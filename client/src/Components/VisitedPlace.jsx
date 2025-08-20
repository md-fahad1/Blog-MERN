import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.2,
      type: "spring",
      stiffness: 120,
      damping: 20,
    },
  }),
};

const VisitedPlace = () => {
  const [travels, setTravels] = useState([]);

  useEffect(() => {
    const fetchTravels = async () => {
      try {
        const res = await fetch("/api/travel/gettravels?startIndex=0&limit=9");
        const data = await res.json();
        if (res.ok) {
          setTravels(data.travels);
        }
      } catch (error) {
        console.error("Failed to fetch travels:", error.message);
      }
    };
    fetchTravels();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {travels.map((place, index) => (
          <motion.div
            key={place._id || place.id}
            className="relative h-40 cursor-pointer overflow-hidden group"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            custom={index}
          >
            <Link to={`/travel/${place._id}`} className="block w-full h-full">
              {/* Background Image */}
              <motion.img
                src={place.images?.[0] || "/placeholder.jpg"}
                alt={place.title || "Travel Image"}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
              />

              {/* Overlay Border */}
              <div className="absolute inset-0 border border-white m-2"></div>

              {/* Centered Title */}
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="bg-white px-4 py-1 text-sm sm:text-base md:text-lg font-semibold tracking-wide text-gray-700 uppercase">
                  {place.title}
                </h3>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default VisitedPlace;
