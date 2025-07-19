"use client"

import { Menu, Search, Bell } from "lucide-react"

export default function DashboardHeader({ setSidebarOpen }) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100 px-6 py-4 h-16 flex items-center justify-between">
      {" "}
      {/* Added h-16 and flex items-center justify-between */}
      <div className="flex items-center space-x-4">
        <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-600 hover:text-gray-800">
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-light text-gray-800">Tableau de bord</h1>
      </div>
      <div className="flex items-center space-x-4">
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
          {new Date().toLocaleDateString("fr-FR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>
    </header>
  )
}
