const BigNumber = web3.BigNumber

const should = require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

const MFGToken = artifacts.require("./MFGToken.sol");
const IndustryCrowdsale = artifacts.require("./IndustryCrowdsale.sol");

contract("IndustryCrowdsale", function([owner, investor, wallet, purchaser]) {

  beforeEach(async function () {
    this.token = await MFGToken.new();
    this.crowdsale = await IndustryCrowdsale.new(this.token.address);
  })

  it("should have the same owner as its token's owner", async function () {
    let tokenOwner = await this.token.owner()
    let crowdsaleOwner = await this.crowdsale.owner()
    tokenOwner.should.equal(crowdsaleOwner)
  })

});
