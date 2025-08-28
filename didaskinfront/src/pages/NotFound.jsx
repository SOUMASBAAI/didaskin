import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">La page que vous cherchez est introuvable.</p>
      <Link to="/" className="px-4 py-2 bg-black text-white rounded">
        Retour à l'accueil
      </Link>
    </div>
  );
}
