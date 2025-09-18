"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Card from "../components/card";
import { API_BASE_URL } from "../config/apiConfig";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Récupération des produits
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/products`);
        if (!response.ok) throw new Error("Impossible de récupérer les produits");
        const result = await response.json();
        if (result.success) setProducts(result.data);
        else throw new Error("Impossible de récupérer les produits");
      } catch (err) {
        setError(err.message);
        console.error("Erreur fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // SEO côté client
  useEffect(() => {
    document.title = error
      ? "Erreur - Produits | Dida Skin"
      : "Nos Produits | Dida Skin";

    let metaDescription = document.querySelector("meta[name='description']");
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute(
      "content",
      error
        ? `Erreur lors de la récupération des produits: ${error}`
        : "Découvrez notre sélection de produits de soin et beauté Dida Skin."
    );
  }, [error]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F1ED]">
        <Header />
        <main className="pt-24 pb-12 px-2 md:px-4 flex justify-center items-center h-64 text-gray-600">
          Chargement des produits...
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F5F1ED]">
        <Header />
        <main className="pt-24 pb-12 px-2 md:px-4 flex justify-center items-center h-64 text-red-600">
          Erreur: {error}
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F1ED]">
      <Header />

      <main className="pt-24 pb-12 px-2 md:px-4">
        {/* Titre principal pour le SEO */}
        <h2 className="text-xl font-light text-gray-800 mb-0 tracking-wide px-2 md:px-4 ">
          Nos Produits
        </h2>

        {/* Grille des produits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-[3px] gap-y-[3px]">
          {products.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`} className="block">
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
