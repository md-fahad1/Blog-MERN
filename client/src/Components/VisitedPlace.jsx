import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaArrowRight, FaImage } from "react-icons/fa";

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: Math.min(i, 6) * 0.06,
      type: "spring",
      stiffness: 120,
      damping: 20,
    },
  }),
};

const SkeletonTile = () => (
  <div className="aspect-[4/5] rounded-2xl bg-gray-200 dark:bg-slate-700/60 animate-pulse" />
);

// Deterministic "no photo yet" background so missing images still look designed,
// not broken — cycles through a small set of on-brand gradients.
const FALLBACK_GRADIENTS = [
  "from-pink-400 to-purple-500",
  "from-purple-400 to-indigo-500",
  "from-rose-400 to-pink-500",
  "from-indigo-400 to-purple-500",
];

const VisitedPlace = () => {
  const [travels, setTravels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [brokenIds, setBrokenIds] = useState(() => new Set());

  useEffect(() => {
    const fetchTravels = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const url = `${apiUrl}/api/travel/gettravels?startIndex=0&limit=9`;
        const res = await fetch(url);
        const data = await res.json();
        if (res.ok) {
          setTravels(data.travels || []);
        }
      } catch (error) {
        console.error("Failed to fetch travels:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTravels();
  }, []);

  const markBroken = (id) => {
    setBrokenIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonTile key={i} />
        ))}
      </div>
    );
  }

  if (!isLoading && travels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-14 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
        <FaMapMarkerAlt className="text-3xl text-pink-400 mb-3" />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No places added yet — the map is waiting to be filled in.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {travels.map((place, index) => {
        const id = place._id || place.id || index;
        const imgSrc = place.images?.[0];
        const hasImage = Boolean(imgSrc) && !brokenIds.has(id);
        const gradient = FALLBACK_GRADIENTS[index % FALLBACK_GRADIENTS.length];

        return (
          <motion.div
            key={id}
            className="group relative aspect-[4/5] overflow-hidden rounded-xl shadow-md hover:shadow-2xl transition-shadow duration-300"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            custom={index}
          >
            <Link to={`/travel/${place._id}`} className="block h-full w-full">
              {/* image or on-brand fallback */}
              {hasImage ? (
                <img
                  src={imgSrc}
                  alt={place.title || "Travel destination"}
                  onError={() => markBroken(id)}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
              ) : (
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${gradient} flex items-center justify-center`}
                >
                  <FaImage className="text-3xl text-white/40" />
                </div>
              )}

              {/* always-on scrim so text stays legible regardless of photo brightness */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/0" />

              {/* content */}
              <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-4">
                {place.location && (
                  <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-medium uppercase tracking-wide text-pink-300 mb-1 truncate">
                    <FaMapMarkerAlt className="text-[10px] shrink-0" />
                    <span className="truncate">{place.location}</span>
                  </span>
                )}
                <h3 className="font-semibold text-white text-sm sm:text-base leading-snug drop-shadow-sm">
                  {place.title}
                </h3>

                {/* full address, revealed on hover instead of always wrapping onto the card */}
                {place.location && (
                  <p className="max-h-0 group-hover:max-h-16 overflow-hidden transition-all duration-300 text-[11px] text-gray-200/90 leading-snug mt-1 line-clamp-2">
                    {place.location}
                  </p>
                )}
              </div>

              {/* explore affordance */}
              <span className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                <FaArrowRight className="text-xs" />
              </span>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
};

export default VisitedPlace;