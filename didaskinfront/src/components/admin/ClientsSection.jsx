"use client";

import { useState, useEffect } from "react";
import { Pencil } from "lucide-react";

export default function ClientsSection() {
  const [showAddClient, setShowAddClient] = useState(false);
  const [newClient, setNewClient] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    is_subscribed: false,
  });
  const [editClientId, setEditClientId] = useState(null);
  const [editClient, setEditClient] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    is_subscribed: false,
  });
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configuration de l'API
  const API_BASE_URL = "http://localhost:8000";

  // Récupérer tous les clients
  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/users`);
      const result = await response.json();

      if (result.success) {
        setClients(result.data);
      } else {
        setError("Erreur lors de la récupération des clients");
      }
    } catch (error) {
      setError("Erreur de connexion au serveur");
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  // Charger les clients au montage du composant
  useEffect(() => {
    fetchClients();
  }, []);

  // Ajouter un nouveau client
  const handleAddClient = async (e) => {
    e.preventDefault();

    if (
      !newClient.firstName ||
      !newClient.lastName ||
      !newClient.email ||
      !newClient.phoneNumber
    ) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: newClient.firstName,
          lastName: newClient.lastName,
          email: newClient.email,
          phoneNumber: newClient.phoneNumber,
          role: "ROLE_USER",
          is_subscribed: newClient.is_subscribed,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Recharger la liste des clients
        await fetchClients();

        // Réinitialiser le formulaire
        setNewClient({
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          is_subscribed: false,
        });
        setShowAddClient(false);
      } else {
        setError(result.error || "Erreur lors de l'ajout du client");
      }
    } catch (error) {
      setError("Erreur de connexion au serveur");
      console.error("Erreur:", error);
    }
  };

  // Modifier un client
  const handleEditClick = (client) => {
    setEditClientId(client.id);
    setEditClient({
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email,
      phoneNumber: client.phoneNumber,
      is_subscribed: client.is_subscribed,
    });
  };

  const handleEditClient = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}/users/${editClientId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editClient),
      });

      const result = await response.json();

      if (result.success) {
        // Recharger la liste des clients
        await fetchClients();

        // Fermer le modal d'édition
        setEditClientId(null);
        setEditClient({
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          is_subscribed: false,
        });
      } else {
        setError(result.error || "Erreur lors de la modification du client");
      }
    } catch (error) {
      setError("Erreur de connexion au serveur");
      console.error("Erreur:", error);
    }
  };

  // Gérer l'abonnement newsletter
  const handleToggleSubscription = async (id, currentStatus) => {
    try {
      const endpoint = currentStatus
        ? "unsubscribe-newsletter"
        : "subscribe-newsletter";
      const response = await fetch(`${API_BASE_URL}/users/${id}/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (result.success) {
        // Recharger la liste des clients
        await fetchClients();
      } else {
        setError(
          result.error || "Erreur lors de la modification de l'abonnement"
        );
      }
    } catch (error) {
      setError("Erreur de connexion au serveur");
      console.error("Erreur:", error);
    }
  };

  // Supprimer un client
  const handleDeleteClient = async (id) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        // Recharger la liste des clients
        await fetchClients();
      } else {
        setError(result.error || "Erreur lors de la suppression du client");
      }
    } catch (error) {
      setError("Erreur de connexion au serveur");
      console.error("Erreur:", error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
        <div className="text-center">Chargement des clients...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
        <div className="text-red-600 mb-4">Erreur: {error}</div>
        <button
          onClick={() => setError(null)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Réessayer
        </button>
      </div>
    );
  }

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

      {clients.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          Aucun client trouvé
        </div>
      ) : (
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
                  <td className="px-4 py-2 whitespace-nowrap">
                    {client.email}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {client.phoneNumber}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        client.is_subscribed
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {client.is_subscribed ? "Abonné" : "Non abonné"}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          handleToggleSubscription(
                            client.id,
                            client.is_subscribed
                          )
                        }
                        className="w-28 px-3 py-1 rounded bg-[#D4A574] text-white text-xs font-medium hover:bg-[#b88b5c] transition text-center"
                        style={{ minWidth: "7rem" }}
                      >
                        {client.is_subscribed ? "Désabonner" : "Abonner"}
                      </button>
                      <button
                        onClick={() => handleEditClick(client)}
                        className="p-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
                        title="Éditer"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClient(client.id)}
                        className="p-2 rounded bg-red-500 text-white hover:bg-red-600 transition"
                        title="Supprimer"
                      >
                        ×
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
                value={newClient.phoneNumber}
                onChange={(e) =>
                  setNewClient((c) => ({ ...c, phoneNumber: e.target.value }))
                }
                required
              />
            </div>
            <div className="mb-4 flex items-center">
              <input
                id="subscribed"
                type="checkbox"
                className="mr-2"
                checked={newClient.is_subscribed}
                onChange={(e) =>
                  setNewClient((c) => ({
                    ...c,
                    is_subscribed: e.target.checked,
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
                value={editClient.phoneNumber}
                onChange={(e) =>
                  setEditClient((c) => ({ ...c, phoneNumber: e.target.value }))
                }
                required
              />
            </div>
            <div className="mb-4 flex items-center">
              <input
                id="editSubscribed"
                type="checkbox"
                className="mr-2"
                checked={editClient.is_subscribed}
                onChange={(e) =>
                  setEditClient((c) => ({
                    ...c,
                    is_subscribed: e.target.checked,
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
