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
const SyncFabCappedCrowdsale = artifacts.require("./SyncFabCappedCrowdsale.sol");

contract('SyncFabCappedCrowdsale', function ([owner, wallet]) {
  const rate = new BigNumber(1250)

  const cap = ether(300)
  const lessThanCap = ether(60)

  const lessThanCapAllowance = rate.mul(cap.minus(lessThanCap))
  const capAllowance = rate.mul(cap)

  before(async function() {
    //Advance to the next block to correctly read time in the solidity "now" function interpreted by testrpc
    await advanceBlock()
  })

  beforeEach(async function () {
    this.startTime = await latestTime() + duration.weeks(1);
    this.endTime = await this.startTime + duration.weeks(1);

    this.token = await MFGToken.new();
    this.crowdsale = await SyncFabCappedCrowdsale.new(this.token.address, this.startTime, this.endTime, rate, wallet, cap);
  })

  describe('creating a valid crowdsale', function () {

    it('should fail with zero cap', async function () {
      await SyncFabCappedCrowdsale.new(this.startTime, this.endTime, rate, wallet, 0).should.be.rejectedWith(EVMThrow);
    })

  });

  describe('accepting payments', function () {

    beforeEach(async function () {
      await increaseTimeTo(this.startTime)
    })

    it('should accept payments within cap', async function () {
      await this.token.approve(this.crowdsale.address, lessThanCapAllowance);
      await this.crowdsale.send(cap.minus(lessThanCap)).should.be.fulfilled

      await this.token.approve(this.crowdsale.address, lessThanCapAllowance);
      await this.crowdsale.send(lessThanCap).should.be.fulfilled
    })

    it('should reject payments outside cap', async function () {
      await this.token.approve(this.crowdsale.address, capAllowance);
      await this.crowdsale.send(cap)

      await this.token.approve(this.crowdsale.address, capAllowance);
      await this.crowdsale.send(1).should.be.rejectedWith(EVMThrow)
    })

    it('should reject payments that exceed cap', async function () {
      await this.token.approve(this.crowdsale.address, capAllowance.plus(rate.mul(1)));
      await this.crowdsale.send(cap.plus(1)).should.be.rejectedWith(EVMThrow)
    })

  })

  describe('ending', function () {

    beforeEach(async function () {
      await increaseTimeTo(this.startTime)
    })

    it('should not be ended if under cap', async function () {
      let hasEnded = await this.crowdsale.hasEnded()
      hasEnded.should.equal(false)

      await this.token.approve(this.crowdsale.address, lessThanCapAllowance);
      await this.crowdsale.send(lessThanCap)
      hasEnded = await this.crowdsale.hasEnded()
      hasEnded.should.equal(false)
    })

    it('should not be ended if just under cap', async function () {
      await this.token.approve(this.crowdsale.address, capAllowance);
      await this.crowdsale.send(cap.minus(1))
      let hasEnded = await this.crowdsale.hasEnded()
      hasEnded.should.equal(false)
    })

    it('should be ended if cap reached', async function () {
      await this.token.approve(this.crowdsale.address, capAllowance);
      await this.crowdsale.send(cap)
      let hasEnded = await this.crowdsale.hasEnded()
      hasEnded.should.equal(true)
    })

  })

})
