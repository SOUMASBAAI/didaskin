import { useEffect, useRef, useState } from "react";

export default function PlanityWidget({
  containerId = "planity-container",
  apiKey = "YOUR_API_KEY",
  primaryColor = "#F5F1ED",
  backgroundColor = "#F5F1ED",
}) {
  const containerRef = useRef(null);
  const [status, setStatus] = useState("initializing");
  const [errorMessage, setErrorMessage] = useState("");
  const initTimeoutRef = useRef(null);
  const checkIntervalRef = useRef(null);
  const retryCountRef = useRef(0);
  const domObserverRef = useRef(null);
  const hasSetReadyRef = useRef(false);
  const readyFallbackTimeoutRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const setReadyOnce = () => {
      if (!isMounted || hasSetReadyRef.current) return;
      hasSetReadyRef.current = true;
      setStatus("ready");
    };

    const widgetDomLooksReady = (container) => {
      if (!container) return false;
      if (container.querySelector("iframe")) return true;
      const contentful =
        container.childElementCount > 0 && container.scrollHeight > 200;
      return contentful;
    };

    const startObservingWidget = (container) => {
      if (!container || domObserverRef.current) return;
      domObserverRef.current = new MutationObserver(() => {
        if (widgetDomLooksReady(container)) {
          setReadyOnce();
        }
      });
      domObserverRef.current.observe(container, {
        childList: true,
        subtree: true,
      });
      // Initial check
      if (widgetDomLooksReady(container)) {
        setReadyOnce();
      }
      // Fallback: if after 8s there's content, mark ready anyway
      readyFallbackTimeoutRef.current = setTimeout(() => {
        if (widgetDomLooksReady(container)) {
          setReadyOnce();
        }
      }, 8000);
    };

    const initializePlanity = () => {
      try {
        const container = document.getElementById(containerId);
        if (!container) {
          throw new Error(`Container non trouvé: ${containerId}`);
        }

        // Vérifier que le conteneur a des dimensions et est visible
        if (container.offsetWidth === 0 || container.offsetHeight === 0) {
          if (isMounted) {
            initTimeoutRef.current = setTimeout(initializePlanity, 1000);
          }
          return;
        }

        // Nettoyer l'ancienne configuration
        if (window.planity) {
          delete window.planity;
        }

        // Configuration Planity avec une approche plus simple
        window.planity = {
          key: apiKey,
          primaryColor: "#F5F1ED",
          // Utiliser container simple pour la compatibilité
          container: container,
        };

        // Commencer à observer la création du DOM du widget
        startObservingWidget(container);

        // Charger les scripts Planity de manière séquentielle
        const loadScripts = async () => {
          try {
            // Script 1: Polyfills
            await new Promise((resolve, reject) => {
              const script1 = document.createElement("script");
              script1.src =
                "https://d2skjte8udjqxw.cloudfront.net/widget/production/2/polyfills.latest.js";
              script1.onload = resolve;
              script1.onerror = reject;
              document.head.appendChild(script1);
            });

            // Script 2: App principal
            await new Promise((resolve, reject) => {
              const script2 = document.createElement("script");
              script2.src =
                "https://d2skjte8udjqxw.cloudfront.net/widget/production/2/app.latest.js";
              script2.onload = resolve;
              script2.onerror = reject;
              document.head.appendChild(script2);
            });

            // Attendre que Planity s'initialise
            let attempts = 0;
            const maxAttempts = 60;

            const checkPlanityReady = () => {
              if (!isMounted) return;

              attempts++;

              // Vérifier que le conteneur existe toujours et a des dimensions
              const currentContainer = document.getElementById(containerId);
              if (!currentContainer) {
                return;
              }

              if (
                currentContainer.offsetWidth === 0 ||
                currentContainer.offsetHeight === 0
              ) {
                return;
              }

              // Si le DOM du widget a été détecté, on est prêt
              if (widgetDomLooksReady(currentContainer)) {
                setReadyOnce();
                return;
              }

              // Fallback si l'API expose un flag
              if (window.planity && window.planity.widget) {
                setReadyOnce();
                return;
              }

              if (attempts >= maxAttempts) {
                if (isMounted) {
                  setStatus("error");
                  setErrorMessage("Timeout d'initialisation de Planity");
                }
                return;
              }

              // Vérifier plus fréquemment
              checkIntervalRef.current = setTimeout(checkPlanityReady, 100);
            };

            // Démarrer la vérification après un délai
            setTimeout(checkPlanityReady, 3000);
          } catch (err) {
            if (isMounted) {
              setStatus("error");
              setErrorMessage(`Erreur de chargement: ${err.message}`);
            }
          }
        };

        loadScripts();
      } catch (err) {
        if (isMounted) {
          setStatus("error");
          setErrorMessage(err.message);
        }
      }
    };

    // Démarrer l'initialisation après un délai
    initTimeoutRef.current = setTimeout(initializePlanity, 3000);

    return () => {
      isMounted = false;
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
      }
      if (checkIntervalRef.current) {
        clearTimeout(checkIntervalRef.current);
      }
      if (readyFallbackTimeoutRef.current) {
        clearTimeout(readyFallbackTimeoutRef.current);
      }
      if (domObserverRef.current) {
        domObserverRef.current.disconnect();
        domObserverRef.current = null;
      }

      // Nettoyer Planity seulement si on quitte la page
      if (window.planity) {
        delete window.planity;
      }
    };
  }, [containerId, apiKey, primaryColor]);

  const handleRetry = () => {
    retryCountRef.current += 1;
    setStatus("initializing");
    setErrorMessage("");

    // Nettoyer et réinitialiser
    if (window.planity) {
      delete window.planity;
    }

    // Réinitialiser après un délai
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  // Afficher l'erreur
  if (status === "error") {
    return (
      <div className="bg-red-50 border border-red-200 p-4 text-center">
        <p className="text-red-600 text-sm">
          Erreur d'initialisation : {errorMessage}
        </p>
        <div className="mt-2 space-y-2">
          <button
            onClick={handleRetry}
            className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
          >
            Réessayer ({retryCountRef.current})
          </button>
          <button
            onClick={() => window.location.reload()}
            className="ml-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
          >
            Recharger la page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Container Planity */}
      <div
        id={containerId}
        ref={containerRef}
        className="w-full min-h-[600px]"
        style={{
          minHeight: "600px",
          position: "relative",
          overflow: "hidden",
          backgroundColor,
        }}
      />

      {/* Indicateur de chargement */}
      {status === "initializing" && (
        <div className="bg-gray-50 border border-gray-200 p-6 text-center">
          <div className="animate-spin mx-auto h-8 w-8 border-4 border-gray-300 border-t-black rounded-full mb-4"></div>
          <p className="text-gray-600">
            Initialisation du calendrier Planity...
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Veuillez patienter quelques secondes
          </p>
        </div>
      )}

      
    </div>
  );
}
