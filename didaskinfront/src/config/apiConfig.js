// Configuration des URLs d'API
export const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:8000"
)
  .replace(/\/index\.php\/?$/, "")
  .replace(/\/$/, "");

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
