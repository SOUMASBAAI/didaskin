"use client";

import { useState } from "react";
import HeroEditor from "./HeroEditor";
import CatalogueEditor from "./CatalogueEditor";
import AboutEditor from "./AboutEditor";

export default function SettingsSection() {
  const [openHero, setOpenHero] = useState(false);
  const [openCatalogue, setOpenCatalogue] = useState(false);
  const [openAbout, setOpenAbout] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Paramètres du site
      </h2>

      <div className="space-y-4">
        <div className="border border-gray-200 rounded p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Section d'accueil (Hero)
              </h3>
              <p className="text-sm text-gray-600">
                Gérer l'image, le titre, la description et le bouton.
              </p>
            </div>
            <button
              onClick={() => setOpenHero(true)}
              className="px-4 py-2 bg-[#D4A574] text-white rounded hover:bg-[#b88b5c] transition"
            >
              Modifier
            </button>
          </div>
        </div>

        <div className="border border-gray-200 rounded p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Section Catalogue (Image)
              </h3>
              <p className="text-sm text-gray-600">
                Choisir l'image affichée pour la section catalogue sur
                l'accueil.
              </p>
            </div>
            <button
              onClick={() => setOpenCatalogue(true)}
              className="px-4 py-2 bg-[#D4A574] text-white rounded hover:bg-[#b88b5c] transition"
            >
              Modifier
            </button>
          </div>
        </div>

        <div className="border border-gray-200 rounded p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Section À propos (Image)
              </h3>
              <p className="text-sm text-gray-600">
                Choisir l'image affichée dans la section À propos du centre.
              </p>
            </div>
            <button
              onClick={() => setOpenAbout(true)}
              className="px-4 py-2 bg-[#D4A574] text-white rounded hover:bg-[#b88b5c] transition"
            >
              Modifier
            </button>
          </div>
        </div>
      </div>

      {openHero && <HeroEditor onClose={() => setOpenHero(false)} />}
      {openCatalogue && (
        <CatalogueEditor onClose={() => setOpenCatalogue(false)} />
      )}
      {openAbout && <AboutEditor onClose={() => setOpenAbout(false)} />}
    </div>
  );
}
