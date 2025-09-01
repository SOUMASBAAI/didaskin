"use client";

import { useEffect, useState } from "react";
import { Menu, Minus, Plus } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { RESOURCE_ENDPOINTS } from "../../config/apiConfig";

export default function DashboardSection() {
  const { getAuthHeaders, handleApiResponse } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const resp = await fetch(RESOURCE_ENDPOINTS.PRODUCTS, {
        headers: getAuthHeaders(),
      });
      const json = await handleApiResponse(resp);
      if (json?.success) setProducts(json.data || []);
      else setError("Erreur lors de la récupération des produits");
    } catch (e) {
      setError("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdjustStock = async (product, delta) => {
    const current = Number(
      product.stock_quantity ?? product.stockQuantity ?? 0
    );
    const next = Math.max(0, current + delta);
    if (next === current) return;

    try {
      setUpdatingId(product.id);
      const resp = await fetch(`${RESOURCE_ENDPOINTS.PRODUCTS}/${product.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ stock_quantity: next }),
      });
      const json = await handleApiResponse(resp);
      if (json?.success) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === product.id ? { ...p, stock_quantity: next } : p
          )
        );
      } else {
        setError(json?.error || "Mise à jour du stock échouée");
      }
    } catch (e) {
      setError("Erreur de connexion au serveur");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
        <div className="text-center">Chargement des produits...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={() => setError(null)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="bg-transparent">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Stock produits
      </h2>
      {products.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center text-gray-500">
          Aucun produit trouvé
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product) => {
            const qty = Number(
              product.stock_quantity ?? product.stockQuantity ?? 0
            );
            const disabled = updatingId === product.id;
            return (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex flex-col"
              >
                <div className="text-sm text-gray-500 mb-1">
                  ID: {product.id}
                </div>
                {(product.image_link || product.imageLink) && (
                  <div className="w-full h-32 mb-2 overflow-hidden rounded">
                    <img
                      src={product.image_link || product.imageLink}
                      alt={product.label}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="text-lg font-medium text-gray-900 mb-2 line-clamp-2">
                  {product.label}
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <button
                    onClick={() => handleAdjustStock(product, +1)}
                    disabled={disabled}
                    className={`p-2 rounded border border-gray-300 hover:bg-gray-100 transition ${
                      disabled ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    title="Augmenter"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <div className="text-xl font-semibold text-gray-800">
                    {qty}
                  </div>
                  <button
                    onClick={() => handleAdjustStock(product, -1)}
                    disabled={disabled || qty === 0}
                    className={`p-2 rounded border border-gray-300 hover:bg-gray-100 transition ${
                      disabled || qty === 0
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    title="Diminuer"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
