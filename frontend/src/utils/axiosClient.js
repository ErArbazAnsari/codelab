import axios from "axios";

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
                // Try to refresh token first
                try {
                    const refreshResponse = await axiosClient.post('/user/refresh-token');
                    if (refreshResponse.data.success) {
                        // Retry the original request
                        return axiosClient(originalRequest);
                    }
                } catch (refreshError) {
                    console.error('Token refresh failed:', refreshError);
                    window.location.href = "/login";
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
