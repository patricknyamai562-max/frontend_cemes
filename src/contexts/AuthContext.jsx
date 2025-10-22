// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import apiClient from "../api/apiClient";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("accessToken"));
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null")
  );
  const [loading, setLoading] = useState(false);

  // Keep axios default header in sync
  useEffect(() => {
    if (token) {
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete apiClient.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // ✅ Corrected backend endpoint for login
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await apiClient.post("/api/Admin/login", { email, password });
      const data = res.data || {};

      const accessToken = data.accessToken;
      const refreshToken = data.refreshToken;
      const userObj = data.user;

      if (!accessToken) {
        throw new Error("Login failed — no token received from backend.");
      }

      localStorage.setItem("accessToken", accessToken);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(userObj));

      setToken(accessToken);
      setUser(userObj);

      return data;
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
// test one 
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    navigate("/login");
  };

  const value = {
    token,
    user,
    login,
    logout,
    isAuthenticated: !!token,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Route guard component
export function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
