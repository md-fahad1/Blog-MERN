import { Modal, Button, FileInput, TextInput, Alert } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineExclamationCircle,
  HiOutlinePlus,
  HiOutlineX,
} from "react-icons/hi";
import { IoTrashOutline, IoLocationOutline } from "react-icons/io5";
import { CiEdit, CiCalendar } from "react-icons/ci";
import { FaMapMarkerAlt } from "react-icons/fa";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { compressImage } from "../../utils/imageCompressor";

function Skeleton({ className }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-slate-100 dark:bg-white/5 ${className}`}
    />
  );
}

const emptyForm = {
  title: "",
  location: "",
  tripDate: "",
  tags: [],
  images: [],
  description: "",
};

// Backend returns ISO datetimes; the <input type="date"> needs YYYY-MM-DD
function toDateInputValue(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

export default function DashTravel() {
  const { currentUser } = useSelector((state) => state.user);
  const [travels, setTravels] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [loading, setLoading] = useState(true);

  // ---- delete modal ----
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [travelIdToDelete, setTravelIdToDelete] = useState("");

  // ---- create / update modal ----
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingId, setEditingId] = useState(null); // null => create mode
  const [formData, setFormData] = useState(emptyForm);
  const [formLoading, setFormLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [imageUploadProgress, setImageUploadProgress] = useState({});
  const [imageUploadError, setImageUploadError] = useState(null);
  const [publishError, setPublishError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const debounceRef = useRef(null);
  const dateRef = useRef(null);

  const isEditMode = editingId !== null;

  // -------- Fetch travels --------
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

  // -------- Delete --------
  const handleDeleteTravel = async () => {
    setShowDeleteModal(false);
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

  // -------- Open modal helpers --------
  const resetFormState = () => {
    setFormData(emptyForm);
    setFiles([]);
    setImageUploadProgress({});
    setImageUploadError(null);
    setPublishError(null);
    setTagInput("");
    setLocationSuggestions([]);
  };

  const openCreateModal = () => {
    setEditingId(null);
    resetFormState();
    setShowFormModal(true);
  };

  const openEditModal = async (travel) => {
    setEditingId(travel._id);
    resetFormState();
    setShowFormModal(true);
    setFormLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/travel/get/${travel._id}`,
        { credentials: "include" }
      );
      const data = await res.json();
      if (res.ok) {
        const t = data.travel || data;
        setFormData({
          title: t.title || "",
          location: t.location || "",
          tripDate: toDateInputValue(t.tripDate),
          tags: t.tags || [],
          images: t.images || [],
          description: t.description || "",
        });
      } else {
        // fall back to the row data we already have
        setFormData({
          title: travel.title || "",
          location: travel.location || "",
          tripDate: toDateInputValue(travel.tripDate),
          tags: travel.tags || [],
          images: travel.images || [],
          description: travel.description || "",
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

  // -------- Image upload --------
  const handleUploadImages = async () => {
    if (!files.length) {
      setImageUploadError("Please select at least one image");
      return;
    }
    setImageUploadError(null);
    try {
      const uploadedURLs = [];
      for (const file of files) {
        const compressedFile = await compressImage(file);
        const formDataUpload = new FormData();
        formDataUpload.append("images", compressedFile);

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/upload`, {
          method: "POST",
          body: formDataUpload,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Upload failed");

        uploadedURLs.push(...data.images);
        setImageUploadProgress((prev) => ({ ...prev, [file.name]: 100 }));
      }

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedURLs],
      }));
      setFiles([]);
      setImageUploadProgress({});
    } catch (err) {
      setImageUploadError(err.message);
    }
  };

  // -------- Submit (create or update) --------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.images.length) {
      setPublishError("Please upload at least one image");
      return;
    }
    setPublishError(null);
    setSubmitting(true);
    try {
      const url = isEditMode
        ? `${import.meta.env.VITE_API_URL}/api/travel/updatetravel/${editingId}`
        : `${import.meta.env.VITE_API_URL}/api/travel/create`;

      const res = await fetch(url, {
        method: isEditMode ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      if (isEditMode) {
        setTravels((prev) =>
          prev.map((t) => (t._id === editingId ? { ...t, ...data.travel || data } : t))
        );
      } else {
        const created = data.travel || data;
        setTravels((prev) => [created, ...prev]);
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

  // -------- Tags --------
  const handleAddTag = () => {
    if (tagInput.trim() === "") return;
    if (formData.tags.includes(tagInput.trim())) return;
    setFormData((prev) => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  // -------- Location autocomplete --------
  const handleLocationChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, location: value }));
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (value.length > 1) fetchLocationSuggestions(value);
      else setLocationSuggestions([]);
    }, 500);
  };

  const fetchLocationSuggestions = async (query) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          query
        )},Bangladesh&format=json&addressdetails=1`
      );
      const data = await res.json();
      setLocationSuggestions(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectLocation = (loc) => {
    setFormData((prev) => ({ ...prev, location: loc.display_name }));
    setLocationSuggestions([]);
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
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={openCreateModal}
              className="self-start sm:self-auto flex items-center gap-2 bg-[#2B2140] text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-full font-semibold text-xs sm:text-sm shadow-lg shadow-[#2B2140]/20 whitespace-nowrap"
            >
              <HiOutlinePlus className="text-base sm:text-lg" />
              Create a travel post
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
        ) : travels.length === 0 ? (
          <div className="rounded-2xl sm:rounded-[28px] bg-white dark:bg-[#1E1832] shadow-sm border border-black/5 dark:border-white/5 p-10 sm:p-16 text-center">
            <p className="text-sm text-slate-400 mb-3">
              You have no travel posts yet!
            </p>
            {currentUser?.isAdmin && (
              <button
                onClick={openCreateModal}
                className="text-sm font-semibold text-[#FF6B4A] hover:text-[#e55a3a] transition-colors"
              >
                Write your first travel post →
              </button>
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
                    <button
                      type="button"
                      onClick={() => openEditModal(travel)}
                      className="flex-shrink-0"
                    >
                      <img
                        src={travel.images?.[0]}
                        alt={travel.title}
                        className="w-16 h-10 sm:w-20 sm:h-11 rounded-lg sm:rounded-xl object-cover bg-slate-100"
                      />
                    </button>

                    <div className="min-w-0 flex-1 md:hidden">
                      <button
                        type="button"
                        onClick={() => openEditModal(travel)}
                        className="font-semibold text-sm text-[#2B2140] dark:text-white truncate block text-left"
                      >
                        {travel.title}
                      </button>
                      <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-400">
                        <IoLocationOutline className="flex-shrink-0" />
                        <span className="truncate">{travel.location}</span>
                        <span className="text-slate-300">·</span>
                        <CiCalendar className="flex-shrink-0" />
                        <span>{new Date(travel.tripDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => openEditModal(travel)}
                    className="hidden md:block font-medium text-sm text-[#2B2140] dark:text-white truncate text-left"
                  >
                    {travel.title}
                  </button>

                  <span className="hidden md:flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 truncate">
                    <IoLocationOutline className="flex-shrink-0 text-[#2DD4BF]" />
                    <span className="truncate">{travel.location}</span>
                  </span>

                  <span className="hidden md:block text-sm text-slate-500 dark:text-slate-400">
                    {new Date(travel.tripDate).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-2 self-end md:self-auto md:justify-end">
                    <button
                      onClick={() => openEditModal(travel)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-[#F7F5F2] hover:text-[#2B2140] dark:hover:bg-white/5 dark:hover:text-white transition-colors"
                      title="Edit"
                    >
                      <CiEdit className="text-lg" />
                    </button>
                    <button
                      onClick={() => {
                        setShowDeleteModal(true);
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
      <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)} popup size="md">
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
            {isEditMode ? "✏️ Update travel post" : "✈️ Create travel post"}
          </span>
        </Modal.Header>

        {/* max-h keeps the modal usable on short mobile viewports; only the body scrolls */}
        <Modal.Body className="max-h-[75vh] overflow-y-auto">
          {formLoading ? (
            <div className="space-y-3 py-6">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : (
            <form
              id="travel-form"
              className="flex flex-col gap-4"
              onSubmit={handleSubmit}
            >
              {/* Title */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-600">
                  Title
                </label>
                <TextInput
                  type="text"
                  placeholder="Enter trip title"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                />
              </div>

              {/* Location & Date */}
              <div className="flex flex-col sm:flex-row w-full relative gap-4">
                <div className="flex flex-col w-full sm:w-1/2">
                  <label className="block mb-2 text-sm font-medium text-gray-600">
                    Location
                  </label>
                  <div className="relative w-full">
                    <TextInput
                      type="text"
                      placeholder="City, Area"
                      required
                      value={formData.location || ""}
                      onChange={handleLocationChange}
                      className="w-full"
                    />
                    {formData.location && locationSuggestions.length > 0 && (
                      <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 z-50 max-h-60 overflow-y-auto rounded-md shadow-md">
                        {locationSuggestions.map((loc) => {
                          const addr = loc.address;
                          const mainTitle =
                            addr.city ||
                            addr.town ||
                            addr.village ||
                            addr.county ||
                            "Unknown";
                          const subTitle = [
                            addr.county || "",
                            addr.state_district || "",
                            addr.state || "",
                            addr.country || "",
                          ]
                            .filter(Boolean)
                            .join(", ");
                          return (
                            <li
                              key={loc.place_id}
                              onClick={() => handleSelectLocation(loc)}
                              className="flex items-start gap-3 p-3 hover:bg-gray-100 cursor-pointer"
                            >
                              <div className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-md flex-shrink-0">
                                <FaMapMarkerAlt className="text-gray-600 text-lg" />
                              </div>
                              <div className="flex flex-col leading-tight">
                                <span className="font-semibold text-gray-900 text-sm">
                                  {mainTitle}
                                </span>
                                <span className="text-gray-600 text-xs">
                                  {subTitle}
                                </span>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="flex flex-col w-full sm:w-1/2">
                  <label className="block mb-2 text-sm font-medium text-gray-600">
                    Trip date
                  </label>
                  <TextInput
                    type="date"
                    required
                    ref={dateRef}
                    value={formData.tripDate || ""}
                    onClick={() => dateRef.current?.showPicker?.()}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        tripDate: e.target.value,
                      }))
                    }
                    className="w-full"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-600">
                  Tags
                </label>
                <div className="flex gap-2">
                  <TextInput
                    type="text"
                    placeholder="Add a tag..."
                    value={tagInput}
                    className="flex-1"
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={handleAddTag}
                    gradientDuoTone="greenToBlue"
                    className="flex-shrink-0"
                  >
                    Add
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium shadow-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          className="ml-2 text-red-500 hover:text-red-700"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          <HiOutlineX className="text-xs" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Image upload */}
              <div className="p-4 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 flex flex-col gap-2">
                <FileInput
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setFiles([...e.target.files])}
                />
                <Button
                  type="button"
                  gradientDuoTone="purpleToBlue"
                  size="sm"
                  onClick={handleUploadImages}
                  disabled={!files.length}
                >
                  Upload images
                </Button>
                {files.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {files.map((file) => (
                      <div key={file.name} className="w-14 h-14 sm:w-16 sm:h-16">
                        <CircularProgressbar
                          value={imageUploadProgress[file.name] || 0}
                          text={`${imageUploadProgress[file.name] || 0}%`}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {imageUploadError && (
                <Alert color="failure">{imageUploadError}</Alert>
              )}

              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {formData.images.map((url, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={url}
                        alt={`upload-${idx}`}
                        className="rounded-xl shadow-md w-full h-28 sm:h-36 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            images: prev.images.filter((_, i) => i !== idx),
                          }))
                        }
                        className="absolute top-1.5 right-1.5 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center opacity-90 group-hover:opacity-100"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-600">
                  Description
                </label>
                <div className="border rounded-xl overflow-hidden">
                  <ReactQuill
                    theme="snow"
                    placeholder="Write something about your trip..."
                    className="h-48 sm:h-56"
                    value={formData.description || ""}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, description: value }))
                    }
                  />
                </div>
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
            form="travel-form"
            gradientDuoTone="purpleToPink"
            disabled={submitting || formLoading}
          >
            {submitting
              ? isEditMode
                ? "Saving..."
                : "Publishing..."
              : isEditMode
              ? "💾 Save changes"
              : "🚀 Publish"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}