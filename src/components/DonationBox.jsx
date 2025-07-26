import React, { useState } from 'react';
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { FaHeart } from 'react-icons/fa';

// Import contract address. We no longer need the full ABI for this component.
import contractConfig from '../contract/config.json';

const DonationBox = () => {
    const { isConnected } = useAccount();
    // 1. Use the correct hook: useSendTransaction
    const { data: hash, sendTransaction, isPending, error } = useSendTransaction();
    const [donationAmount, setDonationAmount] = useState('0.1');

    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({ hash });

    const handleDonate = (e) => {
        e.preventDefault();
        if (!isConnected) {
            alert('请先连接您的钱包！');
            return;
        }
        if (parseFloat(donationAmount) <= 0) {
            alert('捐款金额必须大于0！');
            return;
        }

        // 2. Call sendTransaction with a simpler config
        sendTransaction({
            to: contractConfig.rewardPoolAddress,
            value: parseEther(donationAmount),
        });
    };

    if (!isConnected) {
        return (
            <div className="mt-4 p-3 text-center bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">连接钱包后可在此处快速捐款</p>
            </div>
        );
    }

    return (
        <div className="mt-4">
            <form onSubmit={handleDonate} className="p-4 border-2 border-dashed rounded-lg bg-base-100">
                <div className="flex items-center gap-3">
                    <input
                        type="number"
                        step="0.01"
                        value={donationAmount}
                        onChange={(e) => setDonationAmount(e.target.value)}
                        className="input input-bordered w-full max-w-xs"
                        placeholder="例如: 0.1"
                        disabled={isPending || isConfirming}
                    />
                    <button
                        type="submit"
                        disabled={isPending || isConfirming}
                        className="btn btn-secondary flex-grow"
                    >
                        {isPending || isConfirming ? '处理中...' : (
                            <>
                                <FaHeart />
                                快速捐助
                            </>
                        )}
                    </button>
                </div>
            </form>
            {hash && (
                <div className="mt-2 text-center text-xs">
                    <a
                        href={`https://testnet.blockscout.injective.network/tx/${hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link link-primary"
                    >
                        查看交易状态
                    </a>
                </div>
            )}
            {isConfirmed && (
                <div className="mt-2 text-center text-xs text-success">
                    捐款已成功确认！感谢您的爱心。
                </div>
            )}
            {error && (
                <div className="mt-2 text-center text-xs text-error">
                    <p>错误: {error.shortMessage || error.message}</p>
                </div>
            )}
        </div>
    );
};

export default DonationBox; 