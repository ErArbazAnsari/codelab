import React from "react";
import { useTheme } from "../utils/ThemeContext.jsx";
import { NavLink } from "react-router-dom";
import { Menu } from "lucide-react";
import { useSelector } from "react-redux";

import { ChevronDown, User, LogOut, Settings, HelpCircle, Briefcase, FileText } from "lucide-react";

const Navbar = () => {
    const { theme, setTheme } = useTheme();
    const user = useSelector((state) => state.user);
    const [menuOpen, setMenuOpen] = React.useState(false);
    const [profileOpen, setProfileOpen] = React.useState(false);
    const profileRef = React.useRef(null);

    // Close profile dropdown on outside click
    React.useEffect(() => {
        function handleClick(e) {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setProfileOpen(false);
            }
        }
        if (profileOpen) {
            document.addEventListener("mousedown", handleClick);
        } else {
            document.removeEventListener("mousedown", handleClick);
        }
        return () => document.removeEventListener("mousedown", handleClick);
    }, [profileOpen]);

    return (
        <nav
            className={`navbar sticky top-0 z-50 shadow-lg flex items-center justify-between ${
                theme === "dark"
                    ? "bg-gradient-to-br from-[#18181c]/80 via-[#23232a]/80 to-[#18181c]/80 backdrop-blur-xl border-b border-gray-800 text-white"
                    : "bg-white/80 backdrop-blur-xl border-b border-base-300 text-gray-900"
            }`}
        >
            <div className="container mx-auto px-2 flex items-center justify-between w-full">
                {/* Left: Brand & Mobile Menu */}
                <div className="flex items-center gap-2">
                    <NavLink to="/" className="btn btn-ghost text-xl font-extrabold tracking-tight">
                        <span className="text-primary">CodeLab</span> <span className="text-accent">Pro</span>
                    </NavLink>
                    {/* Mobile menu button */}
                    <button className="lg:hidden btn btn-ghost btn-square" onClick={() => setMenuOpen(!menuOpen)} aria-label="Open menu">
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
                {/* Center: Desktop Menu */}
                <div className="hidden lg:flex flex-1 justify-center">
                    <ul className="menu menu-horizontal px-1 gap-2">
                        <li><NavLink to="/problems" className="btn btn-ghost rounded-lg font-semibold">Problems</NavLink></li>
                        <li><NavLink to="/leaderboard" className="btn btn-ghost rounded-lg font-semibold">Leaderboard</NavLink></li>
                        <li><NavLink to="/contests" className="btn btn-ghost rounded-lg font-semibold">Contests</NavLink></li>
                        <li><NavLink to="/discuss" className="btn btn-ghost rounded-lg font-semibold">Discuss</NavLink></li>
                    </ul>
                </div>
                {/* Right: Theme Switcher & Profile */}
                <div className="flex items-center gap-2 relative">
                    <button
                        className={`btn btn-outline btn-sm flex items-center gap-2 rounded-full border px-3 py-1 shadow ${
                            theme === "dark"
                                ? "bg-[#23232a]/80 text-white border-gray-700 hover:bg-[#23232a]/90"
                                : "bg-white/80 text-gray-900 border-base-300 hover:bg-base-200"
                        }`}
                        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                        aria-label="Toggle theme"
                        style={{ minWidth: 48 }}
                    >
                        <span className="flex items-center gap-1">
                            {theme === "dark" ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" /></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="5" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 6.95l-1.41-1.41M6.46 6.46L5.05 5.05m12.02 12.02l-1.41-1.41M6.46 17.54l-1.41 1.41" /></svg>
                            )}
                        <span className="text-xs font-bold">{theme === "dark" ? "Dark" : "Light"}</span>
                        </span>
                    </button>
                    {/* Profile button with dropdown */}
                    <div className="relative" ref={profileRef}>
                        <button
                            className="btn btn-primary btn-sm rounded-full font-semibold shadow-md flex items-center gap-2"
                            onClick={() => setProfileOpen((open) => !open)}
                            aria-label="Open profile menu"
                        >
                            <User className="w-5 h-5" />
                            {user && user.username ? user.username : "Profile"}
                            <ChevronDown className="w-4 h-4" />
                        </button>
                        {profileOpen && (
                            <div
                                className={`absolute right-0 mt-2 w-56 border rounded-xl shadow-2xl z-50 ${
                                    theme === "dark"
                                        ? "bg-gradient-to-br from-[#18181c]/95 via-[#23232a]/95 to-[#18181c]/95 text-white border-gray-700"
                                        : "bg-white/95 text-gray-900 border-base-300"
                                }`}
                            >
                                <ul className="py-2">
                                    <li><NavLink to="/profile" className={`flex items-center gap-2 px-4 py-3 rounded-lg ${theme === "dark" ? "hover:bg-gray-800/80" : "hover:bg-base-200"}`} onClick={() => setProfileOpen(false)}><User className="w-4 h-4" /> My Profile</NavLink></li>
                                    <li><NavLink to="/settings" className={`flex items-center gap-2 px-4 py-3 rounded-lg ${theme === "dark" ? "hover:bg-gray-800/80" : "hover:bg-base-200"}`} onClick={() => setProfileOpen(false)}><Settings className="w-4 h-4" /> Settings</NavLink></li>
                                    <li><NavLink to="/jobs" className={`flex items-center gap-2 px-4 py-3 rounded-lg ${theme === "dark" ? "hover:bg-gray-800/80" : "hover:bg-base-200"}`} onClick={() => setProfileOpen(false)}><Briefcase className="w-4 h-4" /> Jobs</NavLink></li>
                                    <li><NavLink to="/support" className={`flex items-center gap-2 px-4 py-3 rounded-lg ${theme === "dark" ? "hover:bg-gray-800/80" : "hover:bg-base-200"}`} onClick={() => setProfileOpen(false)}><HelpCircle className="w-4 h-4" /> Help Center</NavLink></li>
                                    <li><NavLink to="/terms" className={`flex items-center gap-2 px-4 py-3 rounded-lg ${theme === "dark" ? "hover:bg-gray-800/80" : "hover:bg-base-200"}`} onClick={() => setProfileOpen(false)}><FileText className="w-4 h-4" /> Terms</NavLink></li>
                                    <li><NavLink to="/privacy" className={`flex items-center gap-2 px-4 py-3 rounded-lg ${theme === "dark" ? "hover:bg-gray-800/80" : "hover:bg-base-200"}`} onClick={() => setProfileOpen(false)}><FileText className="w-4 h-4" /> Privacy Policy</NavLink></li>
                                    <li><NavLink to="/logout" className={`flex items-center gap-2 px-4 py-3 rounded-lg ${theme === "dark" ? "hover:bg-error/80 hover:text-white" : "hover:bg-error/10 hover:text-error"}`} onClick={() => setProfileOpen(false)} replace><LogOut className="w-4 h-4" /> Logout</NavLink></li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* Mobile Menu Dropdown */}
            {menuOpen && (
                <div className={`lg:hidden absolute top-full left-0 w-full bg-base-100 ${theme === "dark" ? "bg-pureblack text-lightgray" : "bg-base-100"} shadow-xl border-t border-base-300 animate-fade-in`}>
                    <ul className="flex flex-col gap-2 p-4">
                        <li><NavLink to="/problems" className="btn btn-ghost w-full text-left" onClick={() => setMenuOpen(false)}>Problems</NavLink></li>
                        <li><NavLink to="/leaderboard" className="btn btn-ghost w-full text-left" onClick={() => setMenuOpen(false)}>Leaderboard</NavLink></li>
                        <li><NavLink to="/contests" className="btn btn-ghost w-full text-left" onClick={() => setMenuOpen(false)}>Contests</NavLink></li>
                        <li><NavLink to="/discuss" className="btn btn-ghost w-full text-left" onClick={() => setMenuOpen(false)}>Discuss</NavLink></li>
                        <li>
                            <button
                                className={`btn btn-outline btn-sm w-full flex items-center gap-2 rounded-full border-base-300 px-3 py-1 ${theme === "dark" ? "bg-black text-white border-white" : "bg-base-100"}`}
                                onClick={() => { setTheme(theme === "light" ? "dark" : "light"); setMenuOpen(false); }}
                                aria-label="Toggle theme"
                                style={{ minWidth: 48 }}
                            >
                                <span className="relative inline-block w-8 h-5">
                                    <span className={`absolute left-0 top-1/2 transform -translate-y-1/2 w-8 h-5 rounded-full transition-colors duration-300 ${theme === "dark" ? "bg-gray-700" : "bg-gray-300"}`}></span>
                                    <span className={`absolute top-1/2 left-0 transform -translate-y-1/2 transition-all duration-300 ${theme === "dark" ? "translate-x-3" : "translate-x-0"}`}>
                                        <span className={`block w-5 h-5 rounded-full shadow ${theme === "dark" ? "bg-white" : "bg-gray-700"}`}></span>
                                    </span>
                                </span>
                            </button>
                        </li>
                        <li>
                            <button
                                className="btn btn-primary w-full text-left flex items-center gap-2 rounded-full font-semibold shadow-md"
                                onClick={() => setProfileOpen((open) => !open)}
                                aria-label="Open profile menu"
                            >
                                <User className="w-5 h-5" />
                                {user && user.username ? user.username : "Profile"}
                                <ChevronDown className="w-4 h-4" />
                            </button>
                            {profileOpen && (
                                <div className={`mt-2 w-full border rounded-xl shadow-xl z-50 animate-fade-in transition-all duration-300 ${theme === "dark" ? "bg-gradient-to-br from-[#18181c]/95 via-[#23232a]/95 to-[#18181c]/95 text-white border-gray-700" : "bg-white/95 text-gray-900 border-base-300"}`}>
                                    <ul className="py-2">
                                        <li><NavLink to="/profile" className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${theme === "dark" ? "hover:bg-gray-800/80" : "hover:bg-base-200"}`}><User className="w-4 h-4" /> My Profile</NavLink></li>
                                        <li><NavLink to="/settings" className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${theme === "dark" ? "hover:bg-gray-800/80" : "hover:bg-base-200"}`}><Settings className="w-4 h-4" /> Settings</NavLink></li>
                                        <li><NavLink to="/jobs" className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${theme === "dark" ? "hover:bg-gray-800/80" : "hover:bg-base-200"}`}><Briefcase className="w-4 h-4" /> Jobs</NavLink></li>
                                        <li><NavLink to="/support" className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${theme === "dark" ? "hover:bg-gray-800/80" : "hover:bg-base-200"}`}><HelpCircle className="w-4 h-4" /> Help Center</NavLink></li>
                                        <li><NavLink to="/terms" className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${theme === "dark" ? "hover:bg-gray-800/80" : "hover:bg-base-200"}`}><FileText className="w-4 h-4" /> Terms</NavLink></li>
                                        <li><NavLink to="/privacy" className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${theme === "dark" ? "hover:bg-gray-800/80" : "hover:bg-base-200"}`}><FileText className="w-4 h-4" /> Privacy Policy</NavLink></li>
                                        <li><NavLink to="/logout" className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${theme === "dark" ? "hover:bg-error/80 hover:text-white" : "hover:bg-error/10 hover:text-error"}`} replace><LogOut className="w-4 h-4" /> Logout</NavLink></li>
                                    </ul>
                                </div>
                            )}
                        </li>
                    </ul>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
