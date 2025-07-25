import React from 'react';
import { FaCoins } from 'react-icons/fa';
import strayDogImage from '../../../assets/stray-dog.png';

const DoggoNFTCard = ({ dog }) => (
    <div className="card card-compact bg-base-200 shadow">
        <figure><img src={dog.image} alt={dog.name} className="h-40 w-full object-cover" /></figure>
        <div className="card-body">
            <h2 className="card-title text-base">{dog.name}</h2>
            <div className="flex items-center text-sm">
                <FaCoins className="text-warning mr-1" />
                <span>总积分: {dog.points}</span>
            </div>
            <div className="card-actions justify-end">
                <button className="btn btn-primary btn-xs">查看详情</button>
            </div>
        </div>
    </div>
);


const MyDoggoNFTs = () => {
    // Mock data for the demo
    const nfts = [
        { id: 1, name: "小黄", image: strayDogImage, points: 1350 },
        { id: 2, name: "旺财", image: "https://placedog.net/400/300?id=2", points: 760 },
        { id: 3, name: "来福", image: "https://placedog.net/400/300?id=3", points: 320 },
    ];

    return (
        <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
                <h2 className="card-title">我的狗狗 NFT</h2>
                <div className="divider my-1"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {nfts.map(dog => <DoggoNFTCard key={dog.id} dog={dog} />)}
                </div>
            </div>
        </div>
    );
};

export default MyDoggoNFTs; 