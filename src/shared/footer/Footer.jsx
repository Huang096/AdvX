import React from 'react';
import logo from '../../assets/adventureX.png';
import { FaTwitter, FaDiscord, FaTelegramPlane, FaCamera, FaHeart, FaGift, FaHome } from 'react-icons/fa';

const Footer = () => {
    const howItWorksSteps = [
        { icon: <FaCamera />, text: "AI智能匹配" },
        { icon: <FaHeart />, text: "独一无二的链上身份" },
        { icon: <FaGift />, text: "链上云养社区" },
        { icon: <FaHome />, text: "寻找一个永远的家" }
    ];

    return (
        <footer className="bg-base-200 text-base-content text-sm">
            <div className="container mx-auto p-4 flex justify-between items-center">
                {/* 第一部分：品牌信息 */}
                <aside className="flex items-center gap-2">
                    <img className='w-10 h-10' src={logo} alt="AdventureX Logo" />
                    <div>
                        <p className='font-bold'>WHO'S YOUR MASTER</p>
                        <p className="text-xs">科技与爱心相遇，让每个生命都值得被期待。</p>
                    </div>
                </aside>

                {/* 第二部分：我们如何运作 (横向带图标) */}
                <nav className="hidden md:flex flex-col items-center">
                    <p className="font-bold mb-1">运作模式:</p>
                    <div className="flex gap-4">
                        {howItWorksSteps.map((step, index) => (
                            <div key={index} className="flex items-center gap-1">
                                {step.icon}
                                <span>{step.text}</span>
                            </div>
                        ))}
                    </div>
                </nav>

                {/* 第三部分：社交媒体 */}
                <nav className="flex gap-4">
                    <a href="#" className="link link-hover text-xl"><FaTwitter /></a>
                    <a href="#" className="link link-hover text-xl"><FaDiscord /></a>
                    <a href="#" className="link link-hover text-xl"><FaTelegramPlane /></a>
                </nav>
            </div>
            {/* 底部版权栏 */}
            <div className="text-center text-xs p-2 bg-base-300">
                <p>© 2024 WHO'S YOUR MASTER. All Rights Reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;