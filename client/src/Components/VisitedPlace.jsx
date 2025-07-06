import React from "react";

const places = [
  { name: "Sreemangal", imgSrc: "/fahad.jpg" },
  { name: "Bandarban", imgSrc: "/bandharban.jpg" },
  { name: "Shylet", imgSrc: "/shylet.jpg" },
  { name: "Tanguar Haor", imgSrc: "/haour.jpg" },
  { name: "Cox's Bazar", imgSrc: "/cox's.jpg" },
  { name: "Saint Martin", imgSrc: "/kuakata.jpg" },
  { name: "Kuakata", imgSrc: "/kuakata2.jpg" },
  { name: "Sitakunda", imgSrc: "/SITAKUNDA.png" },
];

const VisitedPlace = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-8 lg:grid-cols-8 gap-4 p-4">
      {places.map((place, index) => (
        <div key={index} className="relative group">
          <img
            src={place.imgSrc}
            alt={place.name}
            className="w-full h-40 object-cover rounded-lg shadow-lg"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
            <span className="text-white text-lg font-semibold">
              {place.name}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VisitedPlace;
