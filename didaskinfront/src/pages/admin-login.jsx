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
import Footer from "../components/Footer";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [searchParams] = useState(
    () => new URLSearchParams(window.location.search)
  );
  const resetToken = "";

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
      // Use the correct admin login endpoint
      const resp = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const loginJson = await resp.json();

      if (!resp.ok) {
        setError(
          loginJson?.error || loginJson?.message || "Erreur de connexion"
        );
        setLoading(false);
        return;
      }

      // Check if login was successful
      if (!loginJson.success) {
        setError(loginJson.error || "Erreur de connexion");
        setLoading(false);
        return;
      }

      const token = loginJson?.data?.token;
      const userData = loginJson?.data?.user;

      if (!token || !userData) {
        setError("Token ou données utilisateur introuvables dans la réponse");
        setLoading(false);
        return;
      }

      // Verify user is admin
      if (userData.role !== "ROLE_ADMIN") {
        setError(
          "Accès non autorisé. Seuls les administrateurs peuvent se connecter."
        );
        setLoading(false);
        return;
      }

      // FORCE STORAGE - Store directly in localStorage
      console.log("🔄 Storing token directly...");
      localStorage.setItem("adminToken", token);
      localStorage.setItem("adminUser", JSON.stringify(userData));

      // Verify storage worked
      const storedToken = localStorage.getItem("adminToken");
      const storedUser = localStorage.getItem("adminUser");
      console.log("✅ Token stored:", !!storedToken);
      console.log("✅ User stored:", !!storedUser);

      // Also use the login hook as backup
      login(userData, token);

      setSuccess("Connexion réussie ! Redirection...");

      // Redirect after a short delay
      setTimeout(() => {
        console.log("🔄 Redirecting to dashboard...");
        navigate("/admin-dashboard");
      }, 1000);
    } catch (err) {
      setError("Erreur de connexion au serveur");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-4 bg-[#F5F1ED]">
      <main
        className="w-full max-w-md mx-auto flex-grow"
        role="main"
        aria-labelledby="admin-login-title"
      >
        {/* Logo */}
        <header className="text-center mb-8">
          <h1 className="text-3xl font-light tracking-wider text-gray-800 mb-2">
            DIDA SKIN
          </h1>
          <p className="text-sm text-gray-500">Administration</p>
        </header>

        {/* connexion Card */}
        <section className="bg-white rounded-lg shadow-lg p-8">
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

            <div className="flex items-center justify-end">
              <button
                type="button"
                className="text-sm text-rose-400 hover:text-rose-500 font-medium"
                onClick={() => setShowForgot(true)}
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

          {showForgot && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <section className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                <header className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-800">
                    Réinitialiser le mot de passe
                  </h3>
                  <button
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => setShowForgot(false)}
                  >
                    ✕
                  </button>
                </header>
                <p className="text-sm text-gray-600 mb-4">
                  Entrez votre adresse e-mail admin pour recevoir un lien de
                  réinitialisation.
                </p>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setError("");
                    setSuccess("");
                    try {
                      const resp = await fetch(
                        `${API_BASE_URL}/api/forgot-password`,
                        {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ email: forgotEmail }),
                        }
                      );
                      const j = await resp.json();
                      if (!resp.ok || !j?.success) {
                        setError(j?.error || "Erreur lors de l'envoi du lien");
                      } else {
                        setSuccess(
                          "Un email de réinitialisation a été envoyé (vérifiez votre boîte)."
                        );
                        setShowForgot(false);
                      }
                    } catch (err) {
                      setError("Erreur de connexion au serveur");
                    }
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Adresse e-mail
                    </label>
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-200"
                      placeholder="admin@admin.com"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 px-4 bg-black text-white rounded-md hover:bg-gray-800"
                  >
                    Envoyer le lien
                  </button>
                </form>
              </section>
            </div>
          )}

          <footer className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs text-center text-gray-500">
              Accès réservé aux administrateurs autorisés
            </p>
          </footer>
        </section>
      </main>

      <Footer />
    </div>
  );
}
