import { useEffect, useState } from "react";
import TypingCode from "./TypingCode.jsx";
import { useTheme } from "../utils/ThemeContext.jsx";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import axiosClient from "../utils/axiosClient";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import {
    Trophy,
    BookOpen,
    TrendingUp,
    CheckCircle,
    Clock,
    Star,
    Code,
    Users,
    Award,
    Zap,
    Target,
    ChevronRight,
    Play,
    MessageSquare,
    Calendar,
    BarChart3,
    Lightbulb,
    Shield,
    Rocket,
    Brain,
    Globe,
    ArrowRight,
    CheckCircle2,
    Briefcase,
    Crown, // ← This was missing!
    ExternalLink,
    Github,
} from "lucide-react";

function getDifficultyBadgeColor(difficulty) {
    switch ((difficulty && difficulty.toLowerCase()) || "") {
        case "easy":
            return "badge-success";
        case "medium":
            return "badge-warning";
        case "hard":
            return "badge-error";
        default:
            return "badge-neutral";
    }
}

function Homepage() {
    const { theme } = useTheme();
    const { user } = useSelector((state) => state.auth);
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        solved: 0,
        easy: 0,
        medium: 0,
        hard: 0,
    });
    const [activeFeature, setActiveFeature] = useState(0);

    useEffect(() => {
        fetchData();
    }, [user]);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveFeature((prev) => (prev + 1) % 4);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const problemsRes = await axiosClient.get("/problem/getAllProblem");
            setProblems(problemsRes.data);
            setStats({
                total: problemsRes.data.length,
                solved: Math.floor(problemsRes.data.length * 0.3),
                easy: problemsRes.data.filter((p) => p.difficulty === "easy")
                    .length,
                medium: problemsRes.data.filter(
                    (p) => p.difficulty === "medium"
                ).length,
                hard: problemsRes.data.filter((p) => p.difficulty === "hard")
                    .length,
            });
        } catch (error) {
            console.error("Failed to fetch problems", error);
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

    const companies = [
        {
            name: "Google",
            logo: "/google.png",
            color: "hover:text-blue-500",
        },
        {
            name: "Amazon",
            logo: "/amazon.png",
            color: "hover:text-orange-500",
        },
        {
            name: "Microsoft",
            logo: "/microsoft.png",
            color: "hover:text-blue-600",
        },
        {
            name: "Meta",
            logo: "/meta.png",
            color: "hover:text-blue-500",
        },
        {
            name: "Netflix",
            logo: "/netflix.png",
            color: "hover:text-red-500",
        },
        {
            name: "Apple",
            logo: "/apple.png",
            color: "hover:text-gray-600",
        },
        {
            name: "Tesla",
            logo: "/tesla.png",
            color: "hover:text-red-500",
        },
        {
            name: "Uber",
            logo: "/uber.png",
            color: "hover:text-gray-800",
        },
    ];

    return (
        <div
            className={`min-h-screen ${
                theme === "dark" ? " text-white" : " text-gray-900"
            }`}
        >
            <div className="container mx-auto max-w-7xl px-4 py-6">
                {/* Enhanced Hero Section */}
                <div
                    className={`hero rounded-3xl mb-8 shadow-2xl overflow-hidden relative ${
                        theme === "dark"
                            ? "bg-gradient-to-r from-blue-900/80 via-purple-900/80 to-indigo-900/80 backdrop-blur-xl border border-white/10"
                            : "bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600"
                    }`}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
                    <div className="hero-content flex flex-col lg:flex-row items-center justify-between py-16 px-8 gap-12 w-full relative z-10">
                        <div className="max-w-2xl text-center lg:text-left flex-1">
                            <div className="flex flex-col gap-3 items-center justify-center lg:items-start lg:justify-start mb-6">
                                <span className="px-4 py-2 bg-yellow-400 text-black rounded-full text-sm font-bold animate-bounce flex items-center gap-2">
                                    🚀 NEW: AI-Powered Code Reviews
                                </span>
                                <a
                                    href="https://github.com/ErArbazAnsari/codelab"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-bold shadow-lg hover:bg-gray-800 transition-all duration-300 border border-white/20 hover:scale-105"
                                >
                                    <Github className="w-4 h-4 mr-2" />
                                    Open Source on GitHub
                                    <ExternalLink className="w-3 h-3 ml-2" />
                                </a>
                            </div>
                            <p className="mb-8 text-xl text-white/90 leading-relaxed">
                                Join 100,000+ developers who've transformed
                                their careers with our comprehensive coding
                                platform. Practice, learn, and excel with real
                                interview questions from top tech companies.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <NavLink
                                    to="/problems"
                                    className="btn btn-accent btn-lg shadow-xl transform hover:scale-105 transition-all duration-300 group"
                                >
                                    <Play className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                                    Start Coding Now
                                    <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </NavLink>
                                {!user && (
                                    <NavLink
                                        to="/signup"
                                        className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-blue-600 shadow-xl"
                                    >
                                        Join Free Today
                                    </NavLink>
                                )}
                            </div>
                        </div>
                        <div className="flex-1 flex justify-center lg:justify-end">
                            <div className="relative">
                                <div className="w-[32rem] h-[22rem] rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 p-4 shadow-2xl flex flex-col justify-between">
                                    <div className="h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-6 font-mono text-base text-green-400 overflow-hidden shadow-xl border border-gray-700/30 relative">
                                        <div className="flex items-center mb-4">
                                            <div className="flex space-x-2">
                                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                            </div>
                                            <span className="ml-4 text-gray-400 text-xs">
                                                codelab.py
                                            </span>
                                        </div>
                                        <div className="space-y-1 animate-pulse">
                                            {/* Typing effect for a wide code problem */}
                                            <TypingCode width="30rem" />
                                        </div>
                                        <div className="absolute top-2 right-2 text-xs text-gray-500 bg-gray-800/60 px-2 py-1 rounded shadow-lg border border-gray-700/30 flex items-center gap-1">
                                            <Github className="w-3 h-3" />
                                            <a
                                                href="https://github.com/ErArbazAnsari/codelab"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="underline hover:text-blue-400"
                                            >
                                                Open Source
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full blur-xl opacity-60 animate-pulse"></div>
                                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-xl opacity-40 animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Success Metrics Banner */}
                <div
                    className={`mb-8 py-8 px-8 rounded-2xl shadow-xl ${
                        theme === "dark"
                            ? "bg-gradient-to-r from-green-900/50 to-emerald-900/50 backdrop-blur-lg border border-green-500/20"
                            : "bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200"
                    }`}
                >
                    <div className="text-center">
                        <h3 className="text-2xl font-bold mb-6">
                            Proven Results That Speak for Themselves
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[
                                {
                                    number: "50,000+",
                                    label: "Problems Solved Daily",
                                    icon: <Code className="w-6 h-6" />,
                                },
                                {
                                    number: "95%",
                                    label: "Interview Success Rate",
                                    icon: <Trophy className="w-6 h-6" />,
                                },
                                {
                                    number: "1,200+",
                                    label: "Companies Hiring",
                                    icon: <Users className="w-6 h-6" />,
                                },
                                {
                                    number: "$150K",
                                    label: "Average Salary Increase",
                                    icon: <TrendingUp className="w-6 h-6" />,
                                },
                            ].map((metric, idx) => (
                                <div key={idx} className="text-center group">
                                    <div className="flex justify-center mb-3 text-green-600 group-hover:scale-110 transition-transform">
                                        {metric.icon}
                                    </div>
                                    <div className="text-3xl font-bold text-green-600 mb-2">
                                        {metric.number}
                                    </div>
                                    <div className="text-sm opacity-80">
                                        {metric.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Enhanced Companies Section */}
                <div
                    className={`mb-8 py-8 px-8 rounded-3xl shadow-xl ${
                        theme === "dark"
                            ? "bg-gradient-to-br from-blue-900/80 to-purple-900/80 backdrop-blur-xl border border-white/10"
                            : "bg-gradient-to-br from-blue-600 to-purple-600"
                    }`}
                >
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4 text-white">
                            Trusted by Top Companies Worldwide
                        </h2>
                        <p className="text-lg opacity-80 text-white">
                            Our users work at the most innovative companies in
                            tech
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
                        {companies.map((company, idx) => (
                            <div
                                key={company.name}
                                className={`group p-6 rounded-2xl text-center transition-all duration-300 hover:scale-110 cursor-pointer ${
                                    theme === "dark"
                                        ? "bg-slate-800/50 hover:bg-slate-700 border border-gray-700"
                                        : "bg-gray-50 hover:bg-gray-100 border border-gray-200"
                                } ${company.color}`}
                            >
                                <div className="text-4xl mb-3 group-hover:animate-bounce">
                                    <img
                                        src={company.logo}
                                        alt={company.name}
                                    />
                                </div>
                                <div className="font-semibold text-sm">
                                    {company.name}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Enhanced Testimonials */}
                <div
                    className={`mb-8 py-8 px-8 rounded-2xl shadow-xl ${
                        theme === "dark"
                            ? "bg-gradient-to-r from-green-900/50 to-emerald-900/50 backdrop-blur-lg border border-green-500/20"
                            : "bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200"
                    }`}
                >
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">
                            Success Stories
                        </h2>
                        <p className="text-lg opacity-80">
                            Real stories from developers who transformed their
                            careers
                        </p>
                    </div>
                    {/* Animated Testimonials Carousel */}
                    <div className="overflow-hidden relative w-full">
                        <div
                            className="flex gap-8 animate-testimonial-scroll"
                            style={{
                                width: "max-content",
                                animation:
                                    "testimonial-scroll 40s linear infinite",
                            }}
                        >
                            {[
                                {
                                    quote: "CodeLab Pro's AI hints were a game-changer. I went from struggling with basic algorithms to solving complex problems and landed my dream job at Google!",
                                    author: "Priya Sharma",
                                    role: "Software Engineer @ Google",
                                    avatar: "👩‍💻",
                                    rating: 5,
                                },
                                {
                                    quote: "The interview preparation track is phenomenal. I practiced 200+ problems and aced my interviews at 5 different companies.",
                                    author: "Arjun Mehta",
                                    role: "Senior Developer @ Microsoft",
                                    avatar: "👨‍💻",
                                    rating: 5,
                                },
                                {
                                    quote: "The community discussions and editorial solutions helped me understand concepts I struggled with for years. Highly recommended!",
                                    author: "Fatima Khan",
                                    role: "Full Stack Developer @ Meta",
                                    avatar: "👩‍🔬",
                                    rating: 5,
                                },
                                {
                                    quote: "I cracked my Amazon interview after using CodeLab Pro for just 3 months. The mock interviews and instant feedback were invaluable!",
                                    author: "Rohit Agarwal",
                                    role: "SDE @ Amazon",
                                    avatar: "🧑‍💻",
                                    rating: 5,
                                },
                                {
                                    quote: "The editorial solutions and video explanations made even the hardest problems easy to understand. I recommend CodeLab Pro to all my friends!",
                                    author: "Sneha Patel",
                                    role: "Backend Engineer @ Netflix",
                                    avatar: "👩‍💻",
                                    rating: 5,
                                },
                                {
                                    quote: "I never thought coding could be this fun. The gamified experience kept me motivated every day!",
                                    author: "Mohammed Ali",
                                    role: "Frontend Developer @ Apple",
                                    avatar: "🧑‍🔬",
                                    rating: 5,
                                },
                                {
                                    quote: "The leaderboard and contests pushed me to improve. Now I’m working at Tesla!",
                                    author: "Emily Zhang",
                                    role: "Software Engineer @ Tesla",
                                    avatar: "👩‍💻",
                                    rating: 5,
                                },
                                {
                                    quote: "CodeLab Pro’s community is super supportive. I got help whenever I was stuck.",
                                    author: "Aman Gupta",
                                    role: "Data Scientist @ Uber",
                                    avatar: "🧑‍💻",
                                    rating: 5,
                                },
                                // Repeat testimonials for infinite effect
                            ]
                                .concat([
                                    {
                                        quote: "CodeLab Pro's AI hints were a game-changer. I went from struggling with basic algorithms to solving complex problems and landed my dream job at Google!",
                                        author: "Priya Sharma",
                                        role: "Software Engineer @ Google",
                                        avatar: "👩‍💻",
                                        rating: 5,
                                    },
                                    {
                                        quote: "The interview preparation track is phenomenal. I practiced 200+ problems and aced my interviews at 5 different companies.",
                                        author: "Arjun Mehta",
                                        role: "Senior Developer @ Microsoft",
                                        avatar: "👨‍💻",
                                        rating: 5,
                                    },
                                    {
                                        quote: "The community discussions and editorial solutions helped me understand concepts I struggled with for years. Highly recommended!",
                                        author: "Fatima Khan",
                                        role: "Full Stack Developer @ Meta",
                                        avatar: "👩‍🔬",
                                        rating: 5,
                                    },
                                ])
                                .map((testimonial, idx) => (
                                    <div
                                        key={idx}
                                        className={`min-w-[22rem] max-w-xs p-8 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2 ${
                                            theme === "dark"
                                                ? "bg-slate-800/50 border border-gray-700"
                                                : "bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200"
                                        }`}
                                    >
                                        <div className="text-center mb-6">
                                            <div className="text-6xl mb-4">
                                                {testimonial.avatar}
                                            </div>
                                            <div className="flex justify-center space-x-1 mb-4">
                                                {[
                                                    ...Array(
                                                        testimonial.rating
                                                    ),
                                                ].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className="w-5 h-5 text-yellow-400 fill-current"
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <blockquote className="text-lg italic mb-6 leading-relaxed">
                                            "{testimonial.quote}"
                                        </blockquote>
                                        <div className="text-center">
                                            <div className="font-bold text-lg">
                                                {testimonial.author}
                                            </div>
                                            <div className="text-sm opacity-70">
                                                {testimonial.role}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                        {/* Custom animation keyframes for infinite scroll */}
                        <style>{`
                            @keyframes testimonial-scroll {
                                0% { transform: translateX(0); }
                                100% { transform: translateX(-50%); }
                            }
                            .animate-testimonial-scroll {
                                will-change: transform;
                            }
                        `}</style>
                    </div>
                </div>

                {/* Enhanced CTA Section */}
                <div
                    className={`mb-8 py-8 px-8 rounded-3xl shadow-2xl text-center relative overflow-hidden ${
                        theme === "dark"
                            ? "bg-gradient-to-br from-blue-900/80 to-purple-900/80 backdrop-blur-xl border border-white/10"
                            : "bg-gradient-to-br from-blue-600 to-purple-600"
                    }`}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
                    <div className="relative z-10 text-white">
                        <div className="text-6xl mb-6">🚀</div>
                        <h2 className="text-4xl font-bold mb-6">
                            Ready to Transform Your Career?
                        </h2>
                        <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
                            Join thousands of successful developers who've
                            landed their dream jobs. Start your journey today
                            with our comprehensive coding platform.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                            {!user ? (
                                <NavLink
                                    to="/signup"
                                    className="btn btn-accent btn-lg shadow-xl transform hover:scale-105 transition-all duration-300"
                                >
                                    <Rocket className="w-5 h-5 mr-2" />
                                    Start Free Trial
                                </NavLink>
                            ) : (
                                <NavLink
                                    to="/problems"
                                    className="btn btn-accent btn-lg shadow-xl transform hover:scale-105 transition-all duration-300"
                                >
                                    <Play className="w-5 h-5 mr-2" />
                                    Continue Coding
                                </NavLink>
                            )}
                            <NavLink
                                to="/problems"
                                className="btn btn-outline border-white text-white hover:bg-white hover:text-blue-600 btn-lg"
                            >
                                Browse Problems
                            </NavLink>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-8 text-sm opacity-80">
                            <div className="flex items-center">
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Free forever plan
                            </div>
                            <div className="flex items-center">
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                No credit card required
                            </div>
                            <div className="flex items-center">
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Open source
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Footer */}
                <footer
                    className={`py-8 border-t ${
                        theme === "dark"
                            ? "border-white/10 text-white/70"
                            : "border-gray-200 text-gray-600"
                    }`}
                >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <h3 className="text-2xl font-bold mb-4 text-blue-500">
                                CodeLab Pro
                            </h3>
                            <p className="text-sm opacity-80 mb-4">
                                The ultimate open source platform for coding
                                interview preparation and skill development.
                            </p>
                            <a
                                href="https://github.com/ErArbazAnsari/codelab"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-bold shadow-lg hover:bg-gray-800 transition-colors border border-white/20 mb-4"
                            >
                                <Github className="w-4 h-4 mr-2" />
                                Open Source on GitHub
                                <ExternalLink className="w-3 h-3 ml-2" />
                            </a>
                            <div className="flex space-x-4">
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-blue-600 transition-colors">
                                    f
                                </div>
                                <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-blue-500 transition-colors">
                                    t
                                </div>
                                <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-blue-800 transition-colors">
                                    in
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Platform</h4>
                            <div className="space-y-2 text-sm">
                                <NavLink
                                    to="/problems"
                                    className="block hover:text-blue-500 transition-colors"
                                >
                                    Problems
                                </NavLink>
                                <NavLink
                                    to="/contests"
                                    className="block hover:text-blue-500 transition-colors"
                                >
                                    Contests
                                </NavLink>
                                <NavLink
                                    to="/discuss"
                                    className="block hover:text-blue-500 transition-colors"
                                >
                                    Discuss
                                </NavLink>
                                <NavLink
                                    to="/interview"
                                    className="block hover:text-blue-500 transition-colors"
                                >
                                    Interview
                                </NavLink>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Company</h4>
                            <div className="space-y-2 text-sm">
                                <NavLink
                                    to="/about"
                                    className="block hover:text-blue-500 transition-colors"
                                >
                                    About
                                </NavLink>
                                <NavLink
                                    to="/careers"
                                    className="block hover:text-blue-500 transition-colors"
                                >
                                    Careers
                                </NavLink>
                                <NavLink
                                    to="/press"
                                    className="block hover:text-blue-500 transition-colors"
                                >
                                    Press
                                </NavLink>
                                <NavLink
                                    to="/blog"
                                    className="block hover:text-blue-500 transition-colors"
                                >
                                    Blog
                                </NavLink>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Support</h4>
                            <div className="space-y-2 text-sm">
                                <NavLink
                                    to="/help"
                                    className="block hover:text-blue-500 transition-colors"
                                >
                                    Help Center
                                </NavLink>
                                <NavLink
                                    to="/contact"
                                    className="block hover:text-blue-500 transition-colors"
                                >
                                    Contact
                                </NavLink>
                                <NavLink
                                    to="/terms"
                                    className="block hover:text-blue-500 transition-colors"
                                >
                                    Terms
                                </NavLink>
                                <NavLink
                                    to="/privacy"
                                    className="block hover:text-blue-500 transition-colors"
                                >
                                    Privacy
                                </NavLink>
                            </div>
                        </div>
                    </div>
                    <div className="text-center pt-8 border-t border-current border-opacity-20">
                        <p className="text-sm opacity-70">
                            © 2025 CodeLab Pro. All rights reserved. Made with
                            ❤️ for developers worldwide.
                        </p>
                    </div>
                </footer>
            </div>
        </div>
    );
}

export default Homepage;
