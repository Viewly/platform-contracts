pragma solidity ^0.4.24;

// Delegate voting power for stake based voting and governance.
// Enables "liquid democracy".
// Enables safe in-app voting participation, by letting users
// delegate their cold wallet VP to a convenient hot wallet.
contract VotingPowerDelegator {
    // delegator => beneficiary
    mapping (address => address) public delegations;
    mapping (address => uint)    public delegationTimes;
    // beneficiary => [delegators]
    mapping (address => address[]) public delegators; // remove beneficiary when delegation changes
    event Delegated(address src, address dst);

    constructor() public { }

    function delegate(address beneficiary) public {
        require(delegationTimes[msg.sender] == 0
             || delegationTimes[msg.sender] <= now + 7 days );
        delegations[msg.sender] = beneficiary;
        delegators[beneficiary].push(msg.sender); // todo: avoid duplicates
        delegationTimes[msg.sender] = now;
        emit Delegated(msg.sender, beneficiary);
    }

    function () public payable {
        revert();
    }
}
