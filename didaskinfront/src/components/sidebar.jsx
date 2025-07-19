"use client"
import { Calendar, Users, Scissors, DollarSign, Settings, BarChart3, Bell, LogOut, X } from "lucide-react"

export default function Sidebar({ isOpen, setIsOpen }) {
  const menuItems = [
    { icon: BarChart3, label: "Tableau de bord", active: true },
    { icon: Calendar, label: "Rendez-vous", count: 12 },
    { icon: Users, label: "Clients", count: 156 },
    { icon: Scissors, label: "Services" },
    { icon: DollarSign, label: "Finances" },
    { icon: Bell, label: "Notifications", count: 3 },
    { icon: Settings, label: "Paramètres" },
  ]

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setIsOpen(false)} />
      )}

      {/* Sidebar - Fixed on all screen sizes, slides for mobile */}
      <div
        className={`fixed left-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-light tracking-wider text-gray-800">DIDA SKIN</h2>
              <p className="text-xs text-gray-500 mt-1">Administration</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="lg:hidden text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 flex-1 overflow-y-auto">
          {" "}
          {/* Added overflow-y-auto for sidebar content */}
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
                    <span className="bg-[#D4A574] text-white text-xs px-2 py-1 rounded-full">{item.count}</span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* User section */}
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
    </>
  )
}
