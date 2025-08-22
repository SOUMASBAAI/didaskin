"use client";

import { useState } from "react";
import HeroEditor from "./HeroEditor";

export default function SettingsSection() {
  const [openHero, setOpenHero] = useState(false);

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
      </div>

      {openHero && <HeroEditor onClose={() => setOpenHero(false)} />}
    </div>
  );
}
