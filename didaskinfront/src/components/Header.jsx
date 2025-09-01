"use client";

import { Search, ShoppingBag, Calendar, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import logo from "../assets/logo-didaskin.png";
import { API_BASE_URL } from "../config/apiConfig";

export default function Header() {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [showServicesMenu, setShowServicesMenu] = useState(false);
  const [subByCat, setSubByCat] = useState({});
  const menuRef = useRef(null);
  const headerRef = useRef(null);
  const closeTimerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(72);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "NOS SERVICES", href: "/services" },
    { name: "NOS PRODUITS", href: "/products" },
  ];

  // Reset search when navigating to different pages
  useEffect(() => {
    setIsSearchExpanded(false);
    setSearchQuery("");
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Measure header height for fixed mega menu top
  useEffect(() => {
    const measure = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight || 72);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Fetch categories for Services dropdown
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const r = await fetch(`${API_BASE_URL}/categories`);
        if (!r.ok) return;
        const j = await r.json();
        if (!ignore && j?.success) setCategories(j.data || []);
      } catch {}
    })();
    return () => {
      ignore = true;
    };
  }, []);

  // Fetch subcategories for each category (once categories are loaded)
  useEffect(() => {
    if (!categories || categories.length === 0) return;
    let cancelled = false;
    (async () => {
      try {
        const results = await Promise.all(
          categories.map(async (cat) => {
            try {
              const r = await fetch(
                `${API_BASE_URL}/subcategories/category/${cat.id}`
              );
              const j = await r.json();
              return [cat.id, j?.success ? j.data || [] : []];
            } catch {
              return [cat.id, []];
            }
          })
        );
        if (!cancelled) {
          const map = {};
          for (const [id, subs] of results) map[id] = subs;
          setSubByCat(map);
        }
      } catch {}
    })();
    return () => {
      cancelled = true;
    };
  }, [categories]);

  // Close on click outside / Escape
  useEffect(() => {
    const onDown = (e) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setShowServicesMenu(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        setShowServicesMenu(false);
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const openMenu = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setShowServicesMenu(true);
  };
  const scheduleCloseMenu = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => setShowServicesMenu(false), 150);
  };

  const handleSearchToggle = () => {
    setIsSearchExpanded(!isSearchExpanded);
    if (isSearchExpanded) {
      setSearchQuery("");
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search page with search query
      navigate(`/search?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchExpanded(false);
      setSearchQuery("");
    }
  };

  const handleSearchClose = () => {
    setIsSearchExpanded(false);
    setSearchQuery("");
  };

  // When search is expanded, show only the search bar
  if (isSearchExpanded) {
    return (
      <header className="bg-[#F5F1ED] border-b border-gray-100 py-3 px-6 md:px-12 flex items-center justify-center sticky top-0 z-10">
        <form onSubmit={handleSearchSubmit} className="w-full max-w-4xl">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un service..."
              className="w-full pl-12 pr-16 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-lg"
              autoFocus
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <button
              type="button"
              onClick={handleSearchClose}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 px-2 py-1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </form>
      </header>
    );
  }

  // Normal header when search is not expanded
  return (
    <header
      ref={headerRef}
      className="bg-[#F5F1ED] border-b border-gray-100 py-2 md:py-3 px-6 md:px-12 flex items-center justify-between sticky top-0 z-10 relative"
    >
      {/* Left Nav - Hidden on desktop, shown on mobile */}
      <nav className="hidden lg:flex space-x-16 flex-nowrap">
        {/* Cette section est maintenant gérée dans la section desktop ci-dessous */}
      </nav>

      {/* Mobile: sandwich + logo + search in one row */}
      <div className="flex items-center justify-between w-full lg:hidden">
        {/* Sandwich */}
        <button
          className="text-gray-700"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Ouvrir le menu"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
        {/* Logo */}
        <div className="text-center pt-2">
          <Link to="/" className="block">
            <img src={logo} alt="DIDA SKIN" className="h-10 w-auto mx-auto" />
          </Link>
        </div>
        {/* Search */}
        <button onClick={handleSearchToggle} className="text-gray-700">
          <Search className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile slide-over menu */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div className="fixed top-0 left-0 h-full w-80 max-w-[85%] bg-[#F5F1ED] z-50 shadow-xl lg:hidden flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <span className="text-sm font-semibold tracking-wide text-gray-900">
                Menu
              </span>
              <button
                className="text-gray-600 hover:text-gray-800"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Fermer le menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="p-4 space-y-2 overflow-y-auto">
              <Link
                to="/"
                className="block px-3 py-2 rounded text-gray-800 hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Accueil
              </Link>
              <Link
                to="/services"
                className="block px-3 py-2 rounded text-gray-800 hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Nos services
              </Link>
              <Link
                to="/products"
                className="block px-3 py-2 rounded text-gray-800 hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Nos produits
              </Link>
              <Link
                to="/booking"
                className="block px-3 py-2 rounded text-gray-800 hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Réserver un soin
              </Link>
            </nav>
          </div>
        </>
      )}

      {/* Desktop center logo and right actions */}
      <div className="hidden lg:flex items-center justify-between w-full">
        {/* Left section - Services and Products */}
        <div className="flex items-center space-x-6 flex-nowrap">
          {/* NOS SERVICES with mega dropdown */}
          <div
            className="relative"
            onMouseEnter={openMenu}
            onMouseLeave={scheduleCloseMenu}
          >
            <a
              href="#"
              className="text-sm font-medium text-gray-800 hover:text-black transition-colors tracking-wide whitespace-nowrap"
            >
              NOS SERVICES
            </a>
            {showServicesMenu && (
              <div
                ref={menuRef}
                onMouseEnter={openMenu}
                onMouseLeave={scheduleCloseMenu}
                className="fixed left-0 right-0 bg-[#F5F1ED] border-t border-gray-200 shadow-2xl z-30 px-6 md:px-12 py-8"
                style={{ top: headerHeight }}
              >
                {categories.length === 0 ? (
                  <div className="text-sm text-gray-600">Chargement...</div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-10">
                    {categories.map((cat) => (
                      <div key={cat.id} className="min-w-0">
                        <div className="text-[11px] font-bold text-gray-900 tracking-widest mb-3 uppercase">
                          {cat.label}
                        </div>
                        <ul className="space-y-2">
                          {(subByCat[cat.id] || []).slice(0, 7).map((sub) => (
                            <li key={sub.id}>
                              <Link
                                to={`/services?subcategory=${sub.id}`}
                                className="text-[13px] text-gray-700 hover:text-black"
                                onClick={() => setShowServicesMenu(false)}
                              >
                                {sub.label}
                              </Link>
                            </li>
                          ))}
                          <li className="pt-3">
                            <Link
                              to={`/categories?category=${cat.id}`}
                              className="text-[12px] font-semibold text-gray-900 tracking-wide hover:underline"
                              onClick={() => setShowServicesMenu(false)}
                            >
                              TOUT VOIR
                            </Link>
                          </li>
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          {/* NOS PRODUITS */}
          <Link
            to="/products"
            className="text-sm font-medium text-gray-800 hover:text-black transition-colors tracking-wide whitespace-nowrap"
          >
            NOS PRODUITS
          </Link>
        </div>

        {/* Center Logo - Vraiment centré */}
        <div className="absolute left-1/2 transform -translate-x-1/2 pt-3">
          <Link to="/" className="block">
            <img src={logo} alt="DIDA SKIN" className="h-14 w-auto" />
          </Link>
        </div>

        {/* Right Icons */}
        <div className="flex items-center space-x-4 md:space-x-6">
          <button
            onClick={handleSearchToggle}
            className="text-gray-700 hover:text-black"
          >
            <Search className="h-5 w-5" />
          </button>
          <Link
            to="/booking"
            className="hidden md:block text-sm font-medium text-gray-800 hover:text-black transition-colors whitespace-nowrap"
          >
            RESERVER UN SOIN
          </Link>
        </div>
      </div>
    </header>
  );
}
