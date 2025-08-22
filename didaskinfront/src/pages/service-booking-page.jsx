"use client";

import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import PlanityWidget from "../components/PlanityWidget";
import { getPlanityConfig } from "../config/planity";

export default function ServiceBookingPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const serviceId = searchParams.get("service") || id;

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const planityConfig = getPlanityConfig("service-booking");

  // Fetch service data from API
  useEffect(() => {
    const fetchService = async () => {
      if (!serviceId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `http://localhost:8000/services/${serviceId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch service");
        }

        const result = await response.json();
        if (result.success) {
          setService(result.data);
        } else {
          throw new Error("Failed to fetch service");
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching service:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [serviceId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F1ED]">
        <Header />
        <main className="pt-24 pb-12 px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center items-center h-64">
              <div className="text-lg text-gray-600">
                Chargement du service...
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-[#F5F1ED]">
        <Header />
        <main className="pt-24 pb-12 px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-light text-gray-800 mb-4">
              Erreur de chargement
            </h2>
            <p className="text-gray-600">{error || "Service non trouvé"}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F1ED]">
      <Header />

      <main className="pt-24 pb-12 px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="text-sm text-gray-600 hover:text-gray-800 mb-4 flex items-center"
            >
              ← Retour
            </button>
            <h1 className="text-3xl font-light text-gray-800 mb-2">
              Réserver votre soin
            </h1>
            <p className="text-gray-600">
              Réservez votre rendez-vous pour : <strong>{service.label}</strong>
            </p>
          </div>


          {/* Planity Widget */}
          <div>
            <PlanityWidget
              containerId={planityConfig.containerId}
              apiKey={planityConfig.apiKey}
              primaryColor={planityConfig.primaryColor}
            />
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="bg-white border-t border-gray-100 py-6 text-center text-sm text-gray-600">
        <p>© 2025 DIDA SKIN. Tous droits réservés.</p>
      </footer>
    </div>
  );
}
