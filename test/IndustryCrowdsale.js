import ether from 'zeppelin-solidity/test/helpers/ether'
import {advanceBlock} from 'zeppelin-solidity/test/helpers/advanceToBlock'
import {increaseTimeTo, duration} from 'zeppelin-solidity/test/helpers/increaseTime'
import latestTime from 'zeppelin-solidity/test/helpers/latestTime'
import EVMThrow from 'zeppelin-solidity/test/helpers/EVMThrow'

const BigNumber = web3.BigNumber

const should = require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

const MFGToken = artifacts.require("./MFGToken.sol");
const IndustryCrowdsale = artifacts.require("./IndustryCrowdsale.sol");

contract("IndustryCrowdsale", function([owner, investor, wallet, purchaser]) {

  const rate = new BigNumber(1000)
  const value = ether(42)

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
    let et = await this.crowdsale.endTime()
    ended.should.equal(false)
    await increaseTimeTo(this.afterEndTime)
    ended = await this.crowdsale.hasEnded()
    ended.should.equal(true)
  })

  describe("transfering tokens", function() {
    it("should transfer from the owner's account", async function() {
      await this.token.approve(this.crowdsale.address, 10);
      await this.crowdsale.transfer(investor, 10);
      let investorBalance = await this.token.balanceOf(investor);
      assert.equal(investorBalance.toString(), '10');
    });
  });

});
