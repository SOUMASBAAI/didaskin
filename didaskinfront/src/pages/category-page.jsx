"use client";

import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { API_BASE_URL } from "../config/apiConfig";

function SubcategoryCard({ subcategory, onClick }) {
  return (
    <div className="flex flex-col items-center text-center">
      <button
        onClick={onClick}
        className="block w-full bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 group"
      >
        <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden">
          <img
            src={subcategory.image_link || "/placeholder.svg"}
            alt={subcategory.label}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      </button>
      <h3 className="text-xs font-bold text-gray-800 mt-4 group-hover:text-gray-900 transition-colors">
        {subcategory.label}
      </h3>
    </div>
  );
}

export default function CategoryPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const categoryId = searchParams.get("category");

  const [category, setCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [loadingCategory, setLoadingCategory] = useState(true);
  const [loadingSubcategories, setLoadingSubcategories] = useState(true);
  const [error, setError] = useState(null);

  const handleSubcategoryClick = useCallback(
    (id) => navigate(`/services?subcategory=${id}`),
    [navigate]
  );

  // Fetch catégorie
  useEffect(() => {
    if (!categoryId) return;

    const fetchCategory = async () => {
      try {
        setLoadingCategory(true);
        const res = await fetch(`${API_BASE_URL}/categories/${categoryId}`);
        if (!res.ok) throw new Error("Erreur de chargement de la catégorie");
        const data = await res.json();
        if (data.success) setCategory(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingCategory(false);
      }
    };

    fetchCategory();
  }, [categoryId]);

  // Fetch sous-catégories
  useEffect(() => {
    if (!categoryId) return;

    const fetchSubcategories = async () => {
      try {
        setLoadingSubcategories(true);
        const res = await fetch(`${API_BASE_URL}/subcategories/category/${categoryId}`);
        if (!res.ok) throw new Error("Erreur de chargement des sous-catégories");
        const data = await res.json();
        if (data.success) setSubcategories(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingSubcategories(false);
      }
    };

    fetchSubcategories();
  }, [categoryId]);

  // Cas : pas de catégorie sélectionnée
  if (!categoryId) {
    return (
      <div className="min-h-screen bg-[#F5F1ED] flex flex-col">
        <Header />
        <main className="flex-grow pt-[100px] pb-12 px-4 md:px-8 lg:px-12 text-center">
          <h2 className="text-2xl font-light text-gray-800 mb-4">
            Catégorie non sélectionnée
          </h2>
          <p className="text-gray-600">
            Veuillez sélectionner une catégorie depuis la page d'accueil.
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  // Loader principal
  if (loadingCategory && !category) {
    return (
      <div className="min-h-screen bg-[#F5F1ED] flex flex-col">
        <Header />
        <main className="flex-grow pt-[100px] pb-12 px-4 md:px-8 lg:px-12 text-center">
          <p className="text-gray-600">Chargement de la catégorie...</p>
        </main>
        <Footer />
      </div>
    );
  }

  // Erreur
  if (error) {
    return (
      <div className="min-h-screen bg-[#F5F1ED] flex flex-col">
        <Header />
        <main className="flex-grow pt-[100px] pb-12 px-4 md:px-8 lg:px-12 text-center">
          <p className="text-red-600">{error}</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F1ED] flex flex-col">
      <Header />

      <main className="flex-grow pt-[100px] pb-12 px-4 md:px-8 lg:px-12 max-w-6xl mx-auto">
        <h2 className="text-xl md:text-2xl font-light text-gray-800 mb-1 tracking-wide">
          {category?.label || ""}
        </h2>

        {/* Version Mobile */}
        <div className="block lg:hidden">
          {category?.image_link && (
            <div className="w-full mb-8 bg-white shadow-sm overflow-hidden">
              <div className="relative w-full aspect-[16/9] bg-gray-100 overflow-hidden">
                <img
                  src={category.image_link}
                  alt={category.label}
                  className="w-full h-full object-cover transition-transform duration-300"
                  loading="lazy"
                />
              </div>
            </div>
          )}

          {loadingSubcategories ? (
            <p className="text-gray-600 text-center">Chargement des sous-catégories...</p>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {subcategories.map((sub) => (
                <SubcategoryCard
                  key={sub.id}
                  subcategory={sub}
                  onClick={() => handleSubcategoryClick(sub.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Version Desktop */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-2">
          <div className="lg:col-span-2 lg:row-span-3 flex flex-col items-center text-center lg:h-[45.5rem]">
            <div className="block w-full h-full bg-white shadow-sm overflow-hidden lg:h-full">
              <div className="relative w-full h-full bg-gray-100 overflow-hidden lg:h-full">
                <img
                  src={category?.image_link || "/placeholder.svg"}
                  alt={category.label || "Catégorie"}
                  className="w-full h-full object-cover transition-transform duration-300"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {loadingSubcategories ? (
              <p className="text-gray-600 col-span-2 text-center">
                Chargement des sous-catégories...
              </p>
            ) : (
              subcategories.slice(0, 6).map((sub) => (
                <SubcategoryCard
                  key={sub.id}
                  subcategory={sub}
                  onClick={() => handleSubcategoryClick(sub.id)}
                />
              ))
            )}
          </div>
        </div>

        {/* Sous-catégories restantes Desktop */}
        {!loadingSubcategories && subcategories.length > 6 && (
          <div className="hidden lg:block mt-8 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {subcategories.slice(6).map((sub) => (
              <SubcategoryCard
                key={sub.id}
                subcategory={sub}
                onClick={() => handleSubcategoryClick(sub.id)}
              />
            ))}
          </div>
        )}

        {/* Cas : aucune sous-catégorie */}
        {!loadingSubcategories && subcategories.length === 0 && (
          <p className="text-gray-600 text-center mt-8">
            Aucune sous-catégorie trouvée pour cette catégorie.
          </p>
        )}
      </main>

      <Footer />
    </div>
  );
}
