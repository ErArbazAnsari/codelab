import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, NavLink } from "react-router-dom";
import { loginUser } from "../authSlice";
import { useEffect, useState } from "react";
import { useTheme } from "../utils/ThemeContext.jsx";
import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    ArrowRight,
    AlertCircle,
    CheckCircle,
    Github,
    Chrome,
    Loader2,
    Shield,
} from "lucide-react";

const loginSchema = z.object({
    emailId: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { theme } = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, loading, error } = useSelector(
        (state) => state.auth
    );

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
    } = useForm({
        resolver: zodResolver(loginSchema),
        mode: "onBlur",
    });

    const emailValue = watch("emailId");
    const passwordValue = watch("password");

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        setIsLoading(loading);
    }, [loading]);

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            await dispatch(loginUser(data));
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div
            className={`mt-16 flex items-center justify-center p-4 ${
                theme === "dark"
                    ? "bg-pure-black text-white"
                    : ""
            }`}
        >
            {/* Background Pattern */}
            <div className="absolute inset-0 overflow-hidden">
                <div
                    className={`absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 ${
                        theme === "dark" ? "bg-blue-500" : "bg-blue-300"
                    } blur-3xl`}
                ></div>
                <div
                    className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-20 ${
                        theme === "dark" ? "bg-purple-500" : "bg-purple-300"
                    } blur-3xl`}
                ></div>
            </div>

            <div className="relative w-full max-w-md">
                {/* Main Card */}
                <div
                    className={`backdrop-blur-xl rounded-3xl shadow-2xl border overflow-hidden ${
                        theme === "dark"
                            ? "bg-gray-900/80 border-gray-700"
                            : "bg-white/80 border-white/20"
                    }`}
                >
                    {/* Header */}
                    <div
                        className={`px-8 py-6 text-center border-b ${
                            theme === "dark"
                                ? "border-gray-700"
                                : "border-gray-100"
                        }`}
                    >
                        <div className="flex justify-center items-center mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
                                CL
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Welcome Back
                        </h1>
                        <p
                            className={`mt-2 text-sm ${
                                theme === "dark"
                                    ? "text-gray-400"
                                    : "text-gray-600"
                            }`}
                        >
                            Sign in to continue your coding journey
                        </p>
                    </div>

                    {/* Form */}
                    <div className="p-8">
                        {/* Error Alert */}
                        {error && (
                            <div
                                className={`flex items-center p-4 mb-6 rounded-lg border ${
                                    theme === "dark"
                                        ? "bg-red-900/20 border-red-800 text-red-300"
                                        : "bg-red-50 border-red-200 text-red-700"
                                }`}
                            >
                                <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                                <span className="text-sm">{error}</span>
                            </div>
                        )}

                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            {/* Email Field */}
                            <div className="space-y-2">
                                <label
                                    className={`text-sm font-medium ${
                                        theme === "dark"
                                            ? "text-gray-300"
                                            : "text-gray-700"
                                    }`}
                                >
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail
                                            className={`w-5 h-5 ${
                                                errors.emailId
                                                    ? "text-red-500"
                                                    : emailValue
                                                    ? "text-blue-500"
                                                    : theme === "dark"
                                                    ? "text-gray-500"
                                                    : "text-gray-400"
                                            }`}
                                        />
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className={`w-full pl-12 pr-4 py-3 rounded-xl border-2  ${
                                            errors.emailId
                                                ? theme === "dark"
                                                    ? "border-red-600 bg-red-900/10 text-red-300"
                                                    : "border-red-300 bg-red-50 text-red-700"
                                                : emailValue
                                                ? theme === "dark"
                                                    ? "border-blue-500 bg-blue-900/10 text-white"
                                                    : "border-blue-300 bg-blue-50 text-gray-900"
                                                : theme === "dark"
                                                ? "border-gray-600 bg-gray-800/50 text-white hover:border-gray-500"
                                                : "border-gray-300 bg-white text-gray-900 hover:border-gray-400"
                                        } focus:outline-none focus:ring-4 ${
                                            errors.emailId
                                                ? "focus:ring-red-500/20 focus:border-red-500"
                                                : "focus:ring-blue-500/20 focus:border-blue-500"
                                        }`}
                                        {...register("emailId")}
                                    />
                                    {emailValue && !errors.emailId && (
                                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                        </div>
                                    )}
                                </div>
                                {errors.emailId && (
                                    <p className="text-red-500 text-sm flex items-center">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {errors.emailId.message}
                                    </p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <label
                                    className={`text-sm font-medium ${
                                        theme === "dark"
                                            ? "text-gray-300"
                                            : "text-gray-700"
                                    }`}
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock
                                            className={`w-5 h-5 ${
                                                errors.password
                                                    ? "text-red-500"
                                                    : passwordValue
                                                    ? "text-blue-500"
                                                    : theme === "dark"
                                                    ? "text-gray-500"
                                                    : "text-gray-400"
                                            }`}
                                        />
                                    </div>
                                    <input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        placeholder="Enter your password"
                                        className={`w-full pl-12 pr-12 py-3 rounded-xl border-2  ${
                                            errors.password
                                                ? theme === "dark"
                                                    ? "border-red-600 bg-red-900/10 text-red-300"
                                                    : "border-red-300 bg-red-50 text-red-700"
                                                : passwordValue
                                                ? theme === "dark"
                                                    ? "border-blue-500 bg-blue-900/10 text-white"
                                                    : "border-blue-300 bg-blue-50 text-gray-900"
                                                : theme === "dark"
                                                ? "border-gray-600 bg-gray-800/50 text-white hover:border-gray-500"
                                                : "border-gray-300 bg-white text-gray-900 hover:border-gray-400"
                                        } focus:outline-none focus:ring-4 ${
                                            errors.password
                                                ? "focus:ring-red-500/20 focus:border-red-500"
                                                : "focus:ring-blue-500/20 focus:border-blue-500"
                                        }`}
                                        {...register("password")}
                                    />
                                    <button
                                        type="button"
                                        className={`absolute inset-y-0 right-0 pr-4 flex items-center ${
                                            theme === "dark"
                                                ? "text-gray-400 hover:text-gray-300"
                                                : "text-gray-500 hover:text-gray-700"
                                        } transition-colors`}
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-red-500 text-sm flex items-center">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>

                            {/* Forgot Password */}
                            <div className="flex justify-end">
                                <NavLink
                                    to="/forgot-password"
                                    className={`text-sm transition-colors ${
                                        theme === "dark"
                                            ? "text-blue-400 hover:text-blue-300"
                                            : "text-blue-600 hover:text-blue-700"
                                    }`}
                                >
                                    Forgot your password?
                                </NavLink>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading || isSubmitting}
                                className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center ${
                                    isLoading || isSubmitting
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                }`}
                            >
                                {isLoading || isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </>
                                )}
                            </button>
                        </form>

                    
                        {/* Sign Up Link */}
                        <div className="mt-8 text-center">
                            <p
                                className={`text-sm ${
                                    theme === "dark"
                                        ? "text-gray-400"
                                        : "text-gray-600"
                                }`}
                            >
                                New to CodeLab Pro?{" "}
                                <NavLink
                                    to="/signup"
                                    className={`font-semibold transition-colors ${
                                        theme === "dark"
                                            ? "text-blue-400 hover:text-blue-300"
                                            : "text-blue-600 hover:text-blue-700"
                                    }`}
                                >
                                    Create an account
                                </NavLink>
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
