"use client";

import { useState, useEffect } from "react";
import { Pencil, Trash } from "lucide-react";
import ImageUpload from "../ui/ImageUpload";

export default function ProductsSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    label: "",
    shortDescription: "",
    longDescription: "",
    additionalDetails: "",
    price: "",
    rank: 0,
    image_link: "",
    stock_quantity: "",
    slug: "",
  });
  const [editProductId, setEditProductId] = useState(null);
  const [editProduct, setEditProduct] = useState({
    label: "",
    shortDescription: "",
    longDescription: "",
    additionalDetails: "",
    price: "",
    rank: 0,
    image_link: "",
    stock_quantity: "",
    slug: "",
  });

  // Configuration de l'API
  const API_BASE_URL = "http://localhost:8000";

  // Récupérer tous les produits
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/products`);
      const result = await response.json();

      if (result.success) {
        setProducts(result.data);
      } else {
        setError("Erreur lors de la récupération des produits");
      }
    } catch (error) {
      setError("Erreur de connexion au serveur");
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  // Charger les produits au montage du composant
  useEffect(() => {
    fetchProducts();
  }, []);

  // Ajouter un nouveau produit
  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!newProduct.label || !newProduct.price) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          label: newProduct.label,
          shortDescription: newProduct.shortDescription,
          longDescription: newProduct.longDescription,
          additionalDetails: newProduct.additionalDetails,
          price: parseFloat(newProduct.price),
          rank: newProduct.rank,
          image_link: newProduct.image_link,
          stock_quantity: newProduct.stock_quantity,
          slug:
            newProduct.slug ||
            newProduct.label.toLowerCase().replace(/\s+/g, "-"),
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Recharger la liste des produits
        await fetchProducts();

        // Réinitialiser le formulaire
        setNewProduct({
          label: "",
          shortDescription: "",
          longDescription: "",
          additionalDetails: "",
          price: "",
          rank: 0,
          image_link: "",
          stock_quantity: "",
          slug: "",
        });
        setShowAddProduct(false);
      } else {
        setError(result.error || "Erreur lors de l'ajout du produit");
      }
    } catch (error) {
      setError("Erreur de connexion au serveur");
    }
  };

  // Modifier un produit
  const handleEditProductClick = (product) => {
    setEditProductId(product.id);
    setEditProduct({
      label: product.label || "",
      shortDescription: product.shortDescription || "",
      longDescription: product.longDescription || "",
      additionalDetails: product.AdditionalDetails || "", // Correction: AdditionalDetails avec A majuscule
      price: product.price ? product.price.toString() : "",
      rank: product.rank || 0,
      image_link: product.image_link || product.imageLink || "",
      stock_quantity: product.stock_quantity || product.stockQuantity || "",
      slug: product.slug || "",
    });
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${API_BASE_URL}/products/${editProductId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            label: editProduct.label,
            shortDescription: editProduct.shortDescription,
            longDescription: editProduct.longDescription,
            additionalDetails: editProduct.additionalDetails,
            price: parseFloat(editProduct.price),
            rank: editProduct.rank,
            image_link: editProduct.image_link,
            stock_quantity: editProduct.stock_quantity,
            slug: editProduct.slug,
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        // Recharger la liste des produits
        await fetchProducts();

        // Fermer le modal d'édition
        setEditProductId(null);
        setEditProduct({
          label: "",
          shortDescription: "",
          longDescription: "",
          additionalDetails: "",
          price: "",
          rank: 0,
          image_link: "",
          stock_quantity: "",
          slug: "",
        });
      } else {
        setError(result.error || "Erreur lors de la modification du produit");
      }
    } catch (error) {
      setError("Erreur de connexion au serveur");
      console.error("Erreur:", error);
    }
  };

  // Supprimer un produit
  const handleDeleteProduct = async (id) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        // Recharger la liste des produits
        await fetchProducts();
      } else {
        setError(result.error || "Erreur lors de la suppression du produit");
      }
    } catch (error) {
      setError("Erreur de connexion au serveur");
      console.error("Erreur:", error);
    }
  };

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

  // Cloudinary upload options for products
  const getUploadOptions = (type, id = null) => ({
    folder: type === "products" ? "didaskin/products" : `didaskin/${type}`,
    public_id: id ? `${type}_${id}_${Date.now()}` : undefined, // Ajouter timestamp pour URL unique
  });

  // Simple image display like in CategoriesSection
  const getImageDisplay = (imageUrl, productLabel) => {
    if (!imageUrl) {
      return <span className="text-gray-300">—</span>;
    }

    return (
      <div className="relative group">
        <img
          src={imageUrl}
          alt={productLabel}
          className="w-12 h-12 object-cover rounded cursor-pointer"
        />
        {/* Hover preview */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
          <img
            src={imageUrl}
            alt={productLabel}
            className="w-32 h-32 object-cover rounded shadow-lg border-2 border-white"
          />
        </div>
      </div>
    );
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
        Produits
        <button
          onClick={() => setShowAddProduct(true)}
          className="ml-4 flex items-center justify-center w-8 h-8 rounded-full bg-[#D4A574] text-white text-2xl hover:bg-[#b88b5c] transition shadow-sm"
          title="Ajouter un produit"
        >
          +
        </button>
      </h2>

      {products.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          Aucun produit trouvé
        </div>
      ) : (
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
                    {getImageDisplay(
                      product.image_link || product.imageLink,
                      product.label
                    )}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {product.label}
                  </td>
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
      )}

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
                value={newProduct.label}
                onChange={(e) =>
                  setNewProduct((p) => ({ ...p, label: e.target.value }))
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
                value={newProduct.shortDescription}
                onChange={(e) =>
                  setNewProduct((p) => ({
                    ...p,
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
                value={newProduct.longDescription}
                onChange={(e) =>
                  setNewProduct((p) => ({
                    ...p,
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
              <ImageUpload
                value={newProduct.image_link}
                onChange={(imageUrl) =>
                  setNewProduct((p) => ({ ...p, image_link: imageUrl }))
                }
                placeholder="Upload product image"
                uploadOptions={getUploadOptions("products")}
                maxSize={5}
                className="mb-2"
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
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct((p) => ({
                      ...p,
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
                Quantité en stock
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
                value={newProduct.stock_quantity}
                onChange={(e) =>
                  setNewProduct((p) => ({
                    ...p,
                    stock_quantity: e.target.value,
                  }))
                }
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
                value={newProduct.rank}
                onChange={(e) =>
                  setNewProduct((p) => ({
                    ...p,
                    rank: parseInt(e.target.value) || 0,
                  }))
                }
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
                value={editProduct.label}
                onChange={(e) =>
                  setEditProduct((p) => ({ ...p, label: e.target.value }))
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
                value={editProduct.shortDescription}
                onChange={(e) =>
                  setEditProduct((p) => ({
                    ...p,
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
                value={editProduct.longDescription}
                onChange={(e) =>
                  setEditProduct((p) => ({
                    ...p,
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
              <ImageUpload
                value={editProduct.image_link}
                onChange={(imageUrl) =>
                  setEditProduct((p) => ({ ...p, image_link: imageUrl }))
                }
                placeholder="Upload product image"
                uploadOptions={getUploadOptions("products", editProductId)}
                maxSize={5}
                className="mb-2"
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
                  value={editProduct.price}
                  onChange={(e) =>
                    setEditProduct((p) => ({
                      ...p,
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
                Quantité en stock
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
                value={editProduct.stock_quantity}
                onChange={(e) =>
                  setEditProduct((p) => ({
                    ...p,
                    stock_quantity: e.target.value,
                  }))
                }
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
                value={editProduct.rank}
                onChange={(e) =>
                  setEditProduct((p) => ({
                    ...p,
                    rank: parseInt(e.target.value) || 0,
                  }))
                }
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
