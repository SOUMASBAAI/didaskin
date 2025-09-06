import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { TOKEN_CONFIG } from "../config/apiConfig";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const isTokenExpired = (jwt) => {
    try {
      const decoded = jwtDecode(jwt);
      if (!decoded || !decoded.exp) return true;
      return decoded.exp * 1000 <= Date.now();
    } catch (e) {
      return true;
    }
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const checkAuth = () => {
      const storedToken = localStorage.getItem("adminToken");
      const storedUser = localStorage.getItem("adminUser");

      if (storedToken && storedUser) {
        if (isTokenExpired(storedToken)) {
          logout();
        } else {
          try {
            const userData = JSON.parse(storedUser);
            if (userData.role === "ROLE_ADMIN") {
              setUser(userData);
              setToken(storedToken);
              setIsAuthenticated(true);
            } else {
              logout();
            }
          } catch (error) {
            console.error("Error parsing user data:", error);
            logout();
          }
        }
      }
      setIsLoading(false);
    };

    checkAuth();

    // Periodic expiry check
    const intervalMs = TOKEN_CONFIG?.EXPIRY_CHECK_INTERVAL || 60000;
    const intervalId = setInterval(() => {
      const t = localStorage.getItem("adminToken");
      if (t && isTokenExpired(t)) {
        logout();
      }
    }, intervalMs);

    return () => clearInterval(intervalId);
  }, []);

  const login = (userData, userToken) => {
    localStorage.setItem("adminToken", userToken);
    localStorage.setItem("adminUser", JSON.stringify(userData));
    setUser(userData);
    setToken(userToken);
    setIsAuthenticated(true);
  };

  const getAuthHeaders = () => {
    const t = token || localStorage.getItem("adminToken");
    if (!t || isTokenExpired(t)) {
      logout();
      return {};
    }
    return {
      Authorization: `Bearer ${t}`,
      "Content-Type": "application/json",
    };
  };

  const handleApiResponse = async (response) => {
    // Handle 401 Unauthorized - but don't logout immediately
    if (response.status === 401) {
      console.warn("⚠️ 401 error detected, but not logging out automatically");
      // Don't logout automatically - let user handle it
      // logout();
      throw new Error("SESSION_EXPIRED");
    }

    // Check if response is JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("INVALID_RESPONSE");
    }

    return await response.json();
  };

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
    getAuthHeaders,
    handleApiResponse,
  };
};
