import { useState, useEffect, useCallback } from "react";

export const usePlanityInitialization = (containerId, apiKey, primaryColor) => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const initializePlanity = useCallback(async () => {
    try {
      setError(null);
      console.log("usePlanityInitialization - Début de l'initialisation...");

      // Attendre que le DOM soit complètement prêt
      await new Promise((resolve) => setTimeout(resolve, 500));

      const container = document.getElementById(containerId);
      if (!container) {
        throw new Error(`Container avec l'ID '${containerId}' non trouvé`);
      }

      // Nettoyer l'ancienne configuration
      if (window.planity) {
        delete window.planity;
      }

      // Configuration Planity
      window.planity = {
        key: apiKey,
        primaryColor: primaryColor,
        // Utiliser le bon type de conteneur selon l'usage
        ...(containerId.includes("account") && { accountContainer: container }),
        ...(containerId.includes("service-booking") && {
          appointmentContainer: container,
        }),
        ...(containerId.includes("services") && { container: container }),
      };

      console.log(
        "usePlanityInitialization - Configuration créée:",
        window.planity
      );

      // Charger les scripts Planity
      const loadScript = (src) => {
        return new Promise((resolve, reject) => {
          const existingScript = document.querySelector(`script[src="${src}"]`);
          if (existingScript) {
            console.log("usePlanityInitialization - Script déjà chargé:", src);
            resolve();
            return;
          }

          console.log("usePlanityInitialization - Chargement du script:", src);
          const script = document.createElement("script");
          script.src = src;
          script.async = false;
          script.onload = () => {
            console.log("usePlanityInitialization - Script chargé:", src);
            resolve();
          };
          script.onerror = (err) => {
            console.error(
              "usePlanityInitialization - Erreur de chargement:",
              src,
              err
            );
            reject(err);
          };
          document.head.appendChild(script);
        });
      };

      // Charger les scripts
      await loadScript(
        "https://d2skjte8udjqxw.cloudfront.net/widget/production/2/polyfills.latest.js"
      );
      await loadScript(
        "https://d2skjte8udjqxw.cloudfront.net/widget/production/2/app.latest.js"
      );

      // Attendre que Planity s'initialise
      let attempts = 0;
      const maxAttempts = 15; // Plus de tentatives

      const waitForPlanity = () => {
        return new Promise((resolve, reject) => {
          const checkReady = () => {
            attempts++;
            console.log(
              `usePlanityInitialization - Tentative ${attempts}/${maxAttempts}`
            );

            if (window.planity && window.planity.widget) {
              console.log("usePlanityInitialization - Planity est prêt !");
              resolve();
              return;
            }

            if (attempts >= maxAttempts) {
              reject(new Error("Timeout d'initialisation de Planity"));
              return;
            }

            setTimeout(checkReady, 400);
          };

          setTimeout(checkReady, 1000);
        });
      };

      await waitForPlanity();
      setIsReady(true);
      console.log("usePlanityInitialization - Initialisation réussie !");
    } catch (err) {
      console.error("usePlanityInitialization - Erreur:", err);
      setError(err.message);
      setIsReady(false);
    }
  }, [containerId, apiKey, primaryColor]);

  const retry = useCallback(() => {
    setRetryCount((prev) => prev + 1);
    setError(null);
    setIsReady(false);
    initializePlanity();
  }, [initializePlanity]);

  useEffect(() => {
    initializePlanity();
  }, [initializePlanity]);

  return {
    isReady,
    error,
    retry,
    retryCount,
    isInitializing: !isReady && !error,
  };
};
