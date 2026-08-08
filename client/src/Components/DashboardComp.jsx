import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  HiOutlineUserGroup,
  HiOutlineDocumentText,
  HiOutlineChatAlt2,
  HiOutlineHeart,
  HiOutlineArrowNarrowRight,
  HiOutlinePencilAlt,
  HiOutlineCalendar,
} from "react-icons/hi";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const CATEGORY_DOT = {
  coding: "bg-[#FF6B4A]",
  traveling: "bg-[#2DD4BF]",
  study: "bg-[#FFB238]",
  uncategorized: "bg-slate-300",
};

const CATEGORY_LABEL = {
  coding: "text-[#FF6B4A]",
  traveling: "text-[#0D9488]",
  study: "text-[#B45309]",
  uncategorized: "text-slate-500",
};

function Skeleton({ className }) {
  return <div className={`animate-pulse rounded-lg bg-slate-100 dark:bg-white/5 ${className}`} />;
}

export default function DashboardComp() {
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useSelector((state) => state.user);

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/user/getusers?limit=5`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchPosts = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/post/getposts?limit=6`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts);
          setTotalPosts(data.totalPosts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchComments = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/comment/getcomments?limit=20`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          setTotalComments(data.totalComments);
          const likes = (data.comments || []).reduce(
            (sum, c) => sum + (c.numberOfLikes || 0),
            0
          );
          setTotalLikes(likes);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const loadAll = async () => {
      setLoading(true);
      await Promise.all([fetchUsers(), fetchPosts(), fetchComments()]);
      setLoading(false);
    };

    if (currentUser?.isAdmin) {
      loadAll();
    }
  }, [currentUser]);

  const chartData = [
    { name: "Posts", value: totalPosts, fill: "#FF6B4A" },
    { name: "Subs", value: totalUsers, fill: "#FFB238" },
    { name: "Comments", value: totalComments, fill: "#2DD4BF" },
  ];

  return (
    <div className="min-h-screen w-full bg-[#F7F5F2] dark:bg-[#141020] font-sans">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full max-w-[1600px] mx-auto py-4 sm:p-6 lg:p-8 xl:p-10 space-y-5 sm:space-y-7"
      >
        {/* Utility bar */}
        <motion.div variants={fadeUp} className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-slate-400 text-xs sm:text-sm">
            <HiOutlineCalendar className="text-base" />
            <span>{today}</span>
          </div>
          
        </motion.div>

        {/* Heading */}
        <motion.div variants={fadeUp}>
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#FF6B4A] font-bold mb-1">
            Dashboard
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4">
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold text-[#2B2140] dark:text-white leading-tight">
              Welcome back{currentUser?.username ? `, ${currentUser.username}` : ""}
            </h1>
            <Link to="/create-post" className="self-start sm:self-auto">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 bg-[#2B2140] text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-full font-semibold text-xs sm:text-sm shadow-lg shadow-[#2B2140]/20 whitespace-nowrap"
              >
                <HiOutlinePencilAlt className="text-base sm:text-lg" />
                Write a new post
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Hero + stats row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
          <motion.div
            variants={fadeUp}
            className="lg:col-span-3 relative overflow-hidden rounded-2xl sm:rounded-[28px] bg-[#2B2140] text-white p-5 sm:p-7 flex flex-col justify-between min-h-[190px] sm:min-h-[240px] shadow-xl shadow-[#2B2140]/25"
          >
            <div
              className="absolute -right-12 -top-12 w-44 h-44 rounded-full opacity-25 blur-2xl"
              style={{ background: "#FF6B4A" }}
            />
            <div
              className="absolute -left-16 -bottom-20 w-52 h-52 rounded-full opacity-15 blur-2xl"
              style={{ background: "#2DD4BF" }}
            />
            <div className="relative z-10">
              <img
                src={currentUser?.profilePicture}
                alt="you"
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl object-cover ring-4 ring-white/10 mb-3 sm:mb-5 shadow-lg"
              />
              <h2 className="font-display text-lg sm:text-2xl font-semibold">
                {currentUser?.username}
              </h2>
              <p className="text-white/45 text-xs sm:text-sm mt-0.5">Admin &middot; Author</p>
            </div>
            <div className="relative z-10 flex gap-6 sm:gap-8 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/10">
              <div>
                <p className="text-xl sm:text-2xl font-bold font-display">{totalPosts}</p>
                <p className="text-white/40 text-[10px] sm:text-xs uppercase tracking-wide mt-0.5">
                  Posts
                </p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold font-display">{totalUsers}</p>
                <p className="text-white/40 text-[10px] sm:text-xs uppercase tracking-wide mt-0.5">
                  Subscribers
                </p>
              </div>
            </div>
          </motion.div>

          <div className="lg:col-span-9 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {[
              { label: "Total Posts", value: totalPosts, icon: HiOutlineDocumentText, color: "#FF6B4A", bg: "#FFF1EC" },
              { label: "Subscribers", value: totalUsers, icon: HiOutlineUserGroup, color: "#D97706", bg: "#FFF7E8" },
              { label: "Comments", value: totalComments, icon: HiOutlineChatAlt2, color: "#0D9488", bg: "#EAFCFA" },
              { label: "Total Likes", value: totalLikes, icon: HiOutlineHeart, color: "#E11D48", bg: "#FFEFF1" },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="rounded-2xl sm:rounded-[24px] bg-white dark:bg-[#1E1832] p-3.5 sm:p-5 flex flex-col gap-3 sm:gap-5 shadow-sm border border-black/5 dark:border-white/5"
              >
                <div
                  className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center text-base sm:text-xl"
                  style={{ backgroundColor: stat.bg, color: stat.color }}
                >
                  <stat.icon />
                </div>
                <div>
                  {loading ? (
                    <Skeleton className="w-12 h-6 sm:h-7 mb-1" />
                  ) : (
                    <p className="text-xl sm:text-2xl font-bold font-display text-[#2B2140] dark:text-white">
                      {stat.value.toLocaleString()}
                    </p>
                  )}
                  <p className="text-[10px] sm:text-xs text-slate-400 font-medium mt-0.5 sm:mt-1">
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Chart + Recent blogs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
          <motion.div
            variants={fadeUp}
            className="lg:col-span-4 rounded-2xl sm:rounded-[28px] bg-white dark:bg-[#1E1832] p-4 sm:p-7 shadow-sm border border-black/5 dark:border-white/5"
          >
            <h3 className="font-display text-lg sm:text-xl font-semibold text-[#2B2140] dark:text-white mb-1">
              Content overview
            </h3>
            <p className="text-xs text-slate-400 mb-4 sm:mb-6">
              Posts, subscribers and comments at a glance
            </p>
            {loading ? (
              <Skeleton className="w-full h-[180px] sm:h-[220px]" />
            ) : (
              <ResponsiveContainer width="100%" height={180} className="sm:!h-[220px]">
                <BarChart data={chartData} barSize={36}>
                  <CartesianGrid vertical={false} stroke="#00000008" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94A3B8", fontSize: 11, fontFamily: "Inter" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94A3B8", fontSize: 11, fontFamily: "Inter" }}
                    width={30}
                  />
                  <Tooltip
                    cursor={{ fill: "#00000006" }}
                    contentStyle={{
                      borderRadius: 14,
                      border: "none",
                      boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
                      fontFamily: "Inter",
                      fontSize: 13,
                    }}
                  />
                  <Bar dataKey="value" radius={[10, 10, 10, 10]} />
                </BarChart>
              </ResponsiveContainer>
            )}

            <div className="flex flex-wrap gap-3 sm:gap-5 mt-4 sm:mt-6 pt-4 sm:pt-5 border-t border-slate-50 dark:border-white/5">
              {chartData.map((d) => (
                <div key={d.name} className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: d.fill }}
                  />
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {d.name}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="lg:col-span-8 rounded-2xl sm:rounded-[28px] bg-white dark:bg-[#1E1832] p-4 sm:p-7 shadow-sm border border-black/5 dark:border-white/5"
          >
            <div className="flex justify-between items-center mb-4 sm:mb-5">
              <h3 className="font-display text-lg sm:text-xl font-semibold text-[#2B2140] dark:text-white">
                Recent blogs
              </h3>
              <Link
                to="/dashboard?tab=posts"
                className="text-xs font-semibold text-[#2B2140] dark:text-white/70 flex items-center gap-1 group"
              >
                View all
                <HiOutlineArrowNarrowRight className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 sm:gap-4">
                    <Skeleton className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="w-2/3 h-4" />
                      <Skeleton className="w-1/3 h-3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-10 sm:py-14">
                <p className="text-sm text-slate-400 mb-3">
                  No posts yet — your first story starts here.
                </p>
                <Link
                  to="/create-post"
                  className="text-sm font-semibold text-[#FF6B4A] hover:text-[#e55a3a] transition-colors"
                >
                  Write your first post →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 divide-y sm:divide-y-0 divide-slate-50 dark:divide-white/5">
                {posts.map((post) => (
                  <motion.div
                    key={post._id}
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="flex items-center gap-3 sm:gap-4 py-3 sm:py-3.5 border-b border-slate-50 dark:border-white/5 sm:border-b-0"
                  >
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl object-cover bg-slate-100 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-xs sm:text-sm text-[#2B2140] dark:text-white truncate">
                        {post.title}
                      </p>
                      <div className="flex items-center gap-1.5 sm:gap-2 mt-1 sm:mt-1.5 flex-wrap">
                        <span
                          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                            CATEGORY_DOT[post.category] || CATEGORY_DOT.uncategorized
                          }`}
                        />
                        <span
                          className={`text-[10px] sm:text-xs font-medium capitalize ${
                            CATEGORY_LABEL[post.category] || CATEGORY_LABEL.uncategorized
                          }`}
                        >
                          {post.category}
                        </span>
                        <span className="text-xs text-slate-300 hidden sm:inline">&middot;</span>
                        <span className="text-[10px] sm:text-xs text-slate-400">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Link
                      to={`/update-post/${post._id}`}
                      className="text-[10px] sm:text-xs font-semibold text-[#2B2140] dark:text-white/70 bg-slate-50 dark:bg-white/5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full hover:bg-[#2B2140] hover:text-white dark:hover:bg-white/10 transition-colors flex-shrink-0"
                    >
                      Edit
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Recent subscribers strip */}
        {!loading && users.length > 0 && (
          <motion.div
            variants={fadeUp}
            className="rounded-2xl sm:rounded-[28px] bg-white dark:bg-[#1E1832] p-4 sm:p-7 shadow-sm border border-black/5 dark:border-white/5"
          >
            <div className="flex justify-between items-center mb-4 sm:mb-5">
              <h3 className="font-display text-lg sm:text-xl font-semibold text-[#2B2140] dark:text-white">
                Recent subscribers
              </h3>
              <Link
                to="/dashboard?tab=users"
                className="text-xs font-semibold text-[#2B2140] dark:text-white/70 flex items-center gap-1 group"
              >
                View all
                <HiOutlineArrowNarrowRight className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="flex flex-wrap gap-2.5 sm:gap-4">
              {users.map((user) => (
                <motion.div
                  key={user._id}
                  whileHover={{ y: -3 }}
                  className="flex items-center gap-2 sm:gap-3 bg-slate-50 dark:bg-white/5 rounded-full pl-1.5 pr-3 sm:pr-4 py-1.5"
                >
                  <img
                    src={user.profilePicture}
                    alt={user.username}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-white dark:ring-white/10"
                  />
                  <span className="text-xs sm:text-sm font-medium text-[#2B2140] dark:text-white">
                    {user.username}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}