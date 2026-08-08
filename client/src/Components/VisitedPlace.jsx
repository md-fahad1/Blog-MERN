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
        const apiUrl = import.meta.env.VITE_API_URL;

        console.log("VITE_API_URL:", apiUrl);

        const url = `${apiUrl}/api/travel/gettravels?startIndex=0&limit=9`;

        console.log("Fetching:", url);

        const res = await fetch(url);

        console.log("Response status:", res.status);
        console.log("Response URL:", res.url);

        const data = await res.json();

        console.log("Fetched travels:", data);

        if (res.ok) {
          setTravels(data.travels || []);
        }
      } catch (error) {
        console.error("Failed to fetch travels:", error);
      }
    };

    fetchTravels();
  }, []);

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {travels.map((place, index) => (
          <motion.div
            key={place._id || place.id}
            className="group relative h-40 cursor-pointer overflow-hidden"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            custom={index}
          >
            <Link
              to={`/travel/${place._id}`}
              className="block h-full w-full"
            >
              <motion.img
                src={place.images?.[0] || "/placeholder.jpg"}
                alt={place.title || "Travel Image"}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
              />

              <div className="absolute inset-0 m-2 border border-white" />

              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="bg-white bg-opacity-40 px-4 py-1 text-sm font-semibold uppercase tracking-wide text-gray-700 hover:bg-opacity-100 hover:text-[#e74694] sm:text-base md:text-lg">
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