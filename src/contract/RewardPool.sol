// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title RewardPool (Simplified for Demo)
 * @dev This contract is simplified for the hackathon demo. It collects funds
 * and allows the owner to distribute the entire balance to a single hardcoded address.
 */
contract RewardPool {
    address public owner;
    // The single address where all funds will be sent for the demo.
    address payable private constant DEMO_WALLET = payable(0x816f1dDa5702FA5C1C2A3795c92c9D85e49D5E3a);

    event FundsDistributed(address indexed destination, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "RewardPool: Caller is not the owner");
        _;
    }

    /**
     * @dev Sets the contract deployer as the owner.
     */
    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice Fallback function to receive INJ donations from users.
     */
    receive() external payable {}

    /**
     * @notice Distributes the entire contract balance to the hardcoded demo wallet.
     * This function replaces the complex cycle-based distribution for MVP purposes.
     */
    function distributeAllToDemoAddress() external {
        uint256 balance = address(this).balance;
        require(balance > 0, "RewardPool: No funds to distribute");

        (bool success, ) = DEMO_WALLET.call{value: balance}("");
        require(success, "RewardPool: Failed to send funds to demo wallet");

        emit FundsDistributed(DEMO_WALLET, balance);
    }

    /**
     * @notice Allows the owner to withdraw all funds in case of an emergency.
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        (bool success, ) = owner.call{value: balance}("");
        require(success, "RewardPool: Emergency withdrawal failed");
    }

    /**
     * @notice Returns the current balance of the contract.
     */
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
} 