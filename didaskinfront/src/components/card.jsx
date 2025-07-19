"use client"



export default function Card({ imageSrc, title, price, description }) {
  return (
    <div className="flex flex-col items-center text-center p-4">
      <div className="relative w-full aspect-[3/4] bg-gray-100 mb-4 overflow-hidden">
        <img
          src={imageSrc || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300" // Utilisation de classes Tailwind pour le style
        />
      </div>
      <h3 className="text-lg font-medium text-gray-800 mb-1">{title}</h3>
      <p className="text-sm text-gray-600 mb-2">{description}</p>
      <p className="text-base font-semibold text-gray-900">{price}</p>
    </div>
  )
}