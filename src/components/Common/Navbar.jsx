import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faRightFromBracket, faBars, faGear } from "@fortawesome/free-solid-svg-icons";

import { HiOutlineLightBulb, HiOutlineMoon } from 'react-icons/hi';
import { useSearch } from "../../context/SearchContext";
import { useSidebar } from "../../context/SideBarContext";
import { useTheme } from '../../context/ThemeContext';
import { logout as apiLogout } from '../../services/authService';
import { toast } from 'react-hot-toast';


const Navbar = () => {
    const navigate = useNavigate();
    const { setSearchTerm } = useSearch();
    const [tempSearch, setTempSearch] = useState("");
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { collapsed, setCollapsed } = useSidebar();
    const user = JSON.parse(localStorage.getItem("user-info"));
    const img = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name || 'User');
    const { darkMode, toggleDarkMode } = useTheme();
    
    const logout = async () => {
        try {
            await apiLogout();
        } catch {}
        localStorage.removeItem("user-info");
        navigate("/");
        toast.success("Logged out successfully!");
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchTerm(tempSearch);
        navigate(`/search?query=${tempSearch}`);
    };

    return (
        <header className="bg-white dark:bg-zinc-900 
                         text-gray-900 dark:text-white fixed top-0 w-full z-50">
            <div className="h-16 px-4 flex items-center justify-between gap-4">

                <div className="flex items-center gap-8">
                    <button
                        onClick={() => setCollapsed(prev => !prev)}
                        className="p-2 
                                 rounded-full transition-colors text-2xl"
                    >
                        <FontAwesomeIcon icon={faBars} className="text-gray-700 dark:text-gray-200" />
                    </button>
                </div>

                <div className="flex-1 max-w-xl">
                    <form onSubmit={handleSearch}>
                        <div className="relative">
                            <input
                                type="text"
                                value={tempSearch}
                                onChange={(e) => setTempSearch(e.target.value)}
                                placeholder="Search for videos from youtube"
                                className="w-full px-2 py-2 pl-5
                                         bg-gray-50 dark:bg-zinc-800 
                                         border border-gray-200 dark:border-zinc-700 
                                         text-gray-700 dark:text-white 
                                         placeholder-zinc-500 dark:placeholder-white
                                         rounded-full focus:outline-none focus:border-gray-300"
                            />
                            <FontAwesomeIcon
                                icon={faSearch}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 dark:text-white text-zinc-500"
                            />
                        </div>
                    </form>
                </div>

                <div className="flex items-center gap-2">

                    <div className="relative flex items-center">
                        <button
                            onClick={() => toggleDarkMode()}
                            className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-gray-600'
                                } hover:opacity-80 transition-opacity`}
                        >
                            {darkMode ? <HiOutlineLightBulb className="w-6 h-6" /> : <HiOutlineMoon className="w-6 h-6" />}
                        </button>
                    </div>
                    
                    <div className="relative ml-2">
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center"
                        >
                            <img
                                src={img}
                                alt="Profile"
                                className="w-9 h-9 rounded-full object-cover"
                            />
                        </button>

                        {isProfileOpen && (
                            <div className="absolute right-0 mt-2 w-60 
                                          bg-white dark:bg-gray-900 
                                          border border-gray-100 dark:border-gray-700 
                                          rounded-lg shadow-lg">
                                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                                    <p className="font-medium text-gray-900 dark:text-gray-200">
                                        {user?.name}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {user?.email}
                                    </p>
                                </div>

                                <div className="py-2">
                                    <button
                                        onClick={() => { navigate("/profile"); setIsProfileOpen(false); }}
                                        className="w-full px-4 py-2 text-left 
                                                 text-gray-700 dark:text-gray-300 
                                                 hover:bg-gray-50 dark:hover:bg-gray-800 
                                                 flex items-center gap-3"
                                    >
                                        <FontAwesomeIcon icon={faGear} className="text-gray-400" />
                                        <span>Profile</span>
                                    </button>

                                    <button
                                        onClick={() => logout()}
                                        className="w-full px-4 py-2 text-left text-red-600 
                                                 hover:bg-gray-50 dark:hover:bg-gray-800 
                                                 flex items-center gap-3"
                                    >
                                        <FontAwesomeIcon icon={faRightFromBracket} className="text-red-400" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
