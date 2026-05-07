import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/New-LogoLogin-removebg-preview.png";
import {
  User,
  ChevronDown,
  LogOut,
  Search,
  House,
  Newspaper,
  Users,
} from "lucide-react";
import SideBarAction from "./SideBarAction";

const NavigationBar = () => {
  const navigation = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigation("/", { replace: true });
  };

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 text-[15px] font-semibold transition-all duration-200 ${
      isActive
        ? "text-blue-600"
        : "text-gray-600 hover:text-blue-600"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-[75px] flex items-center justify-between">
        <div className="flex items-center gap-3">

          <div className="md:hidden">
            <SideBarAction />
          </div>

          <img
            src={logo}
            alt="logo"
            className="w-[180px] h-[65px] object-contain"
          />
        </div>
        <nav className="hidden md:flex items-center gap-8">

          <NavLink to="/Dashboard" className={navClass}>
            <House size={18} />
            Home
          </NavLink>

          <NavLink to="/search" className={navClass}>
            <Search size={18} />
            Search
          </NavLink>

          <NavLink to="/following" className={navClass}>
            <Users size={18} />
            Following
          </NavLink>

          <NavLink to="/Posts" className={navClass}>
            <Newspaper size={18} />
            Posts
          </NavLink>
        </nav>
        <div className="flex items-center gap-5">
          <NavLink
            to="/Profile"
            className="hidden md:flex items-center gap-2"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
              <User className="text-white w-5 h-5" />
            </div>

            <div className="flex items-center">
              <span className="text-sm font-semibold text-gray-700">
                Profile
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
          </NavLink>
          <button
            onClick={handleLogout}
            className="group relative flex items-center justify-center"
          >
            <div className="p-2 rounded-xl hover:bg-red-50 transition">
              <LogOut className="w-5 h-5 text-gray-700 group-hover:text-red-500 transition" />
            </div>

            <span className="absolute top-12 scale-0 group-hover:scale-100 transition-all duration-200 rounded-lg bg-gray-900 px-3 py-1 text-xs text-white font-semibold">
              Logout
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default NavigationBar;