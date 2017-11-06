pragma solidity ^0.4.18;

import 'zeppelin-solidity/contracts/math/SafeMath.sol';

import './MFGToken.sol';

contract IndustryCrowdsale is Ownable {
  MFGToken public token;

  function IndustryCrowdsale(address tokenAddress) public {
    token = MFGToken(tokenAddress);
    assert(token.owner() == owner);
  }

  function transfer(address _to, uint256 _value) public onlyOwner returns (bool) {
    token.transfer(_to, _value);
    return true;
  }
}
