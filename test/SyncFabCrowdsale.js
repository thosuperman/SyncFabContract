import ether from 'zeppelin-solidity/test/helpers/ether'
import {advanceBlock} from 'zeppelin-solidity/test/helpers/advanceToBlock'
import {increaseTimeTo, duration} from 'zeppelin-solidity/test/helpers/increaseTime'
import latestTime from 'zeppelin-solidity/test/helpers/latestTime'
import EVMThrow from './../test/helpers/EVMThrow'

const BigNumber = web3.BigNumber

const should = require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

const MFGToken = artifacts.require("./MFGToken.sol");
const SyncFabCrowdsale = artifacts.require("./SyncFabCrowdsale.sol");

contract("SyncFabCrowdsale", function([owner, investor, wallet, purchaser]) {

  const rate = new BigNumber(1815)
  const value = ether(1)

  const allowance = rate.mul(value)
  const expectedTokenAmount = allowance

  before(async function() {
    //Advance to the next block to correctly read time in the solidity "now" function interpreted by testrpc
    await advanceBlock()
  })

  beforeEach(async function () {
    this.startTime = await latestTime() + duration.weeks(1);
    this.endTime = await this.startTime + duration.weeks(1);
    this.afterEndTime = await this.endTime + duration.seconds(1)

    this.token = await MFGToken.new();
    this.crowdsale = await SyncFabCrowdsale.new(this.token.address, this.startTime, this.endTime, rate, wallet);
  })

  it("should have the same owner as its token's owner", async function () {
    let tokenOwner = await this.token.owner();
    let crowdsaleOwner = await this.crowdsale.owner();
    tokenOwner.should.equal(crowdsaleOwner);
  })

  it('should be ended only after end', async function () {
    let ended = await this.crowdsale.hasEnded()
    ended.should.equal(false)
    await increaseTimeTo(this.afterEndTime)
    ended = await this.crowdsale.hasEnded()
    ended.should.equal(true)
  })

  describe('accepting payments', function () {

    it('should reject payments before start', async function () {
      await this.crowdsale.send(value).should.be.rejectedWith(EVMThrow)
      await this.crowdsale.buyTokens(investor, {from: purchaser, value: value}).should.be.rejectedWith(EVMThrow)
    })

    it('should accept payments after start', async function () {
      await increaseTimeTo(this.startTime)

      await this.token.approve(this.crowdsale.address, allowance);
      await this.crowdsale.send(value).should.be.fulfilled

      await this.token.approve(this.crowdsale.address, allowance);
      await this.crowdsale.buyTokens(investor, {value: value, from: purchaser}).should.be.fulfilled
    })

    it('should reject payments after end', async function () {
      await increaseTimeTo(this.afterEndTime)
      await this.crowdsale.send(value).should.be.rejectedWith(EVMThrow)
      await this.token.approve(this.crowdsale.address, allowance);
      await this.crowdsale.buyTokens(investor, {value: value, from: purchaser}).should.be.rejectedWith(EVMThrow)
    })

  })

  describe('high-level purchase', function () {

    beforeEach(async function() {
      await increaseTimeTo(this.startTime)
    })

    it('should log purchase', async function () {
      await this.token.approve(this.crowdsale.address, allowance);
      const {logs} = await this.crowdsale.sendTransaction({value: value, from: investor})

      const event = logs.find(e => e.event === 'TokenPurchase')

      should.exist(event)
      event.args.purchaser.should.equal(investor)
      event.args.beneficiary.should.equal(investor)
      event.args.value.should.be.bignumber.equal(value)
      event.args.amount.should.be.bignumber.equal(expectedTokenAmount)
    })

    it('should increase weiRaised', async function () {
      await this.token.approve(this.crowdsale.address, allowance);
      await this.crowdsale.send(value)
      const weiRaised = await this.crowdsale.weiRaised()
      weiRaised.should.be.bignumber.equal(value)
    })

    it('should assign tokens to sender', async function () {
      await this.token.approve(this.crowdsale.address, allowance);
      await this.crowdsale.sendTransaction({value: value, from: investor})
      let balance = await this.token.balanceOf(investor);
      balance.should.be.bignumber.equal(expectedTokenAmount)
    })

    it('should forward funds to wallet', async function () {
      await this.token.approve(this.crowdsale.address, allowance);
      const pre = web3.eth.getBalance(wallet)
      await this.crowdsale.sendTransaction({value, from: investor})
      const post = web3.eth.getBalance(wallet)
      post.minus(pre).should.be.bignumber.equal(value)
    })

  })

  describe('low-level purchase', function () {

    beforeEach(async function() {
      await increaseTimeTo(this.startTime)
    })

    it('should log purchase', async function () {
      await this.token.approve(this.crowdsale.address, allowance);
      const {logs} = await this.crowdsale.buyTokens(investor, {value: value, from: purchaser})

      const event = logs.find(e => e.event === 'TokenPurchase')

      should.exist(event)
      event.args.purchaser.should.equal(purchaser)
      event.args.beneficiary.should.equal(investor)
      event.args.value.should.be.bignumber.equal(value)
      event.args.amount.should.be.bignumber.equal(expectedTokenAmount)
    })

    it('should increase weiRaised', async function () {
      await this.token.approve(this.crowdsale.address, allowance);
      await this.crowdsale.buyTokens(investor, {value, from: purchaser})
      const weiRaised = await this.token.totalSupply()
      weiRaised.should.be.bignumber.equal(weiRaised)
    })

    it('should assign tokens to beneficiary', async function () {
      await this.token.approve(this.crowdsale.address, allowance);
      await this.crowdsale.buyTokens(investor, {value, from: purchaser})
      const balance = await this.token.balanceOf(investor)
      balance.should.be.bignumber.equal(expectedTokenAmount)
    })

    it('should forward funds to wallet', async function () {
      await this.token.approve(this.crowdsale.address, allowance);
      const pre = web3.eth.getBalance(wallet)
      await this.crowdsale.buyTokens(investor, {value, from: purchaser})
      const post = web3.eth.getBalance(wallet)
      post.minus(pre).should.be.bignumber.equal(value)
    })

  })
});
