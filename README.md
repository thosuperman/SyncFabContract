User Accepttance Tests for the contracts that we use to conduct our crowdsales

```
  Contract: MFGToken
    #MFGToken()
      ✓ should return the correct totalSupply after construction
      ✓ should assign all tokens to the owner

  Contract: SyncFabCappedCrowdsale
    creating a valid crowdsale
      ✓ should fail with zero cap
    accepting payments
      ✓ should accept payments within cap (126ms)
      ✓ should reject payments outside cap (99ms)
      ✓ should reject payments that exceed cap
    ending
      ✓ should not be ended if under cap (126ms)
      ✓ should not be ended if just under cap (69ms)
      ✓ should be ended if cap reached (73ms)

  Contract: SyncFabCrowdsale
    ✓ should have the same owner as its token's owner
    ✓ should be ended only after end (130ms)
    accepting payments
      ✓ should reject payments before start
      ✓ should accept payments after start (219ms)
      ✓ should reject payments after end (151ms)
    high-level purchase
      ✓ should log purchase (80ms)
      ✓ should increase weiRaised (71ms)
      ✓ should assign tokens to sender (68ms)
      ✓ should forward funds to wallet (212ms)
    low-level purchase
      ✓ should log purchase (59ms)
      ✓ should increase weiRaised (87ms)
      ✓ should assign tokens to beneficiary (70ms)
      ✓ should forward funds to wallet (219ms)
 
  22 passing (7s)
```
