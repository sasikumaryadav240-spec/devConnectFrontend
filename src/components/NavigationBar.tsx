import { NavLink } from "react-router-dom";
import logo from "../assets/New-LogoLogin-removebg-preview.png";
import { User, ChevronDown, LogOut } from "lucide-react";
import SideBarAction from "./SideBarAction";
import { useNavigate } from "react-router-dom";

const NavigationBar = () => {
    const navigation = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigation("/", {replace : true})
    }
  return (
    <div className="flex flex-row justify-between sticky top-0 z-[100] bg-white">
        <div className="flex justify-start">
            <div className="md:hidden flex items-center justify-center">
                <SideBarAction/>
            </div>
            <img src={logo} className="w-[250px] h-[80px] p-0 m-0"/>
        </div>
            <nav className="hidden md:flex flex-row justify-between justify-center items-center content-around mr-[20px] gap-9 ">
                <NavLink to="/Dashboard" className={({ isActive }) => isActive ? "text-xl font-semibold font-sans tracking-tight text-blue-800 cursor-pointer transition-colors" : "text-xl font-semibold font-sans tracking-tight text-gray-800 hover:text-blue-800 cursor-pointer transition-colors"}>
                    Home
                </NavLink>
                <NavLink 
                    to="/search" 
                    className={({ isActive }) => 
                    isActive ? "text-xl font-semibold font-sans tracking-tight text-blue-800 cursor-pointer transition-colors" : "text-xl font-semibold font-sans tracking-tight text-gray-800 hover:text-blue-800 cursor-pointer transition-colors hover:text-blue-400"
                    }
                >Search</NavLink>
                <NavLink to="/following" className={({ isActive }) => 
                isActive ? "text-xl font-semibold font-sans tracking-tight text-blue-800 cursor-pointer transition-colors" : "text-xl font-semibold font-sans tracking-tight text-gray-800 hover:text-blue-800 cursor-pointer transition-colors"
                }>
                    Following
                </NavLink>
                <NavLink to="/Posts" className={({ isActive }) => isActive ? "text-xl font-semibold font-sans tracking-tight text-blue-800 cursor-pointer transition-colors" : "text-xl font-semibold font-sans tracking-tight text-gray-800 hover:text-blue-800 cursor-pointer transition-colors"}>
                    Posts
                </NavLink>
                <NavLink to="/Profile" className="flex flex-row text-xl gap-1 cursor-pointer">
                    <User className="text-xl font-semibold font-sans tracking-tight bg-blue-300 w-8 h-8 p-1 rounded-3xl border-gray-500"/>
                    <span className="text-gray-800">Profile</span>
                    <ChevronDown className="text-gray-500"/>
                </NavLink>
            </nav>
            <div className="md:hidden group relative flex justify-center items-center " onClick={() => handleLogout()}>
                <LogOut size={24} className="md:hidden text-gray-700"/>
                <span className="absolute top-12 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100 font-bold">
                    Logout
                </span>
            </div>
    </div>
  )
}

export default NavigationBar