'use strict';

const assertJump = require('zeppelin-solidity/test/helpers/assertJump');
// var StandardTokenMock = artifacts.require('./zeppelin-solidity/test/helpers/StandardTokenMock.sol');

var MFGToken = artifacts.require("./MFGToken.sol");
const BigNumber = web3.BigNumber

contract('MFGToken', function(accounts) {

  let token;

  beforeEach(async function() {
    token = await MFGToken.new();
  });

  describe("#MFGToken()", async function() {
    let expectedTokenSupply = new BigNumber(10**9 * 10**18);

    it('should return the correct totalSupply after construction', async function() {
      let totalSupply = await token.totalSupply();

      assert.equal(totalSupply.toString(), expectedTokenSupply.toString());
    });

    it("should assign all tokens to the owner", async function(){
      let firstAccountBalance = await token.balanceOf(accounts[0]);
      assert.equal(firstAccountBalance.toString(), expectedTokenSupply.toString());
    });
  });
});
