import { Routes, Route, Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useTheme } from "./utils/ThemeContext.jsx";
import { ThemeProvider } from "./utils/ThemeContext.jsx";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Homepage from "./pages/Homepage";
import Logout from "./pages/Logout";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./authSlice";
import Navbar from "./components/Navbar";
import AdminPanel from "./components/AdminPanel";
import AdminDelete from "./components/AdminDelete";
import AdminVideo from "./components/AdminVideo";
import AdminUpload from "./components/AdminUpload";
import Leaderboard from "./components/Leaderboard";
import UserProfile from "./components/UserProfile";
import DiscussionForum from "./components/DiscussionForum";
import Contests from "./pages/Contests";
import Discuss from "./pages/Discuss";
import Settings from "./pages/Settings";
import Problems from "./pages/Problems";
import ProblemPage from "./pages/ProblemPage";
import Admin from "./pages/Admin";

function App() {
    const dispatch = useDispatch();
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    // List of public routes (including dynamic bases)
    const publicRoutes = [
        "/",
        "/login",
        "/signup",
        "/contests",
        "/discuss",
        "/settings",
        "/problems",
        "/leaderboard",
        "/problem/",
        "/discussions/",
    ];
    const location = useLocation();
    const currentPath = location.pathname;
    const isPublicRoute = publicRoutes.some((route) =>
        route.endsWith("/")
            ? currentPath.startsWith(route)
            : currentPath === route
    );

    useEffect(() => {
        if (!isPublicRoute) {
            dispatch(checkAuth());
        }
    }, [dispatch, isPublicRoute]);

    return (
        <ThemeProvider>
            <ThemeConsumerApp isAuthenticated={isAuthenticated} user={user} />
        </ThemeProvider>
    );


}

function ThemeConsumerApp({ isAuthenticated, user }) {
    const { theme } = useTheme();
    return (
        <div className={`min-h-screen w-full ${theme === "dark" ? "bg-gradient-to-br from-[#18181c] via-[#23232a] to-[#18181c] text-white" : "bg-white text-gray-900"}`}>
            <Navbar />
            <main className="container mx-auto px-2">
                <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Homepage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/contests" element={<Contests />} />
                    <Route path="/discuss" element={<Discuss />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/problems" element={<Problems />} />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                    <Route path="/problem/:problemId" element={<ProblemPage />} />
                    <Route path="/discussions/:problemId" element={<DiscussionForum />} />
                    <Route path="/logout" element={<Logout />} />
                    {/* Protected routes */}
                    <Route path="/admin" element={isAuthenticated && user?.role === "admin" ? <Admin /> : <Navigate to="/login" />} />
                    <Route path="/admin/create" element={isAuthenticated && user?.role === "admin" ? <AdminPanel /> : <Navigate to="/login" />} />
                    <Route path="/admin/delete" element={isAuthenticated && user?.role === "admin" ? <AdminDelete /> : <Navigate to="/login" />} />
                    <Route path="/admin/video" element={isAuthenticated && user?.role === "admin" ? <AdminVideo /> : <Navigate to="/login" />} />
                    <Route path="/admin/upload/:problemId" element={isAuthenticated && user?.role === "admin" ? <AdminUpload /> : <Navigate to="/login" />} />
                    <Route path="/profile" element={isAuthenticated ? <UserProfile /> : <Navigate to="/login" />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;
