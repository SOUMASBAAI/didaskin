"use client";

import { useState } from "react";
import { Pencil, Trash } from "lucide-react";

export default function CategoriesSection() {
  // Données mock pour les catégories
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
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", image: "" });
  const [addSubCategoryFor, setAddSubCategoryFor] = useState(null);
  const [newSubCategory, setNewSubCategory] = useState({ name: "", image: "" });
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategory, setEditCategory] = useState({ name: "", image: "" });
  const [editSubCategory, setEditSubCategory] = useState({
    catId: null,
    subId: null,
    name: "",
    image: "",
  });

  // Pour le drag & drop des catégories
  const [draggedCatIndex, setDraggedCatIndex] = useState(null);
  const handleDragStart = (index) => setDraggedCatIndex(index);
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const handleDrop = (index) => {
    if (draggedCatIndex === null || draggedCatIndex === index) return;
    setCategories((prev) => {
      const arr = [...prev];
      const [removed] = arr.splice(draggedCatIndex, 1);
      arr.splice(index, 0, removed);
      return arr;
    });
    setDraggedCatIndex(null);
  };

  // Ajout d'un utilitaire pour convertir un fichier en base64
  function fileToBase64(file, cb) {
    const reader = new FileReader();
    reader.onload = function (e) {
      cb(e.target.result);
    };
    reader.readAsDataURL(file);
  }

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategory.name) return;
    setCategories((prev) => [
      ...prev,
      {
        id: prev.length ? Math.max(...prev.map((c) => c.id)) + 1 : 1,
        name: newCategory.name,
        image: newCategory.image,
        subcategories: [],
      },
    ]);
    setNewCategory({ name: "", image: "" });
    setShowAddCategory(false);
  };

  const handleAddSubCategory = (e) => {
    e.preventDefault();
    if (!newSubCategory.name || addSubCategoryFor == null) return;
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === addSubCategoryFor
          ? {
              ...cat,
              subcategories: [
                ...cat.subcategories,
                {
                  id: cat.subcategories.length
                    ? Math.max(...cat.subcategories.map((sc) => sc.id)) + 1
                    : 1,
                  name: newSubCategory.name,
                  image: newSubCategory.image,
                },
              ],
            }
          : cat
      )
    );
    setNewSubCategory({ name: "", image: "" });
    setAddSubCategoryFor(null);
  };

  const handleEditCategoryClick = (cat) => {
    setEditCategoryId(cat.id);
    setEditCategory({ name: cat.name, image: cat.image });
  };
  const handleEditCategory = (e) => {
    e.preventDefault();
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === editCategoryId ? { ...cat, ...editCategory } : cat
      )
    );
    setEditCategoryId(null);
    setEditCategory({ name: "", image: "" });
  };
  const handleDeleteCategory = (catId) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== catId));
  };

  const handleEditSubCategoryClick = (catId, sub) => {
    setEditSubCategory({
      catId,
      subId: sub.id,
      name: sub.name,
      image: sub.image,
    });
  };
  const handleEditSubCategory = (e) => {
    e.preventDefault();
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === editSubCategory.catId
          ? {
              ...cat,
              subcategories: cat.subcategories.map((sub) =>
                sub.id === editSubCategory.subId
                  ? {
                      ...sub,
                      name: editSubCategory.name,
                      image: editSubCategory.image,
                    }
                  : sub
              ),
            }
          : cat
      )
    );
    setEditSubCategory({ catId: null, subId: null, name: "", image: "" });
  };
  const handleDeleteSubCategory = (catId, subId) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === catId
          ? {
              ...cat,
              subcategories: cat.subcategories.filter(
                (sub) => sub.id !== subId
              ),
            }
          : cat
      )
    );
  };

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
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="text-gray-300 text-xl">📁</span>
                )}
              </div>
              <span className="text-base font-light text-gray-900">
                {cat.name}
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
                        {sub.image ? (
                          <img
                            src={sub.image}
                            alt={sub.name}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <span className="text-gray-300 text-base">📂</span>
                        )}
                      </div>
                      <span className="text-xs text-gray-700 font-light">
                        {sub.name}
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
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory((c) => ({ ...c, name: e.target.value }))
                }
                required
              />
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
                      setNewCategory((c) => ({ ...c, image: b64 }))
                    );
                }}
                onClick={() =>
                  document.getElementById("cat-image-input").click()
                }
              >
                {newCategory.image ? (
                  <img
                    src={newCategory.image}
                    alt="aperçu"
                    className="object-contain max-h-20 max-w-full"
                  />
                ) : (
                  <span className="text-gray-400 text-xs">
                    Glisser une image ou cliquer pour parcourir
                  </span>
                )}
                <input
                  id="cat-image-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file)
                      fileToBase64(file, (b64) =>
                        setNewCategory((c) => ({ ...c, image: b64 }))
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
                value={newSubCategory.name}
                onChange={(e) =>
                  setNewSubCategory((c) => ({ ...c, name: e.target.value }))
                }
                required
              />
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
                      setNewSubCategory((c) => ({ ...c, image: b64 }))
                    );
                }}
                onClick={() =>
                  document.getElementById("subcat-image-input").click()
                }
              >
                {newSubCategory.image ? (
                  <img
                    src={newSubCategory.image}
                    alt="aperçu"
                    className="object-contain max-h-20 max-w-full"
                  />
                ) : (
                  <span className="text-gray-400 text-xs">
                    Glisser une image ou cliquer pour parcourir
                  </span>
                )}
                <input
                  id="subcat-image-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file)
                      fileToBase64(file, (b64) =>
                        setNewSubCategory((c) => ({ ...c, image: b64 }))
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
                value={editCategory.name}
                onChange={(e) =>
                  setEditCategory((c) => ({ ...c, name: e.target.value }))
                }
                required
              />
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
                      setEditCategory((c) => ({ ...c, image: b64 }))
                    );
                }}
                onClick={() =>
                  document.getElementById("editcat-image-input").click()
                }
              >
                {editCategory.image ? (
                  <img
                    src={editCategory.image}
                    alt="aperçu"
                    className="object-contain max-h-20 max-w-full"
                  />
                ) : (
                  <span className="text-gray-400 text-xs">
                    Glisser une image ou cliquer pour parcourir
                  </span>
                )}
                <input
                  id="editcat-image-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file)
                      fileToBase64(file, (b64) =>
                        setEditCategory((c) => ({ ...c, image: b64 }))
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
                  name: "",
                  image: "",
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
                value={editSubCategory.name}
                onChange={(e) =>
                  setEditSubCategory((c) => ({ ...c, name: e.target.value }))
                }
                required
              />
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
                      setEditSubCategory((c) => ({ ...c, image: b64 }))
                    );
                }}
                onClick={() =>
                  document.getElementById("editsubcat-image-input").click()
                }
              >
                {editSubCategory.image ? (
                  <img
                    src={editSubCategory.image}
                    alt="aperçu"
                    className="object-contain max-h-20 max-w-full"
                  />
                ) : (
                  <span className="text-gray-400 text-xs">
                    Glisser une image ou cliquer pour parcourir
                  </span>
                )}
                <input
                  id="editsubcat-image-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file)
                      fileToBase64(file, (b64) =>
                        setEditSubCategory((c) => ({ ...c, image: b64 }))
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
