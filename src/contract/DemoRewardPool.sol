// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title DemoRewardPool (MVP for Hackathon)
 * @dev This contract collects INJ donations and allows the owner to distribute
 * the entire balance to a single, hardcoded demo address.
 * It is a simplified version for demonstration purposes, separate from the main RewardPool.
 */
contract DemoRewardPool {
    address public owner;
    address payable private constant DEMO_WALLET = payable(0x816f1dDa5702FA5C1C2A3795c92c9D85e49D5E3a);

    event FundsDistributed(address indexed destination, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "DemoRewardPool: Caller is not the owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Allows the contract to receive INJ donations.
     */
    receive() external payable {}

    /**
     * @dev Distributes the entire contract balance to the hardcoded demo wallet.
     * This simulates the outcome of a reward distribution for the demo.
     */
    function distributeRewards() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "DemoRewardPool: No funds to distribute");

        (bool success, ) = DEMO_WALLET.call{value: balance}("");
        require(success, "DemoRewardPool: Failed to send funds");

        emit FundsDistributed(DEMO_WALLET, balance);
    }

    /**
     * @dev Allows the owner to withdraw funds in case of emergency.
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "DemoRewardPool: No funds to withdraw");

        (bool success, ) = owner.call{value: balance}("");
        require(success, "DemoRewardPool: Failed to send funds");
    }

    /**
     * @dev Returns the current balance of the contract.
     */
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
} 