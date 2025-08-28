"use client";
import {
  Calendar,
  Users,
  Scissors,
  DollarSign,
  Settings,
  BarChart3,
  Bell,
  LogOut,
  X,
  FileText,
  Folder,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Sidebar({
  isOpen,
  setIsOpen,
  activeSection,
  onSectionChange,
}) {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/");
  };
  const menuItems = [
    { icon: BarChart3, label: "Tableau de bord", section: "dashboard" },
    { icon: Users, label: "Clients", section: "clients" },
    { icon: Folder, label: "Catégories", section: "categories" },
    { icon: Scissors, label: "Services", section: "services" },
    { icon: DollarSign, label: "Produits", section: "products" },
    { icon: Bell, label: "Newsletter", section: "newsletter" },
    { icon: FileText, label: "Quiz", section: "quiz" },
    { icon: TrendingUp, label: "Analytics", section: "analytics" },
    { icon: Settings, label: "Paramètres", section: "settings" },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar - Fixed on all screen sizes, slides for mobile */}
      <div
        className={`fixed left-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div
              onClick={handleLogoClick}
              className="cursor-pointer hover:opacity-80 transition-opacity duration-200 flex justify-center"
            >
              <img
                src="/src/assets/logo-dida.png"
                alt="DIDA SKIN"
                className="h-16 w-auto"
              />
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Navigation - Scrollable area */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <button
                  onClick={() => onSectionChange(item.section)}
                  className={`flex items-center justify-between p-3 rounded-lg w-full transition-colors duration-200 ${
                    activeSection === item.section
                      ? "bg-[#F5F1ED] text-[#D4A574] border-l-4 border-[#D4A574]"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
