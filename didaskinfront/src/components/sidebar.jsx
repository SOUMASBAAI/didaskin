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
} from "lucide-react";

export default function Sidebar({
  isOpen,
  setIsOpen,
  activeSection,
  onSectionChange,
}) {
  const menuItems = [
    { icon: BarChart3, label: "Tableau de bord", section: "dashboard" },
    { icon: Users, label: "Clients", section: "clients" },
    { icon: Folder, label: "Catégories", section: "categories" },
    { icon: Scissors, label: "Services", section: "services" },
    { icon: DollarSign, label: "Produits", section: "products" },
    { icon: Bell, label: "Newsletter", section: "newsletter" },
    { icon: FileText, label: "Quiz", section: "quiz" },
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
            <div>
              <h2 className="text-xl font-light tracking-wider text-gray-800">
                DIDA SKIN
              </h2>
              <p className="text-xs text-gray-500 mt-1">Administration</p>
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

        {/* User section - Fixed at bottom */}
        <div className="p-4 border-t border-gray-100 flex-shrink-0">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-[#D4A574] rounded-full flex items-center justify-center">
              <span className="text-white font-medium">AD</span>
            </div>
            <div>
              <p className="font-medium text-gray-800">Admin</p>
              <p className="text-xs text-gray-500">admin@didaskin.com</p>
            </div>
          </div>
          <button className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors">
            <LogOut className="h-4 w-4" />
            <span className="text-sm">Déconnexion</span>
          </button>
        </div>
      </div>
    </>
  );
}

