import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const CURRENT_YEAR = new Date().getFullYear();

const PRIVACY = {
  siteName: "Dida Skin",
  contactEmail: "contact@didaskin.com",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#F5F1ED] flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-12 px-4 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Politique de confidentialité</h1>

        <section className="mb-6" id="introduction">
          <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
          <p>
            La présente politique de confidentialité décrit comment {PRIVACY.siteName} collecte, utilise et protège vos données personnelles lors de votre navigation sur notre site et de l’utilisation de nos services.
          </p>
        </section>

        <section className="mb-6" id="donnees-collectees">
          <h2 className="text-xl font-semibold mb-2">2. Données collectées</h2>
          <p>Nous collectons les données personnelles suivantes :</p>
          <ul className="list-disc pl-5 mb-2">
            <li>Nom et prénom (si fournis) ;</li>
            <li>Adresse e-mail pour la newsletter ou la prise de contact ;</li>
            <li>Données de navigation (cookies, IP, pages visitées) ;</li>
            <li>Données relatives aux commandes et comptes clients (si applicable).</li>
          </ul>
        </section>

        <section className="mb-6" id="utilisation-donnees">
          <h2 className="text-xl font-semibold mb-2">3. Utilisation des données</h2>
          <p>Les données collectées sont utilisées pour :</p>
          <ul className="list-disc pl-5 mb-2">
            <li>Envoyer la newsletter et des communications marketing avec votre consentement ;</li>
            <li>Répondre aux demandes via le formulaire de contact ;</li>
            <li>Gérer les comptes clients et commandes ;</li>
            <li>Améliorer le contenu et l’expérience utilisateur du site ;</li>
            <li>Mesurer et analyser l’audience du site.</li>
          </ul>
        </section>

        <section className="mb-6" id="base-legale">
          <h2 className="text-xl font-semibold mb-2">4. Base légale du traitement</h2>
          <p>
            Le traitement de vos données repose sur votre consentement, l’exécution d’un contrat, ou notre intérêt légitime selon les cas, conformément au RGPD.
          </p>
        </section>

        <section className="mb-6" id="partage-donnees">
          <h2 className="text-xl font-semibold mb-2">5. Partage des données</h2>
          <p>
            Vos données ne sont pas vendues ni communiquées à des tiers à des fins commerciales sans votre consentement. Elles peuvent être partagées avec des prestataires techniques pour le fonctionnement du site ou des services (hébergement, email marketing, paiement, etc.).
          </p>
        </section>

        <section className="mb-6" id="conservation-donnees">
          <h2 className="text-xl font-semibold mb-2">6. Conservation des données</h2>
          <p>
            Les données personnelles sont conservées uniquement le temps nécessaire aux finalités pour lesquelles elles ont été collectées, et sont supprimées ou anonymisées ensuite.
          </p>
        </section>

        <section className="mb-6" id="droits-utilisateur">
          <h2 className="text-xl font-semibold mb-2">7. Vos droits</h2>
          <p>
            Conformément au RGPD, vous disposez des droits suivants :
          </p>
          <ul className="list-disc pl-5 mb-2">
            <li>Droit d’accès à vos données personnelles ;</li>
            <li>Droit de rectification ou suppression ;</li>
            <li>Droit à la portabilité des données ;</li>
            <li>Droit d’opposition ou de limitation du traitement ;</li>
            <li>Droit de retirer votre consentement à tout moment pour les communications marketing.</li>
          </ul>
          <p>Pour exercer vos droits, contactez-nous à : <a className="underline" href={`mailto:${PRIVACY.contactEmail}`}>{PRIVACY.contactEmail}</a>.</p>
        </section>

        <section className="mb-6" id="cookies">
          <h2 className="text-xl font-semibold mb-2">8. Cookies</h2>
          <p>
            Nous utilisons des cookies pour améliorer la navigation et analyser l’audience. Vous pouvez gérer vos préférences via votre navigateur.
          </p>
        </section>

        <section className="mb-6" id="securite">
          <h2 className="text-xl font-semibold mb-2">9. Sécurité des données</h2>
          <p>
            Nous mettons en place des mesures techniques et organisationnelles pour protéger vos données contre tout accès non autorisé, altération ou divulgation.
          </p>
        </section>

        <section className="mb-6" id="modifications">
          <h2 className="text-xl font-semibold mb-2">10. Modifications de la politique</h2>
          <p>
            Cette politique peut être mise à jour périodiquement. Les modifications seront publiées sur cette page avec la date de mise à jour.
          </p>
        </section>

        <section className="mb-6" id="contact">
          <h2 className="text-xl font-semibold mb-2">11. Contact</h2>
          <p>
            Pour toute question relative à la protection des données personnelles : <a className="underline" href={`mailto:${PRIVACY.contactEmail}`}>{PRIVACY.contactEmail}</a>.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
