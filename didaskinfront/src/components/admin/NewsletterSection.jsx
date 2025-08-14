"use client";

import { useState, useEffect } from "react";
import { Pencil, Trash } from "lucide-react";
import ImageUpload from "../ui/ImageUpload";

export default function NewsletterSection() {
  // Configuration de l'API
  const API_BASE_URL = "http://localhost:8000";

  // État des newsletters
  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sendingNewsletter, setSendingNewsletter] = useState(false);
  const [showAddNewsletter, setShowAddNewsletter] = useState(false);
  const [newNewsletter, setNewNewsletter] = useState({
    label: "",
    shortDescription: "",
    actionCall: "",
    url: "",
    image_link: "",
    content: "",
    status: 0, // 0 = draft, 1 = published
  });
  const [editNewsletterId, setEditNewsletterId] = useState(null);
  const [editNewsletter, setEditNewsletter] = useState({
    label: "",
    shortDescription: "",
    actionCall: "",
    url: "",
    image_link: "",
    content: "",
    status: 0, // 0 = draft, 1 = published
  });
  const [previewNewsletter, setPreviewNewsletter] = useState(null);

  // Récupérer toutes les newsletters
  const fetchNewsletters = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/newsletters/newsletter`);
      const result = await response.json();

      if (result.success) {
        setNewsletters(result.data);
      } else {
        setError("Erreur lors de la récupération des newsletters");
      }
    } catch (error) {
      setError("Erreur de connexion au serveur");
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  // Charger les newsletters au montage du composant
  useEffect(() => {
    fetchNewsletters();
  }, []);

  // Ajouter une nouvelle newsletter
  const handleAddNewsletter = async (e, send = false) => {
    e.preventDefault();
    if (
      !newNewsletter.label ||
      !newNewsletter.actionCall ||
      !newNewsletter.url ||
      !newNewsletter.content
    )
      return;

    // Si on envoie la newsletter, activer le chargement
    if (send) {
      setSendingNewsletter(true);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/newsletters/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          label: newNewsletter.label,
          shortDescription: newNewsletter.shortDescription,
          actionCall: newNewsletter.actionCall,
          url: newNewsletter.url,
          image_link: newNewsletter.image_link,
          content: newNewsletter.content,
          status: send ? 1 : 0, // 1 = published, 0 = draft
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Recharger la liste des newsletters
        await fetchNewsletters();

        // Réinitialiser le formulaire
        setNewNewsletter({
          label: "",
          shortDescription: "",
          actionCall: "",
          url: "",
          image_link: "",
          content: "",
          status: 0,
        });
        setShowAddNewsletter(false);
      } else {
        setError(result.error || "Erreur lors de l'ajout de la newsletter");
      }
    } catch (error) {
      setError("Erreur de connexion au serveur");
      console.error("Erreur:", error);
    } finally {
      // Toujours désactiver le chargement
      setSendingNewsletter(false);
    }
  };

  const handleEditNewsletterClick = (n) => {
    setEditNewsletterId(n.id);
    setEditNewsletter({
      label: n.label || "",
      shortDescription: n.shortDescription || "",
      actionCall: n.actionCall || "",
      url: n.url || "",
      image_link: n.image_link || "",
      content: n.content || "",
      status: n.status || 0,
    });
  };

  const handleEditNewsletter = async (e, send = false) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${API_BASE_URL}/newsletters/${editNewsletterId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            label: editNewsletter.label,
            shortDescription: editNewsletter.shortDescription,
            actionCall: editNewsletter.actionCall,
            url: editNewsletter.url,
            image_link: editNewsletter.image_link,
            content: editNewsletter.content,
            status: send ? 1 : 0, // 1 = published, 0 = draft
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        // Recharger la liste des newsletters
        await fetchNewsletters();

        // Fermer le modal d'édition
        setEditNewsletterId(null);
        setEditNewsletter({
          label: "",
          shortDescription: "",
          actionCall: "",
          url: "",
          image_link: "",
          content: "",
          status: 0,
        });
      } else {
        setError(
          result.error || "Erreur lors de la modification de la newsletter"
        );
      }
    } catch (error) {
      setError("Erreur de connexion au serveur");
      console.error("Erreur:", error);
    }
  };

  const handleDeleteNewsletter = async (id) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette newsletter ?")) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/newsletters/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        // Recharger la liste des newsletters
        await fetchNewsletters();
      } else {
        setError(
          result.error || "Erreur lors de la suppression de la newsletter"
        );
      }
    } catch (error) {
      setError("Erreur de connexion au serveur");
      console.error("Erreur:", error);
    }
  };

  // Cloudinary upload options for newsletters
  const getUploadOptions = (type, id = null) => ({
    folder:
      type === "newsletters" ? "didaskin/newsletters" : `didaskin/${type}`,
    public_id: id ? `${type}_${id}_${Date.now()}` : undefined, // Ajouter timestamp pour URL unique
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center justify-between">
        Newsletters
        <button
          onClick={() => setShowAddNewsletter(true)}
          className="ml-4 flex items-center justify-center w-8 h-8 rounded-full bg-[#D4A574] text-white text-2xl hover:bg-[#b88b5c] transition shadow-sm"
          title="Créer une newsletter"
        >
          +
        </button>
      </h2>

      {/* Affichage des erreurs */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Affichage du chargement */}
      {loading && (
        <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
          Chargement des newsletters...
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Titre
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Statut
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Date d'envoi
              </th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {newsletters.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                  {loading ? "Chargement..." : "Aucune newsletter trouvée"}
                </td>
              </tr>
            ) : (
              newsletters.map((n) => (
                <tr key={n.id}>
                  <td className="px-4 py-2 whitespace-nowrap">{n.label}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        n.status === 1
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {n.status === 1 ? "Publiée" : "Brouillon"}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {n.status === 1 ? "Publiée" : "Non publiée"}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setPreviewNewsletter({
                            title: n.label,
                            subtitle: n.shortDescription,
                            cta: n.actionCall,
                            ctaUrl: n.url,
                            image: n.image_link,
                            text: n.content,
                            status: n.status === 1 ? "sent" : "draft",
                          })
                        }
                        className="p-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                        title="Prévisualiser"
                      >
                        <span className="text-xs font-medium">Preview</span>
                      </button>
                      <button
                        onClick={() => handleEditNewsletterClick(n)}
                        className="p-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
                        title="Éditer"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteNewsletter(n.id)}
                        className="p-2 rounded bg-red-500 text-white hover:bg-red-600 transition"
                        title="Supprimer"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Ajouter Newsletter */}
      {showAddNewsletter && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50">
          <form
            onSubmit={(e) => handleAddNewsletter(e, false)}
            className="bg-white rounded border border-gray-200 p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto"
          >
            <button
              type="button"
              onClick={() => setShowAddNewsletter(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
            >
              ×
            </button>
            <h3 className="text-lg font-light mb-3 text-gray-900">
              Créer une newsletter
            </h3>
            <div className="mb-2">
              <label className="block text-xs font-light text-gray-700 mb-1">
                Titre
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
                value={newNewsletter.label}
                onChange={(e) =>
                  setNewNewsletter((n) => ({
                    ...n,
                    label: e.target.value,
                  }))
                }
                required
              />
            </div>
            <div className="mb-2">
              <label className="block text-xs font-light text-gray-700 mb-1">
                Sous-titre
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
                value={newNewsletter.shortDescription}
                onChange={(e) =>
                  setNewNewsletter((n) => ({
                    ...n,
                    shortDescription: e.target.value,
                  }))
                }
              />
            </div>
            <div className="mb-2">
              <label className="block text-xs font-light text-gray-700 mb-1">
                Bouton appel à action
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
                value={newNewsletter.actionCall}
                onChange={(e) =>
                  setNewNewsletter((n) => ({
                    ...n,
                    actionCall: e.target.value,
                  }))
                }
                required
              />
            </div>
            <div className="mb-2">
              <label className="block text-xs font-light text-gray-700 mb-1">
                URL du bouton
              </label>
              <input
                type="url"
                className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
                value={newNewsletter.url}
                onChange={(e) =>
                  setNewNewsletter((n) => ({
                    ...n,
                    url: e.target.value,
                  }))
                }
                required
              />
            </div>
            <div className="mb-3">
              <label className="block text-xs font-light text-gray-700 mb-1">
                Image
              </label>
              <ImageUpload
                value={newNewsletter.image_link}
                onChange={(imageUrl) =>
                  setNewNewsletter((n) => ({ ...n, image_link: imageUrl }))
                }
                placeholder="Upload newsletter image"
                uploadOptions={getUploadOptions("newsletters")}
                maxSize={5}
                className="mb-2"
              />
            </div>
            <div className="mb-3">
              <label className="block text-xs font-light text-gray-700 mb-1">
                Contenu
              </label>
              <textarea
                className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
                value={newNewsletter.content}
                onChange={(e) =>
                  setNewNewsletter((n) => ({
                    ...n,
                    content: e.target.value,
                  }))
                }
                rows={4}
                required
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button
                type="button"
                onClick={() => setPreviewNewsletter(newNewsletter)}
                disabled={sendingNewsletter}
                className={`flex-1 py-1 px-2 border border-gray-300 rounded text-gray-700 text-sm font-light transition ${
                  sendingNewsletter
                    ? "bg-gray-200 cursor-not-allowed"
                    : "hover:bg-gray-100"
                }`}
              >
                Preview
              </button>
              <button
                type="submit"
                disabled={sendingNewsletter}
                className={`flex-1 py-1 px-2 border border-gray-300 rounded text-gray-700 text-sm font-light transition ${
                  sendingNewsletter
                    ? "bg-gray-200 cursor-not-allowed"
                    : "hover:bg-gray-100"
                }`}
              >
                {sendingNewsletter
                  ? "Enregistrement..."
                  : "Enregistrer comme brouillon"}
              </button>
              <button
                type="button"
                onClick={(e) => handleAddNewsletter(e, true)}
                disabled={sendingNewsletter}
                className={`flex-1 py-1 px-2 border border-[#D4A574] text-white text-sm font-light transition ${
                  sendingNewsletter
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#D4A574] hover:bg-[#b88b5c]"
                }`}
              >
                {sendingNewsletter ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Envoi en cours...
                  </div>
                ) : (
                  "Envoyer"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Éditer Newsletter */}
      {editNewsletterId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50">
          <form
            onSubmit={(e) => handleEditNewsletter(e, false)}
            className="bg-white rounded border border-gray-200 p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto"
          >
            <button
              type="button"
              onClick={() => setEditNewsletterId(null)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
            >
              ×
            </button>
            <h3 className="text-lg font-light mb-3 text-gray-900">
              Modifier la newsletter
            </h3>
            <div className="mb-2">
              <label className="block text-xs font-light text-gray-700 mb-1">
                Titre
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
                value={editNewsletter.label}
                onChange={(e) =>
                  setEditNewsletter((n) => ({
                    ...n,
                    label: e.target.value,
                  }))
                }
                required
              />
            </div>
            <div className="mb-2">
              <label className="block text-xs font-light text-gray-700 mb-1">
                Sous-titre
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
                value={editNewsletter.shortDescription}
                onChange={(e) =>
                  setEditNewsletter((n) => ({
                    ...n,
                    shortDescription: e.target.value,
                  }))
                }
              />
            </div>
            <div className="mb-2">
              <label className="block text-xs font-light text-gray-700 mb-1">
                Bouton appel à action
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
                value={editNewsletter.actionCall}
                onChange={(e) =>
                  setEditNewsletter((n) => ({
                    ...n,
                    actionCall: e.target.value,
                  }))
                }
                required
              />
            </div>
            <div className="mb-2">
              <label className="block text-xs font-light text-gray-700 mb-1">
                URL du bouton
              </label>
              <input
                type="url"
                className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
                value={editNewsletter.url}
                onChange={(e) =>
                  setEditNewsletter((n) => ({
                    ...n,
                    url: e.target.value,
                  }))
                }
                required
              />
            </div>
            <div className="mb-3">
              <label className="block text-xs font-light text-gray-700 mb-1">
                Image
              </label>
              <ImageUpload
                value={editNewsletter.image_link}
                onChange={(imageUrl) =>
                  setEditNewsletter((n) => ({ ...n, image_link: imageUrl }))
                }
                placeholder="Upload newsletter image"
                uploadOptions={getUploadOptions(
                  "newsletters",
                  editNewsletterId
                )}
                maxSize={5}
                className="mb-2"
              />
            </div>
            <div className="mb-3">
              <label className="block text-xs font-light text-gray-700 mb-1">
                Contenu
              </label>
              <textarea
                className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
                value={editNewsletter.content}
                onChange={(e) =>
                  setEditNewsletter((n) => ({
                    ...n,
                    content: e.target.value,
                  }))
                }
                rows={4}
                required
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button
                type="button"
                onClick={() => setPreviewNewsletter(editNewsletter)}
                disabled={sendingNewsletter}
                className={`flex-1 py-1 px-2 border border-gray-300 rounded text-gray-700 text-sm font-light transition ${
                  sendingNewsletter
                    ? "bg-gray-200 cursor-not-allowed"
                    : "hover:bg-gray-100"
                }`}
              >
                Preview
              </button>
              <button
                type="submit"
                disabled={sendingNewsletter}
                className={`flex-1 py-1 px-2 border border-gray-300 rounded text-gray-700 text-sm font-light transition ${
                  sendingNewsletter
                    ? "bg-gray-200 cursor-not-allowed"
                    : "hover:bg-gray-100"
                }`}
              >
                {sendingNewsletter
                  ? "Enregistrement..."
                  : "Enregistrer comme brouillon"}
              </button>
              <button
                type="button"
                onClick={(e) => handleEditNewsletter(e, true)}
                disabled={sendingNewsletter}
                className={`flex-1 py-1 px-2 border border-[#D4A574] text-white text-sm font-light transition ${
                  sendingNewsletter
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#D4A574] hover:bg-[#b88b5c]"
                }`}
              >
                {sendingNewsletter ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Envoi en cours...
                  </div>
                ) : (
                  "Envoyer"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Preview Newsletter */}
      {previewNewsletter && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded border border-gray-200 p-12 w-full max-w-2xl relative shadow-lg max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setPreviewNewsletter(null)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
            >
              ×
            </button>
            <div className="flex flex-col items-center">
              {/* Logo en haut */}
              <img
                src="/placeholder-logo.png"
                alt="DidaSkin logo"
                className="h-12 mb-6"
                style={{ objectFit: "contain" }}
              />
              {/* Bloc principal : texte et image côte à côte, texte collé à l'image */}
              <div className="flex w-full items-stretch justify-between mb-0">
                <div className="flex-1 flex flex-col justify-center h-full pr-0">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    {previewNewsletter.title}
                  </h2>
                  {previewNewsletter.subtitle && (
                    <h3 className="text-base text-gray-500 mb-4 font-normal">
                      {previewNewsletter.subtitle}
                    </h3>
                  )}
                  <a
                    href={previewNewsletter.ctaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-fit inline-block px-6 py-2 rounded bg-[#D4A574] text-white font-medium hover:bg-[#b88b5c] transition mb-2"
                  >
                    {previewNewsletter.cta}
                  </a>
                </div>
                {previewNewsletter.image && (
                  <img
                    src={previewNewsletter.image}
                    alt="aperçu"
                    className="w-52 h-72 object-cover rounded shadow-sm ml-0 self-stretch"
                  />
                )}
              </div>
              {/* Texte principal SOUS le bloc flex, sur toute la largeur */}
              <div className="w-full text-gray-700 whitespace-pre-line text-left mb-6 mt-8">
                {previewNewsletter.text}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
