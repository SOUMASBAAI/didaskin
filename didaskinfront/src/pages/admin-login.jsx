"use client";

import { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { AUTH_ENDPOINTS, API_BASE_URL } from "../config/apiConfig";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin-dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // 1) Authentifier via /auth/login (Lexik JWT)
      const resp = await fetch(AUTH_ENDPOINTS.LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const loginJson = await resp.json();

      if (!resp.ok) {
        setError(
          loginJson?.message || loginJson?.error || "Erreur de connexion"
        );
        setLoading(false);
        return;
      }

      const token = loginJson?.token || loginJson?.data?.token;
      if (!token) {
        setError("Token introuvable dans la réponse d'authentification");
        setLoading(false);
        return;
      }

      // 2) Vérifier que l'utilisateur est ADMIN via l'endpoint protégé /admin
      const verify = await fetch(`${API_BASE_URL}/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!verify.ok) {
        setError(
          "Accès non autorisé. Seuls les administrateurs peuvent se connecter."
        );
        setLoading(false);
        return;
      }

      const verifyJson = await verify.json();
      const userData = {
        email: verifyJson?.user || email,
        role: "ROLE_ADMIN",
      };

      // 3) Enregistrer la session
      login(userData, token);

      setSuccess("Connexion réussie ! Redirection...");
      setTimeout(() => navigate("/admin-dashboard"), 600);
    } catch (err) {
      setError("Erreur de connexion au serveur");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F5F1ED]">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light tracking-wider text-gray-800 mb-2">
            DIDA SKIN
          </h1>
          <p className="text-sm text-gray-500">Administration</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <p className="text-center text-gray-600">
              Accédez à votre espace de gestion
            </p>
          </div>

          {/* Messages d'erreur et de succès */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-green-700 text-sm">{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Adresse e-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  placeholder="admin@admin.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  id="remember"
                  type="checkbox"
                  className="rounded border-gray-300 text-rose-400 focus:ring-rose-200"
                />
                <label htmlFor="remember" className="text-sm text-gray-600">
                  Se souvenir de moi
                </label>
              </div>
              <button
                type="button"
                className="text-sm text-rose-400 hover:text-rose-500 font-medium"
              >
                Mot de passe oublié ?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-[#000] text-white font-medium tracking-wide rounded-md hover:bg-[#292727] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Connexion en cours..." : "Se connecter"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs text-center text-gray-500">
              Accès réservé aux administrateurs autorisés
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">
            © 2025 DIDA SKIN. Tous droits réservés.
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="mt-2 text-xs text-[#D4A574] hover:text-[#b88b5c] transition-colors"
          >
            ← Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
}
