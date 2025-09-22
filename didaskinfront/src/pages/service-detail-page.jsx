"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useParams } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";
import BookingButton from "../components/booking-button";
import { API_BASE_URL } from "../config/apiConfig";

export default function ServiceDetailPage() {
  const { id } = useParams();
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          console.log("Service fetched:", result.data); // Debug log
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

  // Debug logs
  useEffect(() => {
    console.log("ServiceDetailPage - id:", id);
    console.log("ServiceDetailPage - service:", service);
    console.log("ServiceDetailPage - loading:", loading);
    console.log("ServiceDetailPage - error:", error);
  }, [id, service, loading, error]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F5F1ED]">
        <Header />
        <main className="flex-grow pt-32 pb-12 px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto flex justify-center items-center h-64">
            <div className="text-lg text-gray-600">
              Chargement du service...
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F5F1ED]">
        <Header />
        <main className="flex-grow pt-32 pb-12 px-4 md:px-6 lg:px-8">
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
    <div className="flex flex-col min-h-screen bg-[#F5F1ED]">
      <Header />

      {/* Main content area - Image on left, initial details on right */}
      <main className="flex-grow pt-32 pb-12 px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex flex-col lg:flex-row gap-x-16 gap-y-8">
          {/* Left Column: Image (now scrolls with content) */}
          <div className="lg:w-1/2 flex justify-center items-start">
            <div className="relative w-full max-w-md aspect-[3/4] bg-gray-100 overflow-hidden">
              <img
                src={service.image_link || "/placeholder.svg"}
                alt={service.label}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right Column: Initial Service Details (now scrolls with content) */}
          <div className="lg:w-1/2 flex flex-col justify-start lg:pt-0 pt-8">
            <h2 className="text-sm font-bold text-gray-800 mb-2 tracking-wide">
              {service.label}
            </h2>
            <p className="text-base font-semibold text-gray-900 mb-4">
              {service.price} €
            </p>

            <p className="text-sm text-gray-600 mb-6">
              {service.shortDescription}
            </p>

            {service.longDescription && (
              <p className="text-base text-gray-700 leading-relaxed mb-8 ">
                {service.longDescription}
              </p>
            )}

            <BookingButton id={id} type="service" className="mb-6" />

            <div className="space-y-4">
              <div className="text-sm text-gray-700">
                <span className="font-medium">DURÉE ESTIMÉE DU SOIN :</span>{" "}
                {service.ServiceDuration} minutes
              </div>
              <button
                onClick={() => setShowDetailsPanel(true)}
                className="text-sm text-gray-700 hover:text-gray-900 transition-colors block text-left"
              >
                PLUS DE DÉTAILS &gt;
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Sliding Details Panel */}
      <div
        className={`fixed inset-y-0 right-0 w-full lg:w-1/2 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          showDetailsPanel ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-8 flex flex-col h-full">
          <div className="flex items-center mb-8">
            <h3 className="flex-grow text-center text-lg font-medium text-gray-800 tracking-wide">
              DÉTAILS
            </h3>
            <button
              onClick={() => setShowDetailsPanel(false)}
              className="text-gray-700 hover:text-gray-900 ml-auto"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-sm mx-auto text-left">
              {" "}
              {/* Centered narrow content */}
              <ul className="list-disc list-inside space-y-2 text-gray-700 text-xs">
                {" "}
                {/* Smaller font for list */}
                {service.additionalDetails &&
                  (() => {
                    const sentences = (service.additionalDetails || "")
                      .replace(/\r?\n+/g, " ")
                      .replace(/\s{2,}/g, " ")
                      .split(/(?<=[.!?])\s+(?=[A-ZÀ-ÖØ-Þ0-9])/)
                      .map((s) => s.trim())
                      .filter(Boolean);
                    return sentences.map((detail, index) => (
                      <li key={index}>{detail}</li>
                    ));
                  })()}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {showDetailsPanel && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDetailsPanel(false)}
        />
      )}

      <Footer />
    </div>
  );
}
