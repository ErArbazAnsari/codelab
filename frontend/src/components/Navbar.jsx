import React from "react";
import { useTheme } from "../utils/ThemeContext.jsx";
import { NavLink, useLocation } from "react-router-dom";
import {
    Menu,
    ChevronDown,
    User,
    LogOut,
    Settings,
    HelpCircle,
    Briefcase,
    FileText,
    X,
    Sun,
    Moon,
    Code,
    Trophy,
    MessageSquare,
    Calendar,
    Shield,
    Bell,
    Search,
} from "lucide-react";
import { useSelector } from "react-redux";

const Navbar = () => {
    const { theme, setTheme } = useTheme();
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const [menuOpen, setMenuOpen] = React.useState(false);
    const [profileOpen, setProfileOpen] = React.useState(false);
    // const [searchOpen, setSearchOpen] = React.useState(false);
    const profileRef = React.useRef(null);
    const mobileMenuRef = React.useRef(null);
    const location = useLocation();

    // Close dropdowns on outside click
    React.useEffect(() => {
        function handleClick(e) {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setProfileOpen(false);
            }
            if (
                mobileMenuRef.current &&
                !mobileMenuRef.current.contains(e.target)
            ) {
                setMenuOpen(false);
            }
        }
        if (profileOpen || menuOpen) {
            document.addEventListener("mousedown", handleClick);
        } else {
            document.removeEventListener("mousedown", handleClick);
        }
        return () => document.removeEventListener("mousedown", handleClick);
    }, [profileOpen, menuOpen]);

    // Close mobile menu on route change
    React.useEffect(() => {
        setMenuOpen(false);
        setProfileOpen(false);
    }, [location.pathname]);

    // Prevent body scroll when mobile menu is open
    React.useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [menuOpen]);

    const navItems = [
        {
            to: "/problems",
            label: "Problems",
            icon: <Code className="w-4 h-4" />,
        },
        {
            to: "/leaderboard",
            label: "Leaderboard",
            icon: <Trophy className="w-4 h-4" />,
        },
        {
            to: "/contests",
            label: "Contests",
            icon: <Calendar className="w-4 h-4" />,
        },
        {
            to: "/discuss",
            label: "Discuss",
            icon: <MessageSquare className="w-4 h-4" />,
        },
    ];

    const isActivePath = (path) => {
        return (
            location.pathname === path ||
            location.pathname.startsWith(path + "/")
        );
    };

    return (
        <>
            <nav
                className={`navbar sticky top-0 z-50 ${
                    theme === "dark"
                        ? "bg-pureblack backdrop-blur-xl text-white shadow-lg shadow-gray-900/20"
                        : "bg-white/95 backdrop-blur-xl text-gray-900 shadow-lg shadow-gray-200/20"
                }`}
            >
                <div className="container mx-auto px-4 flex items-center justify-between w-full h-16">
                    {/* Left: Brand & Mobile Menu */}
                    <div className="flex items-center gap-4">
                        <NavLink
                            to="/"
                            className="flex items-center gap-2 font-extrabold text-xl tracking-tight hover:scale-105 transition-transform duration-200"
                        >
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-lg">
                                CL
                            </div>
                            <span className="hidden sm:block">
                                <span className="text-blue-600">CodeLab</span>
                                <span className="text-purple-600">Pro</span>
                            </span>
                        </NavLink>

                        {/* Mobile menu button */}
                        <button
                            className={`lg:hidden p-2 rounded-xl transition-all duration-200 ${
                                theme === "dark"
                                    ? "hover:bg-gray-800 active:bg-gray-700"
                                    : "hover:bg-gray-100 active:bg-gray-200"
                            }`}
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label={menuOpen ? "Close menu" : "Open menu"}
                        >
                            {menuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>

                    {/* Center: Desktop Navigation */}
                    <div className="hidden lg:flex flex-1 justify-center">
                        <div
                            className={`flex items-center space-x-1 p-1 rounded-2xl ${
                                theme === "dark"
                                    ? "bg-gray-800/50"
                                    : "bg-gray-100/80"
                            }`}
                        >
                            {navItems.map((item) => (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                                        isActivePath(item.to)
                                            ? theme === "dark"
                                                ? "bg-blue-600 text-white shadow-lg"
                                                : "bg-white text-blue-600 shadow-md"
                                            : theme === "dark"
                                            ? "text-gray-300 hover:text-white hover:bg-gray-700"
                                            : "text-gray-600 hover:text-gray-900 hover:bg-white/60"
                                    }`}
                                >
                                    {item.icon}
                                    <span className="hidden xl:block">
                                        {item.label}
                                    </span>
                                </NavLink>
                            ))}
                            {isAuthenticated && user?.role === "admin" && (
                                <NavLink
                                    to="/admin"
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                                        isActivePath("/admin")
                                            ? "bg-orange-500 text-white shadow-lg"
                                            : theme === "dark"
                                            ? "text-orange-400 hover:text-orange-300 hover:bg-gray-700"
                                            : "text-orange-600 hover:text-orange-700 hover:bg-white/60"
                                    }`}
                                >
                                    <Shield className="w-4 h-4" />
                                    <span className="hidden xl:block">
                                        Admin
                                    </span>
                                </NavLink>
                            )}
                        </div>
                    </div>

                    {/* Right: Search, Theme Switcher & Profile */}
                    <div className="flex items-center gap-3">
                        {/* Search Button */}
                        {/* <button
                            className={`hidden md:flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                                theme === "dark"
                                    ? "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200"
                            }`}
                            onClick={() => setSearchOpen(true)}
                        >
                            <Search className="w-4 h-4" />
                            <span className="hidden lg:block">Search...</span>
                            <kbd
                                className={`px-1.5 py-0.5 text-xs rounded ${
                                    theme === "dark"
                                        ? "bg-gray-700 text-gray-400"
                                        : "bg-gray-200 text-gray-500"
                                }`}
                            >
                                ⌘K
                            </kbd>
                        </button> */}

                        {/* Theme Toggle */}
                        <button
                            className={`p-2.5 rounded-xl transition-all duration-200 ${
                                theme === "dark"
                                    ? "bg-gray-800 text-yellow-400 hover:bg-gray-700 hover:text-yellow-300"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
                            }`}
                            onClick={() =>
                                setTheme(theme === "light" ? "dark" : "light")
                            }
                            aria-label="Toggle theme"
                        >
                            {theme === "dark" ? (
                                <Sun className="w-5 h-5" />
                            ) : (
                                <Moon className="w-5 h-5" />
                            )}
                        </button>

                        {/* Notifications (for authenticated users) */}
                        {isAuthenticated && (
                            <button
                                className={`p-2.5 rounded-xl transition-all duration-200 relative ${
                                    theme === "dark"
                                        ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                                aria-label="Notifications"
                            >
                                <Bell className="w-5 h-5" />
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                            </button>
                        )}

                        {/* Auth Section */}
                        {isAuthenticated ? (
                            <div className="relative" ref={profileRef}>
                                <button
                                    className={`flex items-center gap-2 px-3 py-2 rounded-xl font-medium transition-all duration-200 ${
                                        theme === "dark"
                                            ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/25"
                                            : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/25"
                                    }`}
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    aria-label="Open profile menu"
                                >
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                        {user?.firstName?.charAt(0) ||
                                            user?.email?.charAt(0) ||
                                            "U"}
                                    </div>
                                    <span className="hidden sm:block max-w-20 truncate">
                                        {user?.firstName || "Profile"}
                                    </span>
                                    <ChevronDown
                                        className={`w-4 h-4 transition-transform duration-200 ${
                                            profileOpen ? "rotate-180" : ""
                                        }`}
                                    />
                                </button>

                                {/* Profile Dropdown */}
                                {profileOpen && (
                                    <div
                                        className={`absolute right-0 mt-3 w-64 rounded-2xl shadow-2xl border backdrop-blur-xl z-50 transform transition-all duration-200 ${
                                            theme === "dark"
                                                ? "bg-gray-900/95 border-gray-700 text-white"
                                                : "bg-white/95 border-gray-200 text-gray-900"
                                        }`}
                                    >
                                        {/* Profile Header */}
                                        <div
                                            className={`p-4 border-b ${
                                                theme === "dark"
                                                    ? "border-gray-700"
                                                    : "border-gray-200"
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-lg font-bold">
                                                    {user?.firstName?.charAt(
                                                        0
                                                    ) ||
                                                        user?.email?.charAt(
                                                            0
                                                        ) ||
                                                        "U"}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold truncate">
                                                        {user?.firstName}{" "}
                                                        {user?.lastName}
                                                    </p>
                                                    <p
                                                        className={`text-sm truncate ${
                                                            theme === "dark"
                                                                ? "text-gray-400"
                                                                : "text-gray-600"
                                                        }`}
                                                    >
                                                        {user?.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Menu Items */}
                                        <div className="py-2">
                                            <NavLink
                                                to="/profile"
                                                className={`flex items-center gap-3 px-4 py-3 transition-colors duration-200 ${
                                                    theme === "dark"
                                                        ? "hover:bg-gray-800"
                                                        : "hover:bg-gray-100"
                                                }`}
                                                onClick={() =>
                                                    setProfileOpen(false)
                                                }
                                            >
                                                <User className="w-5 h-5" />
                                                <span>My Profile</span>
                                            </NavLink>
                                            <NavLink
                                                to="/settings"
                                                className={`flex items-center gap-3 px-4 py-3 transition-colors duration-200 ${
                                                    theme === "dark"
                                                        ? "hover:bg-gray-800"
                                                        : "hover:bg-gray-100"
                                                }`}
                                                onClick={() =>
                                                    setProfileOpen(false)
                                                }
                                            >
                                                <Settings className="w-5 h-5" />
                                                <span>Settings</span>
                                            </NavLink>
                                            <NavLink
                                                to="/help"
                                                className={`flex items-center gap-3 px-4 py-3 transition-colors duration-200 ${
                                                    theme === "dark"
                                                        ? "hover:bg-gray-800"
                                                        : "hover:bg-gray-100"
                                                }`}
                                                onClick={() =>
                                                    setProfileOpen(false)
                                                }
                                            >
                                                <HelpCircle className="w-5 h-5" />
                                                <span>Help & Support</span>
                                            </NavLink>
                                            {user?.role === "admin" && (
                                                <NavLink
                                                    to="/admin"
                                                    className={`flex items-center gap-3 px-4 py-3 text-orange-500 transition-colors duration-200 ${
                                                        theme === "dark"
                                                            ? "hover:bg-gray-800"
                                                            : "hover:bg-gray-100"
                                                    }`}
                                                    onClick={() =>
                                                        setProfileOpen(false)
                                                    }
                                                >
                                                    <Shield className="w-5 h-5" />
                                                    <span>Admin Panel</span>
                                                </NavLink>
                                            )}
                                            <hr
                                                className={`my-2 ${
                                                    theme === "dark"
                                                        ? "border-gray-700"
                                                        : "border-gray-200"
                                                }`}
                                            />
                                            <NavLink
                                                to="/logout"
                                                className={`flex items-center gap-3 px-4 py-3 text-red-500 transition-colors duration-200 ${
                                                    theme === "dark"
                                                        ? "hover:bg-gray-800"
                                                        : "hover:bg-gray-100"
                                                }`}
                                                onClick={() =>
                                                    setProfileOpen(false)
                                                }
                                                replace
                                            >
                                                <LogOut className="w-5 h-5" />
                                                <span>Sign Out</span>
                                            </NavLink>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <NavLink
                                    to="/login"
                                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                                        theme === "dark"
                                            ? "text-gray-300 hover:text-white hover:bg-gray-800"
                                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                    }`}
                                >
                                    Sign In
                                </NavLink>
                                <NavLink
                                    to="/signup"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-600/25"
                                >
                                    Get Started
                                </NavLink>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {menuOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
                    onClick={() => setMenuOpen(false)}
                />
            )}

            {/* Mobile Menu */}
            <div
                ref={mobileMenuRef}
                className={`lg:hidden fixed top-16 left-0 right-0 z-50 transform transition-all duration-300 ${
                    menuOpen
                        ? "translate-y-0 opacity-100"
                        : "-translate-y-full opacity-0"
                } ${
                    theme === "dark"
                        ? "bg-gray-900/95 backdrop-blur-xl border-b border-gray-800"
                        : "bg-white/95 backdrop-blur-xl border-b border-gray-200"
                }`}
            >
                <div className="container mx-auto px-4 py-6">
                    {/* Search Bar (Mobile) */}
                    <div
                        className={`mb-6 p-3 rounded-xl border ${
                            theme === "dark"
                                ? "bg-gray-800 border-gray-700"
                                : "bg-gray-100 border-gray-200"
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <Search className="w-5 h-5 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search problems..."
                                className="flex-1 bg-transparent outline-none"
                            />
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="space-y-2 mb-6">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={`flex items-center gap-4 p-4 rounded-xl font-medium transition-all duration-200 ${
                                    isActivePath(item.to)
                                        ? theme === "dark"
                                            ? "bg-blue-600 text-white"
                                            : "bg-blue-600 text-white"
                                        : theme === "dark"
                                        ? "text-gray-300 hover:text-white hover:bg-gray-800"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                }`}
                                onClick={() => setMenuOpen(false)}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </NavLink>
                        ))}
                        {isAuthenticated && user?.role === "admin" && (
                            <NavLink
                                to="/admin"
                                className={`flex items-center gap-4 p-4 rounded-xl font-medium transition-all duration-200 ${
                                    isActivePath("/admin")
                                        ? "bg-orange-500 text-white"
                                        : theme === "dark"
                                        ? "text-orange-400 hover:text-orange-300 hover:bg-gray-800"
                                        : "text-orange-600 hover:text-orange-700 hover:bg-gray-100"
                                }`}
                                onClick={() => setMenuOpen(false)}
                            >
                                <Shield className="w-5 h-5" />
                                <span>Admin Panel</span>
                            </NavLink>
                        )}
                    </div>

                    {/* Auth Section (Mobile) */}
                    {isAuthenticated ? (
                        <div className="space-y-2">
                            <div
                                className={`p-4 rounded-xl border ${
                                    theme === "dark"
                                        ? "bg-gray-800 border-gray-700"
                                        : "bg-gray-100 border-gray-200"
                                }`}
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-lg font-bold">
                                        {user?.firstName?.charAt(0) ||
                                            user?.email?.charAt(0) ||
                                            "U"}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold truncate">
                                            {user?.firstName} {user?.lastName}
                                        </p>
                                        <p
                                            className={`text-sm truncate ${
                                                theme === "dark"
                                                    ? "text-gray-400"
                                                    : "text-gray-600"
                                            }`}
                                        >
                                            {user?.email}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <NavLink
                                to="/profile"
                                className={`flex items-center gap-4 p-4 rounded-xl font-medium transition-all duration-200 ${
                                    theme === "dark"
                                        ? "text-gray-300 hover:text-white hover:bg-gray-800"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                }`}
                                onClick={() => setMenuOpen(false)}
                            >
                                <User className="w-5 h-5" />
                                <span>My Profile</span>
                            </NavLink>
                            <NavLink
                                to="/settings"
                                className={`flex items-center gap-4 p-4 rounded-xl font-medium transition-all duration-200 ${
                                    theme === "dark"
                                        ? "text-gray-300 hover:text-white hover:bg-gray-800"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                }`}
                                onClick={() => setMenuOpen(false)}
                            >
                                <Settings className="w-5 h-5" />
                                <span>Settings</span>
                            </NavLink>
                            <NavLink
                                to="/logout"
                                className={`flex items-center gap-4 p-4 rounded-xl font-medium text-red-500 transition-all duration-200 ${
                                    theme === "dark"
                                        ? "hover:bg-gray-800"
                                        : "hover:bg-gray-100"
                                }`}
                                onClick={() => setMenuOpen(false)}
                                replace
                            >
                                <LogOut className="w-5 h-5" />
                                <span>Sign Out</span>
                            </NavLink>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <NavLink
                                to="/login"
                                className={`block w-full p-4 text-center rounded-xl font-medium transition-all duration-200 ${
                                    theme === "dark"
                                        ? "text-gray-300 hover:text-white hover:bg-gray-800 border border-gray-700"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-200"
                                }`}
                                onClick={() => setMenuOpen(false)}
                            >
                                Sign In
                            </NavLink>
                            <NavLink
                                to="/signup"
                                className="block w-full p-4 text-center bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all duration-200"
                                onClick={() => setMenuOpen(false)}
                            >
                                Get Started Free
                            </NavLink>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Navbar;
