// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;

import "./DappToken.sol";
import "./DaiToken.sol";

/**************************************************************************
* @title A simple token farm contract
* @author Colin E. Fitzgerald
* @notice This contract is just a tutorial and shouldn't actually be used.
* @dev Use at your own risk.
**************************************************************************/
contract TokenFarm {
    string public name = "Dapp Token Farm";
    DappToken public dappToken;
    DaiToken public daiToken;

    // State variables to track staking activity.
    address public owner;
    address[] public stakers;
    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    /**************************************************************************
    * @notice
    * @param _dappToken
    * @param _daiToken
    **************************************************************************/
    constructor(DappToken _dappToken, DaiToken _daiToken) public {
        dappToken= _dappToken;
        daiToken = _daiToken;

        owner = msg.sender;
    } // constructor()


    /**************************************************************************
    * @notice This function will allow an investor to stake Dai coins.
    * @param _amount The number to Dai coins to add to the investors stake.
    **************************************************************************/
    function stakeTokens(uint _amount) public {
        // Validate our function parameters.
        require(_amount > 0, "amount to stake must be greater then zero.");

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


    /**************************************************************************
    * @notice This function will allow an investor to unstake their tokens.
    **************************************************************************/
    function unstakeTokens() public {
        // Retrieve the investor's balance...
        uint balance = stakingBalance[msg.sender];

        // ...make sure its more then zero!...
        require(balance > 0, "amount to stake must be greater then zero.");

        // ...then return their Dai from the contract...
        daiToken.transfer(msg.sender, balance);

        // ...and record the fact their balance is now zero...
        stakingBalance[msg.sender] = 0;

        // ...and finally update their staking status.
        isStaking[msg.sender] = false;
    } // unstakeTokens()


    /**************************************************************************
    * @notice This function will issue tokens to an investor.
    **************************************************************************/
    // @todo 3. Issue Tokens (Interest)..
    function issueTokens() public {
        // First, ensure only the contract owner can issue tokens.
        require(msg.sender == owner, "Only the contract owner can issue tokens.");

        // For each investor currently staking...
        for (uint i = 0;i < stakers.length;i++) {
            // ...find their wallet address...
            address recipient = stakers[i];

            // ...and the total amount they are staking...
            uint balance = stakingBalance[recipient];

            // ...and only if they have a positive (non-zero) balance...
            if (balance > 0) {
                // ...issue them a 1:1 ratio of dappToken.
                dappToken.transfer(recipient, balance);
            }
        }
    } // issueTokens()


} // TokenFarm

// End of file.
