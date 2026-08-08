import { Button, Modal } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiOutlineExclamationCircle, HiOutlinePlus, HiOutlineCamera } from "react-icons/hi";
import { CiEdit } from "react-icons/ci";
import { IoTrashOutline } from "react-icons/io5";

function Skeleton({ className }) {
  return <div className={`animate-pulse rounded-lg bg-slate-100 dark:bg-white/5 ${className}`} />;
}

export default function DashFb() {
  const { currentUser } = useSelector((state) => state.user);
  const [fbs, setFbs] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editImage, setEditImage] = useState("");
  const [editFbUrl, setEditFbUrl] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [fbIdToDelete, setFbIdToDelete] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Fetch all FB posts
  const fetchFbs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/fb/all`, {
        credentials: "include",
      });
      const data = await res.json();
      setFbs(Array.isArray(data) ? data : data.fbs || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFbs();
  }, []);

  // Delete FB post
  const handleDelete = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/fb/delete/${fbIdToDelete}`,
        { method: "DELETE", credentials: "include" }
      );
      if (!res.ok) throw new Error("Failed to delete");
      setFbs((prev) => prev.filter((fb) => fb._id !== fbIdToDelete));
    } catch (error) {
      console.error(error);
    }
  };

  // Start editing
  const handleEdit = (fb) => {
    setEditingId(fb._id);
    setEditImage(fb.image);
    setEditFbUrl(fb.fbUrl);
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingId(null);
    setEditImage("");
    setEditFbUrl("");
  };

  // Save update
  const handleUpdate = async (id) => {
    setSaving(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/fb/update/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: editImage, fbUrl: editFbUrl }),
      });
      if (!res.ok) throw new Error("Failed to update");
      handleCancel();
      fetchFbs();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  // Handle image file upload
  const handleImageChange = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("images", file);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/upload`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Image upload failed");
      }

      setEditImage(data.images[0]);
    } catch (error) {
      console.error(error);
      alert("Image upload failed");
    } finally {
      setUploading(false);
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
              Facebook posts
            </h1>
          </div>
          {currentUser?.isAdmin && (
            <Link to="/create-fb" className="self-start sm:self-auto">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 bg-[#2B2140] text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-full font-semibold text-xs sm:text-sm shadow-lg shadow-[#2B2140]/20 whitespace-nowrap"
              >
                <HiOutlinePlus className="text-base sm:text-lg" />
                Create FB post
              </motion.button>
            </Link>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="rounded-2xl sm:rounded-[28px] bg-white dark:bg-[#1E1832] shadow-sm border border-black/5 dark:border-white/5 p-4 sm:p-6 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="w-20 h-12 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="w-2/3 h-4" />
                  <Skeleton className="w-1/4 h-3" />
                </div>
              </div>
            ))}
          </div>
        ) : fbs.length === 0 ? (
          <div className="rounded-2xl sm:rounded-[28px] bg-white dark:bg-[#1E1832] shadow-sm border border-black/5 dark:border-white/5 p-10 sm:p-16 text-center">
            <p className="text-sm text-slate-400 mb-3">
              No Facebook posts yet.
            </p>
            {currentUser?.isAdmin && (
              <Link
                to="/create-fb"
                className="text-sm font-semibold text-[#FF6B4A] hover:text-[#e55a3a] transition-colors"
              >
                Add your first one →
              </Link>
            )}
          </div>
        ) : (
          <div className="rounded-2xl sm:rounded-[28px] bg-white dark:bg-[#1E1832] shadow-sm border border-black/5 dark:border-white/5 overflow-hidden">
            {/* Table header — desktop only */}
            <div className="hidden md:grid grid-cols-[110px_100px_1fr_90px] gap-4 px-6 py-3.5 border-b border-slate-50 dark:border-white/5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              <span>Date</span>
              <span>Image</span>
              <span>Facebook URL</span>
              <span className="text-right">Actions</span>
            </div>

            <div className="divide-y divide-slate-50 dark:divide-white/5">
              {fbs.map((fb) => {
                const isEditing = editingId === fb._id;
                return (
                  <motion.div
                    key={fb._id}
                    layout
                    className="flex flex-col md:grid md:grid-cols-[110px_100px_1fr_90px] gap-3 md:gap-4 md:items-center px-4 sm:px-6 py-3.5 sm:py-4"
                  >
                    <span className="hidden md:block text-xs text-slate-400">
                      {new Date(fb.createdAt).toLocaleDateString()}
                    </span>

                    {isEditing ? (
                      <div className="flex items-center gap-3">
                        <div className="relative w-20 h-12 flex-shrink-0">
                          <img
                            src={editImage}
                            alt="preview"
                            className={`w-20 h-12 rounded-lg object-cover bg-slate-100 ${
                              uploading ? "opacity-50" : ""
                            }`}
                          />
                          <label className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/30 rounded-lg cursor-pointer transition-colors group">
                            <HiOutlineCamera className="text-white text-base opacity-0 group-hover:opacity-100 transition-opacity" />
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageChange(e.target.files[0])}
                              hidden
                            />
                          </label>
                        </div>
                        <div className="flex-1 min-w-0 md:hidden">
                          <input
                            type="text"
                            value={editFbUrl}
                            onChange={(e) => setEditFbUrl(e.target.value)}
                            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-white/10 dark:bg-white/5 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/30"
                            placeholder="Facebook URL"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 md:contents">
                        <img
                          src={fb.image}
                          alt="Facebook post"
                          className="w-20 h-12 rounded-lg object-cover bg-slate-100 flex-shrink-0"
                        />
                        <a
                          href={fb.fbUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="md:hidden text-sm text-[#2B2140] dark:text-white underline break-all min-w-0"
                        >
                          {fb.fbUrl}
                        </a>
                      </div>
                    )}

                    <div className="hidden md:block min-w-0">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editFbUrl}
                          onChange={(e) => setEditFbUrl(e.target.value)}
                          className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-white/10 dark:bg-white/5 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/30"
                          placeholder="Facebook URL"
                        />
                      ) : (
                        <a
                          href={fb.fbUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-[#2B2140] dark:text-white underline truncate block"
                        >
                          {fb.fbUrl}
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-auto md:justify-end">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => handleUpdate(fb._id)}
                            disabled={saving || uploading}
                            className="px-3 py-1.5 rounded-lg bg-[#2B2140] text-white text-xs font-semibold disabled:opacity-50 transition-opacity"
                          >
                            {saving ? "Saving..." : "Save"}
                          </button>
                          <button
                            onClick={handleCancel}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-300 text-xs font-semibold"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(fb)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-[#F7F5F2] hover:text-[#2B2140] dark:hover:bg-white/5 dark:hover:text-white transition-colors"
                            title="Edit"
                          >
                            <CiEdit className="text-lg" />
                          </button>
                          <button
                            onClick={() => {
                              setFbIdToDelete(fb._id);
                              setShowModal(true);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10 transition-colors"
                            title="Delete"
                          >
                            <IoTrashOutline className="text-lg" />
                          </button>
                        </>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
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
              Are you sure you want to delete this post?
            </h3>
            <p className="text-sm text-slate-400 mb-5 sm:mb-6">
              This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <Button color="failure" onClick={handleDelete}>
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