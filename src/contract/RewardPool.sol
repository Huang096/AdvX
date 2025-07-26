// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IERC721
 * @dev Minimal interface for the ERC721 non-fungible token standard.
 * We only need ownerOf to verify who can claim rewards.
 */
interface IERC721 {
    function ownerOf(uint256 tokenId) external view returns (address owner);
}

/**
 * @title RewardPool
 * @dev This contract manages a pool of funds to be distributed as rewards to NFT holders
 * based on off-chain scores. The contract owner is responsible for updating the scores periodically,
 * which starts a new distribution cycle. Unclaimed funds from a cycle roll over to the next one.
 */
contract RewardPool {
    address public immutable owner;
    IERC721 public immutable doggoNFT;

    uint256 public currentCycle;
    uint256 public totalScoresInCycle;
    uint256 public fundsForCycle;

    // Mapping from NFT ID to its score for the current cycle
    mapping(uint256 => uint256) public scores;

    // Mapping from NFT ID to the last cycle it claimed rewards from.
    // This is crucial to prevent an NFT owner from claiming twice in the same cycle.
    mapping(uint256 => uint256) public cycleClaimed;

    event Donated(address indexed from, uint256 amount);
    event CycleStarted(uint256 indexed cycle, uint256 totalScores, uint256 fundsAllocated);
    event RewardClaimed(uint256 indexed cycle, uint256 indexed nftId, address indexed owner, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "RewardPool: caller is not the owner");
        _;
    }

    /**
     * @param _nftAddress The address of the Doggo NFT contract. This is used to verify
     * ownership before allowing reward claims.
     */
    constructor(address _nftAddress) {
        owner = msg.sender;
        require(_nftAddress != address(0), "RewardPool: NFT address cannot be zero");
        doggoNFT = IERC721(_nftAddress);
        // The first cycle will be 1, so we start at 0.
        currentCycle = 0;
    }

    /**
     * @notice Fallback function to receive ETH donations from users.
     */
    receive() external payable {
        emit Donated(msg.sender, msg.value);
    }

    /**
     * @notice Starts a new reward cycle with updated scores for a list of NFTs.
     * This function must be called by the owner at the end of each off-chain scoring period.
     * It locks the contract's current balance for distribution in this new cycle.
     * @param _nftIds An array of NFT token IDs that earned points in the period.
     * @param _scores An array of scores corresponding to the NFT token IDs.
     */
    function startNewCycleWithScores(uint256[] memory _nftIds, uint256[] memory _scores) external onlyOwner {
        require(_nftIds.length == _scores.length, "RewardPool: arrays length mismatch");

        // Increment to start a new cycle
        currentCycle++;

        // Reset and calculate total scores for the new cycle
        totalScoresInCycle = 0;
        uint256 newTotalScores = 0;
        for (uint256 i = 0; i < _nftIds.length; i++) {
            // Overwrite the score for the given NFT for this new cycle
            scores[_nftIds[i]] = _scores[i];
            newTotalScores += _scores[i];
        }
        totalScoresInCycle = newTotalScores;

        // The funds for this new cycle are the entire balance of the contract at this moment.
        fundsForCycle = address(this).balance;

        // A cycle must have funds and scores to be valid.
        require(fundsForCycle > 0, "RewardPool: no funds to distribute");
        require(totalScoresInCycle > 0, "RewardPool: total scores cannot be zero");

        emit CycleStarted(currentCycle, totalScoresInCycle, fundsForCycle);
    }

    /**
     * @notice Allows the owner of an NFT to claim their reward for the current active cycle.
     * @param _nftId The token ID of the NFT for which to claim the reward.
     */
    function claimReward(uint256 _nftId) external {
        require(currentCycle > 0, "RewardPool: no active cycle has started");
        require(doggoNFT.ownerOf(_nftId) == msg.sender, "RewardPool: you are not the owner of this NFT");
        require(cycleClaimed[_nftId] < currentCycle, "RewardPool: reward already claimed for this cycle");

        uint256 rewardAmount = getClaimableReward(_nftId);
        require(rewardAmount > 0, "RewardPool: no reward to claim for this NFT");

        // Mark as claimed before sending ETH to prevent re-entrancy attacks.
        cycleClaimed[_nftId] = currentCycle;

        // Transfer the reward
        (bool success, ) = msg.sender.call{value: rewardAmount}("");
        require(success, "RewardPool: ETH transfer failed");

        emit RewardClaimed(currentCycle, _nftId, msg.sender, rewardAmount);
    }

    /**
     * @notice View function to check the claimable reward for a specific NFT in the current cycle.
     * @param _nftId The token ID of the NFT.
     * @return The amount of ETH claimable as a reward.
     */
    function getClaimableReward(uint256 _nftId) public view returns (uint256) {
        // If there are no scores or no funds in this cycle, there's nothing to claim.
        if (totalScoresInCycle == 0 || fundsForCycle == 0) {
            return 0;
        }
        // Calculation: (NFT's score * funds for this cycle) / total scores for this cycle
        return (scores[_nftId] * fundsForCycle) / totalScoresInCycle;
    }
} 