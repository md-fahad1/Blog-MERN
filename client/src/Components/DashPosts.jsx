import { Modal, Button, FileInput, Select, TextInput, Alert } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { HiOutlineExclamationCircle, HiOutlinePlus } from "react-icons/hi";
import { IoTrashOutline } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { compressImage } from "../../utils/imageCompressor";

const CATEGORY_DOT = {
  coding: "bg-[#FF6B4A]",
  traveling: "bg-[#2DD4BF]",
  study: "bg-[#FFB238]",
  uncategorized: "bg-slate-300",
};

const CATEGORY_LABEL = {
  coding: "text-[#FF6B4A] bg-[#FFF1EC]",
  traveling: "text-[#0D9488] bg-[#EAFCFA]",
  study: "text-[#B45309] bg-[#FFF7E8]",
  uncategorized: "text-slate-500 bg-slate-50",
};

function Skeleton({ className }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-slate-100 dark:bg-white/5 ${className}`}
    />
  );
}

const emptyForm = {
  title: "",
  category: "uncategorized",
  image: "",
  content: "",
};

export default function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [loading, setLoading] = useState(true);

  // ---- delete modal ----
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState("");

  // ---- create / update modal ----
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingId, setEditingId] = useState(null); // null => create mode
  const [formData, setFormData] = useState(emptyForm);
  const [formLoading, setFormLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [publishError, setPublishError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const isEditMode = editingId !== null;

  // -------- Fetch posts --------
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/post/getposts`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (res.ok) {
          setUserPosts(data.posts);
          if (data.posts.length < 9) setShowMore(false);
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };
    if (currentUser?.isAdmin) {
      fetchPosts();
    } else {
      setLoading(false);
    }
  }, [currentUser?._id]);

  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`,
        { credentials: "include" }
      );
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 9) setShowMore(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // -------- Delete --------
  const handleDeletePost = async () => {
    setShowDeleteModal(false);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/post/deletepost/${postIdToDelete}/${currentUser._id}`,
        { method: "DELETE", credentials: "include" }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserPosts((prev) => prev.filter((post) => post._id !== postIdToDelete));
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // -------- Open modal helpers --------
  const resetFormState = () => {
    setFormData(emptyForm);
    setFile(null);
    setImageUploadProgress(null);
    setImageUploadError(null);
    setPublishError(null);
  };

  const openCreateModal = () => {
    setEditingId(null);
    resetFormState();
    setShowFormModal(true);
  };

  const openEditModal = async (post) => {
    setEditingId(post._id);
    resetFormState();
    setShowFormModal(true);
    setFormLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/post/getposts?postId=${post._id}`,
        { credentials: "include" }
      );
      const data = await res.json();
      if (res.ok && data.posts?.[0]) {
        const p = data.posts[0];
        setFormData({
          title: p.title || "",
          category: p.category || "uncategorized",
          image: p.image || "",
          content: p.content || "",
        });
      } else {
        // fall back to the row data we already have
        setFormData({
          title: post.title || "",
          category: post.category || "uncategorized",
          image: post.image || "",
          content: post.content || "",
        });
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setFormLoading(false);
    }
  };

  const closeFormModal = () => {
    if (submitting) return;
    setShowFormModal(false);
    setEditingId(null);
    resetFormState();
  };

  // -------- Image upload (backend /api/upload — same as travel posts) --------
  const handleUploadImage = async () => {
    if (!file) {
      setImageUploadError("Please select an image");
      return;
    }
    setImageUploadError(null);
    setImageUploadProgress(0);
    try {
      const compressedFile = await compressImage(file);
      const formDataUpload = new FormData();
      formDataUpload.append("images", compressedFile);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/upload`, {
        method: "POST",
        body: formDataUpload,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");

      setImageUploadProgress(100);
      setFormData((prev) => ({ ...prev, image: data.images[0] }));
      setFile(null);
      setTimeout(() => setImageUploadProgress(null), 400);
    } catch (error) {
      console.error("Upload error:", error.message);
      setImageUploadError(error.message || "Image upload failed");
      setImageUploadProgress(null);
    }
  };

  // -------- Submit (create or update) --------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setPublishError(null);
    setSubmitting(true);
    try {
      const url = isEditMode
        ? `${import.meta.env.VITE_API_URL}/api/post/updatepost/${editingId}/${currentUser._id}`
        : `${import.meta.env.VITE_API_URL}/api/post/create`;

      const res = await fetch(url, {
        method: isEditMode ? "PUT" : "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      if (isEditMode) {
        setUserPosts((prev) =>
          prev.map((p) => (p._id === editingId ? { ...p, ...data } : p))
        );
      } else {
        setUserPosts((prev) => [data, ...prev]);
      }

      setShowFormModal(false);
      setEditingId(null);
      resetFormState();
    } catch (error) {
      setPublishError("Something went wrong");
    } finally {
      setSubmitting(false);
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
              Posts
            </h1>
          </div>
          {currentUser?.isAdmin && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={openCreateModal}
              className="self-start sm:self-auto flex items-center gap-2 bg-[#2B2140] text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-full font-semibold text-xs sm:text-sm shadow-lg shadow-[#2B2140]/20 whitespace-nowrap"
            >
              <HiOutlinePlus className="text-base sm:text-lg" />
              Create a post
            </motion.button>
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
        ) : !currentUser?.isAdmin || userPosts.length === 0 ? (
          <div className="rounded-2xl sm:rounded-[28px] bg-white dark:bg-[#1E1832] shadow-sm border border-black/5 dark:border-white/5 p-10 sm:p-16 text-center">
            <p className="text-sm text-slate-400 mb-3">
              {currentUser?.isAdmin
                ? "No posts yet — your first story starts here."
                : "You have no posts yet!"}
            </p>
            {currentUser?.isAdmin && (
              <button
                onClick={openCreateModal}
                className="text-sm font-semibold text-[#FF6B4A] hover:text-[#e55a3a] transition-colors"
              >
                Write your first post →
              </button>
            )}
          </div>
        ) : (
          <div className="rounded-2xl sm:rounded-[28px] bg-white dark:bg-[#1E1832] shadow-sm border border-black/5 dark:border-white/5 overflow-hidden">
            {/* Table header — desktop only */}
            <div className="hidden md:grid grid-cols-[110px_88px_1fr_130px_70px] gap-4 px-6 py-3.5 border-b border-slate-50 dark:border-white/5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              <span>Updated</span>
              <span>Image</span>
              <span>Title</span>
              <span>Category</span>
              <span className="text-right">Actions</span>
            </div>

            <div className="divide-y divide-slate-50 dark:divide-white/5">
              {userPosts.map((post) => (
                <motion.div
                  key={post._id}
                  whileHover={{ backgroundColor: "rgba(0,0,0,0.015)" }}
                  className="flex flex-col md:grid md:grid-cols-[110px_88px_1fr_130px_70px] gap-3 md:gap-4 md:items-center px-4 sm:px-6 py-3.5 sm:py-4"
                >
                  <span className="hidden md:block text-xs text-slate-400">
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-3 md:contents">
                    <button
                      type="button"
                      onClick={() => openEditModal(post)}
                      className="flex-shrink-0"
                    >
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-16 h-10 sm:w-20 sm:h-11 rounded-lg sm:rounded-xl object-cover bg-slate-100"
                      />
                    </button>

                    <div className="min-w-0 flex-1 md:hidden">
                      <button
                        type="button"
                        onClick={() => openEditModal(post)}
                        className="font-semibold text-sm text-[#2B2140] dark:text-white truncate block text-left"
                      >
                        {post.title}
                      </button>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                            CATEGORY_DOT[post.category] || CATEGORY_DOT.uncategorized
                          }`}
                        />
                        <span className="text-[11px] text-slate-400 capitalize">
                          {post.category}
                        </span>
                        <span className="text-[11px] text-slate-300">·</span>
                        <span className="text-[11px] text-slate-400">
                          {new Date(post.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => openEditModal(post)}
                    className="hidden md:block font-medium text-sm text-[#2B2140] dark:text-white truncate text-left"
                  >
                    {post.title}
                  </button>

                  <span
                    className={`hidden md:inline-flex w-fit items-center px-2.5 py-1 rounded-full text-[11px] font-medium capitalize ${
                      CATEGORY_LABEL[post.category] || CATEGORY_LABEL.uncategorized
                    }`}
                  >
                    {post.category}
                  </span>

                  <div className="flex items-center gap-2 self-end md:self-auto md:justify-end">
                    <button
                      onClick={() => openEditModal(post)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-[#F7F5F2] hover:text-[#2B2140] dark:hover:bg-white/5 dark:hover:text-white transition-colors"
                      title="Edit"
                    >
                      <CiEdit className="text-lg" />
                    </button>
                    <button
                      onClick={() => {
                        setShowDeleteModal(true);
                        setPostIdToDelete(post._id);
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
      <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)} popup size="md">
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
              <Button color="failure" onClick={handleDeletePost}>
                Yes, delete it
              </Button>
              <Button color="gray" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Create / Update modal */}
      <Modal
        show={showFormModal}
        onClose={closeFormModal}
        size="3xl"
        dismissible={!submitting}
        className="[&>div]:items-end sm:[&>div]:items-center"
      >
        <Modal.Header>
          <span className="text-[#2B2140] font-semibold">
            {isEditMode ? "✏️ Update post" : "📝 Create a post"}
          </span>
        </Modal.Header>

        {/* max-h keeps the modal usable on short mobile viewports; only the body scrolls */}
        <Modal.Body className="max-h-[75vh] overflow-y-auto">
          {formLoading ? (
            <div className="space-y-3 py-6">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : (
            <form
              id="post-form"
              className="flex flex-col gap-4"
              onSubmit={handleSubmit}
            >
              <div className="flex flex-col gap-4 sm:flex-row justify-between">
                <TextInput
                  type="text"
                  placeholder="Title"
                  required
                  className="flex-1"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                />
                <Select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, category: e.target.value }))
                  }
                  className="sm:w-56"
                >
                  <option value="uncategorized">Select a category</option>
                  <option value="coding">Coding</option>
                  <option value="traveling">Traveling</option>
                  <option value="study">Study</option>
                </Select>
              </div>

              {/* Image upload — same Firebase flow as before */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center justify-between border-4 border-teal-500 border-dotted p-3 rounded-xl">
                <FileInput
                  type="file"
                  accept="image/*"
                  className="w-full"
                  onChange={(e) => setFile(e.target.files[0])}
                />
                <Button
                  type="button"
                  gradientDuoTone="purpleToBlue"
                  size="sm"
                  outline
                  onClick={handleUploadImage}
                  disabled={imageUploadProgress !== null}
                  className="flex-shrink-0"
                >
                  {imageUploadProgress ? (
                    <div className="w-14 h-14 sm:w-16 sm:h-16">
                      <CircularProgressbar
                        value={imageUploadProgress}
                        text={`${imageUploadProgress || 0}%`}
                      />
                    </div>
                  ) : (
                    "Upload image"
                  )}
                </Button>
              </div>

              {imageUploadError && (
                <Alert color="failure">{imageUploadError}</Alert>
              )}

              {formData.image && (
                <img
                  src={formData.image}
                  alt="upload"
                  className="w-full h-48 sm:h-72 rounded-xl object-cover"
                />
              )}

              <div className="border rounded-xl overflow-hidden">
                <ReactQuill
                  theme="snow"
                  value={formData.content}
                  placeholder="Write something..."
                  className="h-48 sm:h-64"
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, content: value }))
                  }
                />
              </div>

              {publishError && (
                <Alert className="mt-10 sm:mt-3" color="failure">
                  {publishError}
                </Alert>
              )}
            </form>
          )}
        </Modal.Body>

        {/* Sticky footer keeps the submit action reachable on small screens */}
        <Modal.Footer className="flex justify-end gap-2 border-t border-slate-100">
          <Button color="gray" onClick={closeFormModal} disabled={submitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="post-form"
            gradientDuoTone="purpleToPink"
            disabled={submitting || formLoading}
          >
            {submitting
              ? isEditMode
                ? "Saving..."
                : "Publishing..."
              : isEditMode
              ? "💾 Update post"
              : "🚀 Publish"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}