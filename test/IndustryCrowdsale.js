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
const IndustryCrowdsale = artifacts.require("./IndustryCrowdsale.sol");

contract("IndustryCrowdsale", function([owner, investor, wallet, purchaser]) {

  const rate = new BigNumber(1815)
  const value = ether(1)
  const allowance = value*rate

  const expectedTokenAmount = rate.mul(value)

  before(async function() {
    //Advance to the next block to correctly read time in the solidity "now" function interpreted by testrpc
    await advanceBlock()
  })

  beforeEach(async function () {
    this.startTime = await latestTime() + duration.weeks(1);
    this.endTime = await this.startTime + duration.weeks(1);
    this.afterEndTime = await this.endTime + duration.seconds(1)

    this.token = await MFGToken.new();
    this.crowdsale = await IndustryCrowdsale.new(this.token.address, this.startTime, this.endTime, rate, wallet);
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

  // describe("transfering tokens", function() {
  //   it("should transfer from the owner's account", async function() {
  //     await this.token.approve(this.crowdsale.address, 10);
  //     await this.crowdsale.transfer(investor, 10);
  //     let investorBalance = await this.token.balanceOf(investor);
  //     assert.equal(investorBalance.toString(), '10');
  //   });
  // });

  describe('accepting payments', function () {

    it('should reject payments before start', async function () {
      await this.crowdsale.send(value).should.be.rejectedWith(EVMThrow)
      await this.crowdsale.buyTokens(investor, {from: purchaser, value: value}).should.be.rejectedWith(EVMThrow)
    })

    it('should accept payments after start', async function () {
      await increaseTimeTo(this.startTime)
      await this.token.approve(this.crowdsale.address, allowance);
      await this.crowdsale.send(value).should.be.fulfilled

      // await this.token.approve(this.crowdsale.address, value);
      // await this.crowdsale.buyTokens(investor, {value: value, from: purchaser}).should.be.fulfilled
    })

    // it('should reject payments after end', async function () {
    //   await increaseTimeTo(this.afterEndTime)
    //   await this.crowdsale.send(value).should.be.rejectedWith(EVMThrow)
    //   await this.crowdsale.buyTokens(investor, {value: value, from: purchaser}).should.be.rejectedWith(EVMThrow)
    // })

  })
});
