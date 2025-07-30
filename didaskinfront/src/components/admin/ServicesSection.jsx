"use client";

import { useState } from "react";
import { Pencil, Trash } from "lucide-react";

export default function ServicesSection() {
  // Données mock pour les catégories (nécessaire pour les services)
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: "Soins Visage",
      image: "",
      subcategories: [
        { id: 1, name: "Hydratant", image: "" },
        { id: 2, name: "Anti-âge", image: "" },
      ],
    },
    {
      id: 2,
      name: "Soins Corps",
      image: "",
      subcategories: [],
    },
  ]);

  // Données mock pour les services
  const [services, setServices] = useState([
    {
      id: 1,
      name: "Soin Hydratant",
      categoryId: 1,
      subcategoryId: 1,
      shortDesc: "Hydrate la peau en profondeur.",
      longDesc:
        "Ce soin complet hydrate intensément la peau, la laissant douce et éclatante.",
      additionalDetails:
        "Notre soin hydratant premium utilise des ingrédients naturels de haute qualité, soigneusement sélectionnés pour répondre aux besoins spécifiques de chaque type de peau. Cette formule avancée combine l'efficacité de l'acide hyaluronique avec les propriétés apaisantes de l'aloe vera et les antioxydants puissants de la vitamine E. Le processus de soin comprend plusieurs étapes : un nettoyage en douceur pour éliminer les impuretés, une exfoliation légère pour révéler la peau, l'application d'un masque hydratant personnalisé, et enfin un massage relaxant pour stimuler la circulation et favoriser l'absorption des actifs. Ce soin est particulièrement recommandé pour les peaux sèches, déshydratées ou stressées, et peut être adapté selon les besoins spécifiques de chaque client.",
      duration: "60 min",
      image: "",
      price: "85 €",
    },
  ]);
  const [showAddService, setShowAddService] = useState(false);
  const [newService, setNewService] = useState({
    name: "",
    categoryId: "",
    subcategoryId: "",
    shortDesc: "",
    longDesc: "",
    additionalDetails: "",
    duration: "",
    image: "",
    price: "",
  });
  const [editServiceId, setEditServiceId] = useState(null);
  const [editService, setEditService] = useState({
    name: "",
    categoryId: "",
    subcategoryId: "",
    shortDesc: "",
    longDesc: "",
    additionalDetails: "",
    duration: "",
    image: "",
    price: "",
  });

  // Pour le drag & drop des services
  const [draggedServiceIndex, setDraggedServiceIndex] = useState(null);
  const handleServiceDragStart = (index) => setDraggedServiceIndex(index);
  const handleServiceDragOver = (e) => {
    e.preventDefault();
  };
  const handleServiceDrop = (index) => {
    if (draggedServiceIndex === null || draggedServiceIndex === index) return;
    setServices((prev) => {
      const arr = [...prev];
      const [removed] = arr.splice(draggedServiceIndex, 1);
      arr.splice(index, 0, removed);
      return arr;
    });
    setDraggedServiceIndex(null);
  };

  // Pour la durée (picker heures/minutes)
  const hoursOptions = Array.from({ length: 13 }, (_, i) => i); // 0 à 12h
  const minutesOptions = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  // Helpers pour picker durée
  function getDurationParts(duration) {
    if (!duration) return { h: "", m: "" };
    const [h, m] = duration.split(":");
    return { h: h || "", m: m || "" };
  }

  // Ajout d'un utilitaire pour convertir un fichier en base64
  function fileToBase64(file, cb) {
    const reader = new FileReader();
    reader.onload = function (e) {
      cb(e.target.result);
    };
    reader.readAsDataURL(file);
  }

  const handleAddService = (e) => {
    e.preventDefault();
    if (
      !newService.name ||
      !newService.categoryId ||
      !newService.subcategoryId ||
      !newService.price
    )
      return;
    setServices((prev) => [
      ...prev,
      {
        ...newService,
        id: prev.length ? Math.max(...prev.map((s) => s.id)) + 1 : 1,
      },
    ]);
    setNewService({
      name: "",
      categoryId: "",
      subcategoryId: "",
      shortDesc: "",
      longDesc: "",
      additionalDetails: "",
      duration: "",
      image: "",
      price: "",
    });
    setShowAddService(false);
  };

  const handleEditServiceClick = (service) => {
    setEditServiceId(service.id);
    setEditService({ ...service });
  };

  const handleEditService = (e) => {
    e.preventDefault();
    setServices((prev) =>
      prev.map((s) =>
        s.id === editServiceId ? { ...editService, id: editServiceId } : s
      )
    );
    setEditServiceId(null);
    setEditService({
      name: "",
      categoryId: "",
      subcategoryId: "",
      shortDesc: "",
      longDesc: "",
      additionalDetails: "",
      duration: "",
      image: "",
      price: "",
    });
  };

  const handleDeleteService = (id) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

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
                    {service.image ? (
                      <img
                        src={service.image}
                        alt={service.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {service.name}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {service.price ? service.price + " €" : ""}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {service.duration
                      ? service.duration.replace(":", "h ") + " min"
                      : ""}
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
                value={newService.categoryId}
                onChange={(e) =>
                  setNewService((s) => ({
                    ...s,
                    categoryId: e.target.value,
                    subcategoryId: "",
                  }))
                }
                required
              >
                <option value="">Sélectionner</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
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
                value={newService.subcategoryId}
                onChange={(e) =>
                  setNewService((s) => ({
                    ...s,
                    subcategoryId: e.target.value,
                  }))
                }
                required
                disabled={!newService.categoryId}
              >
                <option value="">Sélectionner</option>
                {categories
                  .find((cat) => cat.id === Number(newService.categoryId))
                  ?.subcategories.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
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
                value={newService.name}
                onChange={(e) =>
                  setNewService((s) => ({ ...s, name: e.target.value }))
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
                value={newService.shortDesc}
                onChange={(e) =>
                  setNewService((s) => ({
                    ...s,
                    shortDesc: e.target.value,
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
                value={newService.longDesc}
                onChange={(e) =>
                  setNewService((s) => ({
                    ...s,
                    longDesc: e.target.value,
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
                  value={newService.price.replace("€", "")}
                  onChange={(e) =>
                    setNewService((s) => ({
                      ...s,
                      price: e.target.value ? e.target.value : "",
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
                Durée
              </label>
              <div className="flex gap-2">
                <select
                  className="border border-gray-200 rounded px-2 py-1 text-sm"
                  value={getDurationParts(newService.duration).h}
                  onChange={(e) => {
                    const m = getDurationParts(newService.duration).m || "00";
                    setNewService((s) => ({
                      ...s,
                      duration: `${e.target.value}:${m}`,
                    }));
                  }}
                >
                  <option value="">h</option>
                  {hoursOptions.map((h) => (
                    <option key={h} value={h}>
                      {h} h
                    </option>
                  ))}
                </select>
                <select
                  className="border border-gray-200 rounded px-2 py-1 text-sm"
                  value={getDurationParts(newService.duration).m}
                  onChange={(e) => {
                    const h = getDurationParts(newService.duration).h || "0";
                    setNewService((s) => ({
                      ...s,
                      duration: `${h}:${e.target.value}`,
                    }));
                  }}
                >
                  <option value="">min</option>
                  {minutesOptions.map((m) => (
                    <option key={m} value={m}>
                      {m.toString().padStart(2, "0")} min
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-3">
              <label className="block text-xs font-light text-gray-700 mb-1">
                Image
              </label>
              <div
                className="w-full h-24 border border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer bg-gray-50 mb-2 relative"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const file = e.dataTransfer.files[0];
                  if (file)
                    fileToBase64(file, (b64) =>
                      setNewService((s) => ({ ...s, image: b64 }))
                    );
                }}
                onClick={() =>
                  document.getElementById("service-image-input").click()
                }
              >
                {newService.image ? (
                  <img
                    src={newService.image}
                    alt="aperçu"
                    className="object-contain max-h-20 max-w-full"
                  />
                ) : (
                  <span className="text-gray-400 text-xs">
                    Glisser une image ou cliquer pour parcourir
                  </span>
                )}
                <input
                  id="service-image-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file)
                      fileToBase64(file, (b64) =>
                        setNewService((s) => ({ ...s, image: b64 }))
                      );
                  }}
                />
              </div>
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
                value={editService.categoryId}
                onChange={(e) =>
                  setEditService((s) => ({
                    ...s,
                    categoryId: e.target.value,
                    subcategoryId: "",
                  }))
                }
                required
              >
                <option value="">Sélectionner</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
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
                value={editService.subcategoryId}
                onChange={(e) =>
                  setEditService((s) => ({
                    ...s,
                    subcategoryId: e.target.value,
                  }))
                }
                required
                disabled={!editService.categoryId}
              >
                <option value="">Sélectionner</option>
                {categories
                  .find((cat) => cat.id === Number(editService.categoryId))
                  ?.subcategories.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
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
                value={editService.name}
                onChange={(e) =>
                  setEditService((s) => ({ ...s, name: e.target.value }))
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
                value={editService.shortDesc}
                onChange={(e) =>
                  setEditService((s) => ({
                    ...s,
                    shortDesc: e.target.value,
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
                value={editService.longDesc}
                onChange={(e) =>
                  setEditService((s) => ({
                    ...s,
                    longDesc: e.target.value,
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
                  value={editService.price.replace("€", "")}
                  onChange={(e) =>
                    setEditService((s) => ({
                      ...s,
                      price: e.target.value ? e.target.value : "",
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
                Durée
              </label>
              <div className="flex gap-2">
                <select
                  className="border border-gray-200 rounded px-2 py-1 text-sm"
                  value={getDurationParts(editService.duration).h}
                  onChange={(e) => {
                    const m = getDurationParts(editService.duration).m || "00";
                    setEditService((s) => ({
                      ...s,
                      duration: `${e.target.value}:${m}`,
                    }));
                  }}
                >
                  <option value="">h</option>
                  {hoursOptions.map((h) => (
                    <option key={h} value={h}>
                      {h} h
                    </option>
                  ))}
                </select>
                <select
                  className="border border-gray-200 rounded px-2 py-1 text-sm"
                  value={getDurationParts(editService.duration).m}
                  onChange={(e) => {
                    const h = getDurationParts(editService.duration).h || "0";
                    setEditService((s) => ({
                      ...s,
                      duration: `${h}:${e.target.value}`,
                    }));
                  }}
                >
                  <option value="">min</option>
                  {minutesOptions.map((m) => (
                    <option key={m} value={m}>
                      {m.toString().padStart(2, "0")} min
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-3">
              <label className="block text-xs font-light text-gray-700 mb-1">
                Image
              </label>
              <div
                className="w-full h-24 border border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer bg-gray-50 mb-2 relative"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const file = e.dataTransfer.files[0];
                  if (file)
                    fileToBase64(file, (b64) =>
                      setEditService((s) => ({ ...s, image: b64 }))
                    );
                }}
                onClick={() =>
                  document.getElementById("editservice-image-input").click()
                }
              >
                {editService.image ? (
                  <img
                    src={editService.image}
                    alt="aperçu"
                    className="object-contain max-h-20 max-w-full"
                  />
                ) : (
                  <span className="text-gray-400 text-xs">
                    Glisser une image ou cliquer pour parcourir
                  </span>
                )}
                <input
                  id="editservice-image-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file)
                      fileToBase64(file, (b64) =>
                        setEditService((s) => ({ ...s, image: b64 }))
                      );
                  }}
                />
              </div>
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
