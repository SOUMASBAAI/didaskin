"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "../config/apiConfig";

export default function CategoryPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const categoryId = searchParams.get("category");

  // États pour les sous-catégories
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // État pour les catégories (pour récupérer l'image de la catégorie)
  const [categories, setCategories] = useState([]);

  // Fetch categories for category image
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setCategories(result.data);
          }
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch subcategories directly from API
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (!categoryId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `${API_BASE_URL}/subcategories/category/${categoryId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch subcategories");
        }

        const result = await response.json();
        if (result.success) {
          console.log("Subcategories fetched:", result.data); // Debug log
          setSubcategories(result.data);
        } else {
          throw new Error("Failed to fetch subcategories");
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching subcategories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubcategories();
  }, [categoryId]);

  // Debug logs
  useEffect(() => {
    console.log("CategoryPage - categoryId:", categoryId);
    console.log("CategoryPage - subcategories:", subcategories);
    console.log("CategoryPage - loading:", loading);
    console.log("CategoryPage - error:", error);
  }, [categoryId, subcategories, loading, error]);

  // Fetch category name from backend instead of hardcoded mapping
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    if (categoryId) {
      const fetchCategoryName = async () => {
        try {
          const response = await fetch(
            `${API_BASE_URL}/categories/${categoryId}`
          );
          if (response.ok) {
            const result = await response.json();
            if (result.success) {
              setCategoryName(result.data.label);
            }
          }
        } catch (error) {
          console.error("Error fetching category:", error);
        }
      };
      fetchCategoryName();
    }
  }, [categoryId]);

  const handleSubcategoryClick = (subcategoryId) => {
    navigate(`/services?subcategory=${subcategoryId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F1ED] flex flex-col">
        <Header />
        <main className="flex-grow pt-[100px] pb-8 px-4 md:px-8 lg:px-12">
          <h2 className="text-2xl md:text-3xl font-light text-gray-800 text-center mb-1 tracking-wide">
            {categoryName || ""}
          </h2>
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-2">
            <div className="lg:col-span-2 lg:row-span-3">
              <div className="w-full h-[45.5rem] bg-gray-200 animate-pulse"></div>
            </div>
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex flex-col items-center text-center">
                  <div className="w-full aspect-[4/3] bg-gray-200 animate-pulse"></div>
                  <div className="w-24 h-4 mt-4 bg-gray-200 animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F5F1ED] flex flex-col">
        <Header />
        <main className="flex-grow pt-[100px] pb-12 px-4 md:px-8 lg:px-12">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-2xl font-light text-gray-800 mb-4">
              Erreur de chargement
            </h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </main>
      </div>
    );
  }

  if (!categoryId) {
    return (
      <div className="min-h-screen bg-[#F5F1ED] flex flex-col">
        <Header />
        <main className="flex-grow pt-[100px] pb-12 px-4 md:px-8 lg:px-12">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-2xl font-light text-gray-800 mb-4">
              Catégorie non sélectionnée
            </h2>
            <p className="text-gray-600">
              Veuillez sélectionner une catégorie depuis la page d'accueil.
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (!subcategories || subcategories.length === 0) {
    return (
      <div className="min-h-screen bg-[#F5F1ED] flex flex-col">
        <Header />
        <main className="flex-grow pt-[100px] pb-12 px-4 md:px-8 lg:px-12">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-light text-gray-800 mb-4">
              {categoryName}
            </h2>
            <p className="text-gray-600">
              Aucune sous-catégorie trouvée pour cette catégorie.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F1ED] flex flex-col">
      <Header />

      <main className="flex-grow pt-[100px] pb-12 px-4 md:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl md:text-2xl font-light text-gray-800 mb-0 tracking-wide text-left">
            {categoryName || ""}
          </h2>

          {/* Version Mobile : Photo catégorie en haut + sous-catégories en grille 2 colonnes */}
          <div className="block lg:hidden">
            {/* Grande carte de la catégorie - Mobile */}
            <div className="w-full mb-8">
              <div className="block w-full bg-white shadow-sm overflow-hidden">
                <div className="relative w-full aspect-[16/9] bg-gray-100 overflow-hidden">
                  <img
                    src={
                      (categoryName &&
                        categories.find((cat) => cat.id == categoryId)
                          ?.image_link) ||
                      "/placeholder.svg"
                    }
                    alt={categoryName || "Catégorie"}
                    className="w-full h-full object-cover transition-transform duration-300"
                  />
                </div>
              </div>
            </div>

            {/* Grille des sous-catégories - Mobile 2 colonnes */}
            <div className="grid grid-cols-2 gap-2">
              {subcategories.map((subcategory, index) => (
                <div
                  key={subcategory.id || index}
                  className="flex flex-col items-center text-center"
                >
                  <button
                    onClick={() => handleSubcategoryClick(subcategory.id)}
                    className="block w-full bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 group"
                  >
                    <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden">
                      <img
                        src={subcategory.image_link || "/placeholder.svg"}
                        alt={subcategory.label}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </button>
                  <h3 className="text-xs font-bold text-gray-800 mt-4 group-hover:text-gray-900 transition-colors">
                    {subcategory.label}
                  </h3>
                </div>
              ))}
            </div>
          </div>

          {/* Version Desktop : Grande carte à gauche + grille à droite (structure actuelle) */}
          <div className="hidden lg:grid lg:grid-cols-4 gap-2">
            {/* Grande carte de gauche - Image de la catégorie */}
            <div className="lg:col-span-2 lg:row-span-3 flex flex-col items-center text-center lg:h-[45.5rem]">
              <div className="block w-full h-full bg-white shadow-sm overflow-hidden lg:h-full">
                <div className="relative w-full h-full bg-gray-100 overflow-hidden lg:h-full">
                  <img
                    src={
                      (categoryName &&
                        categories.find((cat) => cat.id == categoryId)
                          ?.image_link) ||
                      "/placeholder.svg"
                    }
                    alt={categoryName || "Catégorie"}
                    className="w-full h-full object-cover transition-transform duration-300"
                  />
                </div>
              </div>
            </div>

            {/* Grille 2x3 à droite - Sous-catégories */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {subcategories.slice(0, 6).map((subcategory, index) => (
                <div
                  key={subcategory.id || index}
                  className="flex flex-col items-center text-center"
                >
                  <button
                    onClick={() => handleSubcategoryClick(subcategory.id)}
                    className="block w-full bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 group"
                  >
                    <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden">
                      <img
                        src={subcategory.image_link || "/placeholder.svg"}
                        alt={subcategory.label}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </button>
                  <h3 className="text-xs font-bold text-gray-800 mt-4 group-hover:text-gray-900 transition-colors">
                    {subcategory.label}
                  </h3>
                </div>
              ))}
            </div>
          </div>

          {/* Section pour les sous-catégories de débordement - Desktop uniquement */}
          {subcategories.length > 6 && (
            <div className="hidden lg:block mt-8 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {subcategories.slice(6).map((subcategory, index) => (
                <div
                  key={subcategory.id || index}
                  className="flex flex-col items-center text-center"
                >
                  <button
                    onClick={() => handleSubcategoryClick(subcategory.id)}
                    className="block w-full bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 group"
                  >
                    <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden">
                      <img
                        src={subcategory.image_link || "/placeholder.svg"}
                        alt={subcategory.label}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </button>
                  <h3 className="text-xs font-bold text-gray-800 mt-4 group-hover:text-gray-900 transition-colors">
                    {subcategory.label}
                  </h3>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
