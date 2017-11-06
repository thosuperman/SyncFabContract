pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/token/StandardToken.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";

contract MFGToken is StandardToken, Ownable {

  string public constant name = "Smart Manufactoring Token";
  string public constant symbol = "MFG";
  uint8 public constant decimals = 18;

  uint256 public constant INITIAL_SUPPLY = (10 ** 9) * (10 ** uint256(decimals));

  function MFGToken() public {
    totalSupply = INITIAL_SUPPLY;
    balances[msg.sender] = INITIAL_SUPPLY;
  }
}
