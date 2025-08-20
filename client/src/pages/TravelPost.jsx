import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";

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
  const { travelId } = useParams();

  const [formData, setFormData] = useState(null);
  const [publishError, setPublishError] = useState("");

  useEffect(() => {
    const fetchTravel = async () => {
      try {
        const res = await fetch(`/api/travel/get/${travelId}`);
        if (!res.ok) {
          const errorData = await res.json();
          setPublishError(errorData.message || "Something went wrong");
          return;
        }
        const data = await res.json();
        setFormData(data.travel); // backend returns { travel: {...} }
      } catch (err) {
        console.error(err);
        setPublishError("Failed to load travel post");
      }
    };

    if (travelId) fetchTravel();
  }, [travelId]);

  if (publishError)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-3">
        <h2 className="text-3xl font-semibold mb-6 text-gray-700">
          {publishError}
        </h2>
        <Link
          to="/"
          className="px-3 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Back to places
        </Link>
      </div>
    );

  if (!formData) return <p className="text-center mt-10">Loading...</p>;

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b font-fenix from-gray-50 to-gray-100 py-4 px-3 md:px-6 max-w-6xl mx-auto"
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
        </Link>
        <motion.h1
          className="text-2xl md:text-3xl font-bold font-fenix mb-1 md:mb-3 text-gray-900 tracking-tight"
          variants={fadeSlide}
        >
          {formData.title}
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
          src={formData.images?.[0] || "/placeholder.jpg"}
          alt={formData.title}
          className="w-full h-[500px] object-cover object-center group-hover:brightness-90 transition"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-3 text-white text-lg">
          {formData.tag}
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
        <div
          className="text-gray-700 font-fenix leading-relaxed text-lg"
          dangerouslySetInnerHTML={{ __html: formData.description }}
        />
      </motion.section>
      {/* Gallery */}
      <motion.section
        className="grid grid-cols-2 sm:grid-cols-3 gap-6"
        variants={containerVariant}
      >
        {formData.images?.map((img, idx) => (
          <motion.div
            key={idx}
            variants={fadeSlide}
            className="rounded-lg overflow-hidden shadow-md cursor-pointer group"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 150, damping: 15 }}
          >
            <img
              src={img}
              alt={`${formData.title} image ${idx + 1}`}
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
