import React, { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';

// Import ABI and contract addresses from build artifacts
import PetNFT from '../contract/build/SimplePetNFT.json';
import RewardPool from '../contract/build/RewardPool.json';
import contractConfig from '../contract/config.json';

const ContractInteractor = () => {
    const { address, isConnected } = useAccount();
    const { data: hash, writeContract, isPending, error } = useWriteContract();
    const [donationAmount, setDonationAmount] = useState('0.1');

    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({
            hash,
        });

    const handleMintNFT = () => {
        if (!isConnected) {
            alert('请先连接您的钱包！');
            return;
        }

        // A simple, unique URI for each NFT. In a real app, this would point to a JSON file on IPFS.
        const tokenURI = `data:application/json,{"name":"Doggie #${Math.floor(Math.random() * 1000)}", "description":"A cute pet waiting for adoption!", "image": "https://i.imgur.com/Qkw9N0A.jpeg"}`;

        writeContract({
            address: contractConfig.petNftAddress,
            abi: PetNFT.abi,
            functionName: 'mint',
            args: [address, tokenURI],
        });
    };

    const handleDonate = () => {
        if (!isConnected) {
            alert('请先连接您的钱包！');
            return;
        }
        if (parseFloat(donationAmount) <= 0) {
            alert('捐款金额必须大于0！');
            return;
        }

        // We don't need a function name or args for sending native currency
        // The `value` field is all that's needed for the payable `receive` function.
        writeContract({
            address: contractConfig.rewardPoolAddress,
            abi: RewardPool.abi,
            value: parseEther(donationAmount),
        });
    };

    return (
        <div className="container mx-auto p-8 max-w-2xl bg-gray-50 rounded-lg shadow-md mt-10">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">合约交互面板</h2>

            {!isConnected && (
                <div className="text-center p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg">
                    请先连接钱包以进行操作。
                </div>
            )}

            {address && <p className="mb-6 text-center text-gray-600">当前账户: <span className="font-mono bg-gray-200 p-1 rounded">{address}</span></p>}

            <div className="space-y-8">
                {/* Mint NFT Section */}
                <div className="p-6 border rounded-lg bg-white">
                    <h3 className="text-xl font-semibold mb-3">1. 铸造一只小狗NFT</h3>
                    <p className="mb-4 text-sm text-gray-500">点击下方按钮，为您的账户免费铸造一个独一无二的小狗NFT。这是参与后续活动的第一步。</p>
                    <button
                        onClick={handleMintNFT}
                        disabled={!isConnected || isPending}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 disabled:bg-gray-400"
                    >
                        {isPending ? '交易处理中...' : '铸造NFT'}
                    </button>
                </div>

                {/* Donation Section */}
                <div className="p-6 border rounded-lg bg-white">
                    <h3 className="text-xl font-semibold mb-3">2. 向奖池捐款</h3>
                    <p className="mb-4 text-sm text-gray-500">输入您想捐赠的INJ数量，您的爱心将直接进入总奖池，用于激励未来的领养方。</p>
                    <div className="flex items-center space-x-4">
                        <input
                            type="number"
                            value={donationAmount}
                            onChange={(e) => setDonationAmount(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="例如: 0.1"
                            disabled={!isConnected}
                        />
                        <button
                            onClick={handleDonate}
                            disabled={!isConnected || isPending}
                            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300 disabled:bg-gray-400"
                        >
                            {isPending ? '交易处理中...' : '确认捐款'}
                        </button>
                    </div>
                </div>
            </div>

            {hash && (
                <div className="mt-6 p-4 bg-gray-100 rounded-lg text-center">
                    <p className="font-semibold">交易已发送!</p>
                    <a
                        href={`https://testnet.blockscout.injective.network/tx/${hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline break-all"
                    >
                        在区块浏览器上查看: {hash}
                    </a>
                </div>
            )}

            {isConfirming && (
                <div className="mt-4 text-center text-lg font-semibold text-blue-600">
                    等待交易确认中...
                </div>
            )}
            {isConfirmed && (
                <div className="mt-4 text-center text-lg font-semibold text-green-600">
                    交易已成功确认!
                </div>
            )}
            {error && (
                <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    <p className="font-bold">错误!</p>
                    <p className="text-sm break-all">{error.shortMessage || error.message}</p>
                </div>
            )}
        </div>
    );
};

export default ContractInteractor; 