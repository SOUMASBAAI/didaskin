"use client";

import { useState, useEffect } from "react";
import { Pencil, Trash } from "lucide-react";
import ImageUpload from "../ui/ImageUpload";
import { getPresetImageUrl } from "../../lib/cloudinary";
import { useAuth } from "../../hooks/useAuth";
import { RESOURCE_ENDPOINTS } from "../../config/apiConfig";

export default function ServicesSection() {
  const { getAuthHeaders, isAuthenticated, isLoading, handleApiResponse } =
    useAuth();
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddService, setShowAddService] = useState(false);
  const [newService, setNewService] = useState({
    label: "",
    categoryId: "",
    subcategory_id: "",
    shortDescription: "",
    longDescription: "",
    additionalDetails: "",
    serviceDuration: 0,
    price: "",
    image_link: "",
    slug: "",
    featuredLanding: false,
    featuredRank: 0,
  });
  const [editServiceId, setEditServiceId] = useState(null);
  const [editService, setEditService] = useState({
    label: "",
    categoryId: "",
    subcategory_id: "",
    shortDescription: "",
    longDescription: "",
    additionalDetails: "",
    serviceDuration: 0,
    price: "",
    image_link: "",
    slug: "",
    featuredLanding: false,
    featuredRank: 0,
  });

  // DnD for services list (optional; existing table drag wires)
  const [draggedServiceIndex, setDraggedServiceIndex] = useState(null);
  const handleServiceDragStart = (index) => setDraggedServiceIndex(index);
  const handleServiceDragOver = (e) => e.preventDefault();
  const handleServiceDrop = (index) => {
    if (draggedServiceIndex === null || draggedServiceIndex === index) return;
    let newOrderIds = [];
    setServices((prev) => {
      const arr = [...prev];
      const [removed] = arr.splice(draggedServiceIndex, 1);
      arr.splice(index, 0, removed);
      newOrderIds = arr.map((s) => s.id);
      return arr;
    });
    setDraggedServiceIndex(null);
    // Persist order
    (async () => {
      try {
        await fetch(`${RESOURCE_ENDPOINTS.SERVICES}/reorder`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({ ids: newOrderIds }),
        });
      } catch {}
    })();
  };

  // DnD for featured services list
  const [featuredDragIndex, setFeaturedDragIndex] = useState(null);

  // Récupérer toutes les catégories avec leurs sous-catégories
  const fetchCategories = async () => {
    // Don't fetch if not authenticated
    if (!isAuthenticated) {
      return;
    }

    try {
      setError(null);

      const response = await fetch(RESOURCE_ENDPOINTS.CATEGORIES, {
        headers: getAuthHeaders(),
      });

      // Handle 401 Unauthorized
      if (response.status === 401) {
        setError("Session expirée. Veuillez vous reconnecter.");
        return;
      }

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        setError("Réponse invalide du serveur");
        return;
      }

      const result = await response.json();

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

              // Handle 401 for subcategories
              if (subResponse.status === 401) {
                return {
                  ...category,
                  subcategories: [],
                };
              }

              const subResult = await subResponse.json();
              return {
                ...category,
                subcategories: subResult.success ? subResult.data : [],
              };
            } catch (error) {
              console.error(
                `Erreur lors de la récupération des sous-catégories pour ${category.id}:`,
                error
              );
              return {
                ...category,
                subcategories: [],
              };
            }
          })
        );
        setCategories(categoriesWithSubs);
      } else {
        setError("Erreur lors de la récupération des catégories");
      }
    } catch (error) {
      setError("Erreur de connexion au serveur");
      console.error("Erreur:", error);
    }
  };

  // Récupérer tous les services
  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${RESOURCE_ENDPOINTS.SERVICES}/all`, {
        headers: getAuthHeaders(),
      });
      const result = await handleApiResponse(response);
      if (result.success) setServices(result.data);
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

  // Charger les données au montage du composant
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      const loadData = async () => {
        await fetchCategories();
      };
      loadData();
    }
  }, [isAuthenticated, isLoading]);

  // Recharger les services quand les catégories changent
  useEffect(() => {
    if (categories.length > 0) {
      fetchServices();
    }
  }, [categories]);

  // Ajouter un nouveau service
  const handleAddService = async (e) => {
    e.preventDefault();
    if (!newService.label || !newService.price) return;

    try {
      const response = await fetch(RESOURCE_ENDPOINTS.SERVICES, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          label: newService.label,
          subcategory_id: newService.subcategory_id
            ? parseInt(newService.subcategory_id)
            : null,
          shortDescription: newService.shortDescription,
          longDescription: newService.longDescription,
          additionalDetails: newService.additionalDetails,
          serviceDuration: parseInt(newService.serviceDuration),
          price: parseFloat(newService.price),
          image_link: newService.image_link,
          slug:
            newService.slug ||
            newService.label.toLowerCase().replace(/\s+/g, "-"),
          featuredLanding: !!newService.featuredLanding,
          featuredRank: parseInt(newService.featuredRank) || 0,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Recharger la liste des services
        await fetchServices();

        // Réinitialiser le formulaire
        setNewService({
          label: "",
          categoryId: "",
          subcategory_id: "",
          shortDescription: "",
          longDescription: "",
          additionalDetails: "",
          serviceDuration: 0,
          price: "",
          image_link: "",
          slug: "",
          featuredLanding: false,
          featuredRank: 0,
        });
        setShowAddService(false);
      } else {
        setError(result.error || "Erreur lors de l'ajout du service");
      }
    } catch (error) {
      setError("Erreur de connexion au serveur");
      console.error("Erreur:", error);
    }
  };

  // Modifier un service
  const handleEditServiceClick = (service) => {
    setEditServiceId(service.id);
    setEditService({
      label: service.label || "",
      categoryId: service.categoryId || service.category?.id || "",
      subcategory_id: service.subcategoryId || service.subCategory?.id || "",
      shortDescription: service.shortDescription || "",
      longDescription: service.longDescription || "",
      additionalDetails: service.additionalDetails || "",
      serviceDuration: service.ServiceDuration || service.serviceDuration || 0,
      price: service.price ? service.price.toString() : "",
      image_link: service.image_link || service.imageLink || "",
      slug: service.slug || "",
      featuredLanding: !!service.featuredLanding,
      featuredRank: service.featuredRank || 0,
    });
  };

  const handleEditService = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${RESOURCE_ENDPOINTS.SERVICES}/${editServiceId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify({
            label: editService.label,
            subcategory_id: editService.subcategory_id
              ? parseInt(editService.subcategory_id)
              : null,
            shortDescription: editService.shortDescription,
            longDescription: editService.longDescription,
            additionalDetails: editService.additionalDetails,
            serviceDuration: parseInt(editService.serviceDuration),
            price: parseFloat(editService.price),
            image_link: editService.image_link,
            slug: editService.slug,
            featuredLanding: !!editService.featuredLanding,
            featuredRank: parseInt(editService.featuredRank) || 0,
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        // Recharger la liste des services
        await fetchServices();

        // Fermer le modal d'édition
        setEditServiceId(null);
        setEditService({
          label: "",
          categoryId: "",
          subcategory_id: "",
          shortDescription: "",
          longDescription: "",
          additionalDetails: "",
          serviceDuration: 0,
          price: "",
          image_link: "",
          slug: "",
          featuredLanding: false,
          featuredRank: 0,
        });
      } else {
        setError(result.error || "Erreur lors de la modification du service");
      }
    } catch (error) {
      setError("Erreur de connexion au serveur");
      console.error("Erreur:", error);
    }
  };

  // Supprimer un service
  const handleDeleteService = async (id) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce service ?")) {
      return;
    }

    try {
      const response = await fetch(`${RESOURCE_ENDPOINTS.SERVICES}/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      const result = await response.json();

      if (result.success) {
        // Recharger la liste des services
        await fetchServices();
      } else {
        setError(result.error || "Erreur lors de la suppression du service");
      }
    } catch (error) {
      setError("Erreur de connexion au serveur");
      console.error("Erreur:", error);
    }
  };

  // Pour le drag & drop des services
  const hoursOptions = Array.from({ length: 13 }, (_, i) => i); // 0 à 12h
  const minutesOptions = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  // Helpers pour picker durée
  function getDurationParts(duration) {
    if (!duration) return { h: "", m: "" };
    const [h, m] = duration.split(":");
    return { h: h || "", m: m || "" };
  }

  // Convertir la durée en format HH:MM pour l'affichage
  function formatDuration(minutes) {
    if (!minutes && minutes !== 0) return "—";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h > 0) {
      return `${h}h ${m.toString().padStart(2, "0")}min`;
    } else {
      return `${m}min`;
    }
  }

  // Cloudinary upload options for services
  const getUploadOptions = (type, id = null) => ({
    folder: type === "services" ? "didaskin/services" : `didaskin/${type}`,
    // Remove public_id to let Cloudinary generate unique IDs automatically
    // This prevents image caching issues when updating
  });

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
        <div className="text-center">Chargement des services...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
        <div className="text-center text-gray-600">
          Veuillez vous connecter pour accéder à cette section.
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center justify-between">
        Services
        <button
          onClick={() => setShowAddService(true)}
          className="ml-4 flex items-center justify-center w-8 h-8 rounded-full bg-[#D4A574] text-white text-2xl hover:bg-[#b88b5c] transition shadow-sm"
          title="Ajouter un service"
        >
          +
        </button>
      </h2>
      {/* Featured services reorder */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium text-gray-800">
            Mise en avant (Accueil)
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {services
            .filter((s) => s.featuredLanding)
            .sort((a, b) => (a.featuredRank || 0) - (b.featuredRank || 0))
            .map((s, idx, arr) => (
              <div
                key={s.id}
                draggable
                onDragStart={() => setFeaturedDragIndex(idx)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (featuredDragIndex === null || featuredDragIndex === idx)
                    return;
                  const current = services.slice();
                  const featured = current
                    .filter((t) => t.featuredLanding)
                    .sort(
                      (a, b) => (a.featuredRank || 0) - (b.featuredRank || 0)
                    );
                  const [removed] = featured.splice(featuredDragIndex, 1);
                  featured.splice(idx, 0, removed);
                  // reassign featuredRank locally
                  let rank = 1;
                  const newMap = new Map(featured.map((x) => [x.id, rank++]));
                  const merged = current.map((it) =>
                    newMap.has(it.id)
                      ? { ...it, featuredRank: newMap.get(it.id) }
                      : it
                  );
                  setServices(merged);
                  setFeaturedDragIndex(null);
                }}
                onDragEnd={() => setFeaturedDragIndex(null)}
                className={`bg-white border border-gray-200 rounded p-3 flex items-center gap-3 ${
                  featuredDragIndex === idx ? "ring-2 ring-[#D4A574]" : ""
                }`}
                style={{ cursor: "grab" }}
              >
                <img
                  src={getPresetImageUrl(s.image_link, "thumbnail")}
                  alt={s.label}
                  className="w-12 h-12 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {s.label}
                  </div>
                  <div className="text-xs text-gray-500">
                    Ordre: {s.featuredRank || 0}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Image
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Nom
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Prix
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Durée
              </th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {services.map((service, idx) => {
              const cat = categories.find(
                (c) => c.id === Number(service.categoryId)
              );
              const sub = cat?.subcategories.find(
                (sc) => sc.id === Number(service.subcategoryId)
              );
              return (
                <tr
                  key={service.id}
                  draggable
                  onDragStart={() => handleServiceDragStart(idx)}
                  onDragOver={handleServiceDragOver}
                  onDrop={() => handleServiceDrop(idx)}
                  onDragEnd={() => setDraggedServiceIndex(null)}
                  className={
                    draggedServiceIndex === idx
                      ? "ring-2 ring-[#D4A574] bg-[#f9f6f3]"
                      : ""
                  }
                  style={{ cursor: "grab" }}
                >
                  <td className="px-4 py-2 whitespace-nowrap">
                    {service.image_link ? (
                      <div className="relative group">
                        <img
                          src={getPresetImageUrl(
                            service.image_link,
                            "thumbnail"
                          )}
                          alt={service.label}
                          className="w-12 h-12 object-cover rounded cursor-pointer"
                        />
                        {/* Hover preview */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                          <img
                            src={getPresetImageUrl(
                              service.image_link,
                              "medium"
                            )}
                            alt={service.label}
                            className="w-32 h-32 object-cover rounded shadow-lg border-2 border-white"
                          />
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {service.label}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {service.price ? service.price + " €" : ""}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {formatDuration(
                      service.ServiceDuration || service.serviceDuration
                    )}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditServiceClick(service)}
                        className="p-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
                        title="Éditer"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteService(service.id)}
                        className="p-2 rounded bg-red-500 text-white hover:bg-red-600 transition"
                        title="Supprimer"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal Ajouter Service */}
      {showAddService && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50">
          <form
            onSubmit={handleAddService}
            className="bg-white rounded border border-gray-200 p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto"
          >
            <button
              type="button"
              onClick={() => setShowAddService(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
            >
              ×
            </button>
            <h3 className="text-lg font-light mb-3 text-gray-900">
              Ajouter un service
            </h3>
            <div className="mb-2">
              <label className="block text-xs font-light text-gray-700 mb-1">
                Catégorie
              </label>
              <select
                className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
                value={newService.categoryId || ""}
                onChange={(e) =>
                  setNewService((s) => ({
                    ...s,
                    categoryId: e.target.value,
                    subcategory_id: "",
                  }))
                }
              >
                <option value="">Sélectionner</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-2">
              <label className="block text-xs font-light text-gray-700 mb-1">
                Sous-catégorie
              </label>
              <select
                className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
                value={newService.subcategory_id || ""}
                onChange={(e) =>
                  setNewService((s) => ({
                    ...s,
                    subcategory_id: e.target.value,
                  }))
                }
                disabled={!newService.categoryId}
              >
                <option value="">Sélectionner</option>
                {categories
                  .find((cat) => cat.id === Number(newService.categoryId))
                  ?.subcategories.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.label}
                    </option>
                  ))}
              </select>
            </div>
            <div className="mb-2">
              <label className="block text-xs font-light text-gray-700 mb-1">
                Nom du service
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
                value={newService.label}
                onChange={(e) =>
                  setNewService((s) => ({ ...s, label: e.target.value }))
                }
                required
              />
            </div>
            <div className="mb-2">
              <label className="block text-xs font-light text-gray-700 mb-1">
                Courte description
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
                value={newService.shortDescription}
                onChange={(e) =>
                  setNewService((s) => ({
                    ...s,
                    shortDescription: e.target.value,
                  }))
                }
              />
            </div>
            <div className="mb-2">
              <label className="block text-xs font-light text-gray-700 mb-1">
                Description longue
              </label>
              <textarea
                className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
                value={newService.longDescription}
                onChange={(e) =>
                  setNewService((s) => ({
                    ...s,
                    longDescription: e.target.value,
                  }))
                }
                rows={3}
              />
            </div>
            <div className="mb-2">
              <label className="block text-xs font-light text-gray-700 mb-1">
                Détails supplémentaires
              </label>
              <textarea
                className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
                value={newService.additionalDetails}
                onChange={(e) =>
                  setNewService((s) => ({
                    ...s,
                    additionalDetails: e.target.value,
                  }))
                }
                rows={3}
              />
            </div>
            <div className="mb-2">
              <label className="block text-xs font-light text-gray-700 mb-1">
                Prix
              </label>
              <div className="relative flex items-center">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full border border-gray-200 rounded px-2 py-1 text-sm pr-8"
                  value={newService.price}
                  onChange={(e) =>
                    setNewService((s) => ({
                      ...s,
                      price: e.target.value,
                    }))
                  }
                  required
                />
                <span className="absolute right-2 text-gray-500 text-sm pointer-events-none">
                  €
                </span>
              </div>
            </div>
            <div className="mb-2">
              <label className="block text-xs font-light text-gray-700 mb-1">
                Durée (en minutes)
              </label>
              <input
                type="number"
                min="0"
                className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
                value={newService.serviceDuration}
                onChange={(e) =>
                  setNewService((s) => ({
                    ...s,
                    serviceDuration: parseInt(e.target.value) || 0,
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
                value={newService.slug}
                onChange={(e) =>
                  setNewService((s) => ({
                    ...s,
                    slug: e.target.value,
                  }))
                }
              />
            </div>
            <div className="mb-3">
              <label className="block text-xs font-light text-gray-700 mb-1">
                Image
              </label>
              <ImageUpload
                value={newService.image_link}
                onChange={(imageUrl) =>
                  setNewService((s) => ({ ...s, image_link: imageUrl }))
                }
                placeholder="Upload service image"
                uploadOptions={getUploadOptions("services")}
                maxSize={5}
                className="mb-2"
              />
            </div>
            {/* Featured toggles */}
            <div className="mb-2">
              <label className="inline-flex items-center space-x-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={newService.featuredLanding}
                  onChange={(e) =>
                    setNewService((s) => ({
                      ...s,
                      featuredLanding: e.target.checked,
                    }))
                  }
                />
                <span>Mettre en avant sur l'accueil</span>
              </label>
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

      {/* Modal Éditer Service */}
      {editServiceId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50">
          <form
            onSubmit={handleEditService}
            className="bg-white rounded border border-gray-200 p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto"
          >
            <button
              type="button"
              onClick={() => setEditServiceId(null)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
            >
              ×
            </button>
            <h3 className="text-lg font-light mb-3 text-gray-900">
              Modifier le service
            </h3>
            <div className="mb-2">
              <label className="block text-xs font-light text-gray-700 mb-1">
                Catégorie
              </label>
              <select
                className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
                value={editService.categoryId || ""}
                onChange={(e) =>
                  setEditService((s) => ({
                    ...s,
                    categoryId: e.target.value,
                    subcategory_id: "",
                  }))
                }
              >
                <option value="">Sélectionner</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-2">
              <label className="block text-xs font-light text-gray-700 mb-1">
                Sous-catégorie
              </label>
              <select
                className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
                value={editService.subcategory_id || ""}
                onChange={(e) =>
                  setEditService((s) => ({
                    ...s,
                    subcategory_id: e.target.value,
                  }))
                }
                disabled={!editService.categoryId}
              >
                <option value="">Sélectionner</option>
                {categories
                  .find((cat) => cat.id === Number(editService.categoryId))
                  ?.subcategories.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.label}
                    </option>
                  ))}
              </select>
            </div>
            <div className="mb-2">
              <label className="block text-xs font-light text-gray-700 mb-1">
                Nom du service
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
                value={editService.label}
                onChange={(e) =>
                  setEditService((s) => ({ ...s, label: e.target.value }))
                }
                required
              />
            </div>
            <div className="mb-2">
              <label className="block text-xs font-light text-gray-700 mb-1">
                Courte description
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
                value={editService.shortDescription}
                onChange={(e) =>
                  setEditService((s) => ({
                    ...s,
                    shortDescription: e.target.value,
                  }))
                }
              />
            </div>
            <div className="mb-2">
              <label className="block text-xs font-light text-gray-700 mb-1">
                Description longue
              </label>
              <textarea
                className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
                value={editService.longDescription}
                onChange={(e) =>
                  setEditService((s) => ({
                    ...s,
                    longDescription: e.target.value,
                  }))
                }
                rows={3}
              />
            </div>
            <div className="mb-2">
              <label className="block text-xs font-light text-gray-700 mb-1">
                Détails supplémentaires
              </label>
              <textarea
                className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
                value={editService.additionalDetails}
                onChange={(e) =>
                  setEditService((s) => ({
                    ...s,
                    additionalDetails: e.target.value,
                  }))
                }
                rows={3}
              />
            </div>
            <div className="mb-2">
              <label className="block text-xs font-light text-gray-700 mb-1">
                Prix
              </label>
              <div className="relative flex items-center">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full border border-gray-200 rounded px-2 py-1 text-sm pr-8"
                  value={editService.price}
                  onChange={(e) =>
                    setEditService((s) => ({
                      ...s,
                      price: e.target.value,
                    }))
                  }
                  required
                />
                <span className="absolute right-2 text-gray-500 text-sm pointer-events-none">
                  €
                </span>
              </div>
            </div>
            <div className="mb-2">
              <label className="block text-xs font-light text-gray-700 mb-1">
                Durée (en minutes)
              </label>
              <input
                type="number"
                min="0"
                className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
                value={editService.serviceDuration}
                onChange={(e) =>
                  setEditService((s) => ({
                    ...s,
                    serviceDuration: parseInt(e.target.value) || 0,
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
                value={editService.slug}
                onChange={(e) =>
                  setEditService((s) => ({
                    ...s,
                    slug: e.target.value,
                  }))
                }
              />
            </div>
            <div className="mb-3">
              <label className="block text-xs font-light text-gray-700 mb-1">
                Image
              </label>
              <ImageUpload
                value={editService.image_link}
                onChange={(imageUrl) =>
                  setEditService((s) => ({ ...s, image_link: imageUrl }))
                }
                placeholder="Upload service image"
                uploadOptions={getUploadOptions("services", editServiceId)}
                maxSize={5}
                className="mb-2"
              />
            </div>
            {/* Featured toggles edit */}
            <div className="mb-2">
              <label className="inline-flex items-center space-x-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={editService.featuredLanding}
                  onChange={(e) =>
                    setEditService((s) => ({
                      ...s,
                      featuredLanding: e.target.checked,
                    }))
                  }
                />
                <span>Mettre en avant sur l'accueil</span>
              </label>
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
