import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import Breadcrumb from "./Breadcrumb";
import NotificationsDropdown from "./NotificationsDropdown";
import SearchModal from "./SearchModal";
import { Sun, Moon, Search, Menu, LogOut, ChevronDown, User, Zap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Navbar({ onMobileMenuClick }) {
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [searchOpen, setSearchOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef(null);

    // Click Outside Listener to Automatically Close Profile Dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setProfileOpen(false);
            }
        };

        if (profileOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [profileOpen]);

    const handleLogout = async () => {
        await logout();
        toast.success("Logged out successfully");
        navigate("/login");
    };

    const initials = user
        ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() || "U"
        : "U";

    return (
        <>
            <header className="h-16 border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between transition-colors duration-300">
                
                {/* Left: Mobile Menu Toggle & Breadcrumb */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={onMobileMenuClick}
                        aria-label="Toggle navigation drawer"
                        className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden cursor-pointer"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    <Breadcrumb />
                </div>

                {/* Right: Search, Notifications, Theme Toggle, Profile */}
                <div className="flex items-center gap-3">
                    
                    {/* Search Trigger */}
                    <button
                        onClick={() => setSearchOpen(true)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-xs font-semibold cursor-pointer"
                    >
                        <Search className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Search CRM...</span>
                        <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[10px] font-mono text-slate-400">
                            Ctrl+K
                        </kbd>
                    </button>

                    {/* Notifications */}
                    <NotificationsDropdown />

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                        className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
                    >
                        {theme === "light" ? (
                            <Moon className="w-4 h-4 text-indigo-600" />
                        ) : (
                            <Sun className="w-4 h-4 text-amber-400" />
                        )}
                    </button>

                    {/* Profile Dropdown */}
                    {user && (
                        <div ref={profileRef} className="relative">
                            <button
                                onClick={() => setProfileOpen(!profileOpen)}
                                className="flex items-center gap-2 p-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500 transition-all cursor-pointer"
                            >
                                <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs flex items-center justify-center shadow">
                                    {initials}
                                </div>
                                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block pr-1" />
                            </button>

                            {profileOpen && (
                                <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl py-2 z-50">
                                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                            {user.firstName} {user.lastName}
                                        </p>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                                            {user.email}
                                        </p>
                                        <span className="inline-block mt-1 px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase">
                                            Role: {user.role || "User"}
                                        </span>
                                    </div>

                                    <Link
                                        to="/settings"
                                        onClick={() => setProfileOpen(false)}
                                        className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                                    >
                                        <User className="w-3.5 h-3.5 text-slate-400" />
                                        <span>Account Settings</span>
                                    </Link>

                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-2 cursor-pointer"
                                    >
                                        <LogOut className="w-3.5 h-3.5" />
                                        <span>Sign Out</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                </div>

            </header>

            {/* Quick Search Modal */}
            <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
        </>
    );
}
