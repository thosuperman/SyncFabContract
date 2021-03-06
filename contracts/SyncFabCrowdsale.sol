pragma solidity ^0.4.18;

import 'zeppelin-solidity/contracts/math/SafeMath.sol';

import './MFGToken.sol';

contract SyncFabCrowdsale is Ownable {
  using SafeMath for uint256;

  MFGToken public token;

  uint256 public startTime;
  uint256 public endTime;
  uint256 public rate;
  address public wallet;

  uint256 public weiRaised;

  event TokenPurchase(address indexed purchaser, address indexed beneficiary, uint256 value, uint256 amount);

  function SyncFabCrowdsale(address tokenAddress, uint256 _startTime, uint256 _endTime, uint256 _rate, address _wallet)
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

  function transfer(address _to, uint256 _value) internal returns (bool) {
    token.transferFrom(owner, _to, _value);
  }

  function () payable {
    buyTokens(msg.sender);
  }

  function buyTokens(address beneficiary) public payable {
    require(beneficiary != 0x0);
    require(validPurchase());

    uint256 weiAmount = msg.value;

    uint256 tokens = weiAmount.mul(rate);

    weiRaised = weiRaised.add(weiAmount);

    transfer(beneficiary, tokens);
    TokenPurchase(msg.sender, beneficiary, weiAmount, tokens);

    forwardFunds();
  }

  function forwardFunds() internal {
    wallet.transfer(msg.value);
  }

  function validPurchase() internal constant returns (bool) {
    bool withinPeriod = now >= startTime && now <= endTime;
    bool nonZeroPurchase = msg.value != 0;
    return withinPeriod && nonZeroPurchase;
  }

  function hasEnded() public constant returns (bool) {
    return now > endTime;
  }

}
