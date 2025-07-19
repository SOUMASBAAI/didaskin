"use client"

import { Search, ShoppingBag } from "lucide-react"

export default function Header() {
  const navLinks = [

    { name: "NOS SERVICES", href: "#" },
    { name: "NOS PRODUITS", href: "#" },
    
  ]

  return (
    <header className="bg-[#F5F1ED] border-b border-gray-100 py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 z-10">
      {/* Left Nav */}
      <nav className="hidden lg:flex space-x-8">
        {navLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            {link.name}
          </a>
        ))}
      </nav>

      {/* Mobile Menu Button (hidden on large screens) */}
      <button className="lg:hidden text-gray-700">
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>

      {/* Center Logo */}
      <div className="flex-grow text-center">
        <h1 className="text-2xl md:text-3xl font-light tracking-wider text-gray-800">DIDA SKIN</h1>
        <p className="text-xs text-gray-600 font-light tracking-wide">INSTITUT</p>
      </div>

      {/* Right Icons */}
      <div className="flex items-center space-x-4 md:space-x-6">
        <button className="text-gray-700 hover:text-gray-900">
          <Search className="h-5 w-5" />
        </button>
       
        {/* "PRENDRE UN RENDEZ-VOUS" */}
        <a
          href="#"
          className="hidden md:block text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors whitespace-nowrap"
        >
          RESERVER UN SOIN
        </a>
      </div>
    </header>
  )
}
