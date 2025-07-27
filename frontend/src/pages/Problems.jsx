import React, { useEffect, useState } from "react";
import { useTheme } from "../utils/ThemeContext.jsx";
import axiosClient from "../utils/axiosClient";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { Trophy, CheckCircle, Clock, TrendingUp, Search, Filter, Users } from "lucide-react";


const Problems = () => {
    function getDifficultyBadgeColor(difficulty) {
        switch ((difficulty && difficulty.toLowerCase()) || "") {
            case "easy": return "badge-success";
            case "medium": return "badge-warning";
            case "hard": return "badge-error";
            default: return "badge-neutral";
        }
    }
    const { theme } = useTheme();
    const { user } = useSelector((state) => state.auth);
    const [problems, setProblems] = useState([]);
    const [solvedProblems, setSolvedProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({
        difficulty: "all",
        tag: "all",
        status: "all",
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [problemsRes, solvedRes] = await Promise.all([
                    axiosClient.get("/problem/getAllProblem"),
                    user
                        ? axiosClient.get("/problem/problemSolvedByUser")
                        : Promise.resolve({ data: [] }),
                ]);
                setProblems(problemsRes.data);
                setSolvedProblems(solvedRes.data);
            } catch (error) {
                window.alert("Failed to fetch data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);


    const stats = {
        total: problems.length,
        solved: solvedProblems.length,
        easy: solvedProblems.filter((p) => p.difficulty === "easy").length,
        medium: solvedProblems.filter((p) => p.difficulty === "medium").length,
        hard: solvedProblems.filter((p) => p.difficulty === "hard").length,
    };

    const filteredProblems = problems.filter((problem) => {
        const matchesSearch = problem.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesDifficulty =
            filters.difficulty === "all" ||
            problem.difficulty === filters.difficulty;
        const matchesTag =
            filters.tag === "all" || problem.tags === filters.tag;
        const isSolved = solvedProblems.some((sp) => sp._id === problem._id);
        const matchesStatus =
            filters.status === "all" ||
            (filters.status === "solved" && isSolved) ||
            (filters.status === "unsolved" && !isSolved);
        return (
            matchesSearch && matchesDifficulty && matchesTag && matchesStatus
        );
    });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-pureblack text-lightgray' : ''} transition-colors duration-300`}>
            <div className="container mx-auto max-w-6xl px-4 py-10 md:py-12 lg:py-16">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    <div className="stat bg-base-100 rounded-2xl shadow-lg">
                        <div className="stat-figure text-primary">
                            <Trophy className="w-8 h-8" />
                        </div>
                        <div className="stat-title">Problems Solved</div>
                        <div className="stat-value text-primary">{stats.solved}</div>
                        <div className="stat-desc">out of {stats.total} problems</div>
                    </div>
                    <div className="stat bg-base-100 rounded-2xl shadow-lg">
                        <div className="stat-figure text-success">
                            <CheckCircle className="w-8 h-8" />
                        </div>
                        <div className="stat-title">Easy</div>
                        <div className="stat-value text-success">{stats.easy}</div>
                        <div className="stat-desc">completed</div>
                    </div>
                    <div className="stat bg-base-100 rounded-2xl shadow-lg">
                        <div className="stat-figure text-warning">
                            <Clock className="w-8 h-8" />
                        </div>
                        <div className="stat-title">Medium</div>
                        <div className="stat-value text-warning">{stats.medium}</div>
                        <div className="stat-desc">completed</div>
                    </div>
                    <div className="stat bg-base-100 rounded-2xl shadow-lg">
                        <div className="stat-figure text-error">
                            <TrendingUp className="w-8 h-8" />
                        </div>
                        <div className="stat-title">Hard</div>
                        <div className="stat-value text-error">{stats.hard}</div>
                        <div className="stat-desc">completed</div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className={`card ${theme === 'dark' ? 'bg-darkgray text-lightgray border-lightgray' : 'bg-base-100'} shadow-lg mb-10 border border-base-300`}>
                    <div className="card-body">
                        <div className="flex flex-col lg:flex-row gap-4">
                            {/* Search */}
                            <div className="form-control flex-1">
                                <div className={`flex items-center rounded-xl overflow-hidden border ${theme === 'dark' ? 'bg-[#23232a] border-[#3b3b4d]' : 'bg-base-200 border-base-300'}`}>
                                    <span className={`px-3 flex items-center ${theme === 'dark' ? 'bg-[#23232a]' : 'bg-base-200'}`}>
                                        <Search className={`w-5 h-5 ${theme === 'dark' ? 'text-primary' : 'text-base-content/70'}`} />
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="Search problems..."
                                        className={`input input-bordered flex-1 border-none focus:ring-0 focus:outline-none bg-transparent text-lg px-2 ${theme === 'dark' ? 'text-lightgray' : 'text-base-content'}`}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Filters */}
                            <div className="flex gap-2">
                                <select
                                    className="select select-bordered"
                                    value={filters.status}
                                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                >
                                    <option value="all">All Status</option>
                                    <option value="solved">Solved</option>
                                    <option value="unsolved">Unsolved</option>
                                </select>

                                <select
                                    className="select select-bordered"
                                    value={filters.difficulty}
                                    onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
                                >
                                    <option value="all">All Difficulties</option>
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                </select>

                                <select
                                    className="select select-bordered"
                                    value={filters.tag}
                                    onChange={(e) => setFilters({ ...filters, tag: e.target.value })}
                                >
                                    <option value="all">All Topics</option>
                                    <option value="array">Array</option>
                                    <option value="linkedList">Linked List</option>
                                    <option value="graph">Graph</option>
                                    <option value="dp">Dynamic Programming</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Problems List */}
                <div className={`card ${theme === 'dark' ? 'bg-darkgray text-lightgray border-lightgray' : 'bg-base-100'} shadow-lg border border-base-300`}>
                    <div className="card-body">
                        <h2 className="card-title text-2xl mb-6">
                            <Filter className="w-6 h-6" /> Problems ({filteredProblems.length})
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="table table-zebra">
                                <thead>
                                    <tr>
                                        <th>Status</th>
                                        <th>Title</th>
                                        <th>Difficulty</th>
                                        <th>Topic</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProblems.map((problem, index) => {
                                        const isSolved = solvedProblems.some((sp) => sp._id === problem._id);
                                        return (
                                            <tr key={problem._id} className="hover">
                                                <td>
                                                    {isSolved ? (
                                                        <CheckCircle className="w-5 h-5 text-success" />
                                                    ) : (
                                                        <div className="w-5 h-5 rounded-full border-2 border-base-300"></div>
                                                    )}
                                                </td>
                                                <td>
                                                    <NavLink
                                                        to={`/problem/${problem._id}`}
                                                        className="font-medium hover:text-primary transition-colors"
                                                    >
                                                        {index + 1}. {problem.title}
                                                    </NavLink>
                                                </td>
                                                <td>
                                                    <div className={`badge ${getDifficultyBadgeColor(problem.difficulty)}`}>
                                                        {problem.difficulty}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="badge badge-outline">{problem.tags}</div>
                                                </td>
                                                <td>
                                                    <div className="flex gap-2">
                                                        <NavLink
                                                            to={`/problem/${problem._id}`}
                                                            className="btn btn-sm btn-primary"
                                                        >
                                                            Solve
                                                        </NavLink>
                                                        <NavLink
                                                            to={`/discussions/${problem._id}`}
                                                            className="btn btn-sm btn-ghost"
                                                        >
                                                            <Users className="w-4 h-4" />
                                                        </NavLink>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        {filteredProblems.length === 0 && (
                            <div className="text-center py-12">
                                <Search className="w-16 h-16 text-base-content/30 mx-auto mb-4" />
                                <h3 className="text-lg font-medium mb-2">No problems found</h3>
                                <p className="text-base-content/70">Try adjusting your search or filters</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Problems;
