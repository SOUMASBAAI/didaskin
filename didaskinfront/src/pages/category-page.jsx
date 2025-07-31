
import Header from "../components/Header";
import Footer from "../components/Footer";   

export default function CategoryPage() {
  const allFaceCategories = [
    {
      name: "DIAGNOSTIC DE PEAU",
      image:
        "https://media.istockphoto.com/id/1442556244/photo/portrait-of-young-beautiful-woman-with-perfect-smooth-skin-isolated-over-white-background.jpg?s=612x612&w=0&k=20&c=4S7HufG4HDXznwuxFdliWndEAcWGKGvgqC45Ig0Zqog=",
      link: "",
    },
    {
      name: "SOINS DU VISAGE",
      image:
        "https://plus.unsplash.com/premium_photo-1715604347844-e09e8c138c2b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGZhY2UlMjBza2luY2FyZXxlbnwwfHwwfHx8MA%3D%3D",
      link: "",
    },
    {
      name: "TRAITEMENTS DU VISAGE",
      image:
        "https://images.unsplash.com/photo-1699207012725-72af224cca65?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDZ8fGZhY2UlMjBza2luY2FyZXxlbnwwfHwwfHx8MA%3D%3D",
      link: "",
    },
    {
      name: "COMBOS BY DIDA",
      image:
        "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      link: "/products-four-column-page",
    },
    {
      name: "PEELINGS",
      image:
        "https://plus.unsplash.com/premium_photo-1708271598478-2698f30a7b02?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDV8fGZhY2UlMjBza2luY2FyZXxlbnwwfHwwfHx8MA%3D%3D",
      link: "",
    },
    {
      name: "SOINS SIGNATURES BY DIDA",
      image:
        "https://images.unsplash.com/photo-1731514988957-46b5c56ac856?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTB8fGZhY2UlMjBza2luY2FyZXxlbnwwfHwwfHx8MA%3D%3D",
      link: "",
    },
    {
      name: "CATÉGORIE SUPPL. 1", // Nouvelle catégorie pour compléter la 3ème ligne
      image:
        "https://media.istockphoto.com/id/1442556244/photo/portrait-of-young-beautiful-woman-with-perfect-smooth-skin-isolated-over-white-background.jpg?s=612x612&w=0&k=20&c=4S7HufG4HDXznwuxFdliWndEAcWGKGvgqC45Ig0Zqog=",
      link: "",
    },
    {
      name: "CATÉGORIE SUPPL. 2", // Débordement
      image:
        "https://plus.unsplash.com/premium_photo-1715604347844-e09e8c138c2b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGZhY2UlMjBza2luY2FyZXxlbnwwfHwwfHx8MA%3D%3D",
      link: "",
    },
    {
      name: "CATÉGORIE SUPPL. 3", // Débordement
      image:
        "https://images.unsplash.com/photo-1699207012725-72af224cca65?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDZ8fGZhY2UlMjBza2luY2FyZXxlbnwwfHwwfHx8MA%3D%3D",
      link: "",
    },
    {
      name: "CATÉGORIE SUPPL. 4", // Débordement
      image:
        "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      link: "/products-four-column-page",
      link: "",
    },
    {
      name: "CATÉGORIE SUPPL. 5", // Débordement
      image:
        "https://plus.unsplash.com/premium_photo-1708271598478-2698f30a7b02?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDV8fGZhY2UlMjBza2luY2FyZXxlbnwwfHwwfHx8MA%3D%3D",
      link: "",
    },
  ];

  const mainLargeCategory = allFaceCategories[0];
  const rightGridCategories = allFaceCategories.slice(1, 7); // Les 6 catégories pour la grille 2x3
  const overflowCategories = allFaceCategories.slice(7); // Les catégories restantes pour la section du bas

  return (
    <div className="min-h-screen bg-[#F5F1ED] flex flex-col">
      <Header />

      <main className="flex-grow pt-[100px] pb-12 px-4 md:px-8 lg:px-12">
        <h2 className="text-2xl md:text-3xl font-light text-gray-800 text-center mb-12 tracking-wide">
          POUR TON VISAGE
        </h2>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-2">
          {/* Grande carte de gauche (Catégorie 1: DIAGNOSTIC DE PEAU) */}
          <div className="lg:col-span-2 lg:row-span-3 flex flex-col items-center text-center lg:h-[45.5rem]">
            <a
              href={mainLargeCategory.link}
              className="block w-full h-full bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 group lg:h-full"
            >
              {/* Retrait de l'aspect ratio fixe pour que l'image remplisse la hauteur du conteneur */}
              <div className="relative w-full h-full bg-gray-100 overflow-hidden lg:h-full">
                <img
                  src={mainLargeCategory.image || "/placeholder.svg"}
                  alt={mainLargeCategory.name}
                  className="w-full h-full object-cover transition-transform duration-300" // Retrait de group-hover:scale-105
                />
              </div>
            </a>
            {/* Retrait du titre <h3> pour la grande photo */}
          </div>

          {/* Grille 2x3 à droite (Catégories 2 à 7) */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {rightGridCategories.map((category, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center"
              >
                <a
                  href={category.link}
                  className="block w-full bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 group"
                >
                  <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden">
                    <img
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                </a>
                <h3 className="text-xs font-bold text-gray-800 mt-4 group-hover:text-gray-900 transition-colors">
                  {category.name}
                </h3>
              </div>
            ))}
          </div>
        </div>

        {/* Section pour les catégories de débordement (lignes de 4) */}
        {overflowCategories.length > 0 && (
          <div className="mt-2 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {overflowCategories.map((category, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center"
              >
                <a
                  href={category.link}
                  className="block w-full bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 group"
                >
                  <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden">
                    <img
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                </a>
                <h3 className="text-xs font-bold text-gray-800 mt-4 group-hover:text-gray-900 transition-colors">
                  {category.name}
                </h3>
              </div>
            ))}
          </div>
        )}
      </main>

        <Footer />
    </div>
  );
}
