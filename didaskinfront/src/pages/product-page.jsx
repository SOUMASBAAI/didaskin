"use client";

import { useState, useEffect } from "react";
import Header from "../components/header";
import Footer from "../components/Footer";
import Card from "../components/card";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../config/apiConfig";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/products`);
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const result = await response.json();
        if (result.success) {
          setProducts(result.data);
        } else {
          throw new Error("Failed to fetch products");
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F1ED]">
        <Header />
        <main className="pt-24 pb-12 px-2 md:px-4">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600">
              Chargement des produits...
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
        <h2 className="text-lg font-light text-gray-800 text-left mb-1 tracking-wide px-2 md:px-4">
          {"NOS PRODUITS"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-[3px] gap-y-[3px]">
          {products.map((product) => (
            <Link
              key={product.id}
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
      </main>

      <Footer />
    </div>
  );
}
