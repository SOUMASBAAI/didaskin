"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useParams } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";
import BookingButton from "../components/booking-button";
import { API_BASE_URL } from "../config/apiConfig";

function ServiceInfo({ service, onShowDetails }) {
  return (
    <div className="lg:w-1/2 flex flex-col justify-start lg:pt-0 pt-8">
      <h1 className="text-xl font-bold text-gray-800 mb-2 tracking-wide">
        {service.label}
      </h1>
      <p className="text-lg font-semibold text-gray-900 mb-4">{service.price} €</p>
      <p className="text-gray-600 mb-6">{service.shortDescription}</p>

      <BookingButton id={service.id} type="service" className="mb-6" />

      <div className="space-y-4 text-sm text-gray-700">
        <div>
          <span className="font-medium">Durée estimée :</span> {service.ServiceDuration} min
        </div>
        <button
          onClick={onShowDetails}
          className="text-gray-700 hover:text-gray-900 transition-colors block text-left"
        >
          Plus de détails &gt;
        </button>
      </div>
    </div>
  );
}

function SlidingDetailsPanel({ service, isOpen, onClose }) {
  return (
    <>
      <div
        className={`fixed inset-y-0 right-0 w-full lg:w-1/2 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-8 flex flex-col h-full">
          <div className="flex items-center mb-8">
            <h2 className="flex-grow text-center text-lg font-medium text-gray-800 tracking-wide">
              Détails
            </h2>
            <button onClick={onClose} className="text-gray-700 hover:text-gray-900 ml-auto">
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-sm mx-auto text-left">
              <p className="text-gray-700 leading-relaxed mb-6">{service.longDescription}</p>
              {service.additionalDetails && (
                <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
                  {service.additionalDetails.split("\n").map((detail, idx) => (
                    <li key={idx}>{detail.trim()}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {isOpen && <div className="fixed inset-0 z-40" onClick={onClose} />}
    </>
  );
}

export default function ServiceDetailPage() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);

  useEffect(() => {
    if (!id) return setLoading(false);

    const fetchService = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/services/${id}`);
        if (!res.ok) throw new Error("Erreur lors du chargement du service");

        const data = await res.json();
        if (data.success) setService(data.data);
        else throw new Error("Service introuvable");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F1ED]">
      <Header />

      <main className="flex-grow pt-32 pb-12 px-4 md:px-6 lg:px-8">
        {loading && (
          <div className="max-w-4xl mx-auto flex justify-center items-center h-64 text-gray-600 text-lg">
            Chargement du service...
          </div>
        )}

        {error && (
          <div className="max-w-4xl mx-auto text-center text-gray-700">
            <h2 className="text-2xl font-light mb-4">Erreur</h2>
            <p>{error}</p>
          </div>
        )}

        {service && !loading && !error && (
          <div className="max-w-4xl mx-auto flex flex-col lg:flex-row gap-x-16 gap-y-8">
            {/* Left Column: Image */}
            <div className="lg:w-1/2 flex justify-center items-start">
              <div className="relative w-full max-w-md aspect-[3/4] bg-gray-100 overflow-hidden">
                <img
                  src={service.image_link || "/placeholder.svg"}
                  alt={service.label}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right Column: Info */}
            <ServiceInfo service={service} onShowDetails={() => setShowDetailsPanel(true)} />
          </div>
        )}
      </main>

      {/* Sliding Details Panel */}
      {service && (
        <SlidingDetailsPanel
          service={service}
          isOpen={showDetailsPanel}
          onClose={() => setShowDetailsPanel(false)}
        />
      )}

      <Footer />
    </div>
  );
}
