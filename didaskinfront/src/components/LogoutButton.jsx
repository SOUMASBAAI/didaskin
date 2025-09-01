import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Supprimer les données d'authentification
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");

    // Rediriger vers la page de login
    navigate("/admin-login");
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
    >
      <LogOut className="h-4 w-4" />
      <span>Déconnexion</span>
    </button>
  );
}
