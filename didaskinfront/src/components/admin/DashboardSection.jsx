"use client";

import {
  Calendar,
  Users,
  FileText,
  ExternalLink,
  Clock,
  Mail,
  TrendingUp,
} from "lucide-react";
import StatsCards from "../stats-cards";
import { useState } from "react";

export default function DashboardSection() {
  // Données mock pour les RDV (à remplacer par Planity API)
  const [appointments] = useState([
    {
      id: 1,
      client: "Marie Dubois",
      service: "Soin Hydratant",
      time: "14:00",
      status: "confirmé",
    },
    {
      id: 2,
      client: "Sophie Martin",
      service: "Massage",
      time: "16:30",
      status: "confirmé",
    },
    {
      id: 3,
      client: "Emma Laurent",
      service: "Manucure",
      time: "18:00",
      status: "en attente",
    },
  ]);

  const todayAppointments = appointments.filter(
    (apt) => apt.status === "confirmé"
  );
  const pendingAppointments = appointments.filter(
    (apt) => apt.status === "en attente"
  );

  const quickActions = [
    {
      title: "Nouveau rendez-vous",
      description: "Créer un RDV sur Planity",
      icon: Calendar,
      color: "bg-blue-500",
      action: () =>
        window.open("https://app.planity.com/center-beauty", "_blank"),
    },
    {
      title: "Gérer les RDV",
      description: "Accéder au calendrier Planity",
      icon: Clock,
      color: "bg-green-500",
      action: () =>
        window.open("https://app.planity.com/center-beauty/calendar", "_blank"),
    },
    {
      title: "Rapport mensuel",
      description: "Générer le rapport du mois",
      icon: FileText,
      color: "bg-[#D4A574]",
      action: () => console.log("Générer rapport"),
    },
  ];

  return (
    <>
      {/* Stats Cards avec métriques Planity */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-blue-500 mr-4">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                RDV Aujourd'hui
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {todayAppointments.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-orange-500 mr-4">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Traffic</p>
              <p className="text-2xl font-bold text-gray-900">1,247</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-green-500 mr-4">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Nouveaux Abonnés Newsletter
              </p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Actions rapides
            </h3>
            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className="w-full flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200 group"
                >
                  <div className={`p-2 rounded-lg ${action.color} mr-3`}>
                    <action.icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-medium text-gray-800">{action.title}</p>
                    <p className="text-xs text-gray-600">
                      {action.description}
                    </p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Widget Planity */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Calendrier Planity
              </h3>
              <button
                onClick={() =>
                  window.open("https://app.planity.com/center-beauty", "_blank")
                }
                className="flex items-center text-sm text-[#D4A574] hover:text-[#b88b5c] transition-colors"
              >
                <span>Ouvrir Planity</span>
                <ExternalLink className="h-4 w-4 ml-1" />
              </button>
            </div>

            {/* Widget Planity (iframe ou placeholder) */}
            <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
              <div className="text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-2">Widget Planity</p>
                <p className="text-sm text-gray-500 mb-4">
                  Intégration du calendrier Planity en cours
                </p>
                <button
                  onClick={() =>
                    window.open(
                      "https://app.planity.com/center-beauty/calendar",
                      "_blank"
                    )
                  }
                  className="inline-flex items-center px-4 py-2 bg-[#D4A574] text-white rounded-lg hover:bg-[#b88b5c] transition-colors"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Voir le calendrier
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
