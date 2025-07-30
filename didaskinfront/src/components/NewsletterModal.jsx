"use client";

import { useState } from "react";
import { X, Mail, User, Phone } from "lucide-react";

export default function NewsletterModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulation d'un appel API
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSuccess(true);
    setIsSubmitting(false);

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSuccess(false);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
      });
      onClose();
    }, 3000);
  };

  // Empêcher la propagation du scroll
  const handleModalScroll = (e) => {
    e.stopPropagation();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      onWheel={handleModalScroll}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header with Image - No logo DS */}
        <div className="relative h-48 rounded-t-lg overflow-hidden flex-shrink-0">
          {/* Background Image */}
          <img
            src="https://www.mademoisellerelax.fr/wp-content/uploads/2018/06/mademoiselle-relax-soins-visage-2.jpg"
            alt="Dida Skin Newsletter"
            className="w-full h-full object-cover"
          />

          {/* Overlay for better text readability */}
          <div className="absolute inset-0 "></div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-colors bg-white bg-opacity-80 rounded-full p-2"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div
          className="p-8 overflow-y-auto flex-1"
          onScroll={handleModalScroll}
        >
          {!isSuccess ? (
            <>
              {/* Title */}
              <h2 className="text-2xl font-light text-gray-800 mb-3 text-center">
                Soyez informé en premier
              </h2>

              {/* Description */}
              <p className="text-gray-600 text-sm text-center mb-8 leading-relaxed">
                Enrichissez votre expérience avec Dida Skin : abonnez-vous pour
                bénéficier d'un accès privilégié aux nouveautés, à des offres
                sur mesure ainsi qu'à des avantages et services uniques.
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    *Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border-b border-gray-300 focus:border-[#D4A574] focus:outline-none transition-colors"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    *Prénom
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border-b border-gray-300 focus:border-[#D4A574] focus:outline-none transition-colors"
                      placeholder="Votre prénom"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    *Nom
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border-b border-gray-300 focus:border-[#D4A574] focus:outline-none transition-colors"
                      placeholder="Votre nom"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    *Téléphone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border-b border-gray-300 focus:border-[#D4A574] focus:outline-none transition-colors"
                      placeholder="Votre numéro de téléphone"
                    />
                  </div>
                </div>

                {/* Consent Checkbox */}
                <div className="flex items-start space-x-3 pt-4">
                  <input
                    type="checkbox"
                    id="consent"
                    required
                    className="mt-1 h-4 w-4 text-[#D4A574] focus:ring-[#D4A574] border-gray-300 rounded"
                  />
                  <label
                    htmlFor="consent"
                    className="text-xs text-gray-600 leading-relaxed"
                  >
                    Je souhaite recevoir des communications personnalisées de
                    Dida Skin. J'autorise Dida Skin à traiter mes données
                    personnelles afin de personnaliser la communication et les
                    offres selon mes préférences.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#D4A574] text-white py-4 rounded-none hover:bg-[#b88b5c] transition-colors font-light tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
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
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-light text-gray-800 mb-2">
                Inscription réussie !
              </h3>
              <p className="text-gray-600 text-sm">
                Merci de vous être inscrit(e) à notre newsletter. Vous recevrez
                bientôt nos premiers conseils beauté !
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
