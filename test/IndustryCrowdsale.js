const BigNumber = web3.BigNumber

const should = require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

const MFGToken = artifacts.require("./MFGToken.sol");
const IndustryCrowdsale = artifacts.require("./IndustryCrowdsale.sol");

contract("IndustryCrowdsale", function([owner, investor, wallet, purchaser]) {

  beforeEach(async function () {
    token = await MFGToken.new();
    crowdsale = await IndustryCrowdsale.new(token.address);
  })

  it("should have the same owner as its token's owner", async function () {
    let tokenOwner = await token.owner();
    let crowdsaleOwner = await crowdsale.owner();
    tokenOwner.should.equal(crowdsaleOwner);
  })

  describe("transfering tokens", function() {
    it.skip("should transfer from the owner's account", async function() {
      this.crowdsale
    });
  });
});
