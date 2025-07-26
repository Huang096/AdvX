import React from 'react';
import logo from '../../assets/adventureX.png';
import { FaTwitter, FaDiscord, FaTelegramPlane } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-base-200 text-base-content">
            <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center flex-wrap gap-4">
                    <aside className="flex items-center gap-3">
                        <img className='w-10 h-10' src={logo} alt="AdventureX Logo" />
                        <div>
                            <p className='font-bold text-lg'>WHO'S YOUR MASTER</p>
                            <p className="text-sm text-gray-500">© 2024. All Rights Reserved.</p>
                        </div>
                    </aside>

                    <nav className="flex gap-4">
                        <a href="#" aria-label="Twitter" className="text-gray-500 hover:text-gray-900">
                            <FaTwitter size={24} />
                        </a>
                        <a href="#" aria-label="Discord" className="text-gray-500 hover:text-gray-900">
                            <FaDiscord size={24} />
                        </a>
                        <a href="#" aria-label="Telegram" className="text-gray-500 hover:text-gray-900">
                            <FaTelegramPlane size={24} />
                        </a>
                    </nav>
                </div>
            </div>
        </footer>
    );
};

export default Footer;