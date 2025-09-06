"use client";

import { useState, useEffect } from "react";
import { Pencil } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { RESOURCE_ENDPOINTS } from "../../config/apiConfig";

export default function ClientsSection() {
  const { getAuthHeaders, isAuthenticated, isLoading, handleApiResponse } =
    useAuth();
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

  // Récupérer tous les clients
  const fetchClients = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(RESOURCE_ENDPOINTS.USERS, {
        headers: getAuthHeaders(),
      });

      if (response.status === 401) {
        setError("Session expirée. Veuillez vous reconnecter.");
        setLoading(false);
        return;
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        setError("Réponse invalide du serveur");
        setLoading(false);
        return;
      }

      const result = await handleApiResponse(response);

      if (result.success) {
        setClients(result.data);
      } else {
        setError("Erreur lors de la récupération des clients");
      }
    } catch (error) {
      if (error.message === "SESSION_EXPIRED") {
        setError("Session expirée. Veuillez vous reconnecter.");
      } else if (error.message === "INVALID_RESPONSE") {
        setError("Réponse invalide du serveur");
      } else {
        setError("Erreur de connexion au serveur");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      fetchClients();
    }
  }, [isAuthenticated, isLoading]);

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
      const response = await fetch(`${RESOURCE_ENDPOINTS.USERS}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          ...newClient,
          role: "ROLE_USER",
        }),
      });

      const result = await handleApiResponse(response);

      if (result.success) {
        await fetchClients();
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
    }
  };

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
      const response = await fetch(
        `${RESOURCE_ENDPOINTS.USERS}/${editClientId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify(editClient),
        }
      );

      const result = await handleApiResponse(response);

      if (result.success) {
        await fetchClients();
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
    }
  };

  const handleToggleSubscription = async (id, currentStatus) => {
    try {
      const endpoint = currentStatus
        ? "unsubscribe-newsletter"
        : "subscribe-newsletter";
      const response = await fetch(
        `${RESOURCE_ENDPOINTS.USERS}/${id}/${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
        }
      );

      const result = await handleApiResponse(response);

      if (result.success) {
        await fetchClients();
      } else {
        setError("Erreur lors de la modification de l'abonnement");
      }
    } catch (error) {
      setError("Erreur de connexion au serveur");
    }
  };

  const handleDeleteClient = async (id) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) {
      return;
    }

    try {
      const response = await fetch(`${RESOURCE_ENDPOINTS.USERS}/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      const result = await handleApiResponse(response);

      if (result.success) {
        await fetchClients();
      } else {
        setError("Erreur lors de la suppression du client");
      }
    } catch (error) {
      setError("Erreur de connexion au serveur");
    }
  };

  if (loading) {
    return (
      <section className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
        <p className="text-center">Chargement des clients...</p>
      </section>
    );
  }

  if (!isAuthenticated) {
    return (
      <section className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
        <p className="text-center text-gray-600">
          Veuillez vous connecter pour accéder à cette section.
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
        <p className="text-red-600 mb-4">Erreur: {error}</p>
        <button
          onClick={() => setError(null)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Réessayer
        </button>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
      <header>
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
      </header>

      {clients.length === 0 ? (
        <p className="text-center text-gray-500 py-8">Aucun client trouvé</p>
      ) : (
        <article className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  Nom
                </th>
                <th
                  scope="col"
                  className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  Prénom
                </th>
                <th
                  scope="col"
                  className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  Téléphone
                </th>
                <th
                  scope="col"
                  className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                >
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
                    <nav className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          handleToggleSubscription(
                            client.id,
                            client.is_subscribed
                          )
                        }
                        className="w-28 px-3 py-1 rounded bg-[#D4A574] text-white text-xs font-medium hover:bg-[#b88b5c] transition text-center"
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
                    </nav>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
      )}

      {/* Ajouter Client */}
      {showAddClient && (
        <dialog
          open
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
        >
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
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prénom
                </label>
                <input
                  type="text"
                  value={newClient.firstName}
                  onChange={(e) =>
                    setNewClient({ ...newClient, firstName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4A574] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom
                </label>
                <input
                  type="text"
                  value={newClient.lastName}
                  onChange={(e) =>
                    setNewClient({ ...newClient, lastName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4A574] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={newClient.email}
                  onChange={(e) =>
                    setNewClient({ ...newClient, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4A574] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={newClient.phoneNumber}
                  onChange={(e) =>
                    setNewClient({ ...newClient, phoneNumber: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4A574] focus:border-transparent"
                  required
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="newClientSubscribed"
                  checked={newClient.is_subscribed}
                  onChange={(e) =>
                    setNewClient({
                      ...newClient,
                      is_subscribed: e.target.checked,
                    })
                  }
                  className="h-4 w-4 text-[#D4A574] focus:ring-[#D4A574] border-gray-300 rounded"
                />
                <label
                  htmlFor="newClientSubscribed"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Abonné à la newsletter
                </label>
              </div>
            </div>
            <footer className="mt-6">
              <button
                type="submit"
                className="w-full py-2 px-4 bg-[#D4A574] text-white font-medium rounded hover:bg-[#b88b5c] transition"
              >
                Ajouter
              </button>
            </footer>
          </form>
        </dialog>
      )}

      {/* Modal Éditer Client */}
      {editClientId && (
        <dialog
          open
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
        >
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
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prénom
                </label>
                <input
                  type="text"
                  value={editClient.firstName}
                  onChange={(e) =>
                    setEditClient({ ...editClient, firstName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom
                </label>
                <input
                  type="text"
                  value={editClient.lastName}
                  onChange={(e) =>
                    setEditClient({ ...editClient, lastName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={editClient.email}
                  onChange={(e) =>
                    setEditClient({ ...editClient, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={editClient.phoneNumber}
                  onChange={(e) =>
                    setEditClient({
                      ...editClient,
                      phoneNumber: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="editClientSubscribed"
                  checked={editClient.is_subscribed}
                  onChange={(e) =>
                    setEditClient({
                      ...editClient,
                      is_subscribed: e.target.checked,
                    })
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="editClientSubscribed"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Abonné à la newsletter
                </label>
              </div>
            </div>
            <footer className="mt-6">
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-500 text-white font-medium rounded hover:bg-blue-600 transition"
              >
                Enregistrer
              </button>
            </footer>
          </form>
        </dialog>
      )}
    </section>
  );
}
