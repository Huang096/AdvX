import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useEffect, useState } from "react";


// import icon from '../../assets/user.png';

const Navbar = ({ children }) => {
  // const { user, logOut } = useContext(AuthContext); // Removed
  const [theme, setTheme] = useState(localStorage.getItem("theme") ? localStorage.getItem("theme") : "light");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    const localTheme = localStorage.getItem("theme");
    document.querySelector("html").setAttribute("data-theme", localTheme);

    // Add an event listener to handle scroll position
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [theme]);

  const handleScroll = () => {
    // Check if the user has scrolled down, and set isScrolled accordingly
    if (window.scrollY > 0) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };
  const handleToggle=(e)=>{
        if(e.target.checked){
          setTheme("dark");
      
        }else{
          setTheme("light");
        }
      }
  // const handleSignOut=()=>{ // Removed
  //     logOut()
  //     .then()
  //     .catch();
  //       }
  // The class to apply when the user has scrolled down
  const navbarClass = isScrolled ? "fixed top-0 left-0 right-0" : "";
  const containerClass = isScrolled ? "py-3" : ""; 
  const darkThemeClass = theme === "dark" ? "bg-gray-900" : "bg-white"; 

    const navLinks=<>
    <li className=" "><NavLink to="/" className={({ isActive, isPending }) =>
                    isPending ? "pending " : isActive ? " text-[#fff] font-bold  rounded-3xl bg-[#D52B5C] px-6 py-2 underline-offset-8  hover:text-red " : ""
                  }>Home</NavLink></li>
    <li><NavLink to="/mint" className={({ isActive, isPending }) =>
                    isPending ? "pending" : isActive ? "text-[#fff] font-bold rounded-3xl bg-[#D52B5C] px-6 py-2 underline-offset-8 hover:text-red" : ""
                  }>铸造 NFT</NavLink></li>
    <li><NavLink to="/userdashboard" className={({ isActive, isPending }) =>
                    isPending ? "pending" : isActive ? "text-[#fff] font-bold rounded-3xl bg-[#D52B5C] px-6 py-2 underline-offset-8 hover:text-red" : ""
                  }>我的主页</NavLink></li>
    </>
    return (
      <div className=" z-40">
        <div className={`drawer z-30 ${containerClass} `}>
      <div className={`drawer z-30 py-3 ${navbarClass}`}>
      <div className="drawer z-30  fixed">
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          <div className={` shadow-md w-full ${darkThemeClass}`}>
            <div className="max-w-[1200px] mx-auto navbar">
              <div className="flex-none lg:hidden">
                <label
                  htmlFor="my-drawer-3"
                  aria-label="open sidebar"
                  className="btn btn-square btn-ghost"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="inline-block w-6 h-6 stroke-current"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    ></path>
                  </svg>
                </label>
              </div>
              <div className="flex gap-20">
               <div className="flex  items-center gap-7">
               <div className="  w-16"> <img src={logo}  alt="" /></div>
              <div className="  text-2xl font-bold ">WHO'S YOUR MASTER</div>
               </div>
              <div className="flex-none hidden lg:block">
                <ul className="flex gap-7 items-center">
                  {navLinks}
                </ul>
              </div>
              </div>
              <div className="flex-1 mx-2 px-2">
                {children}
              </div>

              <div className="hidden lg:flex items-center">
                <button className="btn btn-primary">连接钱包</button>
              </div>
      
              <div className="ml-5">
  <label className="swap swap-rotate">
  
  {/* this hidden checkbox controls the state */}
  <input type="checkbox" onChange={handleToggle} />
  
  {/* sun icon */}
  <svg className="swap-on fill-current w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/></svg>
  
  {/* moon icon */}
  <svg className="swap-off fill-current w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"/></svg>
  
</label>
  </div>
           
            </div>
          </div>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-3"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu p-4 w-80 min-h-full bg-base-200">
            {navLinks}
           <div className="flex items-center">
             <button className="btn btn-primary">连接钱包</button>
           </div>
          </ul>
        </div>
      </div>
    </div>
    </div>
      </div>
  );
};

export default Navbar;