pragma solidity ^0.5.4;

import "./DappToken.sol";
import "./DaiToken.sol";

contract TokenFarm {
    string public name = "Dapp Token Farm";
    DappToken public dappToken;
    DaiToken public daiToken;

    // State variables to track staking activity.
    address[] public stakers;
    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(DappToken _dappToken, DaiToken _daiToken) public {
        dappToken= _dappToken;
        daiToken = _daiToken;
    } // constructor()

    // @todo 1. Stake DAI Tokens (Deposit)..
    function stakeTokens(uint _amount) public {
        // Transfer Dai Tokens from the sender to this contract, thus staking them.
        daiToken.transferFrom(msg.sender, address(this), _amount);

        // Update the senders staking balance within this contract.
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        // Add the sender to the list of stakers *only* if they haven't been added yet.
        // This check is important so we don't double credit staking rewards later on.
        if (! hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        // Update the users staking status
        hasStaked[msg.sender] = true;
        isStaking[msg.sender] = true;


    } // stakeTokens()

    // @todo 2. Unstake Tokens (Withdraw)..

    // @todo 3. Issue Tokens (Interest)..



} // TokenFarm

// End of file.
