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
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-br from-[#18181c] via-[#23232a] to-[#18181c] text-lightgray' : 'bg-base-100 text-base-content'}`}>
            <div className="container mx-auto max-w-6xl px-4 py-10 md:py-12 lg:py-16">
                {/* Hero Section */}
                <div className={`hero rounded-3xl mb-10 shadow-xl flex items-center justify-center ${theme === 'dark' ? 'bg-[rgba(30,30,40,0.90)] backdrop-blur-lg border border-[#3b3b4d]' : 'bg-gradient-to-r from-primary to-secondary text-primary-content'}`}> 
                    <div className="hero-content flex flex-col md:flex-row items-center justify-between py-12 px-8 gap-8 w-full">
                        <div className="max-w-lg text-left flex-1">
                            <h1 className="mb-5 text-5xl font-bold leading-tight drop-shadow-lg">
                                Level up your coding skills and quickly land a job
                            </h1>
                            <p className="mb-5 text-lg opacity-90">
                                This is the best place to expand your knowledge and get prepared for your next interview.
                            </p>
                            <NavLink to="/problems" className="btn btn-accent btn-lg shadow-md flex items-center gap-2">
                                <BookOpen className="w-5 h-5 mr-2" />
                                Explore Problems
                            </NavLink>
                        </div>
                        <div className="hidden md:block ml-12 flex-1 flex justify-center">
                            <img src="/vite.svg" alt="Coding" className="w-64 h-64 object-contain drop-shadow-2xl rounded-2xl border-2 border-primary/40 bg-[#23232a]" />
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    {[{
                        icon: <Trophy className="w-8 h-8" />,
                        title: 'Problems Solved',
                        value: stats.solved,
                        desc: `out of ${stats.total} problems`,
                        color: 'text-primary',
                    }, {
                        icon: <CheckCircle className="w-8 h-8" />,
                        title: 'Easy',
                        value: stats.easy,
                        desc: 'completed',
                        color: 'text-success',
                    }, {
                        icon: <Clock className="w-8 h-8" />,
                        title: 'Medium',
                        value: stats.medium,
                        desc: 'completed',
                        color: 'text-warning',
                    }, {
                        icon: <TrendingUp className="w-8 h-8" />,
                        title: 'Hard',
                        value: stats.hard,
                        desc: 'completed',
                        color: 'text-error',
                    }].map((card) => (
                        <div
                            key={card.title}
                            className={`stat rounded-2xl shadow-xl border flex flex-col items-center justify-center px-6 py-8 ${theme === 'dark' ? 'bg-[rgba(40,40,50,0.92)] border-[#3b3b4d] text-lightgray' : 'bg-base-100 border-base-300'}`}
                            style={theme === 'dark' ? { backdropFilter: 'blur(8px)' } : {}}
                        >
                            <div className={`stat-figure mb-2 ${card.color}`}>{card.icon}</div>
                            <div className="stat-title text-lg font-semibold mb-1 opacity-80">{card.title}</div>
                            <div className={`stat-value text-2xl font-bold mb-1 ${card.color}`}>{card.value}</div>
                            <div className="stat-desc text-sm opacity-70">{card.desc}</div>
                        </div>
                    ))}
                </div>

                {/* Featured Problems */}
                <div className={`card shadow-xl mb-10 border ${theme === 'dark' ? 'bg-[#23232a] text-lightgray border-[#3b3b4d]' : 'bg-base-100 border-base-300'}`} style={theme === 'dark' ? { backdropFilter: 'blur(6px)' } : {}}>
                    <div className="card-body">
                        <h2 className="card-title text-2xl mb-6 flex items-center gap-2">
                            <Star className="w-6 h-6" />
                            Featured Problems
                        </h2>
                        <div className="overflow-x-auto">
                            <table className={`table table-zebra ${theme === 'dark' ? 'text-lightgray' : ''}`}> 
                                <thead>
                                    <tr className={theme === 'dark' ? 'bg-[#23232a] text-lightgray' : ''}>
                                        <th>#</th>
                                        <th>Title</th>
                                        <th>Difficulty</th>
                                        <th>Tags</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {problems.slice(0, 10).map((problem, idx) => (
                                        <tr key={problem._id} className={theme === 'dark' ? 'hover:bg-[#23232a]/80' : ''}>
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
                <footer className={`site-footer mt-12 py-8 border-t text-center ${theme === 'dark' ? 'border-[#3b3b4d] text-lightgray/70' : 'border-base-300 text-base-content/70'}`} style={theme === 'dark' ? { backdropFilter: 'blur(2px)' } : {}}>
                    <div className="container mx-auto flex flex-wrap justify-center items-center gap-2 text-sm">
                        <span>© 2025 CodeLab</span>
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
