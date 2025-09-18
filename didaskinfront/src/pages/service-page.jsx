"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Card from "../components/card";
import { useLocation, Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { API_BASE_URL } from "../config/apiConfig";

export default function ServicePage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const subcategoryId = searchParams.get("subcategory");
  const searchQuery = searchParams.get("search");

  const [services, setServices] = useState([]);
  const [subcategoryName, setSubcategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch subcategory info + services
  useEffect(() => {
    if (!subcategoryId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [subcatRes, servicesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/subcategories/${subcategoryId}`),
          fetch(`${API_BASE_URL}/services/subcategory/${subcategoryId}`),
        ]);

        const subcatData = await subcatRes.json();
        if (subcatData.success) setSubcategoryName(subcatData.data.label);

        const servicesData = await servicesRes.json();
        if (servicesData.success) setServices(servicesData.data);
      } catch (err) {
        setError(err.message || "Une erreur est survenue");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [subcategoryId]);

  // Filter services by search query
  const filteredServices = useMemo(() => {
    if (!searchQuery?.trim()) return services;
    const query = searchQuery.toLowerCase().trim();
    return services.filter(
      (s) =>
        s.label?.toLowerCase().includes(query) ||
        s.shortDescription?.toLowerCase().includes(query) ||
        s.price?.toString().includes(query)
    );
  }, [services, searchQuery]);

  return (
    <div className="min-h-screen bg-[#F5F1ED]">
      <Header />

      <main className="pt-24 pb-12 px-2 md:px-4">
        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center h-64 text-gray-600 text-lg">
            Chargement des services...
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex justify-center items-center h-64 text-red-600 text-lg">
            Erreur: {error}
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
            {/* Search Results Header */}
            {searchQuery && (
              <div className="mb-4 p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-lg font-medium text-gray-800 mb-1">
                  Résultats de recherche
                </h3>
                <p className="text-gray-600">
                  Recherche pour : <span className="font-medium">"{searchQuery}"</span>
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {filteredServices.length} service{filteredServices.length !== 1 && "s"} trouvé{filteredServices.length !== 1 && "s"}
                </p>
              </div>
            )}

            {/* Page Title */}
            <h2 className="text-lg font-light text-gray-800 mb-0 tracking-wide ml-4">
              {searchQuery
                ? `RECHERCHE - "${searchQuery}"`
                : subcategoryId
                ? subcategoryName || "SOUS-CATÉGORIE"
                : "NOS SOINS"}
            </h2>

            {/* Services Grid */}
            {filteredServices.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredServices.map((service) => (
                  <Link key={service.id} to={`/service/${service.id}`}>
                    <Card
                      imageSrc={service.image_link || "/placeholder.svg"}
                      title={service.label}
                      description={service.shortDescription}
                      price={`${service.price} €`}
                    />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-600">
                {searchQuery
                  ? `Aucun service trouvé pour "${searchQuery}".`
                  : subcategoryId
                  ? "Aucun service trouvé pour cette sous-catégorie."
                  : "Aucun service disponible."}
                {searchQuery && (
                  <div className="mt-4">
                    <Link
                      to={`/services${subcategoryId ? `?subcategory=${subcategoryId}` : ""}`}
                      className="text-sm text-gray-500 hover:text-gray-700 underline"
                    >
                      Voir tous les services
                    </Link>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
