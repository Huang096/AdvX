import React from 'react';
import OrgStats from './OrgStats';
import MyDoggoNFTs from './MyDoggoNFTs';
import ReleaseCalendar from './ReleaseCalendar'; // 1. Uncomment the import

const OrgProfile = () => {
    return (
        <div className="space-y-6">
            <OrgStats />
            <MyDoggoNFTs />
            <ReleaseCalendar /> {/* 2. Uncomment the component usage */}
        </div>
    );
};

export default OrgProfile; 