import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/logo.png";
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Navbar = () => {
    const navLinks = (
        <>
            <li>
                <NavLink 
                    to="/" 
                    className={({ isActive }) =>
                        `text-lg font-medium ${isActive ? 'text-secondary' : ''} hover:text-secondary transition-colors`
                    }
                >
                    Camera
                </NavLink>
            </li>
            <li>
                <NavLink 
                    to="/userdashboard" 
                    className={({ isActive }) =>
                        `text-lg font-medium ${isActive ? 'text-secondary' : ''} hover:text-secondary transition-colors`
                    }
                >
                    MyHome
                </NavLink>
            </li>
        </>
    );

    return (
        <div className="navbar bg-primary text-primary-content shadow-lg">
            <div className="navbar-start">
                <div className="dropdown">
                    <label tabIndex={0} className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                    </label>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        {navLinks}
                    </ul>
                </div>
                <Link to="/" className="btn btn-ghost normal-case text-xl">
                    <img src={logo} alt="logo" className="w-8 h-8" />
                    <span>WHO'S YOUR MASTER</span>
                </Link>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 space-x-4">
                    {navLinks}
                </ul>
            </div>
            <div className="navbar-end">
                <ConnectButton />
            </div>
        </div>
    );
};

export default Navbar;