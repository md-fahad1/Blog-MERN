import { Modal, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { HiOutlineExclamationCircle, HiHeart } from "react-icons/hi";
import { IoTrashOutline } from "react-icons/io5";

function Skeleton({ className }) {
  return <div className={`animate-pulse rounded-lg bg-slate-100 dark:bg-white/5 ${className}`} />;
}

// Show a short, readable slice of a Mongo ObjectId instead of the full string
function shortId(id) {
  if (!id) return "—";
  return `${id.slice(0, 6)}…${id.slice(-4)}`;
}

export default function DashComments() {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/comment/getcomments`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          if (data.comments.length < 9) {
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
      fetchComments();
    } else {
      setLoading(false);
    }
  }, [currentUser?._id]);

  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/comment/getcomments?startIndex=${startIndex}`,
        { credentials: "include" }
      );
      const data = await res.json();
      if (res.ok) {
        setComments((prev) => [...prev, ...data.comments]);
        if (data.comments.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteComment = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/comment/deleteComment/${commentIdToDelete}`,
        { method: "DELETE", credentials: "include" }
      );
      const data = await res.json();
      if (res.ok) {
        setComments((prev) =>
          prev.filter((comment) => comment._id !== commentIdToDelete)
        );
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
              Comments
            </h1>
          </div>
          {!loading && comments.length > 0 && (
            <span className="text-xs sm:text-sm text-slate-400 font-medium">
              {comments.length} loaded
            </span>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="rounded-2xl sm:rounded-[28px] bg-white dark:bg-[#1E1832] shadow-sm border border-black/5 dark:border-white/5 p-4 sm:p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="w-2/3 h-4" />
                <Skeleton className="w-1/3 h-3" />
              </div>
            ))}
          </div>
        ) : !currentUser?.isAdmin || comments.length === 0 ? (
          <div className="rounded-2xl sm:rounded-[28px] bg-white dark:bg-[#1E1832] shadow-sm border border-black/5 dark:border-white/5 p-10 sm:p-16 text-center">
            <p className="text-sm text-slate-400">You have no comments yet!</p>
          </div>
        ) : (
          <div className="rounded-2xl sm:rounded-[28px] bg-white dark:bg-[#1E1832] shadow-sm border border-black/5 dark:border-white/5 overflow-hidden">
            {/* Table header — desktop only */}
            <div className="hidden md:grid grid-cols-[100px_1fr_90px_110px_110px_60px] gap-4 px-6 py-3.5 border-b border-slate-50 dark:border-white/5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              <span>Updated</span>
              <span>Comment</span>
              <span>Likes</span>
              <span>Post</span>
              <span>User</span>
              <span className="text-right">Delete</span>
            </div>

            <div className="divide-y divide-slate-50 dark:divide-white/5">
              {comments.map((comment) => (
                <motion.div
                  key={comment._id}
                  whileHover={{ backgroundColor: "rgba(0,0,0,0.015)" }}
                  className="flex flex-col md:grid md:grid-cols-[100px_1fr_90px_110px_110px_60px] gap-2 md:gap-4 md:items-center px-4 sm:px-6 py-3.5 sm:py-4"
                >
                  <span className="hidden md:block text-xs text-slate-400">
                    {new Date(comment.updatedAt).toLocaleDateString()}
                  </span>

                  <p className="text-sm text-[#2B2140] dark:text-white line-clamp-2 sm:line-clamp-1 md:line-clamp-2">
                    {comment.content}
                  </p>

                  <div className="flex items-center justify-between md:justify-start gap-1.5 text-xs text-slate-400 md:text-sm">
                    <span className="flex items-center gap-1 md:text-slate-500 dark:md:text-slate-400">
                      <HiHeart className="text-rose-400" />
                      {comment.numberOfLikes}
                    </span>
                    <span className="md:hidden">
                      {new Date(comment.updatedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <span
                    className="hidden md:inline-block text-xs font-mono text-slate-400 truncate"
                    title={comment.postId}
                  >
                    {shortId(comment.postId)}
                  </span>

                  <span
                    className="hidden md:inline-block text-xs font-mono text-slate-400 truncate"
                    title={comment.userId}
                  >
                    {shortId(comment.userId)}
                  </span>

                  <div className="flex items-center justify-end self-end md:self-auto -mt-8 md:mt-0">
                    <button
                      onClick={() => {
                        setShowModal(true);
                        setCommentIdToDelete(comment._id);
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
              Are you sure you want to delete this comment?
            </h3>
            <p className="text-sm text-slate-400 mb-5 sm:mb-6">
              This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <Button color="failure" onClick={handleDeleteComment}>
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