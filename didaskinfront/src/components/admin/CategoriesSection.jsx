"use client";

import { useState, useEffect } from "react";
import { Pencil, Trash } from "lucide-react";
import ImageUpload from "../ui/ImageUpload";
import { getPresetImageUrl } from "../../lib/cloudinary";
import { useAuth } from "../../hooks/useAuth";
import { RESOURCE_ENDPOINTS } from "../../config/apiConfig";

export default function CategoriesSection() {
  const { getAuthHeaders, isAuthenticated, isLoading, handleApiResponse } =
    useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({
    label: "",
    shortDescription: "",
    image_link: "",
    slug: "",
  });
  const [addSubCategoryFor, setAddSubCategoryFor] = useState(null);
  const [newSubCategory, setNewSubCategory] = useState({
    label: "",
    image_link: "",
    slug: "",
    ranked: 0,
    category_id: null,
  });
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategory, setEditCategory] = useState({
    label: "",
    shortDescription: "",
    image_link: "",
    slug: "",
  });
  const [editSubCategory, setEditSubCategory] = useState({
    catId: null,
    subId: null,
    label: "",
    image_link: "",
    slug: "",
    ranked: 0,
    category_id: null,
  });

  // Récupérer toutes les catégories avec leurs sous-catégories
  const fetchCategories = async () => {
    // Don't fetch if not authenticated
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(RESOURCE_ENDPOINTS.CATEGORIES, {
        headers: getAuthHeaders(),
      });

      const result = await handleApiResponse(response);

      if (result.success) {
        // Pour chaque catégorie, récupérer ses sous-catégories
        const categoriesWithSubs = await Promise.all(
          result.data.map(async (category) => {
            try {
              const subResponse = await fetch(
                `${RESOURCE_ENDPOINTS.SUBCATEGORIES}/category/${category.id}`,
                {
                  headers: getAuthHeaders(),
                }
              );
              const subResult = await handleApiResponse(subResponse);
              return {
                ...category,
                subcategories: subResult.success ? subResult.data : [],
              };
            } catch (error) {
              if (
                error.message === "SESSION_EXPIRED" ||
                error.message === "INVALID_RESPONSE"
              ) {
                return { ...category, subcategories: [] };
              }
              console.error(
                `Erreur lors de la récupération des sous-catégories pour ${category.id}:`,
                error
              );
              return { ...category, subcategories: [] };
            }
          })
        );
        setCategories(categoriesWithSubs);
      } else {
        setError("Erreur lors de la récupération des catégories");
      }
    } catch (error) {
      if (error.message === "SESSION_EXPIRED") {
        setError("Session expirée. Veuillez vous reconnecter.");
      } else if (error.message === "INVALID_RESPONSE") {
        setError("Réponse invalide du serveur");
      } else {
        setError("Erreur de connexion au serveur");
      }
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  // Charger les catégories au montage du composant
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      fetchCategories();
    }
  }, [isAuthenticated, isLoading]);

  // Ajouter une nouvelle catégorie
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.label) return;

    try {
      const response = await fetch(`${RESOURCE_ENDPOINTS.CATEGORIES}`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          label: newCategory.label,
          shortDescription: newCategory.shortDescription,
          image_link: newCategory.image_link,
          slug:
            newCategory.slug ||
            newCategory.label.toLowerCase().replace(/\s+/g, "-"),
        }),
      });

      const result = await handleApiResponse(response);

      if (result.success) {
        // Recharger la liste des catégories
        await fetchCategories();

        // Réinitialiser le formulaire
        setNewCategory({
          label: "",
          shortDescription: "",
          image_link: "",
          slug: "",
        });
        setShowAddCategory(false);
      } else {
        setError(result.error || "Erreur lors de l'ajout de la catégorie");
      }
    } catch (error) {
      if (error.message === "SESSION_EXPIRED") {
        setError("Session expirée. Veuillez vous reconnecter.");
      } else if (error.message === "INVALID_RESPONSE") {
        setError("Réponse invalide du serveur");
      } else {
        setError("Erreur de connexion au serveur");
      }
      console.error("Erreur:", error);
    }
  };

  // Ajouter une nouvelle sous-catégorie
  const handleAddSubCategory = async (e) => {
    e.preventDefault();
    if (!newSubCategory.label || addSubCategoryFor == null) return;

    try {
      const response = await fetch(`${RESOURCE_ENDPOINTS.SUBCATEGORIES}`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          label: newSubCategory.label,
          image_link: newSubCategory.image_link,
          slug:
            newSubCategory.slug ||
            newSubCategory.label.toLowerCase().replace(/\s+/g, "-"),
          ranked: newSubCategory.ranked,
          category_id: addSubCategoryFor,
        }),
      });

      const result = await handleApiResponse(response);

      if (result.success) {
        // Recharger la liste des catégories
        await fetchCategories();

        // Réinitialiser le formulaire
        setNewSubCategory({
          label: "",
          image_link: "",
          slug: "",
          ranked: 0,
          category_id: null,
        });
        setAddSubCategoryFor(null);
      } else {
        setError(result.error || "Erreur lors de l'ajout de la sous-catégorie");
      }
    } catch (error) {
      if (error.message === "SESSION_EXPIRED") {
        setError("Session expirée. Veuillez vous reconnecter.");
      } else if (error.message === "INVALID_RESPONSE") {
        setError("Réponse invalide du serveur");
      } else {
        setError("Erreur de connexion au serveur");
      }
      console.error("Erreur:", error);
    }
  };

  // Modifier une catégorie
  const handleEditCategoryClick = (cat) => {
    setEditCategoryId(cat.id);
    setEditCategory({
      label: cat.label || "",
      shortDescription: cat.shortDescription || "",
      image_link: cat.image_link || cat.imageLink || "",
      slug: cat.slug || "",
    });
  };

  const handleEditCategory = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${RESOURCE_ENDPOINTS.CATEGORIES}/${editCategoryId}`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            label: editCategory.label,
            shortDescription: editCategory.shortDescription,
            image_link: editCategory.image_link,
            slug: editCategory.slug,
          }),
        }
      );

      const result = await handleApiResponse(response);

      if (result.success) {
        // Recharger la liste des catégories
        await fetchCategories();

        // Fermer le modal d'édition
        setEditCategoryId(null);
        setEditCategory({
          label: "",
          shortDescription: "",
          image_link: "",
          slug: "",
        });
      } else {
        setError(
          result.error || "Erreur lors de la modification de la catégorie"
        );
      }
    } catch (error) {
      setError("Erreur de connexion au serveur");
      console.error("Erreur:", error);
    }
  };

  // Supprimer une catégorie
  const handleDeleteCategory = async (catId) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) {
      return;
    }

    try {
      const response = await fetch(
        `${RESOURCE_ENDPOINTS.CATEGORIES}/${catId}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      const result = await response.json();

      if (result.success) {
        // Recharger la liste des catégories
        await fetchCategories();
      } else {
        setError(
          result.error || "Erreur lors de la suppression de la catégorie"
        );
      }
    } catch (error) {
      setError("Erreur de connexion au serveur");
      console.error("Erreur:", error);
    }
  };

  // Modifier une sous-catégorie
  const handleEditSubCategoryClick = (catId, sub) => {
    setEditSubCategory({
      catId,
      subId: sub.id,
      label: sub.label || "",
      image_link: sub.image_link || sub.imageLink || "",
      slug: sub.slug || "",
      ranked: sub.ranked || 0,
      category_id: catId,
    });
  };

  const handleEditSubCategory = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${RESOURCE_ENDPOINTS.SUBCATEGORIES}/${editSubCategory.subId}`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            label: editSubCategory.label,
            image_link: editSubCategory.image_link,
            slug: editSubCategory.slug,
            ranked: editSubCategory.ranked,
            category_id: editSubCategory.category_id,
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        // Recharger la liste des catégories
        await fetchCategories();

        // Fermer le modal d'édition
        setEditSubCategory({
          catId: null,
          subId: null,
          label: "",
          image_link: "",
          slug: "",
          ranked: 0,
          category_id: null,
        });
      } else {
        setError(
          result.error || "Erreur lors de la modification de la sous-catégorie"
        );
      }
    } catch (error) {
      setError("Erreur de connexion au serveur");
      console.error("Erreur:", error);
    }
  };

  // Supprimer une sous-catégorie
  const handleDeleteSubCategory = async (catId, subId) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette sous-catégorie ?")) {
      return;
    }

    try {
      const response = await fetch(
        `${RESOURCE_ENDPOINTS.SUBCATEGORIES}/${subId}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      const result = await response.json();

      if (result.success) {
        // Recharger la liste des catégories
        await fetchCategories();
      } else {
        setError(
          result.error || "Erreur lors de la suppression de la sous-catégorie"
        );
      }
    } catch (error) {
      setError("Erreur de connexion au serveur");
      console.error("Erreur:", error);
    }
  };

  // Pour le drag & drop des catégories
  const [draggedCatIndex, setDraggedCatIndex] = useState(null);
  const handleDragStart = (index) => setDraggedCatIndex(index);
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const handleDrop = async (index) => {
    if (draggedCatIndex === null || draggedCatIndex === index) return;
    let newOrder;
    setCategories((prev) => {
      const arr = [...prev];
      const [removed] = arr.splice(draggedCatIndex, 1);
      arr.splice(index, 0, removed);
      newOrder = arr.map((c) => c.id);
      return arr;
    });
    setDraggedCatIndex(null);
    try {
      await fetch(`${RESOURCE_ENDPOINTS.CATEGORIES}/reorder`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ ids: newOrder }),
      });
    } catch (e) {
      // ignore network error; UI already reflects order
    }
  };

  // Cloudinary upload options for categories and subcategories
  const getUploadOptions = (type, id = null) => ({
    folder: `didaskin/${type}`,
    // Remove public_id to let Cloudinary generate unique IDs automatically
    // This prevents image caching issues when updating
  });

  if (loading) {
    return (
      <div className="bg-white rounded border border-gray-200 p-6">
        <div className="text-center">Chargement des catégories...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded border border-gray-200 p-6">
        <div className="text-center text-gray-600">
          Veuillez vous connecter pour accéder à cette section.
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded border border-gray-200 p-6">
        <div className="text-red-600 mb-4">Erreur: {error}</div>
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
    <div className="bg-white rounded border border-gray-200 p-6">
      <h2 className="text-xl font-light text-gray-900 mb-4 flex items-center justify-between">
        Catégories
        <button
          onClick={() => setShowAddCategory(true)}
          className="ml-2 flex items-center justify-center w-8 h-8 rounded-full bg-[#D4A574] text-white text-2xl hover:bg-[#b88b5c] transition shadow-sm"
          title="Ajouter une catégorie"
          style={{ fontWeight: 400 }}
        >
          +
        </button>
      </h2>
      <div className="space-y-4">
        {categories.map((cat, idx) => (
          <div
            key={cat.id}
            className={`border border-gray-200 rounded px-3 py-2 transition-shadow ${
              draggedCatIndex === idx
                ? "ring-2 ring-[#D4A574] bg-[#f9f6f3]"
                : ""
            }`}
            draggable
            onDragStart={() => handleDragStart(idx)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(idx)}
            onDragEnd={() => setDraggedCatIndex(null)}
            style={{ cursor: "grab" }}
          >
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                {cat.image_link ? (
                  <img
                    src={getPresetImageUrl(cat.image_link, "thumbnail")}
                    alt={cat.label}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="text-gray-300 text-xl">📁</span>
                )}
              </div>
              <span className="text-base font-light text-gray-900">
                {cat.label}
              </span>
              <button
                onClick={() => setAddSubCategoryFor(cat.id)}
                className="ml-auto px-2 py-1 rounded text-xs text-gray-700 border border-gray-300 hover:bg-gray-100 transition"
                style={{ fontWeight: 300 }}
              >
                + Sous-catégorie
              </button>
              <button
                onClick={() => handleEditCategoryClick(cat)}
                className="p-1 rounded text-gray-600 hover:bg-gray-100 transition ml-1"
                title="Éditer la catégorie"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDeleteCategory(cat.id)}
                className="p-1 rounded text-gray-600 hover:bg-gray-100 transition ml-1"
                title="Supprimer la catégorie"
              >
                <Trash className="h-4 w-4" />
              </button>
            </div>
            <div className="ml-14">
              {cat.subcategories.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {cat.subcategories.map((sub) => (
                    <div key={sub.id} className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center overflow-hidden mb-1">
                        {sub.image_link ? (
                          <img
                            src={getPresetImageUrl(sub.image_link, "thumbnail")}
                            alt={sub.label}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <span className="text-gray-300 text-base">📂</span>
                        )}
                      </div>
                      <span className="text-xs text-gray-700 font-light">
                        {sub.label}
                      </span>
                      <div className="flex gap-1 mt-1">
                        <button
                          onClick={() =>
                            handleEditSubCategoryClick(cat.id, sub)
                          }
                          className="p-1 rounded text-gray-600 hover:bg-gray-100 transition"
                          title="Éditer la sous-catégorie"
                        >
                          <Pencil className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteSubCategory(cat.id, sub.id)
                          }
                          className="p-1 rounded text-gray-600 hover:bg-gray-100 transition"
                          title="Supprimer la sous-catégorie"
                        >
                          <Trash className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-gray-300 text-xs">
                  Aucune sous-catégorie
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Ajouter Catégorie */}
      {showAddCategory && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50">
          <form
            onSubmit={handleAddCategory}
            className="bg-white rounded border border-gray-200 p-6 w-full max-w-sm relative"
          >
            <button
              type="button"
              onClick={() => setShowAddCategory(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
            >
              ×
            </button>
            <h3 className="text-lg font-light mb-3 text-gray-900">
              Ajouter une catégorie
            </h3>
            <div className="mb-2">
              <label className="block text-xs font-light text-gray-700 mb-1">
                Nom
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
                value={newCategory.label}
                onChange={(e) =>
                  setNewCategory((c) => ({ ...c, label: e.target.value }))
                }
                required
              />
            </div>
            <div className="mb-2">
              <label className="block text-xs font-light text-gray-700 mb-1">
                Description courte
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
                value={newCategory.shortDescription}
                onChange={(e) =>
                  setNewCategory((c) => ({
                    ...c,
                    shortDescription: e.target.value,
                  }))
                }
              />
            </div>
            <div className="mb-2">
              <label className="block text-xs font-light text-gray-700 mb-1">
                Slug
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
                value={newCategory.slug}
                onChange={(e) =>
                  setNewCategory((c) => ({ ...c, slug: e.target.value }))
                }
              />
            </div>
            <div className="mb-3">
              <label className="block text-xs font-light text-gray-700 mb-1">
                Image
              </label>
              <ImageUpload
                value={newCategory.image_link}
                onChange={(imageUrl) =>
                  setNewCategory((c) => ({ ...c, image_link: imageUrl }))
                }
                placeholder="Upload category image"
                uploadOptions={getUploadOptions("categories")}
                maxSize={5}
                className="mb-2"
              />
            </div>
            <button
              type="submit"
              className="w-full py-1 px-2 border border-gray-300 rounded text-gray-700 text-sm font-light hover:bg-gray-100 transition"
            >
              Ajouter
            </button>
          </form>
        </div>
      )}

      {/* Modal Ajouter Sous-catégorie */}
      {addSubCategoryFor && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50">
          <form
            onSubmit={handleAddSubCategory}
            className="bg-white rounded border border-gray-200 p-6 w-full max-w-sm relative"
          >
            <button
              type="button"
              onClick={() => setAddSubCategoryFor(null)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
            >
              ×
            </button>
            <h3 className="text-lg font-light mb-3 text-gray-900">
              Ajouter une sous-catégorie
            </h3>
            <div className="mb-2">
              <label className="block text-xs font-light text-gray-700 mb-1">
                Nom
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
                value={newSubCategory.label}
                onChange={(e) =>
                  setNewSubCategory((c) => ({ ...c, label: e.target.value }))
                }
                required
              />
            </div>
            <div className="mb-2">
              <label className="block text-xs font-light text-gray-700 mb-1">
                Rang
              </label>
              <input
                type="number"
                min="0"
                className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
                value={newSubCategory.ranked}
                onChange={(e) =>
                  setNewSubCategory((c) => ({
                    ...c,
                    ranked: parseInt(e.target.value) || 0,
                  }))
                }
              />
            </div>
            <div className="mb-2">
              <label className="block text-xs font-light text-gray-700 mb-1">
                Slug
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
                value={newSubCategory.slug}
                onChange={(e) =>
                  setNewSubCategory((c) => ({ ...c, slug: e.target.value }))
                }
              />
            </div>
            <div className="mb-3">
              <label className="block text-xs font-light text-gray-700 mb-1">
                Image
              </label>
              <ImageUpload
                value={newSubCategory.image_link}
                onChange={(imageUrl) =>
                  setNewSubCategory((c) => ({ ...c, image_link: imageUrl }))
                }
                placeholder="Upload subcategory image"
                uploadOptions={getUploadOptions("subcategories")}
                maxSize={5}
                className="mb-2"
              />
            </div>
            <button
              type="submit"
              className="w-full py-1 px-2 border border-gray-300 rounded text-gray-700 text-sm font-light hover:bg-gray-100 transition"
            >
              Ajouter
            </button>
          </form>
        </div>
      )}

      {/* Modal Éditer Catégorie */}
      {editCategoryId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50">
          <form
            onSubmit={handleEditCategory}
            className="bg-white rounded border border-gray-200 p-6 w-full max-w-sm relative"
          >
            <button
              type="button"
              onClick={() => setEditCategoryId(null)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
            >
              ×
            </button>
            <h3 className="text-lg font-light mb-3 text-gray-900">
              Modifier la catégorie
            </h3>
            <div className="mb-2">
              <label className="block text-xs font-light text-gray-700 mb-1">
                Nom
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
                value={editCategory.label}
                onChange={(e) =>
                  setEditCategory((c) => ({ ...c, label: e.target.value }))
                }
                required
              />
            </div>
            <div className="mb-2">
              <label className="block text-xs font-light text-gray-700 mb-1">
                Description courte
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
                value={editCategory.shortDescription}
                onChange={(e) =>
                  setEditCategory((c) => ({
                    ...c,
                    shortDescription: e.target.value,
                  }))
                }
              />
            </div>
            <div className="mb-2">
              <label className="block text-xs font-light text-gray-700 mb-1">
                Slug
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
                value={editCategory.slug}
                onChange={(e) =>
                  setEditCategory((c) => ({ ...c, slug: e.target.value }))
                }
              />
            </div>
            <div className="mb-3">
              <label className="block text-xs font-light text-gray-700 mb-1">
                Image
              </label>
              <ImageUpload
                value={editCategory.image_link}
                onChange={(imageUrl) =>
                  setEditCategory((c) => ({ ...c, image_link: imageUrl }))
                }
                placeholder="Upload category image"
                uploadOptions={getUploadOptions("categories", editCategoryId)}
                maxSize={5}
                className="mb-2"
              />
            </div>
            <button
              type="submit"
              className="w-full py-1 px-2 border border-gray-300 rounded text-gray-700 text-sm font-light hover:bg-gray-100 transition"
            >
              Enregistrer
            </button>
          </form>
        </div>
      )}

      {/* Modal Éditer Sous-catégorie */}
      {editSubCategory.catId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50">
          <form
            onSubmit={handleEditSubCategory}
            className="bg-white rounded border border-gray-200 p-6 w-full max-w-sm relative"
          >
            <button
              type="button"
              onClick={() =>
                setEditSubCategory({
                  catId: null,
                  subId: null,
                  label: "",
                  image_link: "",
                  slug: "",
                  ranked: 0,
                  category_id: null,
                })
              }
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
            >
              ×
            </button>
            <h3 className="text-lg font-light mb-3 text-gray-900">
              Modifier la sous-catégorie
            </h3>
            <div className="mb-2">
              <label className="block text-xs font-light text-gray-700 mb-1">
                Nom
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
                value={editSubCategory.label}
                onChange={(e) =>
                  setEditSubCategory((c) => ({ ...c, label: e.target.value }))
                }
                required
              />
            </div>
            <div className="mb-2">
              <label className="block text-xs font-light text-gray-700 mb-1">
                Rang
              </label>
              <input
                type="number"
                min="0"
                className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
                value={editSubCategory.ranked}
                onChange={(e) =>
                  setEditSubCategory((c) => ({
                    ...c,
                    ranked: parseInt(e.target.value) || 0,
                  }))
                }
              />
            </div>
            <div className="mb-2">
              <label className="block text-xs font-light text-gray-700 mb-1">
                Slug
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
                value={editSubCategory.slug}
                onChange={(e) =>
                  setEditSubCategory((c) => ({ ...c, slug: e.target.value }))
                }
              />
            </div>
            <div className="mb-3">
              <label className="block text-xs font-light text-gray-700 mb-1">
                Image
              </label>
              <ImageUpload
                value={editSubCategory.image_link}
                onChange={(imageUrl) =>
                  setEditSubCategory((c) => ({ ...c, image_link: imageUrl }))
                }
                placeholder="Upload subcategory image"
                uploadOptions={getUploadOptions(
                  "subcategories",
                  editSubCategory.subId
                )}
                maxSize={5}
                className="mb-2"
              />
            </div>
            <button
              type="submit"
              className="w-full py-1 px-2 border border-gray-300 rounded text-gray-700 text-sm font-light hover:bg-gray-100 transition"
            >
              Enregistrer
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
