import React from 'react';
import { useBalance } from 'wagmi';
import { formatEther } from 'viem';

// Import contract address from the config file generated during deployment
import contractConfig from '../contract/config.json';

const PrizePoolDisplay = () => {
    const { data: balance, isLoading, isError, error } = useBalance({
        address: contractConfig.rewardPoolAddress,
        watch: true, // This is the magic! It will auto-update the balance on change.
    });

    const explorerUrl = `https://testnet.blockscout.injective.network/address/${contractConfig.rewardPoolAddress}`;

    const renderContent = () => {
        if (isLoading) {
            return <span className="text-2xl md:text-4xl font-bold text-gray-700 animate-pulse">加载中...</span>;
        }
        if (isError) {
            console.error("Failed to fetch balance:", error);
            return <span className="text-xl font-bold text-red-500">获取失败</span>;
        }
        if (balance) {
            // Format the balance from Wei to INJ and show 4 decimal places
            const formattedBalance = parseFloat(formatEther(balance.value)).toFixed(4);
            return (
                <span className="text-4xl md:text-6xl font-bold text-purple-600 tracking-tight">
                    {formattedBalance} <span className="text-2xl md:text-4xl text-gray-500 font-medium">INJ</span>
                </span>
            );
        }
        return <span className="text-4xl font-bold text-gray-700">0.0000 INJ</span>;
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-2xl mx-auto border border-gray-200">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-500 mb-2">当前实时总奖池</h2>
            <div className="my-4">
                {renderContent()}
            </div>
            <p className="text-xs text-gray-400">
                由所有爱心捐助汇集而成，所有资金由智能合约管理，公开透明。
                <a 
                    href={explorerUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-purple-500 hover:text-purple-700 ml-1 underline"
                >
                    在区块浏览器上查看
                </a>
            </p>
        </div>
    );
};

export default PrizePoolDisplay; 