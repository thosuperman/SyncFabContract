var MFGToken = artifacts.require("./MFGToken.sol");
var SyncFabCrowdsale = artifacts.require("./SyncFabCrowdsale.sol");
var SyncFabCappedCrowdsale = artifacts.require("./SyncFabCappedCrowdsale.sol");

module.exports = function(deployer) {
  // deployer.deploy(MFGToken).then(function() {
  //   deployer.deploy(SyncFabCrowdsale, MFGToken.address);
  // });

  // deployer.then(function() {
  //   return MFGToken.new();
  // }).then(function(token) {
  //   industryCrowdsale = SyncFabCrowdsale.new(token.address);
  //   token.approve(industryCrowdsale.address, 10);
  // });
};
