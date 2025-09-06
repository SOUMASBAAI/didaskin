// Configuration des URLs d'API
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

// Endpoints d'authentification
export const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/api/admin/login`,
  REGISTER: `${API_BASE_URL}/api/register`,
  ADMIN_REGISTER: `${API_BASE_URL}/api/admin/register`,
};

// Endpoints des ressources
export const RESOURCE_ENDPOINTS = {
  USERS: `${API_BASE_URL}/users`,
  CATEGORIES: `${API_BASE_URL}/categories`,
  SUBCATEGORIES: `${API_BASE_URL}/subcategories`,
  SERVICES: `${API_BASE_URL}/services`,
  PRODUCTS: `${API_BASE_URL}/products`,
  NEWSLETTERS: `${API_BASE_URL}/newsletters`,
  QUIZ_QUESTIONS: `${API_BASE_URL}/quizzquestion`,
};

// Configuration des tokens
export const TOKEN_CONFIG = {
  STORAGE_KEY: "adminToken",
  USER_STORAGE_KEY: "adminUser",
  EXPIRY_CHECK_INTERVAL: 60000, // 1 minute
};

// Configuration des rôles
export const ROLES = {
  ADMIN: "ROLE_ADMIN",
  USER: "ROLE_USER",
};

// Configuration des messages d'erreur
export const ERROR_MESSAGES = {
  UNAUTHORIZED: "Accès non autorisé. Veuillez vous connecter.",
  FORBIDDEN: "Accès interdit. Vous n'avez pas les permissions nécessaires.",
  NETWORK_ERROR:
    "Erreur de connexion au serveur. Vérifiez votre connexion internet.",
  VALIDATION_ERROR: "Veuillez vérifier les informations saisies.",
  SERVER_ERROR: "Erreur serveur. Veuillez réessayer plus tard.",
};

// Public endpoints that don't need authentication
const PUBLIC_ENDPOINTS = [
  "/categories",
  "/products",
  "/services",
  "/subcategories",
  "/quizzquestion",
  "/site-content",
];

// Check if an endpoint is public
const isPublicEndpoint = (url) => {
  return PUBLIC_ENDPOINTS.some(
    (endpoint) => url.includes(endpoint) && !url.includes("/admin/")
  );
};

// Smart API helper that automatically handles authentication
export const smartApiCall = async (url, options = {}) => {
  const isPublic = isPublicEndpoint(url);
  const token = localStorage.getItem("adminToken");

  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  // Only add auth header for non-public endpoints
  if (!isPublic && token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  console.log(
    `🔄 Smart API Call: ${url}`,
    isPublic ? "(public)" : "(authenticated)"
  );

  try {
    const response = await fetch(url, config);
    console.log(`📡 Response: ${response.status} ${url}`);

    if (response.ok) {
      return await response.json();
    } else {
      const errorText = await response.text();
      console.error("❌ API Error:", response.status, errorText);
      throw new Error(`API Error: ${response.status}`);
    }
  } catch (error) {
    console.error("🚨 API Call Failed:", error);
    throw error;
  }
};

// Legacy API helper for backward compatibility
export const apiCall = smartApiCall;
