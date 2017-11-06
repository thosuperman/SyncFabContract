var MFGToken = artifacts.require("./MFGToken.sol");
var IndustryCrowdsale = artifacts.require("./IndustryCrowdsale.sol");

module.exports = function(deployer) {
  deployer.deploy(MFGToken).then(function() {
    deployer.deploy(IndustryCrowdsale, MFGToken.address);
  });
};
