import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function AuthErrorBoundary({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Si l'utilisateur n'est pas authentifié et que le chargement est terminé,
    // rediriger vers la page de login
    if (!isLoading && !isAuthenticated) {
      const currentPath = window.location.pathname;
      if (currentPath.startsWith("/admin") && currentPath !== "/admin-login") {
        navigate("/admin-login");
      }
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Si en cours de chargement, afficher un indicateur
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F1ED]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return children;
}
