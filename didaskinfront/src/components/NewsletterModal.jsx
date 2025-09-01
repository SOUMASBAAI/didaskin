"use client";

import { useState } from "react";
import { X, Mail, User, Phone } from "lucide-react";
import { API_BASE_URL } from "../config/apiConfig";

export default function NewsletterModal({ isOpen, onClose, imageUrl }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const fallbackHero =
    "https://media.istockphoto.com/id/1304547222/photo/glamour-portrait-of-beautiful-woman.jpg?s=612x612&w=0&k=20&c=kiRKdJDxdqEz-lXRCqAuDzEoNsTk-_NZ-SsB2OLGM8Y=";
  const headerImage = imageUrl || fallbackHero;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isValidEmail(formData.email)) {
      setError("Veuillez entrer une adresse email valide.");
      return;
    }

    setIsSubmitting(true);

    try {
      const resp = await fetch(`${API_BASE_URL}/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phone,
        }),
      });

      const data = await resp.json();

      if (!resp.ok || !data?.success) {
        setError(data?.error || "Erreur lors de l'inscription.");
      } else {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          setFormData({ firstName: "", lastName: "", email: "", phone: "" });
          onClose();
        }, 3000);
      }
    } catch {
      setError("Erreur de connexion au serveur.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalScroll = (e) => e.stopPropagation();

  return (
    <div
      className="fixed inset-0 bg-black/20 backdrop-blur-sm md:backdrop-blur-md flex items-center justify-center z-50 p-4"
      onWheel={handleModalScroll}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header image */}
        <div className="relative h-48 rounded-t-lg overflow-hidden flex-shrink-0">
          <img
            src={headerImage}
            alt="Dida Skin Newsletter"
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-colors bg-white bg-opacity-80 rounded-full p-2"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form / Success message */}
        <div
          className="p-8 overflow-y-auto flex-1"
          onScroll={handleModalScroll}
        >
          {!isSuccess ? (
            <>
              <h2 className="text-2xl font-light text-gray-800 mb-3 text-center">
                Soyez informé en premier
              </h2>
              <p className="text-gray-600 text-sm text-center mb-4 leading-relaxed">
                Abonnez-vous pour recevoir nos nouveautés et offres exclusives.
              </p>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {[
                  { label: "Email", name: "email", type: "email", icon: Mail },
                  { label: "Prénom", name: "firstName", type: "text", icon: User },
                  { label: "Nom", name: "lastName", type: "text", icon: User },
                  { label: "Téléphone", name: "phone", type: "tel", icon: Phone },
                ].map(({ label, name, type, icon: Icon }) => (
                  <div key={name}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      *{label}
                    </label>
                    <div className="relative">
                      <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type={type}
                        name={name}
                        value={formData[name]}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border-b border-gray-300 focus:border-[black] focus:outline-none transition-colors"
                        placeholder={`Votre ${label.toLowerCase()}`}
                      />
                    </div>
                  </div>
                ))}

                <div className="flex items-start space-x-3 pt-4">
                  <input
                    type="checkbox"
                    id="consent"
                    required
                    className="mt-1 h-4 w-4 text-[black] focus:ring-[black] border-gray-300 rounded"
                  />
                  <label
                    htmlFor="consent"
                    className="text-xs text-gray-600 leading-relaxed"
                  >
                    J'accepte de recevoir des communications personnalisées et
                    que mes données soient utilisées pour cela.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-black text-white py-4 rounded-none hover:bg-gray-900 transition-colors font-light tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Inscription en cours...
                    </span>
                  ) : (
                    "S'abonner"
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-light text-gray-800 mb-2">
                Inscription réussie !
              </h3>
              <p className="text-gray-600 text-sm">
                Merci de vous être inscrit(e) à notre newsletter.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
