"use client"

import { Clock, User, Phone } from "lucide-react"

export default function AppointmentsTable() {
  const appointments = [
    {
      id: 1,
      client: "Marie Dubois",
      service: "Extension de cils",
      time: "09:00",
      phone: "06 12 34 56 78",
      status: "confirmé",
    },
    {
      id: 2,
      client: "Sophie Martin",
      service: "Rehaussement de cils",
      time: "10:30",
      phone: "06 98 76 54 32",
      status: "en attente",
    },
    {
      id: 3,
      client: "Emma Laurent",
      service: "Teinture sourcils",
      time: "14:00",
      phone: "06 11 22 33 44",
      status: "confirmé",
    },
    {
      id: 4,
      client: "Julie Moreau",
      service: "Extension de cils",
      time: "15:30",
      phone: "06 55 66 77 88",
      status: "annulé",
    },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmé":
        return "bg-green-100 text-green-800"
      case "en attente":
        return "bg-yellow-100 text-yellow-800"
      case "annulé":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800">Rendez-vous d'aujourd'hui</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Service
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Heure</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {appointments.map((appointment) => (
              <tr key={appointment.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-[#D4A574] rounded-full flex items-center justify-center mr-3">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{appointment.client}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{appointment.service}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-1" />
                    {appointment.time}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-1" />
                    {appointment.phone}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}
                  >
                    {appointment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
