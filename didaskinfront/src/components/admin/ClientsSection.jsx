"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";

export default function ClientsSection() {
  const [showAddClient, setShowAddClient] = useState(false);
  const [newClient, setNewClient] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subscribed: false,
  });
  const [editClientId, setEditClientId] = useState(null);
  const [editClient, setEditClient] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subscribed: false,
  });

  // Données mock pour les clients
  const [clients, setClients] = useState([
    {
      id: 1,
      firstName: "Marie",
      lastName: "Dubois",
      email: "marie.dubois@email.com",
      phone: "06 12 34 56 78",
      subscribed: true,
    },
    {
      id: 2,
      firstName: "Sophie",
      lastName: "Martin",
      email: "sophie.martin@email.com",
      phone: "06 98 76 54 32",
      subscribed: false,
    },
    {
      id: 3,
      firstName: "Emma",
      lastName: "Laurent",
      email: "emma.laurent@email.com",
      phone: "06 11 22 33 44",
      subscribed: true,
    },
    {
      id: 4,
      firstName: "Julie",
      lastName: "Moreau",
      email: "julie.moreau@email.com",
      phone: "06 55 66 77 88",
      subscribed: false,
    },
  ]);

  const handleToggleSubscription = (id) => {
    setClients((prev) =>
      prev.map((client) =>
        client.id === id
          ? { ...client, subscribed: !client.subscribed }
          : client
      )
    );
  };

  const handleAddClient = (e) => {
    e.preventDefault();
    if (
      !newClient.firstName ||
      !newClient.lastName ||
      !newClient.email ||
      !newClient.phone
    )
      return;
    setClients((prev) => [
      ...prev,
      {
        ...newClient,
        id: prev.length ? Math.max(...prev.map((c) => c.id)) + 1 : 1,
      },
    ]);
    setNewClient({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      subscribed: false,
    });
    setShowAddClient(false);
  };

  const handleEditClick = (client) => {
    setEditClientId(client.id);
    setEditClient({
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email,
      phone: client.phone,
      subscribed: client.subscribed,
    });
  };

  const handleEditClient = (e) => {
    e.preventDefault();
    setClients((prev) =>
      prev.map((client) =>
        client.id === editClientId ? { ...client, ...editClient } : client
      )
    );
    setEditClientId(null);
    setEditClient({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      subscribed: false,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center justify-between">
        Clients abonnés à la newsletter
        <button
          onClick={() => setShowAddClient(true)}
          className="ml-4 flex items-center justify-center w-8 h-8 rounded-full bg-[#D4A574] text-white text-2xl hover:bg-[#b88b5c] transition"
          title="Ajouter un client"
        >
          +
        </button>
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Nom
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Prénom
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Email
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Téléphone
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Statut
              </th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {clients.map((client) => (
              <tr key={client.id}>
                <td className="px-4 py-2 whitespace-nowrap">
                  {client.lastName}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {client.firstName}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">{client.email}</td>
                <td className="px-4 py-2 whitespace-nowrap">{client.phone}</td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      client.subscribed
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {client.subscribed ? "Abonné" : "Non abonné"}
                  </span>
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleSubscription(client.id)}
                      className="w-28 px-3 py-1 rounded bg-[#D4A574] text-white text-xs font-medium hover:bg-[#b88b5c] transition text-center"
                      style={{ minWidth: "7rem" }}
                    >
                      {client.subscribed ? "Désabonner" : "Abonner"}
                    </button>
                    <button
                      onClick={() => handleEditClick(client)}
                      className="p-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
                      title="Éditer"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Ajouter Client */}
      {showAddClient && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <form
            onSubmit={handleAddClient}
            className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative"
          >
            <button
              type="button"
              onClick={() => setShowAddClient(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
            >
              ×
            </button>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Ajouter un client
            </h3>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded px-3 py-2"
                value={newClient.lastName}
                onChange={(e) =>
                  setNewClient((c) => ({ ...c, lastName: e.target.value }))
                }
                required
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prénom
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded px-3 py-2"
                value={newClient.firstName}
                onChange={(e) =>
                  setNewClient((c) => ({ ...c, firstName: e.target.value }))
                }
                required
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full border border-gray-200 rounded px-3 py-2"
                value={newClient.email}
                onChange={(e) =>
                  setNewClient((c) => ({ ...c, email: e.target.value }))
                }
                required
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded px-3 py-2"
                value={newClient.phone}
                onChange={(e) =>
                  setNewClient((c) => ({ ...c, phone: e.target.value }))
                }
                required
              />
            </div>
            <div className="mb-4 flex items-center">
              <input
                id="subscribed"
                type="checkbox"
                className="mr-2"
                checked={newClient.subscribed}
                onChange={(e) =>
                  setNewClient((c) => ({
                    ...c,
                    subscribed: e.target.checked,
                  }))
                }
              />
              <label htmlFor="subscribed" className="text-sm text-gray-700">
                Abonné à la newsletter
              </label>
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-[#D4A574] text-white font-medium rounded hover:bg-[#b88b5c] transition"
            >
              Ajouter
            </button>
          </form>
        </div>
      )}

      {/* Modal Éditer Client */}
      {editClientId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <form
            onSubmit={handleEditClient}
            className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative"
          >
            <button
              type="button"
              onClick={() => setEditClientId(null)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
            >
              ×
            </button>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Modifier le client
            </h3>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded px-3 py-2"
                value={editClient.lastName}
                onChange={(e) =>
                  setEditClient((c) => ({ ...c, lastName: e.target.value }))
                }
                required
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prénom
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded px-3 py-2"
                value={editClient.firstName}
                onChange={(e) =>
                  setEditClient((c) => ({ ...c, firstName: e.target.value }))
                }
                required
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full border border-gray-200 rounded px-3 py-2"
                value={editClient.email}
                onChange={(e) =>
                  setEditClient((c) => ({ ...c, email: e.target.value }))
                }
                required
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded px-3 py-2"
                value={editClient.phone}
                onChange={(e) =>
                  setEditClient((c) => ({ ...c, phone: e.target.value }))
                }
                required
              />
            </div>
            <div className="mb-4 flex items-center">
              <input
                id="editSubscribed"
                type="checkbox"
                className="mr-2"
                checked={editClient.subscribed}
                onChange={(e) =>
                  setEditClient((c) => ({
                    ...c,
                    subscribed: e.target.checked,
                  }))
                }
              />
              <label htmlFor="editSubscribed" className="text-sm text-gray-700">
                Abonné à la newsletter
              </label>
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 text-white font-medium rounded hover:bg-blue-600 transition"
            >
              Enregistrer
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
