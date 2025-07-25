import React from 'react';
import strayDogImage from '../../../assets/stray-dog.png';

const DoggoProgress = () => {
    // 模拟数据
    const dogName = "小黄";
    const currentPoints = 135;
    const maxPoints = 200;
    const progressPercentage = (currentPoints / maxPoints) * 100;

    const milestones = [
        { points: 100, reward: "解锁酸奶🥛", unlocked: currentPoints >= 100 },
        { points: 200, reward: "解锁狗粮🦴", unlocked: currentPoints >= 200 }
    ];

    return (
        <div className="card bg-base-100 shadow-xl">
            <figure><img src={strayDogImage} alt={dogName} className="w-full h-48 object-cover" /></figure>
            <div className="card-body">
                <h2 className="card-title">我关注的狗狗：{dogName}</h2>
                
                <div className="my-4">
                    <p className="font-bold text-center mb-2">为 {dogName} 解锁奖励</p>
                    <progress 
                        className="progress progress-primary w-full" 
                        value={currentPoints} 
                        max={maxPoints}
                    ></progress>
                    <div className="flex justify-between text-xs px-1">
                        <span>0 积分</span>
                        <span>{maxPoints} 积分</span>
                    </div>
                </div>

                <div>
                    {milestones.map((milestone, index) => (
                        <div key={index} className={`flex items-center justify-between p-2 rounded-lg mb-2 ${milestone.unlocked ? 'bg-green-200 text-green-800' : 'bg-base-200'}`}>
                            <span>{milestone.reward}</span>
                            <span className="font-bold">{milestone.unlocked ? '已达成' : `${milestone.points} 积分`}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DoggoProgress; 