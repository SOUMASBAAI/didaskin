import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";

export default function AppointmentsButton({
  className = "",
  children = "MES RENDEZ-VOUS",
  variant = "default", // "default", "outline", "text"
}) {
  const baseClasses =
    "inline-flex items-center space-x-2 font-medium transition-colors";

  const variantClasses = {
    default: "bg-black text-white hover:bg-gray-800 px-4 py-2 rounded-none",
    outline:
      "border border-black text-black hover:bg-black hover:text-white px-4 py-2 rounded-none",
    text: "text-gray-700 hover:text-black",
  };

  return (
    <Link
      to="/my-appointments"
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      <Calendar className="h-4 w-4" />
      <span>{children}</span>
    </Link>
  );
}
