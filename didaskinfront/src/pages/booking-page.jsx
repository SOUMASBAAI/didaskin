"use client";

import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PlanityWidget from "../components/PlanityWidget";
import { getPlanityConfig } from "../config/planity";
import { API_BASE_URL } from "../config/apiConfig";
import bannerImage from "../assets/booking-banner.png";

export default function BookingPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configuration Planity pour les services
  const planityConfig = getPlanityConfig("services");

  // Fetch service data from API
  useEffect(() => {
    const fetchService = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_BASE_URL}/services/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch service");
        }

        const result = await response.json();
        if (result.success) {
          console.log("Service fetched for booking:", result.data);
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
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F1ED]">
        <Header />
        <main className="pt-32 pb-12 px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto flex justify-center items-center h-64">
            <div className="text-lg text-gray-600">
              Chargement de la page de réservation...
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F5F1ED]">
        <Header />
        <main className="pt-32 pb-12 px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-light text-gray-800 mb-4">
              Erreur de chargement
            </h2>
            <p className="text-gray-600">{error}</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 px-6 py-2 bg-black text-white rounded-none hover:bg-gray-800 transition-colors"
            >
              Retour
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F1ED]">
      <Header />

      {/* Bannière avec photo */}
     <section className="relative h-[50vh] md:h-[70vh] min-h-[300px] md:min-h-[500px] bg-cover bg-no-repeat overflow-hidden z-0">

        <section className="relative overflow-hidden z-0">
  <img
    src={bannerImage}
    alt="Visages"
    className="w-full h-[400px] object-contain md:h-[600px] mx-auto"
  />
</section>
        <div className="absolute inset-0 " />
        <div className="relative z-10 flex items-center justify-center h-full px-4 md:px-6 lg:px-8">
          <div className="text-center text-black max-w-4xl mx-auto"></div>
        </div>
      </section>

      <main className="pt-12 pb-12 px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            {service && (
              <div className="text-gray-600">
                Réservez votre rendez-vous pour :{" "}
                <strong>{service.label}</strong>
              </div>
            )}
          </div>

          {/* Header with service info */}
          {service && (
            <div className="bg-white p-6 mb-8 shadow-sm">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-gray-100 overflow-hidden">
                  <img
                    src={service.image_link || "/placeholder.svg"}
                    alt={service.label}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-light text-gray-800 mb-2">
                    Prise de rendez-vous
                  </h1>
                  <h2 className="text-lg font-medium text-gray-700 mb-1">
                    {service.label}
                  </h2>
                  <p className="text-gray-600 mb-2">
                    {service.shortDescription}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="font-medium">{service.price} €</span>
                    <span>•</span>
                    <span>{service.ServiceDuration} minutes</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Planity Integration Section - full-bleed like service-booking */}
          <div>
            <PlanityWidget
              containerId={planityConfig.containerId}
              apiKey={planityConfig.apiKey}
              primaryColor={planityConfig.primaryColor}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
