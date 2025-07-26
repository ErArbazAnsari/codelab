import { useEffect, useState } from "react";
import { useTheme } from "../utils/ThemeContext.jsx";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import axiosClient from "../utils/axiosClient";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { Trophy, BookOpen, TrendingUp, CheckCircle, Clock, Star } from "lucide-react";

function getDifficultyBadgeColor(difficulty) {
    switch ((difficulty && difficulty.toLowerCase()) || "") {
        case "easy": return "badge-success";
        case "medium": return "badge-warning";
        case "hard": return "badge-error";
        default: return "badge-neutral";
    }
}

function Homepage() {
    const { theme } = useTheme();
    const { user } = useSelector((state) => state.auth);
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, solved: 0, easy: 0, medium: 0, hard: 0 });

    useEffect(() => {
        fetchData();
    }, [user]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const problemsRes = await axiosClient.get("/problem/getAllProblem");
            setProblems(problemsRes.data);
            setStats({
                total: problemsRes.data.length,
                solved: Math.floor(problemsRes.data.length * 0.3),
                easy: problemsRes.data.filter((p) => p.difficulty === "easy").length,
                medium: problemsRes.data.filter((p) => p.difficulty === "medium").length,
                hard: problemsRes.data.filter((p) => p.difficulty === "hard").length,
            });
        } catch (error) {
            window.alert("Failed to fetch problems");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="xl" />
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-pureblack text-lightgray' : 'bg-base-100'} transition-colors duration-300`}>
            <div className="container mx-auto max-w-6xl px-4 py-10 md:py-12 lg:py-16">
                {/* Hero Section */}
                <div className="hero bg-gradient-to-r from-primary to-secondary rounded-3xl text-primary-content mb-10 shadow-xl">
                    <div className="hero-content flex flex-col md:flex-row items-center justify-between py-10 px-6 gap-8">
                        <div className="max-w-lg text-left">
                            <h1 className="mb-5 text-5xl font-bold leading-tight">
                                Level up your coding skills and quickly land a job
                            </h1>
                            <p className="mb-5 text-lg">
                                This is the best place to expand your knowledge and get prepared for your next interview.
                            </p>
                            <NavLink to="/problems" className="btn btn-accent btn-lg shadow-md">
                                <BookOpen className="w-5 h-5 mr-2" />
                                Explore Problems
                            </NavLink>
                        </div>
                        <div className="hidden md:block ml-12">
                            <img src="/public/vite.svg" alt="Coding" className="w-64 h-64 object-contain drop-shadow-lg" />
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    <div className="stat bg-base-100 rounded-2xl shadow-lg border border-base-300">
                        <div className="stat-figure text-primary">
                            <Trophy className="w-8 h-8" />
                        </div>
                        <div className="stat-title">Problems Solved</div>
                        <div className="stat-value text-primary">{stats.solved}</div>
                        <div className="stat-desc">out of {stats.total} problems</div>
                    </div>
                    <div className="stat bg-base-100 rounded-2xl shadow-lg border border-base-300">
                        <div className="stat-figure text-success">
                            <CheckCircle className="w-8 h-8" />
                        </div>
                        <div className="stat-title">Easy</div>
                        <div className="stat-value text-success">{stats.easy}</div>
                        <div className="stat-desc">completed</div>
                    </div>
                    <div className="stat bg-base-100 rounded-2xl shadow-lg border border-base-300">
                        <div className="stat-figure text-warning">
                            <Clock className="w-8 h-8" />
                        </div>
                        <div className="stat-title">Medium</div>
                        <div className="stat-value text-warning">{stats.medium}</div>
                        <div className="stat-desc">completed</div>
                    </div>
                    <div className="stat bg-base-100 rounded-2xl shadow-lg border border-base-300">
                        <div className="stat-figure text-error">
                            <TrendingUp className="w-8 h-8" />
                        </div>
                        <div className="stat-title">Hard</div>
                        <div className="stat-value text-error">{stats.hard}</div>
                        <div className="stat-desc">completed</div>
                    </div>
                </div>

                {/* Featured Problems */}
                <div className={`card ${theme === 'dark' ? 'bg-darkgray text-lightgray border-lightgray' : 'bg-base-100'} shadow-lg mb-10 border border-base-300`}>
                    <div className="card-body">
                        <h2 className="card-title text-2xl mb-6">
                            <Star className="w-6 h-6" />
                            Featured Problems
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="table table-zebra">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Title</th>
                                        <th>Difficulty</th>
                                        <th>Tags</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {problems.slice(0, 10).map((problem, idx) => (
                                        <tr key={problem._id}>
                                            <td>{idx + 1}</td>
                                            <td>{problem.title}</td>
                                            <td>
                                                <span className={`badge ${getDifficultyBadgeColor(problem.difficulty)}`}>{problem.difficulty}</span>
                                            </td>
                                            <td>{problem.tags}</td>
                                            <td>
                                                <NavLink to={`/problem/${problem._id}`} className="btn btn-sm btn-primary">Solve</NavLink>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {problems.length === 0 && (
                            <div className="text-center py-12 text-gray-500">No problems found.</div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <footer className="site-footer mt-12 py-8 border-t border-base-300 text-center text-base-content/70">
                    <div className="container mx-auto">
                        <span>Copyright © 2025 CodeLab</span>
                        <span className="mx-2">|</span>
                        <NavLink to="/support" className="hover:underline">Help Center</NavLink>
                        <span className="mx-2">|</span>
                        <NavLink to="/jobs" className="hover:underline">Jobs</NavLink>
                        <span className="mx-2">|</span>
                        <NavLink to="/terms" className="hover:underline">Terms</NavLink>
                        <span className="mx-2">|</span>
                        <NavLink to="/privacy" className="hover:underline">Privacy Policy</NavLink>
                    </div>
                </footer>
            </div>
        </div>
    );
}

export default Homepage;
