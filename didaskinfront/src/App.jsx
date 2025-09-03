import { Routes, Route } from "react-router-dom";  
import AdminDashboard from "./pages/admin-dashboard";
import AdminLogin from "./pages/admin-login";
import ServicePage from "./pages/service-page";
import ProductPage from "./pages/product-page";
import ServiceDetailPage from "./pages/service-detail-page";
import CategoryPage from "./pages/category-page";
import ProductDetailPage from "./pages/product-detail-page";
import BookingPage from "./pages/booking-page";
import ServiceBookingPage from "./pages/service-booking-page";
import MyAppointmentsPage from "./pages/my-appointments-page";
import LegalNotice from "./pages/LegalNotice";  
import PrivacyPolicy from "./pages/PrivacyPolicy";
import LandingPage from "./pages/landing-page";
import ProtectedRoute from "./components/ProtectedRoute";
import SearchResults from "./pages/search-results";
import AdminResetPassword from "./pages/admin-reset-password";
import NotFound from "./pages/NotFound";

import "./index.css";

function App() {
  return (
    <>

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/services" element={<ServicePage />} />
        <Route path="/categories" element={<CategoryPage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/service/:id" element={<ServiceDetailPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/booking/:id" element={<BookingPage />} />
        <Route path="/service-booking/:id" element={<ServiceBookingPage />} />
        <Route path="/my-appointments" element={<MyAppointmentsPage />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="*" element={<NotFound />} />




        
       
        
        {/* Admin routes */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-reset-password" element={<AdminResetPassword />} />
       <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
          
        />
      
        {/* Legal Notice Page */}
        <Route path="/legal-notice" element={<LegalNotice />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      </Routes>
    </>
  );
}

export default App;
