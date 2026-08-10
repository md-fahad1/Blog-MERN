import { Spinner } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import OAuth from "../Components/OAuth";
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineExclamationCircle,
  HiOutlineCheckCircle,
} from "react-icons/hi";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const BENEFITS = [
  "Save posts to read later",
  "Comment on stories you love",
  "Pick up right where you left off",
];

const containerVariant = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("Please fill all the fields"));
    }
    try {
      dispatch(signInStart());
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/signin`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
      }

      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#FCFCFC] dark:bg-[#10172A] px-4 py-10 overflow-hidden">
      {/* ambient background glow, consistent with the rest of the site */}
      <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-pink-200/50 dark:bg-pink-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 -left-20 w-64 h-64 rounded-full bg-purple-200/40 dark:bg-purple-500/10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row bg-white dark:bg-slate-800"
      >
        {/* Left — branded panel */}
        <div className="relative hidden md:flex md:w-2/5 flex-col justify-between p-8 bg-gradient-to-br from-pink-500 to-purple-600 overflow-hidden">
          {/* decorative dot grid */}
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.15]"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id="dot-grid"
                width="18"
                height="18"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="1.5" cy="1.5" r="1.5" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dot-grid)" />
          </svg>

          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/20 blur-2xl"
          />
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.22, 0.15] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="pointer-events-none absolute bottom-0 -left-10 w-40 h-40 rounded-full bg-white/20 blur-2xl"
          />

          <Link
            to="/"
            className="relative z-10 inline-flex items-center gap-0.5 font-mono text-lg font-semibold text-white"
          >
            <span className="text-white/70">&lt;</span>
            Fahad<span className="text-white/80">Blog</span>
            <span className="text-white/70">/&gt;</span>
          </Link>

          <div className="relative z-10">
            <span className="inline-block text-[11px] font-semibold tracking-widest uppercase text-white/80 bg-white/10 px-3 py-1 rounded-full mb-4">
              Welcome back
            </span>
            <h2 className="text-2xl sm:text-3xl font-fenix font-bold text-white leading-snug mb-4">
              Good to see you again.
            </h2>
            <ul className="flex flex-col gap-2.5">
              {BENEFITS.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2.5 text-sm text-white/90"
                >
                  <HiOutlineCheckCircle className="text-white/80 text-base shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* trust badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="relative z-10 flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 w-fit"
          >
            <div className="flex -space-x-2">
              {["f.jpg", "faha.png", "formal.jpeg"].map((img) => (
                <img
                  key={img}
                  src={`/${img}`}
                  alt=""
                  className="w-7 h-7 rounded-full border-2 border-pink-500 object-cover"
                />
              ))}
            </div>
            <p className="text-xs text-white/85 leading-tight">
              Joined by readers who love
              <br />
              code &amp; travel stories
            </p>
          </motion.div>
        </div>

        {/* Right — form */}
        <motion.div
          variants={containerVariant}
          initial="hidden"
          animate="visible"
          className="flex-1 p-6 sm:p-10"
        >
          <div className="max-w-sm mx-auto">
            <motion.h1
              variants={fadeUp}
              className="text-xl sm:text-2xl font-fenix font-bold text-gray-800 dark:text-white mb-1"
            >
              Sign in to your account
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="text-sm text-gray-500 dark:text-gray-400 mb-6"
            >
              Enter your details below to continue.
            </motion.p>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              {/* Email */}
              <motion.div variants={fadeUp}>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                >
                  Email
                </label>
                <div className="relative">
                  <HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    type="email"
                    placeholder="name@company.com"
                    id="email"
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/5 text-gray-800 dark:text-white placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/40 focus:border-pink-500 transition-all"
                  />
                </div>
              </motion.div>

              {/* Password */}
              <motion.div variants={fadeUp}>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-medium text-pink-500 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••"
                    id="password"
                    onChange={handleChange}
                    className="w-full pl-11 pr-11 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/5 text-gray-800 dark:text-white placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/40 focus:border-pink-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <FaEyeSlash className="text-sm" />
                    ) : (
                      <FaEye className="text-sm" />
                    )}
                  </button>
                </div>
              </motion.div>

              {/* Remember me */}
              <motion.label
                variants={fadeUp}
                className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 select-none cursor-pointer -mt-1"
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-pink-500 focus:ring-pink-500/40 focus:ring-offset-0"
                />
                Remember me
              </motion.label>

              <motion.button
                variants={fadeUp}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="mt-1 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 shadow-lg shadow-pink-500/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Spinner size="sm" light />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </motion.button>

              <motion.div
                variants={fadeUp}
                className="flex items-center gap-3 my-1"
              >
                <span className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  or continue with
                </span>
                <span className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
              </motion.div>

              <motion.div variants={fadeUp}>
                <OAuth />
              </motion.div>
            </form>

            <motion.div
              variants={fadeUp}
              className="flex gap-1.5 text-sm mt-6 text-gray-500 dark:text-gray-400"
            >
              <span>Don't have an account?</span>
              <Link
                to="/sign-up"
                className="text-pink-500 hover:text-pink-600 dark:hover:text-pink-400 font-semibold transition-colors"
              >
                Sign Up
              </Link>
            </motion.div>

            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2.5 mt-5 p-3.5 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm"
              >
                <HiOutlineExclamationCircle className="text-lg shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}