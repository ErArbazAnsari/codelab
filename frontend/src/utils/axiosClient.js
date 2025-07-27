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
        // Handle common errors
        if (error.response?.status === 401) {
            const currentPath = window.location.pathname;
            if (currentPath !== "/login" && currentPath !== "/signup") {
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
