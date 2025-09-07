import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";

export default function UnsubscribePage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading"); // 'loading', 'success', 'error'
  const [message, setMessage] = useState("");
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const processUnsubscribe = () => {
      const statusParam = searchParams.get("status");
      const messageParam = searchParams.get("message");
      const firstName = searchParams.get("firstName");
      const lastName = searchParams.get("lastName");
      const email = searchParams.get("email");

      if (statusParam === "success") {
        setStatus("success");
        setMessage("Désabonnement réussi");
        if (firstName && lastName && email) {
          setUserInfo({
            firstName: decodeURIComponent(firstName),
            lastName: decodeURIComponent(lastName),
            email: decodeURIComponent(email),
          });
        }
      } else if (statusParam === "error") {
        setStatus("error");
        setMessage(
          messageParam
            ? decodeURIComponent(messageParam)
            : "Une erreur est survenue"
        );
      } else {
        setStatus("error");
        setMessage("Paramètres de désabonnement manquants");
      }
    };

    processUnsubscribe();
  }, [searchParams]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#F5F1ED] flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <h1 className="text-xl font-semibold text-gray-800 mb-2">
            Traitement en cours...
          </h1>
          <p className="text-gray-600">
            Nous traitons votre demande de désabonnement.
          </p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen bg-[#F5F1ED] flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4 text-center">
          <div className="text-green-500 text-5xl mb-4">✓</div>
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">
            Désabonnement réussi
          </h1>

          {userInfo && (
            <div className="mb-6">
              <p className="text-gray-600 mb-2">
                Bonjour{" "}
                <strong>
                  {userInfo.firstName} {userInfo.lastName}
                </strong>
                ,
              </p>
              <p className="text-gray-600 mb-2">
                Vous avez été désabonné(e) avec succès de notre newsletter.
              </p>
              <p className="text-gray-600">
                Votre adresse email <strong>{userInfo.email}</strong> ne recevra
                plus nos communications.
              </p>
            </div>
          )}

          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Vous pouvez toujours vous réabonner à tout moment sur notre site
              web.
            </p>
          </div>

          <Link
            to="/"
            className="inline-block bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors duration-200 font-medium"
          >
            Retour au site Didaskin
          </Link>
        </div>
      </div>
    );
  }

  // Error state
  return (
    <div className="min-h-screen bg-[#F5F1ED] flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4 text-center">
        <div className="text-red-500 text-5xl mb-4">⚠</div>
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Erreur de désabonnement
        </h1>

        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 font-medium">{message}</p>
        </div>

        <div className="mb-6 text-left">
          <p className="text-gray-600 mb-2">
            Nous n'avons pas pu traiter votre demande de désabonnement.
          </p>
          <p className="text-gray-600 mb-4">
            Cela peut être dû à un lien expiré ou invalide.
          </p>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-semibold text-gray-800 mb-2">Besoin d'aide ?</p>
            <p className="text-gray-600 text-sm">
              Contactez-nous directement à{" "}
              <a
                href="mailto:contact@didaskin.com"
                className="text-black hover:underline font-medium"
              >
                contact@didaskin.com
              </a>{" "}
              pour être désabonné(e) manuellement de notre newsletter.
            </p>
          </div>
        </div>

        <Link
          to="/"
          className="inline-block bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors duration-200 font-medium"
        >
          Retour au site Didaskin
        </Link>
      </div>
    </div>
  );
}
