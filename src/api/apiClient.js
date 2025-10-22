// src/api/apiClient.js
import axios from "axios";

// Base Axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://localhost:7040",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: attach token from localStorage (if present)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: log and handle 401 (clear token and redirect to login)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);

    // If unauthorized, clear token and force a redirect to /login
    if (error?.response?.status === 401) {
      try {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
      } catch (e) {
        /* ignore */
      }
      // Use window.location so this runs even outside React hooks/interceptors
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default apiClient;
