import React from 'react';
import { FaArrowRight, FaChartPie, FaCoins, FaGift, FaHandHoldingHeart } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseGwei } from 'viem';

import PrizePoolDisplay from '../../components/PrizePoolDisplay';
import DonationBox from '../../components/DonationBox';
import contractConfig from '../../contract/config.json';
import rewardPoolAbi from '../../contract/build/RewardPool.json'; // 1. Use the main RewardPool ABI

const RulesAndPrizes = () => {
    // Mock data for demo purposes
    const topDogs = [
        { name: "小黄", points: 1350, color: "progress-primary" },
        { name: "咖啡", points: 980, color: "progress-success" },
        { name: "旺财", points: 760, color: "progress-info" },
        { name: "豆包", points: 450, color: "progress-warning" },
    ];
    const maxPoints = Math.max(...topDogs.map(d => d.points));

    const { data: hash, error, isPending, writeContract } = useWriteContract();

    const handleClaimRewards = () => {
        writeContract({
            address: contractConfig.rewardPoolAddress, // 2. Use the main RewardPool address
            abi: rewardPoolAbi.abi,
            functionName: 'distributeAllToDemoAddress', // 3. Use the correct function name
            args: [],
        });
    };

    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ 
        hash, 
    });

    React.useEffect(() => {
        if (isConfirmed) {
            const totalPoints = topDogs.reduce((sum, dog) => sum + dog.points, 0);
            const prizePool = 0.2; // This should ideally match the actual pool for accurate display
            const targetAddress = "0x816f1dDa5702FA5C1C2A3795c92c9D85e49D5E3a";

            const distributionDetails = topDogs.map(dog => {
                const percentage = dog.points / totalPoints;
                const reward = (prizePool * percentage).toFixed(6);
                return `<div class="flex justify-between my-1"><span>🐶 ${dog.name}</span> <span class="font-mono text-green-600 font-bold">${reward} INJ</span></div>`;
            }).join('');

            Swal.fire({
                title: '奖励已成功领取!',
                html: `
                    <div class="text-left text-sm">
                        <p class="mb-2">交易已在链上确认！合约 (<code class="text-xs">${contractConfig.rewardPoolAddress}</code>) 中的所有资金已分配至以下地址:</p>
                        <p class="mb-4"><code class="text-xs bg-gray-200 text-gray-800 p-1 rounded break-all">${targetAddress}</code></p>
                        <div class="border-t pt-3 mt-3 font-bold">模拟奖励分配详情:</div>
                        ${distributionDetails}
                        <div class="mt-4"><a href="https://testnet.blockscout.injective.network/tx/${hash}" target="_blank" rel="noopener noreferrer" class="link link-primary text-xs">查看交易详情</a></div>
                    </div>
                `,
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
        <div className="space-y-8 p-4 md:p-0"> {/* Add some padding for mobile */}
            {/* 1. Real-time Prize Pool Display */}
            <PrizePoolDisplay /> {/* 2. Use the new component here */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* 2. 如何为狗狗赢取奖励？ */}
                <div className="card bg-base-200 shadow-xl">
                    <div className="card-body">
                        <h3 className="card-title">如何为狗狗赢取奖励？ (面向爱心人士)</h3>
                        <div className="divider"></div>
                        <p className="font-bold">赚取积分:</p>
                        <ul className="list-disc list-inside space-y-2">
                            <li>每日签到: <span className="font-bold text-green-500">+5 积分</span></li>
                            <li>
                                爱心捐助: <span className="font-bold text-green-500">每 0.1INJ 获 10 积分</span>
                                <DonationBox /> {/* 2. Place the new component here */}
                            </li>
                        </ul>
                        <p className="font-bold mt-4">使用积分:</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>点赞帖子: <span className="font-bold text-red-500">送给小狗1积分</span> </li>
                            <li>评论帖子: <span className="font-bold text-red-500">送给小狗2积分</span> </li>
                        </ul>
                        <div className="divider">核心逻辑</div>
                        <div className="flex items-center justify-center gap-2 text-center text-sm md:gap-4">
                            <div><FaCoins className="text-2xl mx-auto mb-1" /><p>赚取积分</p></div>
                            <FaArrowRight className="text-primary"/>
                            <div><FaHandHoldingHeart className="text-2xl mx-auto mb-1" /><p>互动消耗</p></div>
                            <FaArrowRight className="text-primary"/>
                            <div><FaGift className="text-2xl mx-auto mb-1" /><p>解锁奖励</p></div>
                        </div>
                    </div>
                </div>

                {/* 3. 领养方如何瓜分奖池？ */}
                <div className="card bg-base-200 shadow-xl">
                    <div className="card-body">
                        <h3 className="card-title">领养方如何瓜分奖池？ (面向领养方)</h3>
                        <div className="divider"></div>
                        <p className="mb-4">奖池会在每个月底，根据本月每只狗狗获得的<strong className="text-secondary">总积分占比</strong>，自动分配给对应的领养人/机构。</p>
                        
                        <p className="font-bold flex items-center gap-2"><FaChartPie /> 当前狗狗积分排名:</p>
                        <div className="space-y-3 mt-2">
                            {topDogs.map(dog => (
                                <div key={dog.name}>
                                    <span className="font-semibold">{dog.name}</span>
                                    <progress 
                                        className={`progress ${dog.color} w-full`} 
                                        value={(dog.points / maxPoints) * 100} 
                                        max="100"
                                    ></progress>
                                </div>
                            ))}
                        </div>
                        <div className="card-actions justify-center mt-6">
                            <button 
                                className="btn btn-primary btn-wide shadow-lg" 
                                onClick={handleClaimRewards}
                                disabled={isPending || isConfirming}
                            >
                                {isPending || isConfirming ? (
                                    <>
                                        <span className="loading loading-spinner"></span>
                                        处理中...
                                    </>
                                ) : (
                                    <>
                                        <FaGift className="mr-2"/>
                                        一键领取所有奖励 (Demo)
                                    </>
                                )}
                            </button>
                        </div>
                        <p className="text-xs text-center mt-4 text-base-content/70">所有分配记录均在区块链上可查，确保公平公正。</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RulesAndPrizes; 