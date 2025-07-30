"use client";

import { useState } from "react";
import { Pencil, Trash } from "lucide-react";

export default function NewsletterSection() {
  // Données mock pour les newsletters
  const [newsletters, setNewsletters] = useState([
    {
      id: 1,
      title: "Promo Été",
      subtitle: "Jusqu'à -30% sur les soins visage",
      cta: "Profiter de l'offre",
      ctaUrl: "https://center-beauty.com/ete",
      image: "",
      text: `Découvrez nos offres estivales pour une peau éclatante.

Profitez de nos soins experts pour le visage et le corps, adaptés à tous les types de peau. Nos esthéticiennes vous accompagnent pour révéler votre beauté naturelle tout au long de l'été.

Bénéficiez de conseils personnalisés, de produits haut de gamme et d'une expérience bien-être unique dans notre institut. Réservez dès maintenant pour ne pas manquer nos offres exceptionnelles et laissez-vous chouchouter par notre équipe passionnée.

À très vite chez DidaSkin !`,
      status: "draft", // 'draft' ou 'sent'
      sentAt: null,
    },
  ]);
  const [showAddNewsletter, setShowAddNewsletter] = useState(false);
  const [newNewsletter, setNewNewsletter] = useState({
    title: "",
    subtitle: "",
    cta: "",
    ctaUrl: "",
    image: "",
    text: "",
    status: "draft",
    sentAt: null,
  });
  const [editNewsletterId, setEditNewsletterId] = useState(null);
  const [editNewsletter, setEditNewsletter] = useState({
    title: "",
    subtitle: "",
    cta: "",
    ctaUrl: "",
    image: "",
    text: "",
    status: "draft",
    sentAt: null,
  });
  const [previewNewsletter, setPreviewNewsletter] = useState(null);

  // Ajout d'un utilitaire pour convertir un fichier en base64
  function fileToBase64(file, cb) {
    const reader = new FileReader();
    reader.onload = function (e) {
      cb(e.target.result);
    };
    reader.readAsDataURL(file);
  }

  // Ajout, édition, suppression newsletters
  const handleAddNewsletter = (e, send = false) => {
    e.preventDefault();
    if (
      !newNewsletter.title ||
      !newNewsletter.cta ||
      !newNewsletter.ctaUrl ||
      !newNewsletter.text
    )
      return;
    setNewsletters((prev) => [
      ...prev,
      {
        ...newNewsletter,
        status: send ? "sent" : "draft",
        sentAt: send ? new Date().toLocaleString("fr-FR") : null,
        id: prev.length ? Math.max(...prev.map((n) => n.id)) + 1 : 1,
      },
    ]);
    setNewNewsletter({
      title: "",
      subtitle: "",
      cta: "",
      ctaUrl: "",
      image: "",
      text: "",
      status: "draft",
      sentAt: null,
    });
    setShowAddNewsletter(false);
  };

  const handleEditNewsletterClick = (n) => {
    setEditNewsletterId(n.id);
    setEditNewsletter({ ...n });
  };

  const handleEditNewsletter = (e, send = false) => {
    e.preventDefault();
    setNewsletters((prev) =>
      prev.map((n) =>
        n.id === editNewsletterId
          ? {
              ...editNewsletter,
              status: send ? "sent" : "draft",
              sentAt: send ? new Date().toLocaleString("fr-FR") : n.sentAt,
              id: editNewsletterId,
            }
          : n
      )
    );
    setEditNewsletterId(null);
    setEditNewsletter({
      title: "",
      subtitle: "",
      cta: "",
      ctaUrl: "",
      image: "",
      text: "",
      status: "draft",
      sentAt: null,
    });
  };

  const handleDeleteNewsletter = (id) => {
    setNewsletters((prev) => prev.filter((n) => n.id !== id));
  };

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
            {newsletters.map((n) => (
              <tr key={n.id}>
                <td className="px-4 py-2 whitespace-nowrap">{n.title}</td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      n.status === "sent"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {n.status === "sent" ? "Envoyée" : "Brouillon"}
                  </span>
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {n.sentAt || "-"}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPreviewNewsletter(n)}
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
            ))}
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
                value={newNewsletter.title}
                onChange={(e) =>
                  setNewNewsletter((n) => ({
                    ...n,
                    title: e.target.value,
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
                value={newNewsletter.subtitle}
                onChange={(e) =>
                  setNewNewsletter((n) => ({
                    ...n,
                    subtitle: e.target.value,
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
                value={newNewsletter.cta}
                onChange={(e) =>
                  setNewNewsletter((n) => ({
                    ...n,
                    cta: e.target.value,
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
                value={newNewsletter.ctaUrl}
                onChange={(e) =>
                  setNewNewsletter((n) => ({
                    ...n,
                    ctaUrl: e.target.value,
                  }))
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
                      setNewNewsletter((n) => ({ ...n, image: b64 }))
                    );
                }}
                onClick={() =>
                  document.getElementById("newsletter-image-input").click()
                }
              >
                {newNewsletter.image ? (
                  <img
                    src={newNewsletter.image}
                    alt="aperçu"
                    className="object-contain max-h-20 max-w-full"
                  />
                ) : (
                  <span className="text-gray-400 text-xs">
                    Glisser une image ou cliquer pour parcourir
                  </span>
                )}
                <input
                  id="newsletter-image-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file)
                      fileToBase64(file, (b64) =>
                        setNewNewsletter((n) => ({ ...n, image: b64 }))
                      );
                  }}
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="block text-xs font-light text-gray-700 mb-1">
                Texte
              </label>
              <textarea
                className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
                value={newNewsletter.text}
                onChange={(e) =>
                  setNewNewsletter((n) => ({
                    ...n,
                    text: e.target.value,
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
                className="flex-1 py-1 px-2 border border-gray-300 rounded text-gray-700 text-sm font-light hover:bg-gray-100 transition"
              >
                Preview
              </button>
              <button
                type="submit"
                className="flex-1 py-1 px-2 border border-gray-300 rounded text-gray-700 text-sm font-light hover:bg-gray-100 transition"
              >
                Enregistrer comme brouillon
              </button>
              <button
                type="button"
                onClick={(e) => handleAddNewsletter(e, true)}
                className="flex-1 py-1 px-2 border border-[#D4A574] bg-[#D4A574] text-white text-sm font-light hover:bg-[#b88b5c] transition"
              >
                Envoyer
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
                value={editNewsletter.title}
                onChange={(e) =>
                  setEditNewsletter((n) => ({
                    ...n,
                    title: e.target.value,
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
                value={editNewsletter.subtitle}
                onChange={(e) =>
                  setEditNewsletter((n) => ({
                    ...n,
                    subtitle: e.target.value,
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
                value={editNewsletter.cta}
                onChange={(e) =>
                  setEditNewsletter((n) => ({
                    ...n,
                    cta: e.target.value,
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
                value={editNewsletter.ctaUrl}
                onChange={(e) =>
                  setEditNewsletter((n) => ({
                    ...n,
                    ctaUrl: e.target.value,
                  }))
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
                      setEditNewsletter((n) => ({ ...n, image: b64 }))
                    );
                }}
                onClick={() =>
                  document.getElementById("editnewsletter-image-input").click()
                }
              >
                {editNewsletter.image ? (
                  <img
                    src={editNewsletter.image}
                    alt="aperçu"
                    className="object-contain max-h-20 max-w-full"
                  />
                ) : (
                  <span className="text-gray-400 text-xs">
                    Glisser une image ou cliquer pour parcourir
                  </span>
                )}
                <input
                  id="editnewsletter-image-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file)
                      fileToBase64(file, (b64) =>
                        setEditNewsletter((n) => ({ ...n, image: b64 }))
                      );
                  }}
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="block text-xs font-light text-gray-700 mb-1">
                Texte
              </label>
              <textarea
                className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
                value={editNewsletter.text}
                onChange={(e) =>
                  setEditNewsletter((n) => ({
                    ...n,
                    text: e.target.value,
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
                className="flex-1 py-1 px-2 border border-gray-300 rounded text-gray-700 text-sm font-light hover:bg-gray-100 transition"
              >
                Preview
              </button>
              <button
                type="submit"
                className="flex-1 py-1 px-2 border border-gray-300 rounded text-gray-700 text-sm font-light hover:bg-gray-100 transition"
              >
                Enregistrer comme brouillon
              </button>
              <button
                type="button"
                onClick={(e) => handleEditNewsletter(e, true)}
                className="flex-1 py-1 px-2 border border-[#D4A574] bg-[#D4A574] text-white text-sm font-light hover:bg-[#b88b5c] transition"
              >
                Envoyer
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
