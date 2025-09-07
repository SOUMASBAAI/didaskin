"use client";

import { Facebook, Instagram } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import NewsletterModal from "./NewsletterModal";

export default function Footer() {
  const navigate = useNavigate();
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);

  const handleOpenNewsletter = () => {
    setShowNewsletterModal(true);
  };

  const handleCloseNewsletter = () => {
    setShowNewsletterModal(false);
  };
  return (
    <footer className="w-full bg-[#F5F1ED] text-black text-left">
      <div className="w-full max-w-6xl mx-auto px-8 text-black text-left">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Colonne 1 - HORAIRES */}
          <div>
            <h3 className="text-sm font-semibold text-black mb-3">HORAIRES</h3>
            <div className="space-y-1">
              <div className="text-xs text-black">Lundi: 10h00-19h00</div>
              <div className="text-xs text-black">
                Mardi au Jeudi: 09h00-17h00
              </div>
              <div className="text-xs text-black">Vendredi: 09h00-18h00</div>
              <div className="text-xs text-black">Samedi: 09h00-19h00</div>
            </div>
          </div>

          {/* Colonne 2 - CONTACT */}
          <div>
            <h3 className="text-sm font-semibold text-black mb-3">CONTACT</h3>
            <div className="space-y-1">
              <div className="text-xs text-black">contact@didaskin.com</div>
            </div>
          </div>

          {/* Colonne 3 - INFOS */}
          <div>
            <h3 className="text-sm font-semibold text-black mb-3">INFOS</h3>
            <div className="space-y-1">
              <div
                className="text-xs text-black cursor-pointer hover:underline"
                onClick={handleOpenNewsletter}
              >
                Souscrire newsletter
              </div>
              <div
                className="text-xs text-black cursor-pointer hover:underline"
                onClick={() => navigate("/privacy-policy")}
              >
                Politique de confidentialité
              </div>
              <div
                className="text-xs text-black cursor-pointer hover:underline"
                onClick={() => navigate("/privacy-policy")}
              >
                Conditions générales de vente
              </div>
              <div
                className="text-xs text-black cursor-pointer hover:underline"
                onClick={() => navigate("/legal-notice")}
              >
                Mentions légales
              </div>
            </div>
          </div>

          {/* Colonne 4 - RÉSEAUX SOCIAUX */}
          <div>
            <h3 className="text-sm font-semibold text-black mb-3">
              RÉSEAUX SOCIAUX
            </h3>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/share/1Zj4Z22sQk/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-6 h-6 border border-black rounded flex items-center justify-center cursor-pointer hover:bg-black hover:text-white transition-colors"
              >
                <Facebook className="w-3 h-3" />
              </a>
              <a
                href="https://www.instagram.com/dida.skin.institut?igsh=eXIxMDFsZHF1bnFj"
                target="_blank"
                rel="noopener noreferrer"
                className="w-6 h-6 border border-black rounded flex items-center justify-center cursor-pointer hover:bg-black hover:text-white transition-colors"
              >
                <Instagram className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-300">
          <div className="text-center space-y-2">
            <div className="text-xs text-black">
              ©2025 dida skin tout droit réservés
            </div>
            <div className="text-xs text-gray-600">
              Ce site a été créé par{" "}
              <a
                href="https://www.instagram.com/isakode_conception/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:underline font-medium"
              >
                Isakode
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Modal */}
      <NewsletterModal
        isOpen={showNewsletterModal}
        onClose={handleCloseNewsletter}
      />
    </footer>
  );
}
