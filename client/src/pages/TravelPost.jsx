import React from "react";
import { useParams, Link } from "react-router-dom";
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

const containerVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const fadeSlide = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const TravelPost = () => {
  const { travelSlug } = useParams();
  const place = places.find((p) => p.slug === travelSlug);

  if (!place)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-3">
        <h2 className="text-3xl font-semibold mb-6 text-gray-700">
          Place not found
        </h2>
        <Link
          to="/"
          className="px-3 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Back to places
        </Link>
      </div>
    );

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-4 px-3 md:px-6 max-w-6xl mx-auto"
      variants={containerVariant}
      initial="hidden"
      animate="visible"
    >
      {/* Back Button */}
      <motion.div
        variants={fadeSlide}
        className="mb-3 flex flex-row gap-6 md:gap-72"
      >
        <Link
          to="/"
          className="inline-flex items-center text-[13px] md:text-lg space-x-1 md:space-x-2 px-4 py-1 md:px-4 md:py-2 bg-[#FFCEA3] shadow rounded-md text-black hover:text-blue-800 hover:shadow-lg transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span>Back to places</span>
          {/* Title */}
        </Link>
        <motion.h1
          className="text-2xl md:text-3xl font-bold font-fenix mb-1 md:mb-3 text-gray-900 tracking-tight"
          variants={fadeSlide}
        >
          {place.name}
        </motion.h1>
      </motion.div>

      {/* Main Image */}
      <motion.div
        className="rounded-sm overflow-hidden shadow-2xl mb-5 relative group"
        variants={fadeSlide}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 150, damping: 20 }}
      >
        <img
          src={place.imgSrc}
          alt={place.name}
          className="w-full h-[500px] object-cover object-center group-hover:brightness-90 transition"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-3 text-white text-lg">
          {place.description}
        </div>
      </motion.div>

      {/* Details */}
      <motion.section
        className="bg-white rounded-sm shadow-lg p-8 mb-12 border border-gray-100"
        variants={fadeSlide}
      >
        <h2 className="text-2xl font-semibold font-fenix mb-4 text-gray-800">
          Details
        </h2>
        <p className="text-gray-700 font-fenix leading-relaxed text-lg">
          {place.description}
        </p>
      </motion.section>

      {/* Gallery */}
      <motion.section
        className="grid grid-cols-2 sm:grid-cols-3 gap-6"
        variants={containerVariant}
      >
        {place.moreImages.map((img, idx) => (
          <motion.div
            key={idx}
            variants={fadeSlide}
            className="rounded-lg overflow-hidden shadow-md cursor-pointer group"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 150, damping: 15 }}
          >
            <img
              src={img}
              alt={`${place.name} image ${idx + 1}`}
              className="w-full h-40 sm:h-48 object-cover group-hover:brightness-90 transition"
              loading="lazy"
            />
          </motion.div>
        ))}
      </motion.section>
    </motion.div>
  );
};

export default TravelPost;
