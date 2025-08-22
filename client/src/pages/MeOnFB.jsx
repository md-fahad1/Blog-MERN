import React from "react";

const MeOnFB = () => {
  // Images as objects
  const images = [
    { id: 1, src: "/sreemangal.jpg", alt: "Faha 1" },
    { id: 2, src: "/1.jpg", alt: "Faha 2" },
    { id: 3, src: "/3.jpg", alt: "Faha 3" },
    { id: 4, src: "/4.jpg", alt: "Faha 4" },
    { id: 5, src: "/5.jpg", alt: "Faha 5" },
    { id: 6, src: "/6.jpg", alt: "Faha 6" },
    { id: 7, src: "/7.jpg", alt: "Faha 7" },
    { id: 8, src: "/8.jpg", alt: "Faha 8" },
    { id: 9, src: "/9.jpg", alt: "Faha 9" },
  ];

  return (
    <div className="p-4">
      {/* Section Heading */}
      <div className="flex items-center w-full mb-6">
        <div className="flex-grow border-t border-pink-700 dark:border-gray-600"></div>
        <span className="px-4 text-lg font-semibold text-gray-700 dark:text-gray-200">
          Me On Facebook
        </span>
        <div className="flex-grow border-t border-pink-700 dark:border-gray-600"></div>
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-3 gap-4 p-8">
        {images.map((image) => (
          <img
            key={image.id}
            src={image.src}
            alt={image.alt}
            className="w-full h-32 object-cover shadow-md hover:scale-105 transition-transform duration-300"
          />
        ))}
      </div>
    </div>
  );
};

export default MeOnFB;
