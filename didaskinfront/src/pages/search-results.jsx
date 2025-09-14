"use client";

import { useState, useEffect, useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Card from "../components/card";
import { API_BASE_URL } from "../config/apiConfig";

export default function SearchResults() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search");

  const [allServices, setAllServices] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtered services and products based on search query
  const filteredServices = useMemo(() => {
    if (!searchQuery || !searchQuery.trim()) {
      return allServices;
    }

    const query = searchQuery.toLowerCase().trim();
    return allServices.filter(
      (service) =>
        service.label?.toLowerCase().includes(query) ||
        service.shortDescription?.toLowerCase().includes(query) ||
        service.price?.toString().includes(query) ||
        service.subcategory?.label?.toLowerCase().includes(query)
    );
  }, [allServices, searchQuery]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery || !searchQuery.trim()) {
      return allProducts;
    }

    const query = searchQuery.toLowerCase().trim();
    return allProducts.filter(
      (product) =>
        product.label?.toLowerCase().includes(query) ||
        product.shortDescription?.toLowerCase().includes(query) ||
        product.price?.toString().includes(query)
    );
  }, [allProducts, searchQuery]);

  // Total results count
  const totalResults = filteredServices.length + filteredProducts.length;

  // Fetch all services and products
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch services and products in parallel
        const [servicesResponse, productsResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/services/all`),
          fetch(`${API_BASE_URL}/products`),
        ]);

        // Handle services response
        if (!servicesResponse.ok) {
          throw new Error("Failed to fetch services");
        }
        const servicesResult = await servicesResponse.json();

        // Handle products response
        if (!productsResponse.ok) {
          throw new Error("Failed to fetch products");
        }
        const productsResult = await productsResponse.json();

        if (servicesResult.success && productsResult.success) {
          console.log("Services fetched:", servicesResult.data);
          console.log("Products fetched:", productsResult.data);
          setAllServices(servicesResult.data);
          setAllProducts(productsResult.data);
        } else {
          throw new Error("Failed to fetch data");
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F1ED]">
        <Header />
        <main className="pt-24 pb-12 px-2 md:px-4">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600">Recherche en cours...</div>
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
        <div className="px-2 md:px-4 mb-6">
          <div className="bg-[#F5F1ED] p-6 rounded-lg shadow-sm border border-gray-100">
            <h1 className="text-2xl font-light text-gray-800 mb-2">
              Résultats de recherche
            </h1>
            <p className="text-gray-600 mb-2">
              Recherche pour :{" "}
              <span className="font-medium">"{searchQuery}"</span>
            </p>
            <p className="text-sm text-gray-500">
              {totalResults} résultat{totalResults !== 1 ? "s" : ""} trouvé
              {totalResults !== 1 ? "s" : ""} sur{" "}
              {allServices.length + allProducts.length} élément
              {allServices.length + allProducts.length !== 1 ? "s" : ""}{" "}
              disponible
              {allServices.length + allProducts.length !== 1 ? "s" : ""}
            </p>
            <div className="flex gap-4 mt-3 text-xs text-gray-500">
              <span>Services : {filteredServices.length}</span>
              <span>Produits : {filteredProducts.length}</span>
            </div>
          </div>
        </div>

        {/* Services Section */}
        {filteredServices.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-light text-gray-800 text-left mb-4 tracking-wide px-2 md:px-4">
              SERVICES TROUVÉS ({filteredServices.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[3px] gap-y-[3px]">
              {filteredServices.map((service, index) => (
                <Link
                  key={`service-${service.id || index}`}
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
          </div>
        )}

        {/* Products Section */}
        {filteredProducts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-light text-gray-800 text-left mb-4 tracking-wide px-2 md:px-4">
              PRODUITS TROUVÉS ({filteredProducts.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[3px] gap-y-[3px]">
              {filteredProducts.map((product, index) => (
                <Link
                  key={`product-${product.id || index}`}
                  to={`/product/${product.id}`}
                  className="block"
                >
                  <Card
                    imageSrc={product.image_link || "/placeholder.svg"}
                    title={product.label}
                    description={product.shortDescription}
                    price={`${product.price} €`}
                  />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* No results */}
        {totalResults === 0 && (
          <div className="text-center py-12">
            <div className="bg-[#F5F1ED]p-8 rounded-lg shadow-sm border border-gray-100 max-w-md mx-auto">
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Aucun résultat trouvé
              </h3>
              <p className="text-gray-600 mb-4">
                Aucun service ou produit ne correspond à votre recherche "
                {searchQuery}".
              </p>
              
            </div>
          </div>
        )}

        {/* Navigation links */}
        {totalResults > 0 && (
          <div className="text-center mt-8 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/booking"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 bg-[#F5F1ED] rounded-lg hover:bg-gray-50 "
              >
                ← Voir tous les services
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 bg-[#F5F1ED] rounded-lg hover:bg-gray-50 "
              >
                Voir tous les produits →
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
