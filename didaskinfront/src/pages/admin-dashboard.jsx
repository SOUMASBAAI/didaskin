"use client"

import { useState } from "react"
import Sidebar from "../components/sidebar"
import DashboardHeader from "../components/dashboard-header"
import StatsCards from "../components/stats-cards"
import AppointmentsTable from "../components/appointments-table"
import { Calendar, Users, FileText } from "lucide-react"

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const quickActions = [
    {
      title: "Nouveau rendez-vous",
      description: "Planifier un nouveau rendez-vous",
      icon: Calendar,
      color: "bg-blue-500",
    },
    {
      title: "Ajouter un client",
      description: "Enregistrer un nouveau client",
      icon: Users,
      color: "bg-green-500",
    },
    {
      title: "Rapport mensuel",
      description: "Générer le rapport du mois",
      icon: FileText,
      color: "bg-[#D4A574]",
    },
  ]

  return (
    <div className="min-h-screen bg-[#F5F1ED] flex">
      {/* Sidebar - Fixed on desktop, slides for mobile */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main content area - Scrolls independently */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {" "}
        {/* Added flex flex-col and lg:ml-64 */}
        <DashboardHeader setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 p-6 overflow-y-auto h-[calc(100vh-64px)]">
          {" "}
          {/* Added flex-1, overflow-y-auto, and h-[calc(100vh-64px)] */}
          {/* Stats Cards */}
          <StatsCards />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Quick Actions */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Actions rapides</h3>
                <div className="space-y-3">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      className="w-full flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className={`p-2 rounded-lg ${action.color} mr-3`}>
                        <action.icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-800">{action.title}</p>
                        <p className="text-xs text-gray-600">{action.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {/* Revenue Chart Placeholder */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenus de la semaine</h3>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Graphique des revenus</p>
                </div>
              </div>
            </div>
          </div>
          {/* Appointments Table */}
          <AppointmentsTable />
        </main>
      </div>
    </div>
  )
}
