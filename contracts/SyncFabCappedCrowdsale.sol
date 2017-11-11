pragma solidity ^0.4.18;

import './SyncFabCrowdsale.sol';

contract SyncFabCappedCrowdsale is SyncFabCrowdsale {
  using SafeMath for uint256;

  uint256 public cap;

  function SyncFabCappedCrowdsale (
    address _tokenAddress,
    uint256 _startTime,
    uint256 _endTime,
    uint256 _rate,
    address _wallet,
    uint256 _cap
  ) SyncFabCrowdsale(_tokenAddress, _startTime, _endTime, _rate, _wallet)
  {
    require(_cap > 0);
    cap = _cap;
  }

  function validPurchase() internal constant returns (bool) {
    bool withinCap = weiRaised.add(msg.value) <= cap;
    return super.validPurchase() && withinCap;
  }

  function hasEnded() public constant returns (bool) {
    bool capReached = weiRaised >= cap;
    return super.hasEnded() || capReached;
  }

}
