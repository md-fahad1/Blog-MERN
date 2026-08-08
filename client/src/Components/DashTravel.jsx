import { Modal, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiOutlineExclamationCircle, HiOutlinePlus } from "react-icons/hi";
import { IoTrashOutline, IoLocationOutline } from "react-icons/io5";
import { CiEdit, CiCalendar } from "react-icons/ci";

function Skeleton({ className }) {
  return <div className={`animate-pulse rounded-lg bg-slate-100 dark:bg-white/5 ${className}`} />;
}

export default function DashTravel() {
  const { currentUser } = useSelector((state) => state.user);
  const [travels, setTravels] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [travelIdToDelete, setTravelIdToDelete] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch travels
  useEffect(() => {
    const fetchTravels = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/travel/gettravels?startIndex=0&limit=9`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (res.ok) {
          setTravels(data.travels);
          if (data.travels.length < 9) setShowMore(false);
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTravels();
  }, []);

  // Show more travels
  const handleShowMore = async () => {
    const startIndex = travels.length;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/travel/gettravels?startIndex=${startIndex}&limit=9`,
        { credentials: "include" }
      );
      const data = await res.json();
      if (res.ok) {
        setTravels((prev) => [...prev, ...data.travels]);
        if (data.travels.length < 9) setShowMore(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // Delete travel
  const handleDeleteTravel = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/travel/deletetravel/${travelIdToDelete}`,
        { method: "DELETE", credentials: "include" }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setTravels((prev) =>
          prev.filter((travel) => travel._id !== travelIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F7F5F2] dark:bg-[#141020] font-sans">
      <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4 mb-6">
          <div>
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#FF6B4A] font-bold mb-1">
              Content
            </p>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#2B2140] dark:text-white">
              Travel posts
            </h1>
          </div>
          {currentUser?.isAdmin && (
            <Link to="/create-travelpost" className="self-start sm:self-auto">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 bg-[#2B2140] text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-full font-semibold text-xs sm:text-sm shadow-lg shadow-[#2B2140]/20 whitespace-nowrap"
              >
                <HiOutlinePlus className="text-base sm:text-lg" />
                Create a travel post
              </motion.button>
            </Link>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="rounded-2xl sm:rounded-[28px] bg-white dark:bg-[#1E1832] shadow-sm border border-black/5 dark:border-white/5 p-4 sm:p-6 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="w-16 h-10 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="w-1/3 h-4" />
                  <Skeleton className="w-1/5 h-3" />
                </div>
              </div>
            ))}
          </div>
        ) : travels.length === 0 ? (
          <div className="rounded-2xl sm:rounded-[28px] bg-white dark:bg-[#1E1832] shadow-sm border border-black/5 dark:border-white/5 p-10 sm:p-16 text-center">
            <p className="text-sm text-slate-400 mb-3">
              You have no travel posts yet!
            </p>
            {currentUser?.isAdmin && (
              <Link
                to="/create-travelpost"
                className="text-sm font-semibold text-[#FF6B4A] hover:text-[#e55a3a] transition-colors"
              >
                Write your first travel post →
              </Link>
            )}
          </div>
        ) : (
          <div className="rounded-2xl sm:rounded-[28px] bg-white dark:bg-[#1E1832] shadow-sm border border-black/5 dark:border-white/5 overflow-hidden">
            {/* Table header — desktop only */}
            <div className="hidden md:grid grid-cols-[110px_88px_1fr_140px_120px_70px] gap-4 px-6 py-3.5 border-b border-slate-50 dark:border-white/5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              <span>Updated</span>
              <span>Image</span>
              <span>Title</span>
              <span>Location</span>
              <span>Trip date</span>
              <span className="text-right">Actions</span>
            </div>

            <div className="divide-y divide-slate-50 dark:divide-white/5">
              {travels.map((travel) => (
                <motion.div
                  key={travel._id}
                  whileHover={{ backgroundColor: "rgba(0,0,0,0.015)" }}
                  className="flex flex-col md:grid md:grid-cols-[110px_88px_1fr_140px_120px_70px] gap-3 md:gap-4 md:items-center px-4 sm:px-6 py-3.5 sm:py-4"
                >
                  <span className="hidden md:block text-xs text-slate-400">
                    {new Date(travel.updatedAt).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-3 md:contents">
                    <Link to={`/travel/${travel.slug}`} className="flex-shrink-0">
                      <img
                        src={travel.images?.[0]}
                        alt={travel.title}
                        className="w-16 h-10 sm:w-20 sm:h-11 rounded-lg sm:rounded-xl object-cover bg-slate-100"
                      />
                    </Link>

                    <div className="min-w-0 flex-1 md:hidden">
                      <Link
                        to={`/travel/${travel.slug}`}
                        className="font-semibold text-sm text-[#2B2140] dark:text-white truncate block"
                      >
                        {travel.title}
                      </Link>
                      <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-400">
                        <IoLocationOutline className="flex-shrink-0" />
                        <span className="truncate">{travel.location}</span>
                        <span className="text-slate-300">·</span>
                        <CiCalendar className="flex-shrink-0" />
                        <span>{new Date(travel.tripDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    to={`/travel/${travel.slug}`}
                    className="hidden md:block font-medium text-sm text-[#2B2140] dark:text-white truncate"
                  >
                    {travel.title}
                  </Link>

                  <span className="hidden md:flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 truncate">
                    <IoLocationOutline className="flex-shrink-0 text-[#2DD4BF]" />
                    <span className="truncate">{travel.location}</span>
                  </span>

                  <span className="hidden md:block text-sm text-slate-500 dark:text-slate-400">
                    {new Date(travel.tripDate).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-2 self-end md:self-auto md:justify-end">
                    <Link
                      to={`/update-travel/${travel._id}`}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-[#F7F5F2] hover:text-[#2B2140] dark:hover:bg-white/5 dark:hover:text-white transition-colors"
                      title="Edit"
                    >
                      <CiEdit className="text-lg" />
                    </Link>
                    <button
                      onClick={() => {
                        setShowModal(true);
                        setTravelIdToDelete(travel._id);
                      }}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10 transition-colors"
                      title="Delete"
                    >
                      <IoTrashOutline className="text-lg" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {showMore && (
              <button
                onClick={handleShowMore}
                className="w-full text-[#FF6B4A] hover:text-[#e55a3a] font-semibold text-sm py-4 border-t border-slate-50 dark:border-white/5 transition-colors"
              >
                Show more
              </button>
            )}
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center py-2">
            <HiOutlineExclamationCircle className="h-12 w-12 sm:h-14 sm:w-14 text-rose-400 mb-4 mx-auto" />
            <h3 className="mb-4 sm:mb-6 text-base sm:text-lg font-medium text-[#2B2140] dark:text-slate-300 px-2">
              Are you sure you want to delete this travel post?
            </h3>
            <p className="text-sm text-slate-400 mb-5 sm:mb-6">
              This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <Button color="failure" onClick={handleDeleteTravel}>
                Yes, delete it
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}