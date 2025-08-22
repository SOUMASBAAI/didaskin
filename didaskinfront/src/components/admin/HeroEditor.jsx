"use client";

import { useState, useEffect } from "react";
import ImageUpload from "../ui/ImageUpload";
import { useAuth } from "../../hooks/useAuth";

export default function HeroEditor({ onClose }) {
  const { getAuthHeaders, handleApiResponse } = useAuth();
  const [form, setForm] = useState({
    title: "",
    description: "",
    cta: "",
    image: "",
  });
  const [saving, setSaving] = useState(false);
  const API = "http://localhost:8000/site-content/hero";

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(API);
        if (r.ok) {
          const j = await r.json();
          if (j?.success && j?.data) setForm(j.data);
        }
      } catch {}
    })();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const r = await fetch(API, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(form),
      });
      await handleApiResponse(r);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <form
        onSubmit={submit}
        className="bg-white rounded border border-gray-200 p-6 w-full max-w-lg relative"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
        >
          ×
        </button>
        <h3 className="text-lg font-light mb-3 text-gray-900">
          Modifier le contenu d'accueil
        </h3>
        <div className="mb-3">
          <label className="block text-xs font-light text-gray-700 mb-1">
            Titre
          </label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
          />
        </div>
        <div className="mb-3">
          <label className="block text-xs font-light text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
            rows={3}
          />
        </div>
        <div className="mb-3">
          <label className="block text-xs font-light text-gray-700 mb-1">
            Texte du bouton
          </label>
          <input
            value={form.cta}
            onChange={(e) => setForm({ ...form, cta: e.target.value })}
            className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-xs font-light text-gray-700 mb-1">
            Image
          </label>
          <ImageUpload
            value={form.image}
            onChange={(url) => setForm({ ...form, image: url })}
            placeholder="Upload hero image"
            maxSize={5}
            className="mb-2"
          />
        </div>
        <button
          disabled={saving}
          className="w-full py-1 px-2 border border-gray-300 rounded text-gray-700 text-sm font-light hover:bg-gray-100 transition"
        >
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
      </form>
    </div>
  );
}
