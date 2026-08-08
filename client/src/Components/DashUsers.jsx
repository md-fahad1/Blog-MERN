import { Modal, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { HiOutlineExclamationCircle, HiOutlineShieldCheck } from "react-icons/hi";
import { FaCheck, FaTimes } from "react-icons/fa";
import { IoTrashOutline } from "react-icons/io5";

function Skeleton({ className }) {
  return <div className={`animate-pulse rounded-lg bg-slate-100 dark:bg-white/5 ${className}`} />;
}

export default function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/user/getusers`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          if (data.users.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };
    if (currentUser?.isAdmin) {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [currentUser?._id]);

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/getusers?startIndex=${startIndex}`,
        { credentials: "include" }
      );
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/delete/${userIdToDelete}`,
        { method: "DELETE", credentials: "include" }
      );
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
        setShowModal(false);
      } else {
        console.log(data.message);
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
              Community
            </p>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#2B2140] dark:text-white">
              Users
            </h1>
          </div>
          {!loading && users.length > 0 && (
            <span className="text-xs sm:text-sm text-slate-400 font-medium">
              {users.length} {users.length === 1 ? "user" : "users"} loaded
            </span>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="rounded-2xl sm:rounded-[28px] bg-white dark:bg-[#1E1832] shadow-sm border border-black/5 dark:border-white/5 p-4 sm:p-6 space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="w-1/3 h-4" />
                  <Skeleton className="w-1/2 h-3" />
                </div>
              </div>
            ))}
          </div>
        ) : !currentUser?.isAdmin || users.length === 0 ? (
          <div className="rounded-2xl sm:rounded-[28px] bg-white dark:bg-[#1E1832] shadow-sm border border-black/5 dark:border-white/5 p-10 sm:p-16 text-center">
            <p className="text-sm text-slate-400">You have no users yet!</p>
          </div>
        ) : (
          <div className="rounded-2xl sm:rounded-[28px] bg-white dark:bg-[#1E1832] shadow-sm border border-black/5 dark:border-white/5 overflow-hidden">
            {/* Table header — desktop only */}
            <div className="hidden md:grid grid-cols-[110px_52px_1fr_1fr_80px_60px] gap-4 px-6 py-3.5 border-b border-slate-50 dark:border-white/5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              <span>Joined</span>
              <span></span>
              <span>Username</span>
              <span>Email</span>
              <span>Admin</span>
              <span className="text-right">Delete</span>
            </div>

            <div className="divide-y divide-slate-50 dark:divide-white/5">
              {users.map((user) => (
                <motion.div
                  key={user._id}
                  whileHover={{ backgroundColor: "rgba(0,0,0,0.015)" }}
                  className="flex md:grid md:grid-cols-[110px_52px_1fr_1fr_80px_60px] gap-3 md:gap-4 md:items-center px-4 sm:px-6 py-3.5 sm:py-4"
                >
                  <span className="hidden md:block text-xs text-slate-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>

                  <img
                    src={user.profilePicture}
                    alt={user.username}
                    className="w-10 h-10 rounded-full object-cover bg-slate-100 ring-2 ring-[#F7F5F2] dark:ring-white/5 flex-shrink-0"
                  />

                  <div className="min-w-0 flex-1 md:flex-none">
                    <p className="font-semibold text-sm text-[#2B2140] dark:text-white truncate">
                      {user.username}
                    </p>
                    <p className="text-xs text-slate-400 truncate md:hidden">
                      {user.email}
                    </p>
                    <div className="flex items-center gap-2 mt-1 md:hidden">
                      {user.isAdmin ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#FF6B4A] bg-[#FFF1EC] dark:bg-[#FF6B4A]/10 px-2 py-0.5 rounded-full">
                          <HiOutlineShieldCheck />
                          Admin
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-slate-400">
                          Member
                        </span>
                      )}
                      <span className="text-[10px] text-slate-300">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <span className="hidden md:block text-sm text-slate-500 dark:text-slate-400 truncate">
                    {user.email}
                  </span>

                  <span className="hidden md:flex justify-start">
                    {user.isAdmin ? (
                      <FaCheck className="text-emerald-500" />
                    ) : (
                      <FaTimes className="text-slate-300" />
                    )}
                  </span>

                  <div className="flex items-center self-start md:self-auto md:justify-end">
                    <button
                      onClick={() => {
                        setShowModal(true);
                        setUserIdToDelete(user._id);
                      }}
                      disabled={user._id === currentUser?._id}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
                      title={
                        user._id === currentUser?._id
                          ? "You can't delete your own account here"
                          : "Delete"
                      }
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
              Are you sure you want to delete this user?
            </h3>
            <p className="text-sm text-slate-400 mb-5 sm:mb-6">
              This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <Button color="failure" onClick={handleDeleteUser}>
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