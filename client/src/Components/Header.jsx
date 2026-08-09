import { Avatar, Dropdown } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { signoutSuccess } from "../redux/user/userSlice";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenu, HiX } from "react-icons/hi";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Projects", to: "/projects" },
];

export default function Header() {
  const path = useLocation().pathname;
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
      if (isMenuOpen) setIsMenuOpen(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMenuOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [path]);

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", { method: "POST" });
      const data = await res.json();
      if (res.ok) dispatch(signoutSuccess());
    } catch (error) {
      console.log(error.message);
    }
  };

  const activeOrHovered = hoveredLink ?? path;

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-lg shadow-[0_1px_0_0_rgba(0,0,0,0.06)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.06)]"
          : "bg-[#FCFCFC] dark:bg-[#10172A]"
      }`}
    >
      <div className="max-w-8xl mx-auto px-4 md:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo — code-style mark */}
          <Link
            to="/"
            className="group flex items-center gap-0.5 font-mono text-base sm:text-lg 2xl:text-xl font-semibold whitespace-nowrap shrink-0"
          >
           
            <span className="text-gray-800 dark:text-white group-hover:text-pink-500 dark:group-hover:text-pink-400 transition-colors">
              Fahad
            </span>
            <span className="text-pink-500">Blog</span>
            <span className="ml-0.5 w-[2px] h-4 bg-pink-500 animate-[blink_1.1s_steps(1)_infinite]" />
          </Link>

          {/* Desktop nav — segmented pill with sliding indicator */}
          <nav
            onMouseLeave={() => setHoveredLink(null)}
            className="hidden md:flex items-center gap-1 relative bg-gray-100/80 dark:bg-white/5 rounded-full p-1"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onMouseEnter={() => setHoveredLink(link.to)}
                className="relative px-4 py-1.5 text-sm font-semibold rounded-full transition-colors z-10"
              >
                {activeOrHovered === link.to && (
                  <motion.span
                    layoutId="nav-pill"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className="absolute inset-0 rounded-full bg-white dark:bg-[#182238] shadow-sm -z-10"
                  />
                )}
                <span
                  className={
                    path === link.to
                      ? "text-pink-500"
                      : "text-gray-600 dark:text-gray-300"
                  }
                >
                  {link.label}
                </span>
              </Link>
            ))}
            <a
              href="https://fahad-portfolio-v1-bice.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setHoveredLink("portfolio")}
              className="relative px-4 py-1.5 text-sm font-semibold rounded-full transition-colors z-10 text-gray-600 dark:text-gray-300"
            >
              {activeOrHovered === "portfolio" && (
                <motion.span
                  layoutId="nav-pill"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  className="absolute inset-0 rounded-full bg-white dark:bg-[#182238] shadow-sm -z-10"
                />
              )}
              Portfolio
            </a>
          </nav>

          {/* Right side controls */}
          <div className="flex items-center gap-3 shrink-0">
            <label className="theme-switch">
              <input
                type="checkbox"
                className="theme-switch__checkbox"
                checked={theme === "dark"}
                onChange={() => dispatch(toggleTheme())}
              />
              <div className="theme-switch__container">
                <div className="theme-switch__clouds"></div>
                <div className="theme-switch__stars-container">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 144 55"
                    fill="none"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M135.831 3.00688C135.055 3.85027 134.111 4.29946 133 4.35447C134.111 4.40947 135.055 4.85867 135.831 5.71123C136.607 6.55462 136.996 7.56303 136.996 8.72727C136.996 7.95722 137.172 7.25134 137.525 6.59129C137.886 5.93124 138.372 5.39954 138.98 5.00535C139.598 4.60199 140.268 4.39114 141 4.35447C139.88 4.2903 138.936 3.85027 138.16 3.00688C137.384 2.16348 136.996 1.16425 136.996 0C136.996 1.16425 136.607 2.16348 135.831 3.00688ZM31 23.3545C32.1114 23.2995 33.0551 22.8503 33.8313 22.0069C34.6075 21.1635 34.9956 20.1642 34.9956 19C34.9956 20.1642 35.3837 21.1635 36.1599 22.0069C36.9361 22.8503 37.8798 23.2903 39 23.3545C38.2679 23.3911 37.5976 23.602 36.9802 24.0053C36.3716 24.3995 35.8864 24.9312 35.5248 25.5913C35.172 26.2513 34.9956 26.9572 34.9956 27.7273C34.9956 26.563 34.6075 25.5546 33.8313 24.7112C33.0551 23.8587 32.1114 23.4095 31 23.3545Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <div className="theme-switch__circle-container">
                  <div className="theme-switch__sun-moon-container">
                    <div className="theme-switch__moon">
                      <div className="theme-switch__spot"></div>
                      <div className="theme-switch__spot"></div>
                      <div className="theme-switch__spot"></div>
                    </div>
                  </div>
                </div>
              </div>
            </label>

            {currentUser ? (
              <Dropdown
                arrowIcon={false}
                inline
                label={
                  <Avatar
                    alt="user"
                    img={currentUser.profilePicture}
                    rounded
                  />
                }
              >
                <Dropdown.Header>
                  <span className="block text-sm">
                    @{currentUser.username}
                  </span>
                  <span className="block text-sm font-medium truncate">
                    {currentUser.email}
                  </span>
                </Dropdown.Header>
                {currentUser.isAdmin && (
                  <Link to="/dashboard?tab=dash">
                    <Dropdown.Item>Dashboard</Dropdown.Item>
                  </Link>
                )}
                <Link to="/dashboard?tab=profile">
                  <Dropdown.Item>Profile</Dropdown.Item>
                </Link>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleSignout}>
                  Sign out
                </Dropdown.Item>
              </Dropdown>
            ) : (
              <Link
                to="/sign-in"
                className="hidden sm:inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 shadow-sm shadow-pink-500/30 transition-all"
              >
                Sign In
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <HiX className="text-xl" />
              ) : (
                <HiMenu className="text-xl" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-t border-gray-100 dark:border-gray-800 bg-[#FCFCFC] dark:bg-[#10172A]"
          >
            <nav className="flex flex-col gap-1 px-4 py-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    path === link.to
                      ? "text-pink-500 bg-pink-50 dark:bg-pink-500/10"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <a
                href="https://fahad-portfolio-v1-bice.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
              >
                Portfolio
              </a>
              {!currentUser && (
                <Link
                  to="/sign-in"
                  className="mt-1 px-3 py-2.5 rounded-full text-sm font-semibold text-center text-white bg-gradient-to-r from-pink-500 to-purple-500"
                >
                  Sign In
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}