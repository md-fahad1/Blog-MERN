import { Alert, Button, Modal, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess,
} from "../redux/user/userSlice";
import {
  HiOutlineExclamationCircle,
  HiOutlineCamera,
  HiOutlinePencilAlt,
  HiOutlineTrash,
  HiOutlineLogout,
  HiOutlineCheckCircle,
  HiOutlineShieldCheck,
  HiOutlineMail,
  HiOutlineCalendar,
} from "react-icons/hi";
import { Link } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export default function DashProfile() {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const filePickerRef = useRef();
  const dispatch = useDispatch();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    setImageFileUploading(true);
    setImageFileUploadError(null);

    try {
      const formDataData = new FormData();
      formDataData.append("images", imageFile);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/upload`, {
        method: "POST",
        credentials: "include",
        body: formDataData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Upload failed");
      }

      setImageFileUrl(data.images[0]);

      setFormData((prev) => ({
        ...prev,
        profilePicture: data.images[0],
      }));

      setImageFileUploadProgress(100);
      setImageFileUploading(false);
    } catch (err) {
      setImageFileUploadError(err.message);
      setImageFileUploading(false);
      setImageFileUploadProgress(null);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if (Object.keys(formData).length === 0) {
      setUpdateUserError("No changes made");
      return;
    }
    if (imageFileUploading) {
      setUpdateUserError("Please wait for image to upload");
      return;
    }
    try {
      dispatch(updateStart());
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/update/${currentUser._id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("Profile updated successfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/delete/${currentUser._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignout = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/signout`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const joinedDate = currentUser?.createdAt
    ? new Date(currentUser.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="min-h-screen w-full bg-[#F7F5F2] dark:bg-[#141020] font-sans py-6 px-4 sm:py-10 sm:px-8 lg:px-12">
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.08 } } }}
        className="w-full max-w-6xl mx-auto"
      >
        <motion.div variants={fadeUp} className="mb-6 sm:mb-8">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#FF6B4A] font-bold mb-1">
            Account
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#2B2140] dark:text-white">
            Your profile
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your public profile and account security.
          </p>
        </motion.div>

        {/* Success / Error banners */}
        <AnimatePresence>
          {updateUserSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-5"
            >
              <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-4 py-3 rounded-xl sm:rounded-2xl text-sm font-medium">
                <HiOutlineCheckCircle className="text-lg flex-shrink-0" />
                {updateUserSuccess}
              </div>
            </motion.div>
          )}
          {(updateUserError || error) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-5"
            >
              <Alert color="failure">{updateUserError || error}</Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 items-start">
          {/* LEFT: Profile summary card */}
          <motion.div
            variants={fadeUp}
            className="lg:col-span-1 rounded-2xl sm:rounded-[28px] bg-white dark:bg-[#1E1832] shadow-sm border border-black/5 dark:border-white/5 p-6 sm:p-8 flex flex-col items-center text-center"
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={filePickerRef}
              hidden
            />

            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="relative w-28 h-28 sm:w-36 sm:h-36 cursor-pointer group"
              onClick={() => filePickerRef.current.click()}
            >
              {imageFileUploadProgress && imageFileUploadProgress < 100 && (
                <CircularProgressbar
                  value={imageFileUploadProgress || 0}
                  text={`${imageFileUploadProgress}%`}
                  strokeWidth={4}
                  styles={{
                    root: {
                      width: "100%",
                      height: "100%",
                      position: "absolute",
                      top: 0,
                      left: 0,
                      zIndex: 10,
                    },
                    path: { stroke: "#FF6B4A" },
                    text: {
                      fill: "#2B2140",
                      fontSize: "20px",
                      fontWeight: 700,
                    },
                  }}
                />
              )}
              <img
                src={imageFileUrl || currentUser.profilePicture}
                alt="user"
                className={`rounded-full w-full h-full object-cover ring-4 ring-[#F7F5F2] dark:ring-[#141020] shadow-md ${
                  imageFileUploadProgress &&
                  imageFileUploadProgress < 100 &&
                  "opacity-50"
                }`}
              />
              <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <HiOutlineCamera className="text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>

            <h2 className="mt-4 font-display text-lg sm:text-xl font-semibold text-[#2B2140] dark:text-white">
              {currentUser?.username}
            </h2>

            {currentUser?.isAdmin && (
              <span className="mt-1.5 inline-flex items-center gap-1 bg-[#FFF1EC] dark:bg-[#FF6B4A]/10 text-[#FF6B4A] text-[11px] font-semibold px-2.5 py-1 rounded-full">
                <HiOutlineShieldCheck className="text-sm" />
                Administrator
              </span>
            )}

            <p className="text-xs text-slate-400 mt-3">
              Tap your photo to change it
            </p>

            <AnimatePresence>
              {imageFileUploadError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="w-full mt-3"
                >
                  <Alert color="failure">{imageFileUploadError}</Alert>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="w-full mt-6 pt-6 border-t border-slate-50 dark:border-white/5 space-y-3 text-left">
              <div className="flex items-center gap-2.5 text-sm text-slate-500 dark:text-slate-400">
                <HiOutlineMail className="text-base flex-shrink-0" />
                <span className="truncate">{currentUser?.email}</span>
              </div>
              {joinedDate && (
                <div className="flex items-center gap-2.5 text-sm text-slate-500 dark:text-slate-400">
                  <HiOutlineCalendar className="text-base flex-shrink-0" />
                  <span>Joined {joinedDate}</span>
                </div>
              )}
            </div>

            {currentUser?.isAdmin && (
              <Link to="/create-post" className="w-full mt-6">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  className="w-full flex items-center justify-center gap-2 bg-[#FFF1EC] dark:bg-[#FF6B4A]/10 text-[#FF6B4A] py-3 rounded-xl sm:rounded-2xl font-semibold text-sm transition-colors"
                >
                  Write a new post
                </motion.button>
              </Link>
            )}

            <div className="w-full mt-6 pt-6 border-t border-slate-50 dark:border-white/5 flex justify-between items-center">
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-rose-500 hover:text-rose-600 transition-colors"
              >
                <HiOutlineTrash />
                Delete account
              </button>
              <button
                onClick={handleSignout}
                className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-400 hover:text-[#2B2140] dark:hover:text-white transition-colors"
              >
                <HiOutlineLogout />
                Sign out
              </button>
            </div>
          </motion.div>

          {/* RIGHT: Settings form */}
          <motion.div
            variants={fadeUp}
            className="lg:col-span-2 rounded-2xl sm:rounded-[28px] bg-white dark:bg-[#1E1832] shadow-sm border border-black/5 dark:border-white/5 p-6 sm:p-8"
          >
            <h3 className="font-display text-lg sm:text-xl font-semibold text-[#2B2140] dark:text-white mb-1">
              Account settings
            </h3>
            <p className="text-sm text-slate-400 mb-6">
              Update your username, email, or password.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5 block">
                    Username
                  </label>
                  <TextInput
                    type="text"
                    id="username"
                    placeholder="username"
                    defaultValue={currentUser.username}
                    onChange={handleChange}
                    className="[&_input]:rounded-xl sm:[&_input]:rounded-2xl [&_input]:py-2.5 sm:[&_input]:py-3 [&_input]:text-sm sm:[&_input]:text-base"
                  />
                </div>

                <div>
                  <label className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5 block">
                    Email
                  </label>
                  <TextInput
                    type="email"
                    id="email"
                    placeholder="email"
                    defaultValue={currentUser.email}
                    onChange={handleChange}
                    className="[&_input]:rounded-xl sm:[&_input]:rounded-2xl [&_input]:py-2.5 sm:[&_input]:py-3 [&_input]:text-sm sm:[&_input]:text-base"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5 block">
                  New password
                </label>
                <TextInput
                  type="password"
                  id="password"
                  placeholder="Leave blank to keep current"
                  onChange={handleChange}
                  className="[&_input]:rounded-xl sm:[&_input]:rounded-2xl [&_input]:py-2.5 sm:[&_input]:py-3 [&_input]:text-sm sm:[&_input]:text-base max-w-md"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading || imageFileUploading}
                className="self-start flex items-center justify-center gap-2 bg-[#2B2140] text-white py-3 sm:py-3.5 px-6 rounded-xl sm:rounded-2xl font-semibold text-sm shadow-lg shadow-[#2B2140]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity mt-2"
              >
                <HiOutlinePencilAlt className="text-lg" />
                {loading ? "Saving..." : "Save changes"}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </motion.div>

      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center py-2">
            <HiOutlineExclamationCircle className="h-12 w-12 sm:h-14 sm:w-14 text-rose-400 mb-4 mx-auto" />
            <h3 className="mb-4 sm:mb-6 text-base sm:text-lg font-medium text-[#2B2140] dark:text-slate-300 px-2">
              Are you sure you want to delete your account?
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