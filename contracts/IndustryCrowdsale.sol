pragma solidity ^0.4.18;

import 'zeppelin-solidity/contracts/math/SafeMath.sol';

import './MFGToken.sol';

contract IndustryCrowdsale is Ownable {
  using SafeMath for uint256;

  MFGToken public token;

  uint256 public startTime;
  uint256 public endTime;

  address public wallet;

  // how many token units a buyer gets per wei
  uint256 public rate;

  // amount of raised money in wei
  uint256 public weiRaised;

  /**
   * event for token purchase logging
   * @param purchaser who paid for the tokens
   * @param beneficiary who got the tokens
   * @param value weis paid for purchase
   * @param amount amount of tokens purchased
   */
  event TokenPurchase(address indexed purchaser, address indexed beneficiary, uint256 value, uint256 amount);

  function IndustryCrowdsale(address tokenAddress, uint256 _startTime, uint256 _endTime, uint256 _rate, address _wallet)
    public
  {
    require(_startTime >= now);
    require(_endTime >= _startTime);
    require(_rate > 0);
    require(_wallet != 0x0);

    token = MFGToken(tokenAddress);
    assert(token.owner() == owner);

    startTime = _startTime;
    endTime = _endTime;
    rate = _rate;
    wallet = _wallet;
  }

  function transfer(address _to, uint256 _value) public onlyOwner returns (bool) {
    token.transferFrom(owner, _to, _value);
    return true;
  }

  // @return true if crowdsale event has ended
  function hasEnded() public constant returns (bool) {
    return now > endTime;
  }

}
