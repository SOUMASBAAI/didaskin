"use client";

import { useState } from "react";
import { Pencil, Trash } from "lucide-react";

export default function ProductsSection() {
  // Données mock pour les produits
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Crème Hydratante",
      categoryId: 1,
      subcategoryId: 1,
      shortDesc: "Hydrate la peau",
      longDesc: "Crème riche pour une hydratation intense.",
      additionalDetails:
        "Notre crème hydratante révolutionnaire est le fruit de plusieurs années de recherche en dermatologie et cosmétologie. Formulée avec des ingrédients d'origine naturelle et des actifs de pointe, cette crème offre une hydratation exceptionnelle qui dure jusqu'à 24 heures. La formule exclusive combine l'efficacité prouvée de l'acide hyaluronique à faible et haute molécularité pour une hydratation multi-niveaux, les propriétés réparatrices du céramide NP pour renforcer la barrière cutanée, et les antioxydants naturels de l'extrait de thé vert pour protéger contre les radicaux libres. La texture onctueuse et non grasse pénètre rapidement sans laisser de film gras, laissant la peau douce, souple et éclatante. Testée dermatologiquement et hypoallergénique, cette crème convient à tous les types de peau, y compris les plus sensibles. Elle peut être utilisée matin et soir, seule ou sous maquillage, et s'intègre parfaitement dans toutes les routines de soin.",
      image: "",
      price: "29.90",
    },
  ]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    categoryId: "",
    subcategoryId: "",
    shortDesc: "",
    longDesc: "",
    additionalDetails: "",
    image: "",
    price: "",
  });
  const [editProductId, setEditProductId] = useState(null);
  const [editProduct, setEditProduct] = useState({
    name: "",
    categoryId: "",
    subcategoryId: "",
    shortDesc: "",
    longDesc: "",
    additionalDetails: "",
    image: "",
    price: "",
  });

  // Drag & drop produits
  const [draggedProductIndex, setDraggedProductIndex] = useState(null);
  const handleProductDragStart = (index) => setDraggedProductIndex(index);
  const handleProductDragOver = (e) => {
    e.preventDefault();
  };
  const handleProductDrop = (index) => {
    if (draggedProductIndex === null || draggedProductIndex === index) return;
    setProducts((prev) => {
      const arr = [...prev];
      const [removed] = arr.splice(draggedProductIndex, 1);
      arr.splice(index, 0, removed);
      return arr;
    });
    setDraggedProductIndex(null);
  };

  // Ajout d'un utilitaire pour convertir un fichier en base64
  function fileToBase64(file, cb) {
    const reader = new FileReader();
    reader.onload = function (e) {
      cb(e.target.result);
    };
    reader.readAsDataURL(file);
  }

  // Ajout, édition, suppression produits
  const handleAddProduct = (e) => {
    e.preventDefault();
    if (
      !newProduct.name ||
      !newProduct.categoryId ||
      !newProduct.subcategoryId ||
      !newProduct.price
    )
      return;
    setProducts((prev) => [
      ...prev,
      {
        ...newProduct,
        id: prev.length ? Math.max(...prev.map((p) => p.id)) + 1 : 1,
      },
    ]);
    setNewProduct({
      name: "",
      categoryId: "",
      subcategoryId: "",
      shortDesc: "",
      longDesc: "",
      additionalDetails: "",
      image: "",
      price: "",
    });
    setShowAddProduct(false);
  };

  const handleEditProductClick = (product) => {
    setEditProductId(product.id);
    setEditProduct({ ...product });
  };

  const handleEditProduct = (e) => {
    e.preventDefault();
    setProducts((prev) =>
      prev.map((p) =>
        p.id === editProductId ? { ...editProduct, id: editProductId } : p
      )
    );
    setEditProductId(null);
    setEditProduct({
      name: "",
      categoryId: "",
      subcategoryId: "",
      shortDesc: "",
      longDesc: "",
      additionalDetails: "",
      image: "",
      price: "",
    });
  };

  const handleDeleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center justify-between">
        Produits
        <button
          onClick={() => setShowAddProduct(true)}
          className="ml-4 flex items-center justify-center w-8 h-8 rounded-full bg-[#D4A574] text-white text-2xl hover:bg-[#b88b5c] transition shadow-sm"
          title="Ajouter un produit"
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
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {products.map((product, idx) => (
              <tr
                key={product.id}
                draggable
                onDragStart={() => handleProductDragStart(idx)}
                onDragOver={handleProductDragOver}
                onDrop={() => handleProductDrop(idx)}
                onDragEnd={() => setDraggedProductIndex(null)}
                className={
                  draggedProductIndex === idx
                    ? "ring-2 ring-[#D4A574] bg-[#f9f6f3]"
                    : ""
                }
                style={{ cursor: "grab" }}
              >
                <td className="px-4 py-2 whitespace-nowrap">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <span className="text-gray-300">—</span>
                  )}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">{product.name}</td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {product.price ? product.price + " €" : ""}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditProductClick(product)}
                      className="p-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
                      title="Éditer"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="p-2 rounded bg-red-500 text-white hover:bg-red-600 transition"
                      title="Supprimer"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Ajouter Produit */}
      {showAddProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50">
          <form
            onSubmit={handleAddProduct}
            className="bg-white rounded border border-gray-200 p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto"
          >
            <button
              type="button"
              onClick={() => setShowAddProduct(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
            >
              ×
            </button>
            <h3 className="text-lg font-light mb-3 text-gray-900">
              Ajouter un produit
            </h3>
            <div className="mb-2">
              <label className="block text-xs font-light text-gray-700 mb-1">
                Nom du produit
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct((p) => ({ ...p, name: e.target.value }))
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
                value={newProduct.shortDesc}
                onChange={(e) =>
                  setNewProduct((p) => ({
                    ...p,
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
                value={newProduct.longDesc}
                onChange={(e) =>
                  setNewProduct((p) => ({
                    ...p,
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
                value={newProduct.additionalDetails}
                onChange={(e) =>
                  setNewProduct((p) => ({
                    ...p,
                    additionalDetails: e.target.value,
                  }))
                }
                rows={3}
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
                      setNewProduct((p) => ({ ...p, image: b64 }))
                    );
                }}
                onClick={() =>
                  document.getElementById("product-image-input").click()
                }
              >
                {newProduct.image ? (
                  <img
                    src={newProduct.image}
                    alt="aperçu"
                    className="object-contain max-h-20 max-w-full"
                  />
                ) : (
                  <span className="text-gray-400 text-xs">
                    Glisser une image ou cliquer pour parcourir
                  </span>
                )}
                <input
                  id="product-image-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file)
                      fileToBase64(file, (b64) =>
                        setNewProduct((p) => ({ ...p, image: b64 }))
                      );
                  }}
                />
              </div>
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
                  value={newProduct.price.replace("€", "")}
                  onChange={(e) =>
                    setNewProduct((p) => ({
                      ...p,
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
            <button
              type="submit"
              className="w-full py-1 px-2 border border-gray-300 rounded text-gray-700 text-sm font-light hover:bg-gray-100 transition"
            >
              Ajouter
            </button>
          </form>
        </div>
      )}

      {/* Modal Éditer Produit */}
      {editProductId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50">
          <form
            onSubmit={handleEditProduct}
            className="bg-white rounded border border-gray-200 p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto"
          >
            <button
              type="button"
              onClick={() => setEditProductId(null)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
            >
              ×
            </button>
            <h3 className="text-lg font-light mb-3 text-gray-900">
              Modifier le produit
            </h3>
            <div className="mb-2">
              <label className="block text-xs font-light text-gray-700 mb-1">
                Nom du produit
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
                value={editProduct.name}
                onChange={(e) =>
                  setEditProduct((p) => ({ ...p, name: e.target.value }))
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
                value={editProduct.shortDesc}
                onChange={(e) =>
                  setEditProduct((p) => ({
                    ...p,
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
                value={editProduct.longDesc}
                onChange={(e) =>
                  setEditProduct((p) => ({
                    ...p,
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
                value={editProduct.additionalDetails}
                onChange={(e) =>
                  setEditProduct((p) => ({
                    ...p,
                    additionalDetails: e.target.value,
                  }))
                }
                rows={3}
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
                      setEditProduct((p) => ({ ...p, image: b64 }))
                    );
                }}
                onClick={() =>
                  document.getElementById("editproduct-image-input").click()
                }
              >
                {editProduct.image ? (
                  <img
                    src={editProduct.image}
                    alt="aperçu"
                    className="object-contain max-h-20 max-w-full"
                  />
                ) : (
                  <span className="text-gray-400 text-xs">
                    Glisser une image ou cliquer pour parcourir
                  </span>
                )}
                <input
                  id="editproduct-image-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file)
                      fileToBase64(file, (b64) =>
                        setEditProduct((p) => ({ ...p, image: b64 }))
                      );
                  }}
                />
              </div>
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
                  value={editProduct.price.replace("€", "")}
                  onChange={(e) =>
                    setEditProduct((p) => ({
                      ...p,
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
