import axios from "axios";

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
    withCredentials: true,
    timeout: 30000, // 30 seconds timeout
    headers: {
        "Content-Type": "application/json",
    },
});

axiosClient.interceptors.request.use(
    (config) => {
        // No need to manually attach token, cookies will be sent automatically
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Request interceptor
axiosClient.interceptors.request.use(
    (config) => {
        // Add loading state or auth token if needed
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Only redirect to /login for protected API requests
        if (error.response?.status === 401) {
            const currentPath = window.location.pathname;
            const url = error.config.url || "";
            // List of public API endpoints (add more if needed)
            const isPublicApi = url.includes("/user/check") || url.includes("/contests") || url.includes("/leaderboard") || url.includes("/discuss") || url.includes("/homepage");
            if (!isPublicApi && currentPath !== "/login" && currentPath !== "/signup") {
                window.location.href = "/login";
            }
        }

        if (error.response?.status === 429) {
            // Rate limit exceeded
            console.warn("Rate limit exceeded");
        }

        if (error.code === "ECONNABORTED") {
            // Timeout error
            error.message = "Request timeout. Please try again.";
        }

        return Promise.reject(error);
    }
);

export default axiosClient;
