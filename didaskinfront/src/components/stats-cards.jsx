"use client"

import { TrendingUp, TrendingDown, Users, Calendar, DollarSign, Scissors } from "lucide-react"

export default function StatsCards() {
  const stats = [
    {
      title: "Rendez-vous aujourd'hui",
      value: "12",
      change: "+2",
      trend: "up",
      icon: Calendar,
      color: "bg-blue-500",
    },
    {
      title: "Nouveaux clients",
      value: "8",
      change: "+3",
      trend: "up",
      icon: Users,
      color: "bg-green-500",
    },
    {
      title: "Revenus du jour",
      value: "1,250€",
      change: "+15%",
      trend: "up",
      icon: DollarSign,
      color: "bg-[#D4A574]",
    },
    {
      title: "Services populaires",
      value: "Cils",
      change: "45%",
      trend: "up",
      icon: Scissors,
      color: "bg-purple-500",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <div className="flex items-center mt-2">
                {stat.trend === "up" ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm font-medium ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                  {stat.change}
                </span>
              </div>
            </div>
            <div className={`p-3 rounded-lg ${stat.color}`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
