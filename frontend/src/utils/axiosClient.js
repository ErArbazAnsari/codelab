import axios from "axios";

// Flag to prevent multiple simultaneous refresh token requests
let isRefreshingToken = false;

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
    withCredentials: true,
    timeout: 60000, // Increased timeout to 60 seconds for code execution
    headers: {
        "Content-Type": "application/json",
    },
    // Ensure cookies are sent with every request
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
    // Add credentials explicitly for cross-origin requests
    credentials: 'include'
});

axiosClient.interceptors.request.use(
    (config) => {
        // Don't send credentials for refresh token requests to avoid loops
        if (config.url.includes('/user/refresh-token')) {
            config.withCredentials = true;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Remove duplicate request interceptor as we already have one above

// Response interceptor
axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Handle retries for network errors and 5xx responses
        if ((error.message === 'Network Error' || (error.response && error.response.status >= 500)) 
            && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                // Wait 1 second before retrying
                await new Promise(resolve => setTimeout(resolve, 1000));
                return await axiosClient(originalRequest);
            } catch (retryError) {
                console.error('Retry failed:', retryError);
            }
        }

        // Handle authentication errors
        if (error.response?.status === 401) {
            const currentPath = window.location.pathname;
            const url = error.config.url || "";
            
            // List of public API endpoints
            const isPublicApi = url.includes("/user/check") || 
                              url.includes("/contests") || 
                              url.includes("/leaderboard") || 
                              url.includes("/discuss") || 
                              url.includes("/homepage");

            if (!isPublicApi && currentPath !== "/login" && currentPath !== "/signup") {
                // Check if this is already a refresh token request to prevent loops
                if (url.includes("/user/refresh-token")) {
                    // Clear any stored tokens/session
                    document.cookie = "accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
                    document.cookie = "refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
                    // Redirect to login
                    window.location.href = "/login";
                    return Promise.reject(error);
                }

                // Prevent multiple refresh requests
                if (!axiosClient.isRefreshing) {
                    axiosClient.isRefreshing = true;

                    try {
                        const refreshResponse = await axios.post(
                            `${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/user/refresh-token`,
                            {},
                            { 
                                withCredentials: true,
                                headers: {
                                    "Content-Type": "application/json"
                                }
                            }
                        );

                        if (refreshResponse.data.success) {
                            axiosClient.isRefreshing = false;
                            // Retry the original request
                            return axiosClient(originalRequest);
                        }
                    } catch (refreshError) {
                        axiosClient.isRefreshing = false;
                        console.error('Token refresh failed:', refreshError);
                        // Only redirect if not already on login page
                        if (currentPath !== "/login") {
                            window.location.href = "/login";
                        }
                    }
                }
            }
        }

        // Handle rate limiting
        if (error.response?.status === 429) {
            console.warn("Rate limit exceeded. Please wait before trying again.");
            error.message = "Too many requests. Please wait a moment before trying again.";
        }

        // Handle timeouts
        if (error.code === "ECONNABORTED") {
            error.message = "Request timed out. Please check your connection and try again.";
        }

        // Handle Judge0 specific errors
        if (error.response?.data?.error) {
            error.message = error.response.data.error;
        }

        return Promise.reject(error);
    }
);

export default axiosClient;
