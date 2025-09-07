"use client";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { X } from "lucide-react";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { API_BASE_URL } from "../config/apiConfig";

function ProductInfo({ product, onShowDetails }) {
  return (
    <div className="lg:w-1/2 flex flex-col justify-start lg:pt-0 pt-8">
      <h1 className="text-xl font-bold text-gray-800 mb-2 tracking-wide">
        {product.label}
      </h1>
      <p className="text-lg font-semibold text-gray-900 mb-4">{product.price} €</p>
      <p className="text-gray-600 mb-6">{product.shortDescription}</p>
      <p className="text-gray-700 mb-6">{product.longDescription}</p>

      <button className="w-full py-3 px-6 bg-black text-white font-medium hover:bg-gray-800 transition-colors mb-6">
        {product.stock_quantity > 0 ? "DISPONIBLE EN BOUTIQUE" : "EN RUPTURE DE STOCK"}
      </button>

      <button
        onClick={onShowDetails}
        className="text-sm text-gray-700 hover:text-gray-900 transition-colors block text-left"
      >
        PLUS DE DÉTAILS &gt;
      </button>
    </div>
  );
}

function SlidingDetailsPanel({ product, isOpen, onClose }) {
  const additionalDetails = product.AdditionalDetails
    ? product.AdditionalDetails.split(",").map((d) => d.trim())
    : [];

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
              DÉTAILS
            </h2>
            <button onClick={onClose} className="text-gray-700 hover:text-gray-900 ml-auto">
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-sm mx-auto text-left">
              <p className="text-gray-700 leading-relaxed mb-6">{product.longDescription}</p>
              {additionalDetails.length > 0 && (
                <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
                  {additionalDetails.map((detail, index) => (
                    <li key={index}>{detail}</li>
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

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);

  useEffect(() => {
    if (!id) return setLoading(false);

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_BASE_URL}/products/${id}`);
        if (!res.ok) throw new Error("Erreur lors du chargement du produit");

        const data = await res.json();
        if (data.success) setProduct(data.data);
        else throw new Error("Produit introuvable");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F1ED]">
      <Header />

      <main className="flex-grow pt-32 pb-12 px-4 md:px-6 lg:px-8">
        {loading && (
          <div className="flex justify-center items-center h-64 text-gray-600 text-lg">
            Chargement du produit...
          </div>
        )}

        {error && (
          <div className="flex justify-center items-center h-64 text-red-600 text-lg">
            {error}
          </div>
        )}

        {product && !loading && !error && (
          <div className="max-w-4xl mx-auto flex flex-col lg:flex-row gap-x-16 gap-y-8">
            {/* Image */}
            <div className="lg:w-1/2 flex justify-center items-start">
              <div className="relative w-full max-w-md aspect-[3/4] bg-gray-100 overflow-hidden">
                <img
                  src={product.image_link || "/placeholder.svg"}
                  alt={product.label}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.target.src = "/placeholder.svg")}
                />
              </div>
            </div>

            {/* Product Info */}
            <ProductInfo
              product={product}
              onShowDetails={() => setShowDetailsPanel(true)}
            />
          </div>
        )}
      </main>

      {/* Sliding Details Panel */}
      {product && (
        <SlidingDetailsPanel
          product={product}
          isOpen={showDetailsPanel}
          onClose={() => setShowDetailsPanel(false)}
        />
      )}

      <Footer />
    </div>
  );
}
