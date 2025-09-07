"use client";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { X } from "lucide-react";
import { API_BASE_URL } from "../config/apiConfig";

import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ProductDetailPage() {
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/products/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }
        const result = await response.json();
        if (result.success) {
          setProduct(result.data);
        } else {
          throw new Error("Failed to fetch product");
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F1ED]">
        <Header />
        <main className="flex-grow pt-32 pb-12 px-4 md:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600">
              Chargement du produit...
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#F5F1ED]">
        <Header />
        <main className="flex-grow pt-32 pb-12 px-4 md:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-red-600">
              {error || "Produit introuvable"}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Parse additional details from string to array if it exists
  const additionalDetails = product.AdditionalDetails
    ? product.AdditionalDetails.split(",").map((detail) => detail.trim())
    : [];

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
                src={product.image_link || "/placeholder.svg"}
                alt={product.label}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error("Image failed to load:", product.image_link);
                  e.target.src = "/placeholder.svg";
                }}
              />
            </div>
          </div>

          {/* Right Column: Initial Product Details (now scrolls with content) */}
          <div className="lg:w-1/2 flex flex-col justify-start lg:pt-0 pt-8">
            <h2 className="text-sm font-bold text-gray-800 mb-2 tracking-wide">
              {product.label}
            </h2>
            <p className="text-base font-semibold text-gray-900 mb-4">
              {product.price} €
            </p>

            <p className="text-sm text-gray-600 mb-6">
              {product.shortDescription}
            </p>

            <p className="text-base text-gray-700 leading-relaxed mb-8">
              {product.longDescription}
            </p>
            <button className="w-full py-3 px-6 bg-black text-white font-medium tracking-wide rounded-none hover:bg-gray-800 transition-colors duration-200 mb-6">
              {product.stock_quantity > 0
                ? "DISPONIBLE EN BOUTIQUE"
                : "EN RUPTURE DE STOCK"}
            </button>

            <div className="space-y-4">
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
              {/* Centered narrow content */}
              <p className="text-sm text-gray-700 leading-relaxed mb-6">
                {product.longDescription}
              </p>
              {additionalDetails.length > 0 && (
                <ul className="list-disc list-inside space-y-2 text-gray-700 text-xs">
                  {/* Smaller font for list */}
                  {additionalDetails.map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
                </ul>
              )}
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
