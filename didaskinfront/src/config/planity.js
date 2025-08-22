// Configuration Planity pour la production
export const PLANITY_CONFIG = {
  // Remplacez par votre vraie clé API Planity
  API_KEY: "-MpHYq7OyZRKMJMm6Qe1", // Clé de test temporaire

  // Couleur primaire du thème
  PRIMARY_COLOR: "#000000",

  // Configuration des conteneurs
  CONTAINERS: {
    SERVICES: "planity-services-container",
    SERVICE_BOOKING: "planity-service-booking-container",
    ACCOUNT: "planity-account-container",
  },
};

// Fonction pour obtenir la configuration selon le type
export const getPlanityConfig = (type = "services") => {
  return {
    apiKey: PLANITY_CONFIG.API_KEY,
    primaryColor: PLANITY_CONFIG.PRIMARY_COLOR,
    containerId:
      type === "service-booking"
        ? PLANITY_CONFIG.CONTAINERS.SERVICE_BOOKING
        : type === "account"
        ? PLANITY_CONFIG.CONTAINERS.ACCOUNT
        : PLANITY_CONFIG.CONTAINERS.SERVICES,
  };
};
