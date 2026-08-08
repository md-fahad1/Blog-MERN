import {
  HiUser,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiAnnotation,
  HiChartPie,
  HiOutlineGlobeAlt,
  HiOutlineThumbUp,
} from "react-icons/hi";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";

const NAV_ITEMS = [
  { tab: "dash", label: "Dashboard", icon: HiChartPie, adminOnly: true },
  { tab: "profile", label: "Profile", icon: HiUser, adminOnly: false },
  { tab: "posts", label: "Posts", icon: HiDocumentText, adminOnly: true },
  { tab: "travelpost", label: "Travel Posts", icon: HiOutlineGlobeAlt, adminOnly: false },
  { tab: "fb", label: "Fb Posts", icon: HiOutlineThumbUp, adminOnly: false },
  { tab: "users", label: "Users", icon: HiOutlineUserGroup, adminOnly: true },
  { tab: "comments", label: "Comments", icon: HiAnnotation, adminOnly: true },
];

export default function DashSidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    } else {
      setTab("");
    }
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
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

  const isActive = (itemTab) =>
    itemTab === "dash" ? tab === "dash" || !tab : tab === itemTab;

  return (
    <aside className="w-16 md:w-64 flex-shrink-0 h-full">
      <div className="sticky top-0 h-screen flex flex-col bg-white dark:bg-[#1E1832] border-r border-black/5 dark:border-white/5 py-4 md:py-6 px-2 md:px-4">
        {/* Brand */}
        

        {/* User mini-card */}
        {currentUser && (
          <Link
            to="/dashboard?tab=profile"
            className="hidden md:flex items-center gap-3 bg-[#F7F5F2] dark:bg-white/5 rounded-2xl px-3 py-2.5 mb-5"
          >
            <img
              src={currentUser.profilePicture}
              alt={currentUser.username}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-white dark:ring-white/10 flex-shrink-0"
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#2B2140] dark:text-white truncate">
                {currentUser.username}
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                {currentUser.isAdmin ? "Administrator" : "Member"}
              </p>
            </div>
          </Link>
        )}
        <div className="md:hidden flex justify-center mb-5">
          <img
            src={currentUser?.profilePicture}
            alt={currentUser?.username}
            className="w-9 h-9 rounded-full object-cover ring-2 ring-[#F7F5F2] dark:ring-white/10"
          />
        </div>

        {/* Nav */}
        <nav className="flex-1 flex flex-col gap-1 overflow-y-auto">
          {NAV_ITEMS.filter((item) => !item.adminOnly || currentUser?.isAdmin).map(
            (item) => {
              const active = isActive(item.tab);
              return (
                <Link key={item.tab} to={`/dashboard?tab=${item.tab}`}>
                  <motion.div
                    whileHover={{ x: active ? 0 : 3 }}
                    className={`relative flex items-center gap-3 px-2.5 md:px-3 py-2.5 rounded-xl md:rounded-2xl text-sm font-medium transition-colors ${
                      active
                        ? "bg-[#FFF1EC] dark:bg-[#FF6B4A]/10 text-[#FF6B4A]"
                        : "text-slate-500 dark:text-slate-400 hover:bg-[#F7F5F2] dark:hover:bg-white/5 hover:text-[#2B2140] dark:hover:text-white"
                    }`}
                  >
                    <item.icon className="text-lg flex-shrink-0" />
                    <span className="hidden md:inline truncate">
                      {item.label}
                    </span>
                    {active && (
                      <motion.span
                        layoutId="sidebar-active-dot"
                        className="hidden md:block ml-auto w-1.5 h-1.5 rounded-full bg-[#FF6B4A] flex-shrink-0"
                      />
                    )}
                  </motion.div>
                </Link>
              );
            }
          )}
        </nav>

        {/* Sign out */}
        <button
          onClick={handleSignout}
          className="flex items-center gap-3 px-2.5 md:px-3 py-2.5 mt-2 rounded-xl md:rounded-2xl text-sm font-medium text-slate-400 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10 transition-colors"
        >
          <HiArrowSmRight className="text-lg flex-shrink-0" />
          <span className="hidden md:inline">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}