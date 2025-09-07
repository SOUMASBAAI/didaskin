import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const CURRENT_YEAR = new Date().getFullYear();

const LEGAL = {
  siteName: "Dida Skin",
  editor: {
    entity: "didaskin",
    address: "69 RUE ALFRED LABRIERE 95100 ARGENTEUIL",
    email: "contact@didaskin.com]",
    phone: "",
    siret: "907 599 963 00028",
    publicationManager: "ASBAAI SOUMIA",
  },
  host: {
    name: "Cloud Azure",
    address: "[Adresse de l'hébergeur]",
    phone: "[Téléphone de l'hébergeur]",
    website: "[URL de l'hébergeur]",
  },
  contactEmail: "contact@didaskin.com",
};

export default function LegalNotice() {
  return (
    <div className="min-h-screen bg-[#F5F1ED] flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-12 px-4 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Mentions légales</h1>

        <section className="mb-6" id="editeur">
          <h2 className="text-xl font-semibold mb-2">1. Éditeur du site</h2>
          <p><span className="font-medium">Nom / Raison sociale :</span> {LEGAL.editor.entity}</p>
          <p><span className="font-medium">Adresse :</span> {LEGAL.editor.address}</p>
          <p><span className="font-medium">Email :</span> {LEGAL.editor.email}</p>
          <p><span className="font-medium">Téléphone :</span> {LEGAL.editor.phone}</p>
          <p><span className="font-medium">SIRET :</span> {LEGAL.editor.siret}</p>
          <p><span className="font-medium">Responsable de la publication :</span> {LEGAL.editor.publicationManager}</p>
        </section>

        <section className="mb-6" id="hebergeur">
          <h2 className="text-xl font-semibold mb-2">2. Hébergeur</h2>
          <p><span className="font-medium">Nom :</span> {LEGAL.host.name}</p>
          <p><span className="font-medium">Adresse :</span> {LEGAL.host.address}</p>
          <p><span className="font-medium">Téléphone :</span> {LEGAL.host.phone}</p>
          <p><span className="font-medium">Site web :</span> {LEGAL.host.website}</p>
        </section>

        <section className="mb-6" id="propriete-intellectuelle">
          <h2 className="text-xl font-semibold mb-2">3. Propriété intellectuelle</h2>
          <p>
            L’ensemble des éléments du site {LEGAL.siteName} (textes, images, logos, vidéos, codes, etc.) est protégé par le droit de la propriété intellectuelle. Toute reproduction totale ou partielle est interdite sans autorisation écrite préalable.
          </p>
        </section>

        <section className="mb-6" id="donnees-personnelles">
          <h2 className="text-xl font-semibold mb-2">4. Données personnelles (RGPD)</h2>
          <p>Les données collectées sont utilisées uniquement pour :</p>
          <ul className="list-disc pl-5 mb-2">
            <li>Gestion des inscriptions à la newsletter ;</li>
            <li>Réponses aux messages via le formulaire de contact ;</li>
            <li>Gestion des comptes clients et commandes (si applicable) ;</li>
          </ul>
          <p>
            Vous pouvez exercer vos droits d’accès, de rectification, d’effacement et de portabilité des données en nous contactant à : <a className="underline" href={`mailto:${LEGAL.contactEmail}`}>{LEGAL.contactEmail}</a>.
          </p>
        </section>

        <section className="mb-6" id="cookies">
          <h2 className="text-xl font-semibold mb-2">5. Cookies</h2>
          <p>
            Le site utilise des cookies pour améliorer la navigation et mesurer l’audience. Vous pouvez gérer vos préférences via votre navigateur.
          </p>
        </section>

        <section className="mb-6" id="responsabilite">
          <h2 className="text-xl font-semibold mb-2">6. Limitation de responsabilité</h2>
          <p>
            {LEGAL.siteName} s’efforce de fournir des informations exactes, mais ne peut être tenu responsable des erreurs ou omissions.
          </p>
        </section>

        <section className="mb-6" id="newsletter">
          <h2 className="text-xl font-semibold mb-2">7. Newsletter</h2>
          <p>
            En vous inscrivant à la newsletter, vous acceptez que votre email soit utilisé pour l’envoi d’informations et d’offres. Vous pouvez vous désinscrire à tout moment via le lien présent dans chaque email.
          </p>
        </section>

        <section className="mb-6" id="contact">
          <h2 className="text-xl font-semibold mb-2">8. Contact</h2>
          <p>
            Pour toute question sur ces mentions légales, contactez-nous à : <a className="underline" href={`mailto:${LEGAL.contactEmail}`}>{LEGAL.contactEmail}</a>.
          </p>
        </section>

        
      </main>
      <Footer />
    </div>
  );
}
