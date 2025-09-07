"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff, Lock, Mail, AlertCircle, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { API_BASE_URL } from "../config/apiConfig";
import Footer from "../components/Footer";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  // États pour le formulaire principal
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // États pour le mot de passe oublié
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  // Redirection si déjà connecté
  useEffect(() => {
    if (isAuthenticated) navigate("/admin-dashboard");
  }, [isAuthenticated, navigate]);

  // Soumission du formulaire de login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);

    try {
      const resp = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await resp.json();

      if (!resp.ok || !data.success) {
        setError(data?.error || "Erreur de connexion");
        return;
      }

      const { token, user } = data.data;

      if (!token || !user || user.role !== "ROLE_ADMIN") {
        setError("Accès non autorisé ou données manquantes");
        return;
      }

      // Stockage local du token et des infos admin
      localStorage.setItem("adminToken", token);
      localStorage.setItem("adminUser", JSON.stringify(user));
      login(user, token);

      setSuccess("Connexion réussie ! Redirection...");
      setTimeout(() => navigate("/admin-dashboard"), 1000);
    } catch {
      setError("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  // Soumission du formulaire "Mot de passe oublié"
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");

    try {
      const resp = await fetch(`${API_BASE_URL}/api/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await resp.json();
      if (!resp.ok || !data.success) setError(data?.error || "Erreur lors de l'envoi du lien");
      else {
        setSuccess("Email de réinitialisation envoyé.");
        setShowForgot(false);
      }
    } catch {
      setError("Erreur de connexion au serveur");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-4 bg-[#F5F1ED]">
      <main className="w-full max-w-md mx-auto flex-grow" role="main">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl font-light text-gray-800 mb-2">DIDA SKIN</h1>
          <p className="text-sm text-gray-500">Administration</p>
        </header>

        {/* Card de connexion */}
        <section className="bg-white rounded-lg shadow-lg p-8">
          <p className="text-center text-gray-600 mb-6">Accédez à votre espace de gestion</p>

          {/* Messages */}
          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500" /><span className="text-red-700 text-sm">{error}</span>
          </div>}
          {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" /><span className="text-green-700 text-sm">{success}</span>
          </div>}

          {/* Formulaire login */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Adresse e-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input id="email" type="email" placeholder="admin@admin.com"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-200"
                  required
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-200"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Mot de passe oublié */}
            <div className="flex items-center justify-end">
              <button type="button" className="text-sm text-rose-400 hover:text-rose-500 font-medium"
                onClick={() => setShowForgot(true)}>Mot de passe oublié ?</button>
            </div>

            {/* Bouton login */}
            <button type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-black text-white font-medium tracking-wide rounded-md hover:bg-gray-800 disabled:opacity-50">
              {loading ? "Connexion en cours..." : "Se connecter"}
            </button>
          </form>

          {/* Footer de la card */}
          <footer className="mt-6 pt-6 border-t border-gray-100 text-xs text-center text-gray-500">
            Accès réservé aux administrateurs autorisés
          </footer>
        </section>
      </main>

      {/* Modal Mot de passe oublié */}
      {showForgot && <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <section className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
          <header className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-800">Réinitialiser le mot de passe</h3>
            <button className="text-gray-500 hover:text-gray-700" onClick={() => setShowForgot(false)}>✕</button>
          </header>
          <p className="text-sm text-gray-600 mb-4">
            Entrez votre adresse e-mail admin pour recevoir un lien de réinitialisation.
          </p>
          <form onSubmit={handleForgotSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adresse e-mail</label>
              <input type="email" required value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-200"
                placeholder="admin@admin.com"
              />
            </div>
            <button type="submit" className="w-full py-2 px-4 bg-black text-white rounded-md hover:bg-gray-800">
              Envoyer le lien
            </button>
          </form>
        </section>
      </div>}

      <Footer />
    </div>
  );
}
