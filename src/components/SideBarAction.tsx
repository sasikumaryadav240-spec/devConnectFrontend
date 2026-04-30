import { Menu, User, X } from "lucide-react";
import { useEffect, useState } from "react"
import { NavLink } from "react-router-dom";
import logo from "../assets/New-LogoLogin-removebg-preview.png";

const SideBarAction = () => {
    const [ isMenuOpen, setIsMenuOpen ] = useState<boolean>(false);

    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
    },[isMenuOpen]);

  return (
    <>
      <button 
        onClick={() => setIsMenuOpen(true)} 
        className="flex justify-center items-center p-2 text-gray-600"
      >
        <Menu size={28} />
      </button>
      <aside className={`fixed top-0 left-0 h-full w-[280px] bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
            <nav className="flex flex-col justify-between justify-center items-center content-around mr-[20px] gap-9 ">
                <div className="flex flex-row justify-center items-center">
                    <img src={logo} className="w-[250px] h-[80px] p-0 m-0"/>
                    <button onClick={() => setIsMenuOpen(false)} className="text-gray-500">
                        <X size={24} />
                    </button>
                </div>
                <NavLink to="/Profile" className="flex flex-row text-xl gap-1 cursor-pointer"
                    onClick={() => setIsMenuOpen(false)}
                >
                    <User className="text-xl font-semibold font-sans tracking-tight bg-blue-300 w-8 h-8 p-1 rounded-3xl border-gray-500"/>
                    <span className="text-gray-800">Profile</span>
                </NavLink>
                <NavLink to="/Dashboard" onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) => isActive ? "text-xl font-semibold font-sans tracking-tight text-blue-800 cursor-pointer transition-colors" : "text-xl font-semibold font-sans tracking-tight text-gray-800 hover:text-blue-800 cursor-pointer transition-colors"}>
                    Home
                </NavLink>
                <NavLink 
                    to="/search" 
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) => 
                    isActive ? "text-xl font-semibold font-sans tracking-tight text-blue-800 cursor-pointer transition-colors" : "text-xl font-semibold font-sans tracking-tight text-gray-800 hover:text-blue-800 cursor-pointer transition-colors hover:text-blue-400"
                    }
                >Search</NavLink>
                <NavLink to="/following" onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) => 
                isActive ? "text-xl font-semibold font-sans tracking-tight text-blue-800 cursor-pointer transition-colors" : "text-xl font-semibold font-sans tracking-tight text-gray-800 hover:text-blue-800 cursor-pointer transition-colors"
                }>
                    Following
                </NavLink>
                <NavLink to="/Posts" onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) => isActive ? "text-xl font-semibold font-sans tracking-tight text-blue-800 cursor-pointer transition-colors" : "text-xl font-semibold font-sans tracking-tight text-gray-800 hover:text-blue-800 cursor-pointer transition-colors"}>
                    Posts
                </NavLink>
            </nav>
      </aside>
    </>
  )
}

export default SideBarAction