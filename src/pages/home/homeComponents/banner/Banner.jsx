import React from 'react';
import { TypeAnimation } from 'react-type-animation';
import { FaPaw, FaUsers, FaCubes, FaHandHoldingHeart } from 'react-icons/fa';

const MissionItem = ({ icon, title, description }) => (
    <div className="flex items-start gap-4">
        <div className="text-secondary text-3xl mt-1">{icon}</div>
        <div>
            <h3 className="font-bold text-lg">{title}</h3>
            <p className="text-sm text-base-content text-opacity-70">{description}</p>
        </div>
    </div>
);

const Banner = () => {
    const handleScrollToMatching = () => {
        const matchingSection = document.getElementById('ai-matching-section');
        if (matchingSection) {
            matchingSection.scrollIntoView({ behavior: 'smooth' });
        }
    };
    
    const missions = [
        { icon: <FaPaw />, title: "AI 智能匹配", description: "为你找到长相最像你的流浪毛孩。" },
        { icon: <FaUsers />, title: "专属内容社区", description: "见证每一只流浪狗的成长点滴。" },
        { icon: <FaCubes />, title: "铸造链上身份 (NFT)", description: "成为它在元宇宙中永远的守护者。" },
        { icon: <FaHandHoldingHeart />, title: "透明捐赠与激励", description: "所有善款公开透明，用于帮助个人和机构。" }
    ];

    return (
        <div className="bg-base-100">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Left Column: Slogan & CTA */}
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                            <TypeAnimation
                                sequence={[
                                    '嘿，有只狗狗',
                                    2000,
                                    '',
                                    500,
                                ]}
                                wrapper="span"
                                speed={50}
                                className="block"
                                repeat={Infinity}
                            />
                            <span className="block mt-2 text-5xl lg:text-6xl font-extrabold text-secondary">长得好像你！</span>
                        </h1>
                        <p className="mt-4 mb-6 max-w-md mx-auto md:mx-0 text-lg text-base-content text-opacity-80">
                            通过 AI 摄像头，我们为你匹配最像你的流浪毛孩，开启一段奇妙的云养之旅，直至把它带回家。
                        </p>
                        <button
                            onClick={handleScrollToMatching}
                            className="btn btn-primary btn-lg text-black hover:text-white"
                        >
                            开启匹配之旅
                        </button>
                    </div>

                    {/* Right Column: Mission */}
                    <div className="bg-base-200 p-8 rounded-2xl shadow-lg">
                        <h2 className="text-2xl font-bold mb-6 text-center">我们的理念</h2>
                        <div className="space-y-6">
                            {missions.map((mission, index) => (
                                <MissionItem key={index} {...mission} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Banner;