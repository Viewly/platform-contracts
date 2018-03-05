pragma solidity ^0.4.2;

import "./dappsys/math.sol";
import "./dappsys/token.sol";
import "./dappsys/auth.sol";
import "./dappsys/stop.sol";

contract NameRegistrar is DSAuth, DSMath, DSStop {

    DSToken public viewToken;
    uint public minStakeAmount;
    uint8 public challengePeriodDays;
    uint8 public withdrawPeriodDays;

    struct Stake {
        uint amount;
        uint date;
        address addr;
    }
    // todo: this structure won't survive a DDOS, because some critical methods
    // need too loop over Stake[] to work
    mapping (bytes32 => Stake[]) public stakes;
    mapping (bytes32 => address) public owners; // is this really needed?
    mapping (bytes32 => uint) public challengePeriods;

    struct Withdrawal {
        uint amount;
        uint releaseDate;
    }
    mapping (bytes32 => mapping (address => Withdrawal)) public withdrawals;

    // channel ID's are only 13 bytes long
    mapping (bytes32 => bytes13) public channels;

    event Staked(
        bytes32 name,
        uint amount,
        address account
    );

    event UnStaked(
        bytes32 name,
        address account
    );

    event SetChannel(
        bytes32 name,
        bytes13 channelId,
        address owner
    );

    event Withdrawn(
        bytes32 name,
        uint amount,
        address account
    );


    function NameRegistrar(DSToken viewToken_) public {
        viewToken = viewToken_;
    }

    // GOVERNANCE
    // ----------
    function setMinStakeAmount(uint price) public auth {
        minStakeAmount = price;
    }

    function setWithdrawPeriod(uint8 period) public auth {
        withdrawPeriodDays = period;
    }

    function setChallengePeriod(uint8 period) public auth {
        challengePeriodDays = period;
    }

    // STAKING
    // -------
    function stake(bytes32 name, uint amount) public stoppable {
        require(amount >= minStakeAmount);
        require(viewToken.transferFrom(msg.sender, this, amount));

        // todo: if this stake changes transientOwner,
        // start the challenge period for this name
        // if amount > largestStake(name) && msg.sender != largestStakeHolder(name):
        // challengePeriods[name] = now + challengePeriodDays*CONST;

        Stake memory s = Stake(amount, now, msg.sender);
        stakes[name][stakes[name].length+1] = s;
        Staked(name, amount, msg.sender);
    }

    function unStake(bytes32 name) public {
        // pseudocode ahead!
        // find stake from our user (msg.sender)
        // what if user has multiple stakes? unstake lowest one first.
        // stake = stakes[name].find(msg.sender)
        // require(stake && stake.amount > 0);
        // delete stake;

        // has unStake changed transientOwner?
        // if so, change owner WITHOUT challengePeriod

        // Withdrawal memory w = Withdrawal(stake.amount, now+withdrawPeriodDays*CONST);
        // withdrawals[name][msg.sender] = w;

        UnStaked(name, msg.sender);
    }

    function withdrawStake(bytes32 name) public {
        require(withdrawals[name][msg.sender].releaseDate <= now);
        uint amount = withdrawals[name][msg.sender].amount;
        require(amount > 0);
        require(viewToken.transferFrom(this, msg.sender, amount));
        Withdrawn(name, amount, msg.sender);
    }

    function getStakesFor(bytes32 name) public {

    }

    // OWNERSHIP
    // ---------
    function setChannelFor(bytes32 name, bytes13 channelId) public {
        // right now anybody can 'freeze' the name by staking more
        // q: should old owner be still allowed to change channelId despite challengePeriod?
        require(!isChallenged(name));
        require(getTransientOwnerFor(name) == msg.sender);

        channels[name] = channelId;
        SetChannel(name, channelId, msg.sender);
    }

    // HELPERS
    // -------
    function getTransientOwnerFor(bytes32 name) public returns (address) {
        // basically highest active stake behind name
    }

    function isChallenged(bytes32 name) public returns (bool) {
        return challengePeriods[name] >= now;
    }

    function () public payable {
        revert();
     }

}
