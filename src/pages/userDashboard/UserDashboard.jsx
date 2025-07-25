
import React, { useState } from 'react';
import Navbar from '../../shared/navbar/Navbar';
import Footer from '../../shared/footer/Footer';
import UserProfile from './userProfile/UserProfile'; // 导入我们全新的组件
import ContentPlaza from './ContentPlaza'; // 1. 导入新组件
// import RulesAndPrizes from './RulesAndPrizes'; // 1. 导入新组件
import OrgProfile from './orgProfile/OrgProfile'; // 1. 导入最终的容器组件

// The placeholder is no longer needed
// const UserType2Profile = () => (
//     <div className="p-4">
//         <h3 className="text-xl font-bold">领养人/机构主页</h3>
//         <p>这里将显示您的机构信息、本月收益、您的狗狗NFT和发布日历。</p>
//         {/* We will build the detailed components here later */}
//     </div>
// );


const UserDashboard = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [userType, setUserType] = useState(1); // 1 for 爱狗人士, 2 for 领养人
    const [userPoints, setUserPoints] = useState(520); // 1. Lift points state up

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                // 2. Pass points state down
                return userType === 1 ? <UserProfile userPoints={userPoints} /> : <OrgProfile />;
            case 'plaza':
                // 2. Pass points state and setter down
                return <ContentPlaza userType={userType} userPoints={userPoints} setUserPoints={setUserPoints} />;
            case 'rules':
                return <RulesAndPrizes />; // 2. 在这里使用新组件
            default:
                return null;
        }
    };

    return (
        <div className="bg-base-100 min-h-screen">
            <Navbar />

            <main className="container mx-auto px-4 py-8">
                {/* User Type Switcher - adding points display here for easy debugging */}
                <div className="text-center mb-8 bg-base-300 p-2 rounded-lg">
                    <div className="flex justify-center items-center gap-4">
                        <div>
                            <span className="mr-4 font-bold">（演示用）切换用户视角:</span>
                            <div className="join">
                                <button 
                                    className={`join-item btn ${userType === 1 ? 'btn-active' : ''}`}
                                    onClick={() => setUserType(1)}
                                >
                                    我是爱狗人士
                                </button>
                                <button 
                                    className={`join-item btn ${userType === 2 ? 'btn-active' : ''}`}
                                    onClick={() => setUserType(2)}
                                >
                                    我是领养方
                                </button>
                            </div>
                        </div>
                        <div className="font-bold text-lg">
                            当前积分: <span className="text-primary">{userPoints}</span>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div role="tablist" className="tabs tabs-lifted tabs-lg">
                    <a
                        role="tab"
                        className={`tab ${activeTab === 'profile' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        我的主页
                    </a>
                    <a
                        role="tab"
                        className={`tab ${activeTab === 'plaza' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('plaza')}
                    >
                        内容广场
                    </a>
                    <a
                        role="tab"
                        className={`tab ${activeTab === 'rules' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('rules')}
                    >
                        奖池与积分规则
                    </a>
                    {/* Add a ghost tab to fill the remaining space and complete the bottom border */}
                    <a role="tab" className="tab [--tab-border-color:transparent]"></a>
          </div>
                {/* A single panel to render the content */}
                <div className="bg-base-100 border-base-300 rounded-box p-6 -mt-[--tab-border] border-t-0">
                    {renderContent()}
        </div>
            </main>

            <Footer />
    </div>
  );
};

export default UserDashboard;