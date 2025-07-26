import React, { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import PetNFTAbi from '../contract/build/SimplePetNFT.json';
import contractConfig from '../contract/config.json';
import axios from 'axios';

// --- Cloudinary & Pinata Configuration ---
const CLOUDINARY_CLOUD_NAME = 'dqhu7cgrl';
const CLOUDINARY_UPLOAD_PRESET = 'dognft';
const PINATA_JWT = import.meta.env.VITE_PINATA_JWT || 'YOUR_PINATA_JWT_HERE'; // Remember to set this in .env.local

const NFTMinter = ({ onNftMinted }) => {
    const { address, isConnected } = useAccount();
    const { data: hash, writeContract, isPending, error: writeError } = useWriteContract();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [imageFile, setImageFile] = useState(null); // State for the selected image file
    const [status, setStatus] = useState('idle'); // idle, uploadingImage, uploadingMeta, minting, success, error

    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

    // Step 1: Upload image to Cloudinary
    const handleImageUpload = async () => {
        if (!imageFile) {
            alert("请选择一张图片。");
            return null;
        }
        setStatus('uploadingImage');
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            if (!data.secure_url) {
                throw new Error('Cloudinary did not return a secure_url.');
            }
            return data.secure_url;
        } catch (e) {
            console.error("Error uploading to Cloudinary:", e);
            setStatus('error');
            alert("图片上传失败！请检查您的Cloudinary配置。");
            return null;
        }
    };
    
    // Step 2: Upload metadata to IPFS
    const handleUploadToIpfs = async (imageUrl) => {
        if (!name || !description) {
            alert("请填写名称和描述。");
            return null;
        }
        if (PINATA_JWT === 'YOUR_PINATA_JWT_HERE') {
            alert("请配置您的Pinata JWT密钥！");
            return null;
        }

        setStatus('uploadingMeta');
        try {
            const metadata = { name, description, image: imageUrl, attributes: [{ "trait_type": "Type", "value": "Pet Adoption NFT" }] };
            const response = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", metadata, {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${PINATA_JWT}` }
            });
            return `ipfs://${response.data.IpfsHash}`;
        } catch (e) {
            console.error("Error uploading to Pinata:", e);
            setStatus('error');
            alert("元数据上传到IPFS失败！");
            return null;
        }
    };

    // Step 3: Mint NFT
    const handleMint = async (e) => {
        e.preventDefault();
        if (!isConnected) {
            alert('请先连接钱包！');
            return;
        }
        
        const imageUrl = await handleImageUpload();
        if (!imageUrl) return;

        const tokenURI = await handleUploadToIpfs(imageUrl);
        if (!tokenURI) return;

        setStatus('minting');
        writeContract({
            address: contractConfig.petNftAddress,
            abi: PetNFTAbi.abi,
            functionName: 'mint',
            args: [address, tokenURI],
        });
    };

    // Effect to trigger the callback when the transaction is confirmed
    React.useEffect(() => {
        if (isConfirmed && hash) {
            setStatus('success');
            onNftMinted({
                name,
                description,
                imageUrl: URL.createObjectURL(imageFile), // Use local file for immediate display
                txHash: hash,
                timestamp: new Date().toISOString(),
            });
            // Reset form
            setName('');
            setDescription('');
            setImageFile(null);
        }
    }, [isConfirmed, hash, name, description, imageFile, onNftMinted]);
    
    const isWorking = status === 'uploadingImage' || status === 'uploadingMeta' || status === 'minting' || isConfirming;

    return (
        <div className="max-w-xl mx-auto">
            <h3 className="text-xl font-bold mb-4">铸造一个新的狗狗 NFT</h3>
            <form onSubmit={handleMint} className="space-y-4">
                <div>
                    <label className="label"><span className="label-text">名字</span></label>
                    <input type="text" placeholder="例如：小黄" className="input input-bordered w-full" value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <div>
                    <label className="label"><span className="label-text">描述</span></label>
                    <textarea className="textarea textarea-bordered w-full" placeholder="关于这只狗狗的简短故事" value={description} onChange={e => setDescription(e.target.value)} required></textarea>
                </div>
                <div>
                    <label className="label"><span className="label-text">上传图片</span></label>
                    <input type="file" className="file-input file-input-bordered w-full" accept="image/png, image/jpeg, image/gif" onChange={e => setImageFile(e.target.files[0])} required />
                    {imageFile && <img src={URL.createObjectURL(imageFile)} alt="Preview" className="mt-4 rounded-lg shadow-md max-h-48" />}
                </div>
                <button type="submit" className="btn btn-primary w-full" disabled={!isConnected || isWorking}>
                    {status === 'idle' && '开始铸造'}
                    {status === 'uploadingImage' && '上传图片中...'}
                    {status === 'uploadingMeta' && '上传元数据中...'}
                    {status === 'minting' && '等待钱包确认...'}
                    {isConfirming && '交易确认中...'}
                    {status === 'success' && '铸造成功!'}
                    {status === 'error' && '重试'}
                </button>
            </form>
             {hash && (
                <div className="mt-4 text-center text-sm">
                    <p>交易已发送！</p>
                    <a href={`https://testnet.blockscout.injective.network/tx/${hash}`} target="_blank" rel="noopener noreferrer" className="link link-primary break-all">{hash}</a>
                </div>
            )}
             {writeError && (
                <div className="mt-4 text-error text-center text-sm">
                    <p>错误: {writeError.shortMessage || writeError.message}</p>
                </div>
            )}
        </div>
    );
};

export default NFTMinter; 