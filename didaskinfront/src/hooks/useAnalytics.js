import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Hook personnalisé pour Google Analytics
export const useAnalytics = () => {
  const location = useLocation();

  // Tracker les changements de page automatiquement
  useEffect(() => {
    if (window.gtag) {
      window.gtag("config", "G-XXXXXXXXXX", {
        page_path: location.pathname + location.search,
        page_title: document.title,
      });
    }
  }, [location]);

  // Fonction pour tracker les événements personnalisés
  const trackEvent = (action, category, label, value) => {
    if (window.gtag) {
      window.gtag("event", action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }
  };

  // Fonction pour tracker les conversions
  const trackConversion = (conversionType, value) => {
    if (window.gtag) {
      window.gtag("event", "conversion", {
        send_to: `G-XXXXXXXXXX/${conversionType}`,
        value: value,
      });
    }
  };

  return {
    trackEvent,
    trackConversion,
  };
};

// Fonction utilitaire pour tracker les clics sur les boutons
export const trackButtonClick = (buttonName, page = "") => {
  if (window.gtag) {
    window.gtag("event", "click", {
      event_category: "Button",
      event_label: buttonName,
      page_location: page || window.location.href,
    });
  }
};

// Fonction pour tracker les formulaires
export const trackFormSubmission = (formName, success = true) => {
  if (window.gtag) {
    window.gtag("event", "form_submit", {
      event_category: "Form",
      event_label: formName,
      value: success ? 1 : 0,
    });
  }
};
