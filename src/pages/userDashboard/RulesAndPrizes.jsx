import React from 'react';
import { FaArrowRight, FaChartPie, FaCoins, FaGift, FaHandHoldingHeart } from 'react-icons/fa';

const RulesAndPrizes = () => {
    // Mock data for demo purposes
    const totalPrizePool = "10.25 ETH";
    const topDogs = [
        { name: "小黄", points: 1350, color: "progress-primary" },
        { name: "咖啡", points: 980, color: "progress-success" },
        { name: "旺财", points: 760, color: "progress-info" },
        { name: "豆包", points: 450, color: "progress-warning" },
    ];
    const maxPoints = Math.max(...topDogs.map(d => d.points));

    return (
        <div className="space-y-8">
            {/* 1. 总奖池 */}
            <div className="text-center p-8 bg-base-200 rounded-box shadow-lg">
                <h2 className="text-2xl font-bold">当前实时总奖池</h2>
                <p className="text-5xl font-bold text-primary my-4">{totalPrizePool}</p>
                <p className="text-sm text-base-content/70">由 AdventureX及公益社区共同捐助，所有资金由智能合约管理，公开透明。</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* 2. 如何为狗狗赢取奖励？ */}
                <div className="card bg-base-200 shadow-xl">
                    <div className="card-body">
                        <h3 className="card-title">如何为狗狗赢取奖励？ (面向爱心人士)</h3>
                        <div className="divider"></div>
                        <p className="font-bold">赚取积分:</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>每日签到: <span className="font-bold text-green-500">+5 积分</span></li>
                            <li>爱心捐助: <span className="font-bold text-green-500">每 0.1U 获 10 积分</span></li>
                        </ul>
                        <p className="font-bold mt-4">使用积分:</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>点赞帖子: <span className="font-bold text-red-500">-1 积分</span> (流向狗狗)</li>
                            <li>评论帖子: <span className="font-bold text-red-500">-2 积分</span> (流向狗狗)</li>
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
                        <p className="mb-4">奖池会在每个月底，根据本月每只狗狗获得的<strong className="text-primary">总积分占比</strong>，自动分配给对应的领养人/机构。</p>
                        
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