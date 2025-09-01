"use client";

import { Menu, Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/apiConfig";

export default function DashboardHeader({ setSidebarOpen }) {
  const {
    getAuthHeaders,
    handleApiResponse,
    logout,
    isAuthenticated,
    isLoading: authLoading,
  } = useAuth();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    // Ne pas récupérer les notifications si l'authentification n'est pas prête
    if (!isAuthenticated || authLoading) {
      return;
    }

    try {
      setLoading(true);
      const r = await fetch(`${API_BASE_URL}/notifications`, {
        headers: getAuthHeaders(),
      });
      const j = await handleApiResponse(r);
      if (j?.success) setItems(j.data || []);
    } catch (error) {
      console.error("Erreur lors de la récupération des notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Récupération immédiate des notifications quand l'authentification est prête
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      console.log("Authentification prête, récupération des notifications...");
      fetchNotifications();
    }
  }, [isAuthenticated, authLoading]); // Exécuté quand l'authentification est prête

  // Polling des notifications toutes les 10 secondes (seulement si authentifié)
  useEffect(() => {
    if (!isAuthenticated || authLoading) return;

    const id = setInterval(fetchNotifications, 10000);
    return () => clearInterval(id);
  }, [isAuthenticated, authLoading, getAuthHeaders]); // Dépendances complètes

  const unread = items.filter((n) => !n.is_read).length;

  const markRead = async (id) => {
    try {
      await handleApiResponse(
        await fetch(`${API_BASE_URL}/notifications/read/${id}`, {
          method: "POST",
          headers: getAuthHeaders(),
        })
      );
      setItems((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch {}
  };

  const toggleOpen = () => {
    const next = !open;
    setOpen(next);
    if (next) {
      fetchNotifications(); // Rafraîchir les notifications quand on ouvre le menu
    }
  };

  // Fonction pour forcer la récupération des notifications
  const refreshNotifications = () => {
    fetchNotifications();
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 px-6 py-4 h-16 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden text-gray-600 hover:text-gray-800"
        >
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-light text-gray-800">Tableau de bord</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={toggleOpen}
            className="relative p-2 text-gray-600 hover:text-gray-800"
          >
            <Bell className="h-5 w-5" />
            {authLoading ? (
              <span className="absolute -top-1 -right-1 bg-gray-400 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                ⏳
              </span>
            ) : loading ? (
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                ...
              </span>
            ) : unread > 0 ? (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unread}
              </span>
            ) : null}
          </button>
          {open && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded shadow-lg z-10">
              <div className="p-3 border-b text-sm text-gray-700 flex items-center justify-between">
                <span>Notifications</span>
                <button
                  onClick={refreshNotifications}
                  className="text-xs text-[#D4A574] hover:text-[#b88b5c] transition-colors"
                  title="Rafraîchir les notifications"
                >
                  🔄
                </button>
              </div>
              <div className="max-h-72 overflow-auto">
                {loading ? (
                  <div className="p-3 text-sm text-gray-500">Chargement...</div>
                ) : items.length === 0 ? (
                  <div className="p-3 text-sm text-gray-500">
                    Aucune notification
                  </div>
                ) : (
                  items.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3 border-b text-sm ${
                        n.is_read ? "text-gray-500" : "text-gray-800"
                      }`}
                    >
                      <div className="font-medium">{n.label}</div>
                      <div className="text-xs">{n.message}</div>
                      {!n.is_read && (
                        <button
                          onClick={() => markRead(n.id)}
                          className="mt-2 text-xs text-[#D4A574] hover:text-[#b88b5c]"
                        >
                          Marquer comme lue
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        <button
          onClick={() => {
            logout();
            navigate("/admin-login");
          }}
          className="text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          Déconnexion
        </button>
      </div>
    </header>
  );
}
