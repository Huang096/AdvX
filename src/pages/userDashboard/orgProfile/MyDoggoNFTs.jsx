import React, { useState, useEffect } from 'react';
import { FaPlus, FaExternalLinkAlt, FaTimes } from 'react-icons/fa';
import NFTMinter from '../../../components/NFTMinter';
import contractConfig from '../../../contract/config.json';

// Import placeholder images
import placeholder1 from '../../../assets/nft_placeholders/nft_placeholder_1.png';
import placeholder2 from '../../../assets/nft_placeholders/nft_placeholder_2.png';
import placeholder3 from '../../../assets/nft_placeholders/nft_placeholder_3.png';
import placeholder4 from '../../../assets/nft_placeholders/nft_placeholder_4.png';
import placeholder5 from '../../../assets/nft_placeholders/nft_placeholder_5.png';

const placeholderImages = [placeholder1, placeholder2, placeholder3, placeholder4, placeholder5];

const LOCAL_STORAGE_KEY = 'my-doggo-nfts-v2';

// Re-usable NFT Card component
const DoggoNFTCard = ({ nft, onCardClick }) => (
    <div className="card card-compact bg-base-200 shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer" onClick={() => onCardClick(nft)}>
        <figure><img src={nft.imageUrl} alt={nft.name} className="h-48 w-full object-cover" /></figure>
        <div className="card-body">
            <h2 className="card-title text-lg font-bold">{nft.name}</h2>
            <p className="text-sm text-base-content/70 truncate" title={nft.description}>{nft.description}</p>
        </div>
    </div>
);


const MyDoggoNFTs = () => {
    const [showMinter, setShowMinter] = useState(false);
    const [myNfts, setMyNfts] = useState([]);
    const [selectedNft, setSelectedNft] = useState(null);

    // Load NFTs from localStorage on component mount
    useEffect(() => {
        try {
            const storedNfts = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
            // Assign a placeholder image to each loaded NFT
            const nftsWithPlaceholders = storedNfts.map((nft, index) => ({
                ...nft,
                imageUrl: placeholderImages[index % placeholderImages.length]
            }));
            setMyNfts(nftsWithPlaceholders);
        } catch (error) {
            console.error("Failed to parse NFTs from localStorage", error);
            setMyNfts([]);
        }
    }, []);

    // Callback function for when a new NFT is successfully minted
    const handleNftMinted = (newNftData) => {
        // Assign a placeholder image to the new NFT
        const newNftWithPlaceholder = {
            ...newNftData,
            imageUrl: placeholderImages[myNfts.length % placeholderImages.length]
        };

        // Add the new NFT to the start of the list
        const updatedNfts = [newNftWithPlaceholder, ...myNfts];
        setMyNfts(updatedNfts);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedNfts));
        setShowMinter(false); // Hide the minter panel after success
        setSelectedNft(newNftWithPlaceholder); // Automatically show details for the new NFT
    };

    return (
        <div className="space-y-6">
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <div className="flex justify-between items-center">
                        <h2 className="card-title text-xl font-bold">我的狗狗 NFT ({myNfts.length})</h2>
                        <button 
                            className="btn btn-primary btn-sm"
                            onClick={() => {
                                setShowMinter(!showMinter);
                                setSelectedNft(null); // Hide details when showing minter
                            }}
                        >
                            <FaPlus className="mr-2" />
                            {showMinter ? '收起铸造面板' : '铸造新 NFT'}
                        </button>
                    </div>
                    <div className="divider mt-2 mb-4"></div>
                    
                    {myNfts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {myNfts.map((nft, index) => <DoggoNFTCard key={nft.txHash || index} nft={nft} onCardClick={setSelectedNft} />)}
                        </div>
                    ) : (
                        <p className="text-center text-base-content/60 py-8">您还没有狗狗 NFT，快去铸造一个吧！</p>
                    )}
                </div>
            </div>
            
            {/* Conditional Panel for Details or Minter */}
            {selectedNft && !showMinter && (
                <div className="card bg-base-200 shadow-xl slide-in-bottom">
                    <div className="card-body relative">
                        <button onClick={() => setSelectedNft(null)} className="btn btn-sm btn-circle btn-ghost absolute top-2 right-2">
                            <FaTimes />
                        </button>
                        <h3 className="card-title">NFT 详情</h3>
                        <div className="flex flex-col sm:flex-row gap-6 mt-4">
                            <img src={selectedNft.imageUrl} alt={selectedNft.name} className="w-full sm:w-1/3 h-auto object-cover rounded-lg shadow-md" />
                            <div className="space-y-2 flex-grow">
                                <h4 className="text-lg font-bold">{selectedNft.name}</h4>
                                <p className="text-base-content/80">{selectedNft.description}</p>
                                <p className="text-xs text-base-content/60">铸造于: {new Date(selectedNft.timestamp).toLocaleString()}</p>
                                <div className="form-control pt-2">
                                    <label className="label py-0">
                                        <span className="label-text">交易哈希:</span>
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <input type="text" readOnly value={selectedNft.txHash} className="input input-bordered input-sm w-full truncate" />
                                        <a href={`https://testnet.blockscout.injective.network/tx/${selectedNft.txHash}`} target="_blank" rel="noopener noreferrer" className="btn btn-square btn-sm">
                                            <FaExternalLinkAlt />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {showMinter && (
                <div className="card bg-base-100 shadow-xl slide-in-bottom">
                    <div className="card-body">
                        <NFTMinter onNftMinted={handleNftMinted} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyDoggoNFTs; 