"use client"

import { useState } from "react"
import { X } from "lucide-react"

import Header from "../components/Header"

export default function ServiceDetailPage() {
  const [showDetailsPanel, setShowDetailsPanel] = useState(false)

  const service = {
    imageSrc:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c29pbiUyMHZpc2FnZXxlbnwwfHwwfHx8MA%3D%3D",
    title: "SOIN VISAGE HYDRATANT PROFOND",
    price: "85 €",
    shortDescription: "Un soin revitalisant pour une peau éclatante et hydratée.",
    longDescription:
      "Ce soin du visage complet est conçu pour infuser votre peau d'une hydratation intense, la laissant douce, souple et lumineuse. Il comprend un nettoyage en profondeur, une exfoliation douce, un masque hydratant personnalisé et un massage relaxant du visage, du cou et des épaules. Idéal pour tous les types de peau, en particulier les peaux sèches ou déshydratées.",
    estimatedDuration: "60 minutes",
    additionalDetails: [
      "Type de peau: Convient à tous les types de peau, idéal pour les peaux sèches et déshydratées.",
      "Bienfaits: Hydratation profonde, amélioration de l'élasticité, réduction des ridules, éclat du teint.",
      "Ingrédients clés: Acide hyaluronique, vitamines C et E, extraits de plantes apaisantes.",
      "Fréquence recommandée: Une fois par mois pour des résultats optimaux.",
      "Conseils post-soin: Appliquer une crème hydratante et un écran solaire.",
    ],
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F1ED]">
      <Header />

      {/* Main content area - Image on left, initial details on right */}
      <main className="flex-grow pt-32 pb-12 px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex flex-col lg:flex-row gap-x-16 gap-y-8">
          {/* Left Column: Image (now scrolls with content) */}
          <div className="lg:w-1/2 flex justify-center items-start">
            <div className="relative w-full max-w-md aspect-[3/4] bg-gray-100 overflow-hidden">
              <img
                src={service.imageSrc || "/placeholder.svg"}
                alt={service.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right Column: Initial Service Details (now scrolls with content) */}
          <div className="lg:w-1/2 flex flex-col justify-start lg:pt-0 pt-8">
            <h2 className="text-sm font-bold text-gray-800 mb-2 tracking-wide">{service.title}</h2>
            <p className="text-base font-semibold text-gray-900 mb-4">{service.price}</p>

            <p className="text-sm text-gray-600 mb-6">{service.shortDescription}</p>

            <p className="text-base text-gray-700 leading-relaxed mb-8">{service.longDescription}</p>

            <button className="w-full py-3 px-6 bg-black text-white font-medium tracking-wide rounded-none hover:bg-gray-800 transition-colors duration-200 mb-6">
              PRENDRE UN RENDEZ-VOUS
            </button>

            <div className="space-y-4">
              <div className="text-sm text-gray-700">
                <span className="font-medium">DURÉE ESTIMÉE DU SOIN :</span> {service.estimatedDuration}
              </div>
              <button
                onClick={() => setShowDetailsPanel(true)}
                className="text-sm text-gray-700 hover:text-gray-900 transition-colors block text-left"
              >
                PLUS DE DÉTAILS &gt;
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Sliding Details Panel */}
      <div
        className={`fixed inset-y-0 right-0 w-full lg:w-1/2 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          showDetailsPanel ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-8 flex flex-col h-full">
          <div className="flex items-center mb-8">
            <h3 className="flex-grow text-center text-lg font-medium text-gray-800 tracking-wide">DÉTAILS</h3>
            <button onClick={() => setShowDetailsPanel(false)} className="text-gray-700 hover:text-gray-900 ml-auto">
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-sm mx-auto text-left">
              {" "}
              {/* Centered narrow content */}
              <p className="text-sm text-gray-700 leading-relaxed mb-6">{service.longDescription}</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 text-xs">
                {" "}
                {/* Smaller font for list */}
                {service.additionalDetails.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {showDetailsPanel && (
        <div className="fixed inset-0 z-40" onClick={() => setShowDetailsPanel(false)} />
      )}

      {/* Simple Footer */}
      <footer className="bg-white border-t border-gray-100 py-6 text-center text-sm text-gray-600">
        <p>© 2024 DIDA SKIN. Tous droits réservés.</p>
      </footer>
    </div>
  )
}
