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
  hover: {
    scale: 1.05,
    boxShadow: "0 12px 24px rgba(37, 99, 235, 0.3)",
    transition: { duration: 0.3 },
  },
};

const VisitedPlace = () => {
  const [travels, setTravels] = useState([]);
  const [showMore, setShowMore] = useState(true);

  useEffect(() => {
    const fetchTravels = async () => {
      try {
        const res = await fetch("/api/travel/gettravels?startIndex=0&limit=9");
        const data = await res.json();
        if (res.ok) {
          setTravels(data.travels);
          console.log("Fetched travels:", data.travels);
          if (data.travels.length < 9) setShowMore(false);
        }
      } catch (error) {
        console.error("Failed to fetch travels:", error.message);
      }
    };
    fetchTravels();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {travels.map((place, index) => (
          <motion.div
            key={place._id || place.id}
            className="bg-white rounded-sm shadow-md overflow-hidden cursor-pointer border border-gray-200 hover:border-[#E5D6FE]"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            custom={index}
            whileHover="hover"
          >
            <Link to={`/travel/${place._id}`} className="block">
              <motion.img
                src={place.images?.[0] || "/placeholder.jpg"}
                alt={place.title || "Travel Image"}
                className="w-full h-56 object-cover rounded-t-sm"
                loading="lazy"
                whileHover={{ scale: 1.05, filter: "brightness(0.85)" }}
                transition={{ duration: 0.3 }}
              />
              <div className="p-2">
                <motion.h3
                  className="text-center text-xl font-semibold font-fenix text-[#F26259] mb-1"
                  whileHover={{ color: "#2563EB" }}
                >
                  {place.title}
                </motion.h3>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default VisitedPlace;
