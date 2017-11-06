pragma solidity ^0.4.18;

import 'zeppelin-solidity/contracts/math/SafeMath.sol';

import './MFGToken.sol';

contract IndustryCrowdsale {
  MFGToken public token;

  function IndustryCrowdsale(address tokenAddress) {
    token = MFGToken(tokenAddress);
  }
}
