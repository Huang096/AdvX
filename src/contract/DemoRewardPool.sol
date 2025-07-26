
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

    event RewardDistributed(address indexed user, uint256 amount);
    event ScoreUpdated(address indexed user, uint256 totalScore);

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

    function distributeRewards() external onlyOwner {
        uint256 pool = address(this).balance;
        require(pool > 0, "No funds");
        require(block.number > lastSnapshotBlock + 6000, "Wait for next epoch");

        uint256 totalPoints = 0;
        for (uint i = 0; i < participants.length; i++) {
            totalPoints += totalScore(participants[i]);
        }

        uint256 tailPool = (pool * tailRewardRatio) / 10000;
        uint256 mainPool = pool - tailPool;

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
                payable(user).transfer(reward);
                emit RewardDistributed(user, reward);
            }
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