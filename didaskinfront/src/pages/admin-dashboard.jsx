"use client";

import { useState } from "react";
import Sidebar from "../components/sidebar";
import DashboardHeader from "../components/dashboard-header";
import DashboardSection from "../components/admin/DashboardSection";
import ClientsSection from "../components/admin/ClientsSection";
import CategoriesSection from "../components/admin/CategoriesSection";
import ServicesSection from "../components/admin/ServicesSection";
import ProductsSection from "../components/admin/ProductsSection";
import NewsletterSection from "../components/admin/NewsletterSection";
import QuizSection from "../components/admin/QuizSection";
import SettingsSection from "../components/admin/SettingsSection";
import AnalyticsSection from "../components/admin/AnalyticsSection";

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [notificationKey, setNotificationKey] = useState(0); // Clé pour forcer la mise à jour des notifications

  return (
    <div className="min-h-screen bg-[#F5F1ED] flex">
      {/* Sidebar - Fixed on desktop, slides for mobile */}
      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      {/* Main content area - Scrolls independently */}
      <div className="flex-1 flex flex-col lg:ml-64">
        <DashboardHeader
          setSidebarOpen={setSidebarOpen}
          key={notificationKey} // Force la remontée des notifications
        />
        <main className="flex-1 p-6 overflow-y-auto h-[calc(100vh-64px)]">
          {activeSection === "dashboard" && <DashboardSection />}
          {activeSection === "clients" && <ClientsSection />}
          {activeSection === "categories" && <CategoriesSection />}
          {activeSection === "services" && <ServicesSection />}
          {activeSection === "products" && <ProductsSection />}
          {activeSection === "newsletter" && <NewsletterSection />}
          {activeSection === "quiz" && <QuizSection />}
          {activeSection === "analytics" && <AnalyticsSection />}
          {activeSection === "settings" && <SettingsSection />}
        </main>
      </div>
    </div>
  );
}
