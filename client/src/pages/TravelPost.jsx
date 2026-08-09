import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaExpand,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaImage,
} from "react-icons/fa";

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
  const [brokenIdx, setBrokenIdx] = useState(() => new Set());
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    const fetchTravel = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/travel/get/${travelId}`
        );
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

  const markBroken = (idx) => {
    setBrokenIdx((prev) => new Set(prev).add(idx));
  };

  const images = formData?.images?.length ? formData.images : [];
  const hasLightboxImage =
    lightboxIndex !== null && images[lightboxIndex] && !brokenIdx.has(lightboxIndex);

  const goTo = (delta) => {
    setLightboxIndex((prev) => {
      if (prev === null) return prev;
      const next = (prev + delta + images.length) % images.length;
      return next;
    });
  };

  // Error state
  if (publishError) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#FCFCFC] dark:bg-[#10172A] px-4 text-center">
        <span className="w-16 h-16 rounded-full bg-pink-500/10 text-pink-500 flex items-center justify-center mb-5">
          <FaMapMarkerAlt className="text-2xl" />
        </span>
        <h2 className="text-2xl font-fenix font-semibold mb-2 text-gray-800 dark:text-white">
          {publishError}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          This trip might have been moved or doesn't exist.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 shadow-sm shadow-pink-500/30 transition-all"
        >
          <FaArrowLeft className="text-xs" />
          Back to places
        </Link>
      </div>
    );
  }

  // Loading state
  if (!formData) {
    return (
      <div className="min-h-screen bg-[#FCFCFC] dark:bg-[#10172A] py-6 px-3 md:px-6 max-w-6xl mx-auto animate-pulse">
        <div className="h-8 w-40 bg-gray-200 dark:bg-slate-700/60 rounded-full mb-6" />
        <div className="h-10 w-2/3 bg-gray-200 dark:bg-slate-700/60 rounded-lg mb-6" />
        <div className="h-[420px] w-full bg-gray-200 dark:bg-slate-700/60 rounded-2xl mb-8" />
        <div className="h-40 w-full bg-gray-200 dark:bg-slate-700/60 rounded-2xl mb-8" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-40 bg-gray-200 dark:bg-slate-700/60 rounded-xl"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-[#FCFCFC] dark:bg-[#10172A] py-6 px-3 md:px-6 max-w-6xl mx-auto"
      variants={containerVariant}
      initial="hidden"
      animate="visible"
    >
      {/* Back link + title */}
      <motion.div variants={fadeSlide} className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-200 hover:text-pink-500 dark:hover:text-pink-400 transition-colors mb-4"
        >
          <FaArrowLeft className="text-xs" />
          Back to places
        </Link>

        <h1 className="text-2xl md:text-4xl font-fenix font-bold text-gray-900 dark:text-white tracking-tight">
          {formData.title}
        </h1>

        {(formData.location || formData.tag) && (
          <div className="flex flex-wrap items-center gap-3 mt-3">
            {formData.location && (
              <span className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                <FaMapMarkerAlt className="text-pink-500 text-xs" />
                {formData.location}
              </span>
            )}
            {formData.tag && (
              <span className="text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full bg-pink-500/10 text-pink-500">
                {formData.tag}
              </span>
            )}
          </div>
        )}
      </motion.div>

      {/* Hero image */}
      <motion.div
        className="rounded-2xl overflow-hidden shadow-xl mb-8 relative group"
        variants={fadeSlide}
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 150, damping: 20 }}
      >
        {images[0] && !brokenIdx.has(0) ? (
          <img
            src={images[0]}
            alt={formData.title}
            onError={() => markBroken(0)}
            className="w-full h-[320px] md:h-[500px] object-cover object-center group-hover:brightness-90 transition cursor-zoom-in"
            loading="lazy"
            onClick={() => setLightboxIndex(0)}
          />
        ) : (
          <div className="w-full h-[320px] md:h-[500px] bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
            <FaImage className="text-4xl text-white/50" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition pointer-events-none" />
        {images[0] && !brokenIdx.has(0) && (
          <button
            onClick={() => setLightboxIndex(0)}
            className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
            aria-label="Expand image"
          >
            <FaExpand className="text-sm" />
          </button>
        )}
      </motion.div>

      {/* Details */}
      <motion.section
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 md:p-8 mb-10 border border-gray-100 dark:border-gray-700"
        variants={fadeSlide}
      >
        <h2 className="text-xl md:text-2xl font-fenix font-semibold mb-4 text-gray-800 dark:text-white">
          Details
        </h2>
        <div
          className="prose prose-p:leading-relaxed prose-p:text-gray-700 dark:prose-invert dark:prose-p:text-gray-300 max-w-none text-lg font-fenix"
          dangerouslySetInnerHTML={{ __html: formData.description }}
        />
      </motion.section>

      {/* Gallery */}
      {images.length > 0 && (
        <motion.section variants={fadeSlide}>
          <h2 className="text-xl md:text-2xl font-fenix font-semibold mb-4 text-gray-800 dark:text-white">
            Gallery
          </h2>
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6"
            variants={containerVariant}
          >
            {images.map((img, idx) => (
              <motion.button
                key={idx}
                type="button"
                variants={fadeSlide}
                onClick={() => !brokenIdx.has(idx) && setLightboxIndex(idx)}
                className="relative rounded-xl overflow-hidden shadow-md cursor-pointer group text-left"
                whileHover={{ scale: 1.04 }}
                transition={{ type: "spring", stiffness: 150, damping: 15 }}
              >
                {!brokenIdx.has(idx) ? (
                  <img
                    src={img}
                    alt={`${formData.title} image ${idx + 1}`}
                    onError={() => markBroken(idx)}
                    className="w-full h-40 sm:h-48 object-cover group-hover:brightness-90 transition"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-40 sm:h-48 bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                    <FaImage className="text-2xl text-white/50" />
                  </div>
                )}
                <span className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <FaExpand className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm" />
                </span>
              </motion.button>
            ))}
          </motion.div>
        </motion.section>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center px-4"
            onClick={() => setLightboxIndex(null)}
          >
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <FaTimes />
            </button>

            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goTo(-1);
                  }}
                  className="absolute left-3 md:left-8 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                  aria-label="Previous image"
                >
                  <FaChevronLeft />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goTo(1);
                  }}
                  className="absolute right-3 md:right-8 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                  aria-label="Next image"
                >
                  <FaChevronRight />
                </button>
              </>
            )}

            {hasLightboxImage ? (
              <motion.img
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                src={images[lightboxIndex]}
                alt={`${formData.title} large view`}
                onClick={(e) => e.stopPropagation()}
                onError={() => markBroken(lightboxIndex)}
                className="max-h-[85vh] max-w-full rounded-lg object-contain"
              />
            ) : (
              <div className="w-full max-w-xl aspect-video rounded-lg bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
                <FaImage className="text-4xl text-white/50" />
              </div>
            )}

            {images.length > 1 && (
              <span className="absolute bottom-5 left-1/2 -translate-x-1/2 text-xs text-white/70 font-medium">
                {lightboxIndex + 1} / {images.length}
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TravelPost;