"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Card from "../components/card";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";

export default function ServicePage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const subcategoryId = searchParams.get("subcategory");
  const searchQuery = searchParams.get("search");

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subcategoryName, setSubcategoryName] = useState("");

  // Filtered services based on search query
  const filteredServices = useMemo(() => {
    if (!searchQuery || !searchQuery.trim()) {
      return services;
    }

    const query = searchQuery.toLowerCase().trim();
    return services.filter(
      (service) =>
        service.label?.toLowerCase().includes(query) ||
        service.shortDescription?.toLowerCase().includes(query) ||
        service.price?.toString().includes(query)
    );
  }, [services, searchQuery]);

  // Fetch subcategory name from backend
  useEffect(() => {
    if (subcategoryId) {
      const fetchSubcategoryName = async () => {
        try {
          const response = await fetch(
            `http://localhost:8000/subcategories/${subcategoryId}`
          );
          if (response.ok) {
            const result = await response.json();
            if (result.success) {
              setSubcategoryName(result.data.label);
            }
          }
        } catch (error) {
          console.error("Error fetching subcategory:", error);
        }
      };
      fetchSubcategoryName();
    }
  }, [subcategoryId]);

  // Fetch services directly from API
  useEffect(() => {
    const fetchServices = async () => {
      if (!subcategoryId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `http://localhost:8000/services/subcategory/${subcategoryId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }

        const result = await response.json();
        if (result.success) {
          console.log("Services fetched:", result.data); // Debug log
          setServices(result.data);
        } else {
          throw new Error("Failed to fetch services");
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching services:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [subcategoryId]);

  // Debug logs
  useEffect(() => {
    console.log("ServicePage - subcategoryId:", subcategoryId);
    console.log("ServicePage - subcategoryName:", subcategoryName);
    console.log("ServicePage - services:", services);
    console.log("ServicePage - searchQuery:", searchQuery);
    console.log("ServicePage - filteredServices:", filteredServices);
    console.log("ServicePage - loading:", loading);
    console.log("ServicePage - error:", error);
  }, [
    subcategoryId,
    subcategoryName,
    services,
    searchQuery,
    filteredServices,
    loading,
    error,
  ]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F1ED]">
        <Header />
        <main className="pt-24 pb-12 px-2 md:px-4">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600">
              Chargement des services...
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
        <main className="pt-24 pb-12 px-2 md:px-4">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-red-600">Erreur: {error}</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F1ED]">
      <Header />

      <main className="pt-24 pb-12 px-2 md:px-4">
        {/* Search results header */}
        {searchQuery && (
          <div className="px-2 md:px-4 mb-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Résultats de recherche
              </h3>
              <p className="text-gray-600">
                Recherche pour :{" "}
                <span className="font-medium">"{searchQuery}"</span>
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {filteredServices.length} service
                {filteredServices.length !== 1 ? "s" : ""} trouvé
                {filteredServices.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        )}

        <h2 className="text-lg font-light text-gray-800 text-left mb-0 tracking-wide px-2 md:px-4">
          {searchQuery
            ? `RECHERCHE - "${searchQuery}"`
            : subcategoryId
            ? `SERVICES - ${subcategoryName || "SOUS-CATÉGORIE"}`
            : "NOS SOINS"}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[3px] gap-y-[3px]">
          {filteredServices?.map((service, index) => (
            <Link
              key={service.id || index}
              to={`/service/${service.id}`}
              className="block"
            >
              <Card
                imageSrc={service.image_link || "/placeholder.svg"}
                title={service.label}
                description={service.shortDescription}
                price={`${service.price} €`}
              />
            </Link>
          ))}
        </div>

        {(!filteredServices || filteredServices.length === 0) && (
          <div className="text-center py-12">
            <p className="text-gray-600">
              {searchQuery
                ? `Aucun service trouvé pour "${searchQuery}".`
                : subcategoryId
                ? "Aucun service trouvé pour cette sous-catégorie."
                : "Aucun service disponible."}
            </p>
            {searchQuery && (
              <div className="mt-4">
                <Link
                  to={`/services${
                    subcategoryId ? `?subcategory=${subcategoryId}` : ""
                  }`}
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Voir tous les services
                </Link>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
