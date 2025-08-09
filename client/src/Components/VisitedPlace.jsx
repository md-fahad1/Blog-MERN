import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const places = [
  {
    id: 1,
    name: "Sreemangal",
    slug: "sreemangal",
    imgSrc: "/fahad.jpg",
    description:
      "Known as the tea capital of Bangladesh, famous for lush green tea gardens and peaceful landscapes.",
    moreImages: ["/fahad.jpg", "/sreemangal2.jpg", "/sreemangal3.jpg"],
  },
  {
    id: 2,
    name: "Bandarban",
    slug: "bandarban",
    imgSrc: "/bandharban.jpg",
    description:
      "A beautiful hilly district with mountains, waterfalls, and rich tribal culture.",
    moreImages: ["/bandharban.jpg", "/bandarban2.jpg", "/bandarban3.jpg"],
  },
  {
    id: 3,
    name: "Shylet",
    slug: "shylet",
    imgSrc: "/shylet.jpg",
    description:
      "Sylhet is famous for its tea gardens, tropical forests, and natural beauty.",
    moreImages: ["/shylet.jpg", "/shylet2.jpg", "/shylet3.jpg"],
  },
  {
    id: 4,
    name: "Tanguar Haor",
    slug: "tanguar-haor",
    imgSrc: "/haour.jpg",
    description:
      "A vast wetland and bird sanctuary, perfect for nature lovers and boat rides.",
    moreImages: ["/haour.jpg", "/haour2.jpg", "/haour3.jpg"],
  },
  {
    id: 5,
    name: "Cox's Bazar",
    slug: "coxs-bazar",
    imgSrc: "/cox's.jpg",
    description:
      "World's longest natural sea beach, known for its breathtaking views and vibrant local culture.",
    moreImages: ["/cox's.jpg", "/coxs2.jpg", "/coxs3.jpg"],
  },
  {
    id: 6,
    name: "Saint Martin",
    slug: "saint-martin",
    imgSrc: "/kuakata.jpg",
    description:
      "A beautiful coral island in the Bay of Bengal, famous for its clear blue waters and marine life.",
    moreImages: ["/kuakata.jpg", "/saintmartin2.jpg", "/saintmartin3.jpg"],
  },
  {
    id: 7,
    name: "Kuakata",
    slug: "kuakata",
    imgSrc: "/kuakata2.jpg",
    description:
      "Known as the 'Daughter of the Sea,' Kuakata offers panoramic sea beach views of both sunrise and sunset.",
    moreImages: ["/kuakata2.jpg", "/kuakata3.jpg", "/kuakata4.jpg"],
  },
  {
    id: 8,
    name: "Sitakunda",
    slug: "sitakunda",
    imgSrc: "/SITAKUNDA.png",
    description:
      "A scenic hill and eco-tourism spot famous for its waterfalls and the Chandranath Temple.",
    moreImages: ["/SITAKUNDA.png", "/sitakunda2.jpg", "/sitakunda3.jpg"],
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.2, // delay each card based on its index for stagger effect on scroll
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
  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {places.map((place, index) => (
          <motion.div
            key={place.id}
            className="bg-white rounded-sm shadow-md overflow-hidden cursor-pointer border border-gray-200 hover:border-[#E5D6FE]"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            custom={index}
            whileHover="hover"
          >
            <Link to={`/travel/${place.slug}`} className="block">
              <motion.img
                src={place.imgSrc}
                alt={place.name}
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
                  {place.name}
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
