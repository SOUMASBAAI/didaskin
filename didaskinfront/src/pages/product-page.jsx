
import Header from "../components/header"
import Card from "../components/card"

export default function ProductPage() {
  const products = [
    {
      imageSrc:
        "https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVpdCUyMHNraW5jYXJlfGVufDB8fDB8fHww",
      title: "SOIN VISAGE HYDRATANT",
    
      price: "85 €",
    },
    {
      imageSrc:
        "https://plus.unsplash.com/premium_photo-1679049600123-23be208ea913?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cHJvZHVpdCUyMHNraW5jYXJlfGVufDB8fDB8fHww",
      title: "EXTENSION DE CILS VOLUME RUSSE",
      price: "120 €",
    },
    {
      imageSrc:
        "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHByb2R1aXQlMjBza2luY2FyZXxlbnwwfHwwfHx8MA%3D%3D",
      title: "MASSAGE RELAXANT CORPS",
      price: "95 €",
    },
    {
      imageSrc:
        "https://images.unsplash.com/photo-1670201203150-bf8771401590?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nzh8fHByb2R1aXQlMjBza2luY2FyZXxlbnwwfHwwfHx8MA%3D%3D",
      title: "ÉPILATION LASER JAMBES",
      price: "150 €",
    },
    {
      imageSrc:
        "https://images.unsplash.com/photo-1670201202833-b0932731628f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODd8fHByb2R1aXQlMjBza2luY2FyZXxlbnwwfHwwfHx8MA%3D%3D",
      title: "MICROBLADING SOURCILS",
      price: "250 €",
    },
    {
      imageSrc:
        "https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2VydW18ZW58MHx8MHx8fDA%3D",
      title: "SÉRUM ANTI-ÂGE LUXE",
      price: "75 €",
    },
    {
      imageSrc:
        "https://images.unsplash.com/photo-1696671296367-1549e8236fe4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTQwfHxwcm9kdWl0JTIwc2tpbmNhcmV8ZW58MHx8MHx8fDA%3D",
      title: "SOIN ANTI-ACNÉ",
      price: "90 €",
    },
    {
      imageSrc:
        "https://plus.unsplash.com/premium_photo-1679448061971-ee0993f0e500?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODF8fHByb2R1Y3QlMjBiZWF1dHl8ZW58MHx8MHx8fDA%3D",
      title: "MASQUE DÉTOXIFIANT",
      price: "45 €",
    },
  ]

  return (
    <div className="min-h-screen bg-[#F5F1ED]">
      <Header />

      <main className="pt-24 pb-12 px-2 md:px-4">
        <h2 className="text-lg font-light text-gray-800 text-left mb-1 tracking-wide px-2 md:px-4">
          {"NOS SOINS & PRODUITS"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-[3px] gap-y-[3px]">
          {products.map((product, index) => (
            <Card
              key={index}
              imageSrc={product.imageSrc}
              title={product.title}
              price={product.price}
            />
          ))}
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="bg-white border-t border-gray-100 py-6 text-center text-sm text-gray-600">
        <p>© 2024 DIDA SKIN. Tous droits réservés.</p>
      </footer>
    </div>
  )
}
