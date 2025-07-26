import React, { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { FaTimes } from 'react-icons/fa';
import { NFT_ABI, NFT_CONTRACT_ADDRESS, createNFTMetadata, INJECTIVE_TESTNET } from '../contract/nftContract';

// --- 您的 Cloudinary 配置 ---
const CLOUDINARY_CLOUD_NAME = "dqhu7cgrl"; // <-- 已替换
const CLOUDINARY_UPLOAD_PRESET = "dognft"; // <-- 已替换
// ------------------------------

const NFTMinter = ({ onNftMinted }) => {
    const { address, isConnected, chain } = useAccount();
    const [nftName, setNftName] = useState('');
    const [nftDescription, setNftDescription] = useState('');
    const [uploadedImages, setUploadedImages] = useState([]); // <-- State for multiple images
    const [isUploading, setIsUploading] = useState(false);
    const [isMinting, setIsMinting] = useState(false);

    const { writeContractAsync, data: hash, error, isPending } = useWriteContract();
    
    const { isLoading: isConfirming, isSuccess: isConfirmed, data: receipt } = 
        useWaitForTransactionReceipt({ hash });

    // 当交易确认后，调用回调函数 (仅用于之前的单次铸造逻辑，批量铸造有自己的处理)
    useEffect(() => {
        if (isConfirmed && receipt && onNftMinted && Number(uploadedImages.length) === 1 && !isMinting) {
            const mintedData = {
                name: nftName,
                description: nftDescription,
                imageUrl: uploadedImages[0].url, // Assuming only one image for now
                txHash: receipt.transactionHash,
                timestamp: new Date().toISOString(),
            };
            onNftMinted([mintedData]); // Pass as an array
            resetForm();
        }
    }, [isConfirmed, receipt]);

    // Handle multiple file uploads
    const handleImageUpload = async (event) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        try {
            const uploadPromises = Array.from(files).map(file => {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
                return fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
                    method: 'POST',
                    body: formData,
                }).then(response => response.json());
            });

            const results = await Promise.all(uploadPromises);
            const successfulUploads = results
                .filter(result => result.secure_url)
                .map(result => ({ url: result.secure_url, name: result.original_filename }));
            
            setUploadedImages(prev => [...prev, ...successfulUploads]);
        } catch (error) {
            console.error('批量上传图片失败:', error);
            alert(`部分图片上传失败: ${error.message}`);
        } finally {
            setIsUploading(false);
        }
    };

    // Remove an image from the preview list
    const removeImage = (urlToRemove) => {
        setUploadedImages(prev => prev.filter(image => image.url !== urlToRemove));
    };
  
    // Handle minting for all uploaded images
    const handleMint = async () => {
        if (!nftName || !nftDescription || uploadedImages.length === 0) {
            alert('请填写所有字段并至少上传一张图片');
            return;
        }
        setIsMinting(true);
        try {
            const newNftsData = [];
            for (let i = 0; i < uploadedImages.length; i++) {
                const image = uploadedImages[i];
                const currentName = `${nftName} #${i + 1}`;
                const metadata = createNFTMetadata(currentName, nftDescription, image.url);
                const tokenURI = `data:application/json;base64,${btoa(unescape(encodeURIComponent(JSON.stringify(metadata))))}`;
                
                const tx = await writeContractAsync({
                    address: NFT_CONTRACT_ADDRESS,
                    abi: NFT_ABI,
                    functionName: 'mint',
                    args: [address, tokenURI],
                });
                newNftsData.push({ name: currentName, description: nftDescription, imageUrl: image.url, txHash: tx.hash, timestamp: new Date().toISOString() });
            }
            onNftMinted(newNftsData);
            resetForm();
        } catch (err) {
            console.error('批量铸造失败:', err);
        } finally {
            setIsMinting(false);
        }
    };

    const resetForm = () => {
        setNftName('');
        setNftDescription('');
        setUploadedImages([]);
    };
    
    // 读取用户拥有的NFT数量
    const { data: balance } = useReadContract({
        address: NFT_CONTRACT_ADDRESS,
        abi: NFT_ABI,
        functionName: 'balanceOf',
        args: [address],
        enabled: !!address && NFT_CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000",
    });

    // 读取总供应量
    const { data: totalSupply } = useReadContract({
        address: NFT_CONTRACT_ADDRESS,
        abi: NFT_ABI,
        functionName: 'totalSupply',
        enabled: NFT_CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000",
    });

    // 检查是否连接到正确的网络
    const isCorrectNetwork = chain?.id === INJECTIVE_TESTNET.chainId;

    return (
        <div className="max-w-2xl mx-auto p-6 bg-base-200 rounded-lg shadow-lg">
            <div className="text-center mb-6">
                <h2 className="text-3xl font-bold mb-2">🐕 宠物领养 NFT 铸造</h2>
                <p className="text-base-content/70">在 Injective EVM 测试网上铸造你的宠物领养纪念 NFT</p>
            </div>

            {/* 网络信息 */}
            <div className="mb-6 p-4 bg-info/10 rounded-lg">
                <h3 className="font-semibold mb-2">📡 网络信息</h3>
                <div className="text-sm space-y-1">
                    <p><strong>网络:</strong> {INJECTIVE_TESTNET.name}</p>
                    <p><strong>Chain ID:</strong> {INJECTIVE_TESTNET.chainId}</p>
                    <p><strong>水龙头:</strong> <a href={INJECTIVE_TESTNET.faucetUrl} target="_blank" rel="noopener noreferrer" className="link link-primary">获取测试币</a></p>
                    <p><strong>浏览器:</strong> <a href={INJECTIVE_TESTNET.explorerUrl} target="_blank" rel="noopener noreferrer" className="link link-primary">查看交易</a></p>
                </div>
            </div>

            {/* 连接钱包 */}
            <div className="mb-6 text-center">
                <ConnectButton />
            </div>

            {/* 网络检查 */}
            {isConnected && !isCorrectNetwork && (
                <div className="alert alert-warning mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span>请切换到 Injective EVM 测试网 (Chain ID: {INJECTIVE_TESTNET.chainId})</span>
                </div>
            )}

            {/* 合约状态 */}
            {isConnected && isCorrectNetwork && (
                <div className="mb-6 p-4 bg-success/10 rounded-lg">
                    <h3 className="font-semibold mb-2">📊 合约状态</h3>
                    <div className="text-sm space-y-1">
                        <p><strong>合约地址:</strong> {NFT_CONTRACT_ADDRESS}</p>
                        <p><strong>你的NFT数量:</strong> {balance ? balance.toString() : '0'}</p>
                        <p><strong>总供应量:</strong> {totalSupply ? totalSupply.toString() : '0'}</p>
                    </div>
                </div>
            )}

            {/* NFT铸造表单 */}
            {isConnected && isCorrectNetwork && (
                <div className="space-y-6">
                    <div className="form-control">
                        <label className="label"><span className="label-text font-semibold">NFT 基础名称</span></label>
                        <input type="text" placeholder="例如: 我的爱犬系列" className="input input-bordered w-full" value={nftName} onChange={(e) => setNftName(e.target.value)} />
                    </div>

                    <div className="form-control">
                        <label className="label"><span className="label-text font-semibold">通用描述</span></label>
                        <textarea placeholder="这些 NFT 的共同故事..." className="textarea textarea-bordered h-24" value={nftDescription} onChange={(e) => setNftDescription(e.target.value)} />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">批量上传图片 (可多选)</span>
                        </label>
                        <input
                            type="file"
                            accept="image/png, image/jpeg, image/gif"
                            multiple // <-- Allow multiple file selection
                            className="file-input file-input-bordered w-full"
                            onChange={handleImageUpload}
                            disabled={isUploading || isMinting}
                        />
                    </div>

                    {isUploading && <div className="text-center"><span className="loading loading-lg text-primary"></span><p>图片上传中...</p></div>}
                    
                    {uploadedImages.length > 0 && (
                        <div className="mt-4 p-4 bg-base-100 rounded-lg">
                            <h4 className="font-semibold mb-2">待铸造图片 ({uploadedImages.length} 张):</h4>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                {uploadedImages.map((image, index) => (
                                    <div key={index} className="relative group">
                                        <img src={image.url} alt={image.name} className="w-full h-24 object-cover rounded-md shadow-md" />
                                        <button onClick={() => removeImage(image.url)} className="btn btn-xs btn-circle btn-error absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <FaTimes />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <button
                        className={`btn btn-primary w-full ${(isPending || isUploading || isMinting) ? 'loading' : ''}`}
                        onClick={handleMint}
                        disabled={!nftName || !nftDescription || uploadedImages.length === 0 || isPending || isUploading || isMinting}
                    >
                        {isMinting ? `铸造中...` : `🎨 为 ${uploadedImages.length} 张图片分别铸造 NFT`}
                    </button>

                    {hash && !isConfirmed && (
                        <div className="alert alert-info mt-4">
                            <div>
                                <p>交易已提交，正在等待确认...</p>
                                <p className="text-xs truncate">哈希: <a href={`${INJECTIVE_TESTNET.explorerUrl}/tx/${hash}`} target="_blank" rel="noopener noreferrer" className="link">{hash}</a></p>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="alert alert-error mt-4">
                            <span>错误: {error.message}</span>
                        </div>
                    )}
                </div>
            )}

            {/* 合约部署提示 */}
            {NFT_CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000" && (
                <div className="alert alert-warning">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <div>
                        <p className="font-bold">⚠️ 需要部署合约</p>
                        <p>请先部署 NFT 合约到 Injective EVM 测试网，然后更新 <code>NFT_CONTRACT_ADDRESS</code></p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NFTMinter; 