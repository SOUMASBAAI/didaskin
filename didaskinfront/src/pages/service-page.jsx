"use client"

import Header from "../components/header"
import Card from "../components/card"

export default function ServicePage() {
  const services = [
    {
      imageSrc:
        "https://images.unsplash.com/photo-1731514771613-991a02407132?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "SOIN VISAGE HYDRATANT",
      description: "Hydratation profonde pour une peau éclatante.",
      price: "85 €",
    },
    {
      imageSrc:
        "https://images.unsplash.com/photo-1589710751893-f9a6770ad71b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8RVhURU5TSU9OJTIwREUlMjBDSUxTfGVufDB8fDB8fHww",
      title: "EXTENSION DE CILS VOLUME RUSSE",
      description: "Volume intense et regard sublimé.",
      price: "120 €",
    },
    {
      imageSrc:
        "https://images.unsplash.com/photo-1639162906614-0603b0ae95fd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8TUFTU0FHRXxlbnwwfHwwfHx8MA%3D%3D",
      title: "MASSAGE RELAXANT CORPS",
      description: "Détente absolue et bien-être.",
      price: "95 €",
    },
    {
      imageSrc:
        "https://images.unsplash.com/photo-1700760933574-9f0f4ea9aa3b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGFzZXIlMjBoYWlyfGVufDB8fDB8fHww",
      title: "ÉPILATION LASER JAMBES",
      description: "Peau lisse durablement.",
      price: "150 €",
    },
    {
      imageSrc:
        "https://plus.unsplash.com/premium_photo-1718626724867-970453587837?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8bWljcm9ibGFkaW5nfGVufDB8fDB8fHww",
      title: "MICROBLADING SOURCILS",
      description: "Sourcils parfaitement dessinés.",
      price: "250 €",
    },
    {
      imageSrc:
        "https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2VydW18ZW58MHx8MHx8fDA%3D",
      title: "SÉRUM ANTI-ÂGE LUXE",
      description: "Réduit les signes du vieillissement.",
      price: "75 €",
    },
  ]

  return (
    <div className="min-h-screen bg-[#F5F1ED]">
      <Header />

      <main className="pt-24 pb-12 px-2 md:px-4">
        {" "}
        {/* Increased pt for more margin from header */}
        <h2 className="text-lg font-light text-gray-800 text-left mb-1 tracking-wide px-2 md:px-4">
          {"NOS SOINS & PRODUITS"}
        </h2>{" "}
        {/* Reduced mb to mb-1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[3px] gap-y-[3px]">
          {services.map((service, index) => (
            <Card
              key={index}
              imageSrc={service.imageSrc}
              title={service.title}
              description={service.description}
              price={service.price}
            />
          ))}
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="bg-white border-t border-gray-100 py-6 text-center text-sm text-gray-600">
        <p>© 2025 DIDA SKIN. Tous droits réservés.</p>
      </footer>
    </div>
  )
}

