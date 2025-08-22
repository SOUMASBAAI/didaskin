import { useState, useEffect } from "react";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const storedToken = localStorage.getItem("adminToken");
      const storedUser = localStorage.getItem("adminUser");

      if (storedToken && storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          if (userData.role === "ROLE_ADMIN") {
            setUser(userData);
            setToken(storedToken);
            setIsAuthenticated(true);
          } else {
            // Nettoyer les données invalides
            logout();
          }
        } catch (error) {
          console.error("Error parsing user data:", error);
          logout();
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = (userData, userToken) => {
    localStorage.setItem("adminToken", userToken);
    localStorage.setItem("adminUser", JSON.stringify(userData));
    setUser(userData);
    setToken(userToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  };

  const getAuthHeaders = () => {
    if (!token) return {};
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  const handleApiResponse = async (response) => {
    // Handle 401 Unauthorized
    if (response.status === 401) {
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
