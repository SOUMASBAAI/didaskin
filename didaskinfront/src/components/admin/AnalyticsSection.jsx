import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";

const AnalyticsSection = () => {
  const { isAuthenticated } = useAuth();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState("7d"); // 7d, 30d, 90d

  // Fonction pour récupérer les données Google Analytics
  const fetchAnalyticsData = async () => {
    if (!window.gtag) {
      setError("Google Analytics n'est pas configuré");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simulation des données (remplacer par l'API Google Analytics)
      const mockData = {
        visitors: {
          total: 1247,
          unique: 892,
          new: 567,
          returning: 325,
        },
        pages: {
          totalViews: 3456,
          topPages: [
            { path: "/", views: 1234, uniqueViews: 890 },
            { path: "/services", views: 567, uniqueViews: 456 },
            { path: "/categories", views: 234, uniqueViews: 189 },
            { path: "/products", views: 123, uniqueViews: 98 },
          ],
        },
        engagement: {
          avgSessionDuration: "2m 34s",
          bounceRate: "34.2%",
          pagesPerSession: 2.8,
        },
        conversions: {
          bookings: 23,
          newsletterSignups: 45,
          contactForms: 12,
        },
      };

      setAnalyticsData(mockData);
    } catch (error) {
      setError("Erreur lors de la récupération des données analytics");
      console.error("Erreur analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAnalyticsData();
    }
  }, [isAuthenticated, dateRange]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Analytics du Site
          </h2>
          <p className="text-gray-600">Métriques de performance et trafic</p>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">7 derniers jours</option>
            <option value="30d">30 derniers jours</option>
            <option value="90d">90 derniers jours</option>
          </select>

          <button
            onClick={fetchAnalyticsData}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Chargement..." : "Actualiser"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {loading && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-blue-600">Chargement des données analytics...</p>
        </div>
      )}

      {analyticsData && (
        <div className="space-y-6">
          {/* Métriques principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
              <h3 className="text-lg font-semibold mb-2">Visiteurs Uniques</h3>
              <p className="text-3xl font-bold">
                {analyticsData.visitors.unique.toLocaleString()}
              </p>
              <p className="text-blue-100 text-sm">
                +12% vs période précédente
              </p>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
              <h3 className="text-lg font-semibold mb-2">Pages Vues</h3>
              <p className="text-3xl font-bold">
                {analyticsData.pages.totalViews.toLocaleString()}
              </p>
              <p className="text-green-100 text-sm">
                +8% vs période précédente
              </p>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
              <h3 className="text-lg font-semibold mb-2">Taux de Rebond</h3>
              <p className="text-3xl font-bold">
                {analyticsData.engagement.bounceRate}
              </p>
              <p className="text-purple-100 text-sm">
                -5% vs période précédente
              </p>
            </div>

            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-lg text-white">
              <h3 className="text-lg font-semibold mb-2">Réservations</h3>
              <p className="text-3xl font-bold">
                {analyticsData.conversions.bookings}
              </p>
              <p className="text-orange-100 text-sm">
                +15% vs période précédente
              </p>
            </div>
          </div>

          {/* Pages populaires */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Pages les Plus Visitées
            </h3>
            <div className="space-y-3">
              {analyticsData.pages.topPages.map((page, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-white rounded-md shadow-sm"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-semibold text-gray-500">
                      #{index + 1}
                    </span>
                    <span className="font-medium text-gray-900">
                      {page.path}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {page.views.toLocaleString()} vues
                    </p>
                    <p className="text-sm text-gray-600">
                      {page.uniqueViews.toLocaleString()} uniques
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Engagement et conversions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Engagement
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">
                    Durée moyenne de session
                  </span>
                  <span className="font-semibold text-gray-900">
                    {analyticsData.engagement.avgSessionDuration}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Pages par session</span>
                  <span className="font-semibold text-gray-900">
                    {analyticsData.engagement.pagesPerSession}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Taux de rebond</span>
                  <span className="font-semibold text-gray-900">
                    {analyticsData.engagement.bounceRate}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Conversions
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Réservations</span>
                  <span className="font-semibold text-green-600">
                    {analyticsData.conversions.bookings}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Newsletter</span>
                  <span className="font-semibold text-blue-600">
                    {analyticsData.conversions.newsletterSignups}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Formulaires contact</span>
                  <span className="font-semibold text-purple-600">
                    {analyticsData.conversions.contactForms}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsSection;
