"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import PlanityWidget from "../components/PlanityWidget";
import { getPlanityConfig } from "../config/planity";

export default function MyAppointmentsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Configuration Planity pour la gestion des rendez-vous
  const planityConfig = getPlanityConfig("account");

  useEffect(() => {
    // Simuler un temps de chargement
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F1ED]">
        <Header />
        <main className="pt-32 pb-12 px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto flex justify-center items-center h-64">
            <div className="text-lg text-gray-600">
              Chargement de vos rendez-vous...
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F1ED]">
      <Header />

      <main className="pt-32 pb-12 px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white p-6 mb-8 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-light text-gray-800 mb-2">
                  Mes Rendez-vous
                </h1>
                <p className="text-gray-600">
                  Consultez et gérez vos rendez-vous passés et à venir
                </p>
              </div>
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-2 bg-gray-200 text-gray-800 font-medium rounded-none hover:bg-gray-300 transition-colors"
              >
                Retour
              </button>
            </div>
          </div>

          {/* Planity Account Widget */}
          <div className="bg-white p-6 shadow-sm">
            <h2 className="text-xl font-medium text-gray-800 mb-4">
              Gestion de vos rendez-vous
            </h2>
            <p className="text-gray-600 mb-6">
              Connectez-vous à votre compte pour voir vos rendez-vous, les
              modifier ou les annuler.
            </p>

            {/* Planity Account Widget */}
            <div className="border border-gray-200">
              <PlanityWidget
                containerId={planityConfig.containerId}
                apiKey={planityConfig.apiKey}
                primaryColor={planityConfig.primaryColor}
              />
            </div>
          </div>

          {/* Actions rapides */}
          <div className="bg-white p-6 mt-8 shadow-sm">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Actions rapides
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => navigate("/services")}
                className="p-4 border border-gray-200 rounded-none hover:border-black transition-colors text-left"
              >
                <h4 className="font-medium text-gray-800 mb-2">
                  Prendre un nouveau rendez-vous
                </h4>
                <p className="text-sm text-gray-600">
                  Réservez un nouveau soin ou service
                </p>
              </button>

              <button
                onClick={() => navigate("/")}
                className="p-4 border border-gray-200 rounded-none hover:border-black transition-colors text-left"
              >
                <h4 className="font-medium text-gray-800 mb-2">
                  Retour à l'accueil
                </h4>
                <p className="text-sm text-gray-600">
                  Découvrez nos autres services
                </p>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-6 text-center text-sm text-gray-600">
        <p>© 2024 DIDA SKIN. Tous droits réservés.</p>
      </footer>
    </div>
  );
}
