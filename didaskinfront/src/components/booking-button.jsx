import { useNavigate } from "react-router-dom";

export default function BookingButton({
  id,
  type = "service", // "service" ou "product"
  className = "",
  children = "RESERVER VOTRE SOIN",
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (type === "product") {
      navigate(`/booking/${id}`); // Utilise la route générale pour les produits
    } else {
      navigate(`/booking`); // Nouvelle route spécifique pour les services
    }
  };

  return (
    <button
      onClick={handleClick}
     className={`w-full py-3 px-6 bg-black text-white font-medium tracking-wide rounded-none cursor-pointer ${className}`}
    >
      {children}
    </button>
  );
}
