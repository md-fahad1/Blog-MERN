import React from "react";

const MeOnFB = () => {
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
        {Array.from({ length: 9 }).map((_, index) => (
          <img
            key={index}
            src="/faha.png"
            alt={`Faha ${index + 1}`}
            className="w-full h-32 object-cover  shadow-md hover:scale-105 transition-transform duration-300"
          />
        ))}
      </div>
    </div>
  );
};

export default MeOnFB;
