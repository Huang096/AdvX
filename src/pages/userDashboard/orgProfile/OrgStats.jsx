import React from 'react';
import { FaBuilding, FaCoins, FaEthereum } from 'react-icons/fa';

const OrgStats = () => {
    // Mock data for the demo
    const orgName = "阳光救助站";
    const monthlyEarnings = "1.25 ETH";
    const totalPointsReceived = "1350";

    return (
        <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
                {/* Org Info */}
                <div className="flex items-center gap-4">
                    <div className="avatar">
                        <div className="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                            <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt={orgName} />
                        </div>
                    </div>
                    <h2 className="card-title text-2xl">{orgName}</h2>
                </div>
                
                <div className="divider"></div>

                {/* Earnings and Points Stats */}
                <div className="flex justify-around text-center">
                    <div>
                        <p className="font-bold text-lg flex items-center justify-center gap-2">
                            <FaEthereum className="text-primary" />
                            {monthlyEarnings}
                        </p>
                        <p className="text-sm text-base-content/70">本月已瓜分奖池</p>
                    </div>
                    <div>
                        <p className="font-bold text-lg flex items-center justify-center gap-2">
                            <FaCoins className="text-warning" />
                            {totalPointsReceived}
                        </p>
                        <p className="text-sm text-base-content/70">狗狗收到的总积分</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrgStats; 