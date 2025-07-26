import React from 'react';
import { FaArrowRight, FaChartPie, FaCoins, FaGift, FaHandHoldingHeart } from 'react-icons/fa';
import PrizePoolDisplay from '../../components/PrizePoolDisplay';
import DonationBox from '../../components/DonationBox'; // 1. Import the new component

const RulesAndPrizes = () => {
    // Mock data for demo purposes - we can keep this for the ranking part
    const topDogs = [
        { name: "小黄", points: 1350, color: "progress-primary" },
        { name: "咖啡", points: 980, color: "progress-success" },
        { name: "旺财", points: 760, color: "progress-info" },
        { name: "豆包", points: 450, color: "progress-warning" },
    ];
    const maxPoints = Math.max(...topDogs.map(d => d.points));

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
                        <p className="text-xs text-center mt-4 text-base-content/70">所有分配记录均在区块链上可查，确保公平公正。</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RulesAndPrizes; 