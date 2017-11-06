const MFGToken = artifacts.require("./MFGToken.sol");
const IndustryCrowdsale = artifacts.require("./IndustryCrowdsale.sol");

contract('IndustryCrowdsale', function([owner, investor, wallet, purchaser]) {
  it("should read totalSupply", async function() {
    let token = await MFGToken.new();
    let crowdsale = await IndustryCrowdsale.new(token.address);

    assert.equal('asdf', supply.toString());
  });
});
