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
  Menu,
  Search,
} from "lucide-react";

export default function Navbar({ isOpen, setIsOpen }) {
  const menuItems = [
    { icon: BarChart3, label: "Tableau de bord", active: true },
    { icon: Calendar, label: "Rendez-vous", count: 12 },
    { icon: Users, label: "Clients", count: 156 },
    { icon: Scissors, label: "Services" },
    { icon: DollarSign, label: "Finances" },
    { icon: Bell, label: "Notifications", count: 3 },
    { icon: Settings, label: "Paramètres" },
  ];

  const currentDate = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Sidebar (Off-canvas) */}
      <div
        className={`fixed left-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:hidden`} // Only show on mobile
      >
        {/* Header for mobile sidebar */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <img
                src="/src/assets/logo-didaskin.png"
                alt="DIDA SKIN"
                className="h-8 w-auto"
              />
              <p className="text-xs text-gray-500 mt-1">Administration</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Navigation for mobile sidebar */}
        <nav className="p-4 flex-1 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <a
                  href="#"
                  className={`flex items-center justify-between p-3 rounded-lg transition-colors duration-200 ${
                    item.active
                      ? "bg-[#F5F1ED] text-[#D4A574] border-l-4 border-[#D4A574]"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.count && (
                    <span className="bg-[#D4A574] text-white text-xs px-2 py-1 rounded-full">
                      {item.count}
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* User section for mobile sidebar */}
        <div className="p-4 border-t border-gray-100">
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

      {/* Desktop Navbar (Top Bar) */}
      <header className="bg-white shadow-sm border-b border-gray-100 px-6 py-4 flex items-center justify-between lg:flex">
        {/* Left section: Mobile Menu Toggle (only on mobile), Brand, and Desktop Nav Items */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsOpen(true)}
            className="lg:hidden text-gray-600 hover:text-gray-800"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-shrink-0">
            <img
              src="/assets/logo-dida.png"
              alt="DIDA SKIN"
              className="h-8 w-auto"
            />
            <p className="text-xs text-gray-500 mt-1">Administration</p>
          </div>
          {/* Desktop Navigation Items */}
          <nav className="hidden lg:flex ml-8">
            <ul className="flex space-x-6">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className={`flex items-center space-x-2 text-sm font-medium transition-colors duration-200 ${
                      item.active
                        ? "text-[#D4A574] border-b-2 border-[#D4A574] pb-1"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                    {item.count && (
                      <span className="bg-[#D4A574] text-white text-xs px-1.5 py-0.5 rounded-full">
                        {item.count}
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Right section: Search, Notifications, Date, User */}
        <div className="flex items-center space-x-6">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A574] focus:border-transparent"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:text-gray-800">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              3
            </span>
          </button>

          {/* Date */}
          <div className="hidden md:block text-sm text-gray-600">
            {currentDate}
          </div>

          {/* User section */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-[#D4A574] rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">AD</span>
            </div>
            <div className="hidden sm:block">
              {" "}
              {/* Hide name/email on very small screens */}
              <p className="font-medium text-gray-800 text-sm">Admin</p>
              <p className="text-xs text-gray-500">admin@didaskin.com</p>
            </div>
            <button className="text-gray-600 hover:text-red-500 transition-colors">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
