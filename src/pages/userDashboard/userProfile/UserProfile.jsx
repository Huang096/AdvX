import React from 'react';
import DoggoProgress from './DoggoProgress';
import ActivityCalendar from './ActivityCalendar';
import { FaUserCircle } from 'react-icons/fa';

const UserProfile = ({ userPoints }) => { // 1. Receive userPoints as a prop
    const userName = "爱心市民";
    // const userPoints = 520; // 2. Remove the local state

    return (
        <div className="space-y-6">
            <div className="card bg-base-100 shadow-xl p-4 flex-row items-center gap-4">
                <FaUserCircle className="text-4xl" />
                <div>
                    <h2 className="card-title">{userName}</h2>
                    {/* 3. Use the prop */}
                    <p className="font-bold text-secondary">当前可用积分: {userPoints}</p>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <DoggoProgress />
                </div>
                <div>
                    <ActivityCalendar />
                </div>
            </div>
        </div>
    );
};

export default UserProfile; 