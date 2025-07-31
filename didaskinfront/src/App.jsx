import { Routes, Route } from "react-router-dom";  // <-- Ajoute Routes et Route ici
import AdminDashboard from "./pages/admin-dashboard";
import AdminLogin from "./pages/admin-login";
import ServicePage from "./pages/service-page";
import ProductPage from "./pages/product-page";
import ServiceDetailPage from "./pages/service-detail-page";
import ProductDetailPage from "./pages/product-detail-page";
import CategoryPage from "./pages/category-page";
import LandingPage from "./pages/landing-page";
import Reservation from "./pages/reservation";

import "./index.css";

function App() {
  return (
    <>
  

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/services" element={<ServicePage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/service/:id" element={<ServiceDetailPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/reservation" element={<Reservation />} />
        
        {/* Category page */}
        <Route path="/category/:id" element={<CategoryPage />} />
        
       
        
        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      
      </Routes>
    </>
  );
}

export default App;
