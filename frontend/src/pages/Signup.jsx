import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, NavLink } from "react-router-dom";
import { registerUser } from "../authSlice";
import { useTheme } from "../utils/ThemeContext.jsx";
import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    User,
    ArrowRight,
    AlertCircle,
    CheckCircle,
    Loader2,
    Shield,
    UserPlus,
} from "lucide-react";

const signupSchema = z.object({
    firstName: z.string().min(3, "First name must be at least 3 characters"),
    emailId: z.string().email("Please enter a valid email address"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            "Password must contain at least one uppercase letter, one lowercase letter, and one number"
        ),
});

function Signup() {
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
        resolver: zodResolver(signupSchema),
        mode: "onBlur",
    });

    const firstNameValue = watch("firstName");
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
            await dispatch(registerUser(data));
        } finally {
            setIsLoading(false);
        }
    };

    const getPasswordStrength = (password) => {
        if (!password) return { strength: 0, label: "", color: "" };

        let strength = 0;
        if (password.length >= 8) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/\d/.test(password)) strength += 1;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;

        const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
        const strengthColors = [
            "bg-red-500",
            "bg-orange-500",
            "bg-yellow-500",
            "bg-blue-500",
            "bg-green-500",
        ];

        return {
            strength,
            label: strengthLabels[strength - 1] || "Very Weak",
            color: strengthColors[strength - 1] || "bg-red-500",
        };
    };

    const passwordStrength = getPasswordStrength(passwordValue);

    return (
        <div
            className={`mt-16 flex items-center justify-center p-4 ${
                theme === "dark" ? "bg-pure-black text-white" : ""
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
                            Join CodeLab Pro
                        </h1>
                        <p
                            className={`mt-2 text-sm ${
                                theme === "dark"
                                    ? "text-gray-400"
                                    : "text-gray-600"
                            }`}
                        >
                            Start your coding journey with us today
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
                            {/* First Name Field */}
                            <div className="space-y-2">
                                <label
                                    className={`text-sm font-medium ${
                                        theme === "dark"
                                            ? "text-gray-300"
                                            : "text-gray-700"
                                    }`}
                                >
                                    First Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User
                                            className={`w-5 h-5 ${
                                                errors.firstName
                                                    ? "text-red-500"
                                                    : firstNameValue
                                                    ? "text-blue-500"
                                                    : theme === "dark"
                                                    ? "text-gray-500"
                                                    : "text-gray-400"
                                            }`}
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Enter your first name"
                                        className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${
                                            errors.firstName
                                                ? theme === "dark"
                                                    ? "border-red-600 bg-red-900/10 text-red-300"
                                                    : "border-red-300 bg-red-50 text-red-700"
                                                : firstNameValue
                                                ? theme === "dark"
                                                    ? "border-blue-500 bg-blue-900/10 text-white"
                                                    : "border-blue-300 bg-blue-50 text-gray-900"
                                                : theme === "dark"
                                                ? "border-gray-600 bg-gray-800/50 text-white hover:border-gray-500"
                                                : "border-gray-300 bg-white text-gray-900 hover:border-gray-400"
                                        } focus:outline-none focus:ring-4 ${
                                            errors.firstName
                                                ? "focus:ring-red-500/20 focus:border-red-500"
                                                : "focus:ring-blue-500/20 focus:border-blue-500"
                                        }`}
                                        {...register("firstName")}
                                    />
                                    {firstNameValue && !errors.firstName && (
                                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                        </div>
                                    )}
                                </div>
                                {errors.firstName && (
                                    <p className="text-red-500 text-sm flex items-center">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {errors.firstName.message}
                                    </p>
                                )}
                            </div>

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
                                        className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${
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
                                        placeholder="Create a strong password"
                                        className={`w-full pl-12 pr-12 py-3 rounded-xl border-2 ${
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

                                {/* Password Strength Indicator */}
                                {passwordValue && (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-500">
                                                Password strength
                                            </span>
                                            <span
                                                className={`text-xs font-medium ${
                                                    passwordStrength.strength >=
                                                    4
                                                        ? "text-green-500"
                                                        : passwordStrength.strength >=
                                                          3
                                                        ? "text-blue-500"
                                                        : passwordStrength.strength >=
                                                          2
                                                        ? "text-yellow-500"
                                                        : "text-red-500"
                                                }`}
                                            >
                                                {passwordStrength.label}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                                                style={{
                                                    width: `${
                                                        (passwordStrength.strength /
                                                            5) *
                                                        100
                                                    }%`,
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                )}

                                {errors.password && (
                                    <p className="text-red-500 text-sm flex items-center">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>

                            {/* Password Requirements */}
                            <div
                                className={`text-xs space-y-1 ${
                                    theme === "dark"
                                        ? "text-gray-400"
                                        : "text-gray-600"
                                }`}
                            >
                                <p className="font-medium">
                                    Password must contain:
                                </p>
                                <ul className="space-y-1 ml-2">
                                    <li
                                        className={`flex items-center ${
                                            passwordValue &&
                                            passwordValue.length >= 8
                                                ? "text-green-500"
                                                : ""
                                        }`}
                                    >
                                        <span className="w-1 h-1 bg-current rounded-full mr-2"></span>
                                        At least 8 characters
                                    </li>
                                    <li
                                        className={`flex items-center ${
                                            passwordValue &&
                                            /[A-Z]/.test(passwordValue)
                                                ? "text-green-500"
                                                : ""
                                        }`}
                                    >
                                        <span className="w-1 h-1 bg-current rounded-full mr-2"></span>
                                        One uppercase letter
                                    </li>
                                    <li
                                        className={`flex items-center ${
                                            passwordValue &&
                                            /[a-z]/.test(passwordValue)
                                                ? "text-green-500"
                                                : ""
                                        }`}
                                    >
                                        <span className="w-1 h-1 bg-current rounded-full mr-2"></span>
                                        One lowercase letter
                                    </li>
                                    <li
                                        className={`flex items-center ${
                                            passwordValue &&
                                            /\d/.test(passwordValue)
                                                ? "text-green-500"
                                                : ""
                                        }`}
                                    >
                                        <span className="w-1 h-1 bg-current rounded-full mr-2"></span>
                                        One number
                                    </li>
                                </ul>
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
                                        Creating account...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="w-5 h-5 mr-2" />
                                        Create Account
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Sign In Link */}
                        <div className="mt-8 text-center">
                            <p
                                className={`text-sm ${
                                    theme === "dark"
                                        ? "text-gray-400"
                                        : "text-gray-600"
                                }`}
                            >
                                Already have an account?{" "}
                                <NavLink
                                    to="/login"
                                    className={`font-semibold transition-colors ${
                                        theme === "dark"
                                            ? "text-blue-400 hover:text-blue-300"
                                            : "text-blue-600 hover:text-blue-700"
                                    }`}
                                >
                                    Sign in here
                                </NavLink>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;
