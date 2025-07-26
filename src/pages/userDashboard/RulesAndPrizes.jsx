import React from 'react';
import { FaArrowRight, FaChartPie, FaCoins, FaGift, FaHandHoldingHeart, FaSort, FaSortDown, FaSortUp, FaExternalLinkAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseGwei } from 'viem';

import PrizePoolDisplay from '../../components/PrizePoolDisplay';
import DonationBox from '../../components/DonationBox';
import contractConfig from '../../contract/config.json';
import rewardPoolAbi from '../../contract/build/RewardPool.json';

// --- NEW AVATAR IMPORTS ---
import avatar1 from '../../assets/dog_avatars/dog_avatar_1.png';
import avatar2 from '../../assets/dog_avatars/dog_avatar_2.png';
import avatar3 from '../../assets/dog_avatars/dog_avatar_3.png';
import avatar4 from '../../assets/dog_avatars/dog_avatar_4.png';
import avatar5 from '../../assets/dog_avatars/dog_avatar_5.png';
import avatar6 from '../../assets/dog_avatars/dog_avatar_6.png';
import avatar7 from '../../assets/dog_avatars/dog_avatar_7.png';
import avatar8 from '../../assets/dog_avatars/dog_avatar_8.png';
import avatar9 from '../../assets/dog_avatars/dog_avatar_9.png';
import avatar10 from '../../assets/dog_avatars/dog_avatar_10.png';
import avatar11 from '../../assets/dog_avatars/dog_avatar_11.png';
import avatar12 from '../../assets/dog_avatars/dog_avatar_12.png';
import avatar13 from '../../assets/dog_avatars/dog_avatar_13.png';
import avatar14 from '../../assets/dog_avatars/dog_avatar_14.png';
import avatar15 from '../../assets/dog_avatars/dog_avatar_15.png';
import TalisBg from '../../assets/Talis.png';

const dogAvatars = [avatar1, avatar2, avatar3, avatar4, avatar5, avatar6, avatar7, avatar8, avatar9, avatar10, avatar11, avatar12, avatar13, avatar14, avatar15];
// --- END NEW AVATAR IMPORTS ---

// --- MOCK DATA (unchanged) ---
const weights = {
    interaction: 0.5,
    loyalty: 0.3,
    consistency: 0.2,
};

const mockDogData = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    name: ['小黄', '咖啡', '旺财', '豆包', 'Buddy', 'Lucy', 'Max', 'Bella', 'Charlie', 'Daisy', 'Rocky', 'Molly', 'Toby', 'Sadie', 'Lucky'][i],
    owner: `阳光救助站 #${i + 1}`,
    avatar: dogAvatars[i], // Use imported local images
    scores: {
        interaction: Math.floor(Math.random() * 80) + 20,
        loyalty: Math.floor(Math.random() * 70) + 30,
        consistency: Math.floor(Math.random() * 90) + 10,
    },
}));

mockDogData.forEach(dog => {
    dog.totalScore = 
        dog.scores.interaction * weights.interaction +
        dog.scores.loyalty * weights.loyalty +
        dog.scores.consistency * weights.consistency;
});
// --- END MOCK DATA ---

// A simple component for custom progress bars to match the color scheme
const CustomProgressBar = ({ value, color }) => (
    <div className="w-full bg-[#E0E0E0] rounded-full h-1.5">
        <div 
            className="h-1.5 rounded-full" 
            style={{ width: `${value}%`, backgroundColor: color }}
        ></div>
    </div>
);


const RulesAndPrizes = () => {
    // Hooks for sorting and contract interaction remain unchanged
    const [dogs, setDogs] = React.useState(mockDogData);
    const [sortConfig, setSortConfig] = React.useState({ key: 'totalScore', direction: 'descending' });

    const sortedDogs = React.useMemo(() => {
        let sortableDogs = [...dogs];
        if (sortConfig !== null) {
            sortableDogs.sort((a, b) => {
                let aValue = sortConfig.key.includes('.') ? a.scores[sortConfig.key.split('.')[1]] : a[sortConfig.key];
                let bValue = sortConfig.key.includes('.') ? b.scores[sortConfig.key.split('.')[1]] : b[sortConfig.key];

                if (aValue < bValue) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableDogs;
    }, [dogs, sortConfig]);
    
    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) {
            return <FaSort className="inline-block ml-1 text-[#666666] opacity-50" />;
        }
        if (sortConfig.direction === 'ascending') {
            return <FaSortUp className="inline-block ml-1" style={{ color: '#7E57C2' }} />;
        }
        return <FaSortDown className="inline-block ml-1" style={{ color: '#7E57C2' }} />;
    };

    const { data: hash, error, isPending, writeContract } = useWriteContract();

    const handleClaimRewards = () => {
        writeContract({
            address: contractConfig.rewardPoolAddress,
            abi: rewardPoolAbi.abi,
            functionName: 'distributeAllToDemoAddress',
            args: [],
        });
    };

    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

    React.useEffect(() => {
        // Swal logic remains unchanged
        if (isConfirmed) {
            Swal.fire({
                title: '奖励已成功领取!',
                html: `...`,
                icon: 'success',
                confirmButtonText: '太棒了！'
            });
        }
        if (error) {
            Swal.fire({
                title: '错误',
                text: error.shortMessage || error.message,
                icon: 'error',
                confirmButtonText: '关闭'
            });
        }
    }, [isConfirmed, error, hash]);
    
    return (
        <div className="space-y-8 p-4 md:p-0">
            {/* 1. Real-time Prize Pool Display */}
            <PrizePoolDisplay />

            {/* --- NEW 2-COLUMN LAYOUT --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 2. "How to Earn Rewards" - Now on the left */}
                <div className="card shadow-xl h-full" style={{ backgroundColor: '#FFFFFF', borderColor: '#E0E0E0', borderWidth: 1 }}>
                    <div className="card-body">
                        <h3 className="card-title" style={{ color: '#212121' }}>如何为狗狗赢取奖励？</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mt-4">
                            {/* Part 1: Earning Points */}
                            <div className="space-y-4">
                                <h4 className="font-bold" style={{ color: '#666666' }}>赚取积分</h4>
                                <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F6FA' }}>
                                    <p className="font-semibold" style={{ color: '#212121' }}>每日签到: <span style={{ color: '#4CAF50' }}>+5 积分</span></p>
                                </div>
                                <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F6FA' }}>
                                    <p className="font-semibold" style={{ color: '#212121' }}>爱心捐助</p>
                                    <p className="text-sm mb-3" style={{ color: '#666666' }}>每捐助 0.1 INJ 可获 10 积分</p>
                                    <DonationBox />
                                </div>
                            </div>
                            {/* Part 2: Using Points */}
                            <div className="space-y-4">
                                <h4 className="font-bold" style={{ color: '#666666' }}>使用积分</h4>
                                <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F6FA' }}>
                                    <p className="font-semibold" style={{ color: '#212121' }}>点赞帖子: <span style={{ color: '#E57373' }}>送给小狗 1 积分</span></p>
                                </div>
                                <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F6FA' }}>
                                    <p className="font-semibold" style={{ color: '#212121' }}>评论帖子: <span style={{ color: '#E57373' }}>送给小狗 2 积分</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* UPDATED: Talis.art Connection Card - with background image */}
                <div 
                    className="card shadow-xl h-full relative overflow-hidden" 
                    style={{
                        backgroundImage: `url(${TalisBg})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                >
                    <div className="absolute inset-0 bg-black/60 z-0"></div>
                    <div className="card-body flex flex-col text-white relative z-10">
                        <div className="flex-grow">
                            <h3 className="card-title text-2xl" style={{ color: '#FFFFFF' }}>连接 Talis.art，铸就独特价值</h3>
                            <p className="mt-4 text-base" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                                <strong>领养即铸造 (Adopt & Mint)。</strong> 您救助的每一只狗狗都将对应一枚独特的NFT。让小狗成长赋予NFT真正价值。一键查阅尽在Injective Talis.art。
                            </p>
                        </div>
                        <div className="card-actions justify-end mt-6">
                            <a 
                                href="https://injective.talis.art/collections" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="btn btn-wide font-bold"
                                style={{ backgroundColor: '#E2CFFC', color: '#212121', border: 'none' }}
                            >
                                探索 Talis.art 市场
                                <FaExternalLinkAlt className="ml-2" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. "How to Distribute Rewards" - Vertical Layout, remains full-width below */}
            <div className="card shadow-xl" style={{ backgroundColor: '#FFFFFF', borderColor: '#E0E0E0', borderWidth: 1 }}>
                <div className="card-body">
                    <h3 className="card-title" style={{ color: '#212121' }}>瓜分奖池Snapshot</h3>
                    <p className="text-sm mt-2" style={{ color: '#666666' }}>奖池会根据社区快照中每只狗狗的综合表现（由以下三个维度加权计算）进行分配，确保公平与激励性。</p>

                    {/* Weighting Factors Display */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
                        <div className="text-center p-4 rounded-lg" style={{ backgroundColor: '#F7F6FA' }}>
                            <p className="text-sm font-semibold" style={{ color: '#666666' }}>互动深度</p>
                            <p className="text-4xl font-bold" style={{ color: '#7E57C2' }}>50%</p>
                        </div>
                        <div className="text-center p-4 rounded-lg" style={{ backgroundColor: '#F7F6FA' }}>
                            <p className="text-sm font-semibold" style={{ color: '#666666' }}>忠实用户</p>
                            <p className="text-4xl font-bold" style={{ color: '#5C6BC0' }}>30%</p>
                        </div>
                         <div className="text-center p-4 rounded-lg" style={{ backgroundColor: '#F7F6FA' }}>
                            <p className="text-sm font-semibold" style={{ color: '#666666' }}>活跃一致性</p>
                            <p className="text-4xl font-bold" style={{ color: '#C49FEF' }}>20%</p>
                        </div>
                    </div>

                    {/* Dog Ranking Table */}
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr style={{ borderBottom: '1px solid #E0E0E0' }}>
                                    <th onClick={() => requestSort('totalScore')} className="cursor-pointer text-left font-semibold" style={{ color: '#666666' }}>
                                        排名 {getSortIcon('totalScore')}
                                    </th>
                                    <th className="text-left font-semibold" style={{ color: '#666666' }}>狗狗信息</th>
                                    <th onClick={() => requestSort('scores.interaction')} className="cursor-pointer text-left font-semibold" style={{ color: '#666666' }}>
                                        互动深度 {getSortIcon('scores.interaction')}
                                    </th>
                                    <th onClick={() => requestSort('scores.loyalty')} className="cursor-pointer text-left font-semibold" style={{ color: '#666666' }}>
                                        忠实用户 {getSortIcon('scores.loyalty')}
                                    </th>
                                    <th onClick={() => requestSort('scores.consistency')} className="cursor-pointer text-left font-semibold" style={{ color: '#666666' }}>
                                        活跃度 {getSortIcon('scores.consistency')}
                                    </th>
                                    <th className="text-left font-semibold" style={{ color: '#666666' }}>预计奖励 (INJ)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedDogs.map((dog, index) => (
                                    <tr key={dog.id} className="hover" style={{ borderBottom: '1px solid #F7F6FA' }}>
                                        <td className="font-semibold" style={{ color: '#212121' }}>{index + 1}</td>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="avatar">
                                                    <div className="mask mask-squircle w-12 h-12">
                                                        <img src={dog.avatar} alt={dog.name} />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-bold" style={{ color: '#212121' }}>{dog.name}</div>
                                                    <div className="text-sm" style={{ color: '#666666' }}>{dog.owner}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="font-semibold mr-2" style={{ color: '#212121' }}>{dog.scores.interaction}</span>
                                            <CustomProgressBar value={dog.scores.interaction} color="#7E57C2" />
                                        </td>
                                        <td>
                                            <span className="font-semibold mr-2" style={{ color: '#212121' }}>{dog.scores.loyalty}</span>
                                            <CustomProgressBar value={dog.scores.loyalty} color="#5C6BC0" />
                                        </td>
                                        <td>
                                            <span className="font-semibold mr-2" style={{ color: '#212121' }}>{dog.scores.consistency}</span>
                                            <CustomProgressBar value={dog.scores.consistency} color="#C49FEF" />
                                        </td>
                                        <td className="font-bold" style={{ color: '#4CAF50' }}>
                                            {((dog.totalScore / 100) * 0.05).toFixed(4)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                     <div className="card-actions justify-center mt-8">
                        <button 
                            className="btn btn-wide shadow-lg text-white font-bold" 
                            style={{ backgroundColor: '#7E57C2', border: 'none' }}
                            onClick={handleClaimRewards}
                            disabled={isPending || isConfirming}
                        >
                            {isPending || isConfirming ? (
                                <>
                                    <span className="loading loading-spinner"></span>
                                    处理中...
                                </>
                            ) : "一键领取所有奖励 (Demo)"}
                        </button>
                    </div>
                    <p className="text-xs text-center mt-4" style={{ color: '#666666' }}>所有分配记录均在区块链上可查，确保公平公正。</p>
                </div>
            </div>
        </div>
    );
};

export default RulesAndPrizes; 