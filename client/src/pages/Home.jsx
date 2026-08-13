import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import PostCardVertical from "../Components/PostCardVertical";
import VisitedPlace from "../Components/VisitedPlace";
import Aboutme from "./Aboutme";
import ShowRecentPost from "./ShowRecentPost";
import MeOnFB from "./MeOnFB";
import {
  FaMapMarkedAlt,
  FaPenNib,
  FaArrowRight,
  FaGithub,
  FaLinkedin,
  FaCode,
  FaPlaneDeparture,
} from "react-icons/fa";
import { HiOutlineNewspaper } from "react-icons/hi";

const textContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};
const textItem = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.7 } },
};
const imageVariants = {
  hidden: { x: 80, opacity: 0, scale: 0.94 },
  visible: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.9, ease: "easeOut" },
  },
};

// Change these to your real profiles / stack once — used in the hero and the tech strip
const SOCIAL_LINKS = {
  github: "https://github.com/your-username",
  linkedin: "https://linkedin.com/in/your-username",
};

const TECH_STACK = [
  "JavaScript",
  "React",
  "Node.js",
  "MongoDB",
  "Tailwind CSS",
  "Express",
];

// Reusable section header used above "Visited Places" and "Latest Posts"
const SectionHeading = ({ eyebrow, title }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="text-center md:text-left mb-4"
  >
    {eyebrow && (
      <span className="inline-block text-xs font-semibold tracking-widest uppercase text-pink-500 mb-1.5">
        {eyebrow}
      </span>
    )}
    <h2 className="text-2xl font-fenix font-bold text-gray-800 dark:text-white">
      {title}
    </h2>
  </motion.div>
);

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/post/getPosts`
        );
        const data = await res.json();
        setPosts(data.posts || []);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="bg-[#FCFCFC] dark:bg-[#10172A] min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden">
        {/* soft decorative glow, light & dark aware */}
        <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-pink-200/50 dark:bg-pink-500/10 blur-3xl" />
        <div className="pointer-events-none absolute top-40 -left-20 w-64 h-64 rounded-full bg-purple-200/40 dark:bg-purple-500/10 blur-3xl" />

        <div className="relative flex min-h-[85vh] items-center">
          <div className="flex flex-col-reverse md:flex-row items-center gap-10 md:gap-40 px-4 md:px-8 lg:px-20 w-full">
            {/* Text column */}
            <motion.div
              className="space-y-4 md:space-y-6 max-w-3xl text-center md:text-left"
              variants={textContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.span
                variants={textItem}
                className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-pink-500 bg-pink-50 dark:bg-pink-500/10 px-3 py-1.5 rounded-full"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500" />
                </span>
                Code &amp; travel journal
              </motion.span>

              <motion.h1
                variants={textItem}
                className="text-2xl sm:text-3xl 2xl:text-5xl font-bold text-gray-800 dark:text-white leading-snug"
              >
                Welcome to <span className="text-pink-500">Fahad Blog</span>
              </motion.h1>

              <motion.p
                variants={textItem}
                className="text-gray-600 dark:text-gray-300 text-base sm:text-lg 2xl:text-2xl leading-relaxed"
              >
                Hi, I&apos;m Fahad — a software engineer who builds things by
                day and chases new places on the side. Here I write about
                the code I&apos;m shipping, the cities I&apos;m exploring,
                and everything in between.
              </motion.p>

              <motion.p
                variants={textItem}
                className="text-gray-500 dark:text-gray-400 text-sm sm:text-base leading-relaxed"
              >
                Life is short, so treasure every moment. Pursue happiness and
                build joyful memories. Live fully and cherish each
                experience.
              </motion.p>

              {/* Stats row — post count is live, not made up */}
              <motion.div
                variants={textItem}
                className="flex items-center justify-center md:justify-start gap-6 pt-1"
              >
                <div className="text-center md:text-left">
                  <p className="text-xl font-bold text-gray-800 dark:text-white">
                    {posts.length}+
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Posts published
                  </p>
                </div>
                <div className="w-px h-8 bg-gray-300 dark:bg-gray-700" />
                <div className="text-center md:text-left">
                  <p className="text-xl font-bold text-gray-800 dark:text-white">
                    Engineer &amp; Traveler
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Code by day, wander by weekend
                  </p>
                </div>
              </motion.div>

              {/* CTAs */}
              <motion.div
                variants={textItem}
                className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2"
              >
                <button className="learn-more">
                  <span className="circle" aria-hidden="true">
                    <span className="icon arrow mt-4"></span>
                  </span>
                  <span className="button-text text-[13px]">
                    <Link to="/search">See all posts</Link>
                  </span>
                </button>

                <Link
                  to="/about"
                  className="group inline-flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-pink-500 dark:hover:text-pink-400 transition-colors"
                >
                  More about me
                  <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </motion.div>

              {/* Social links */}
              <motion.div
                variants={textItem}
                className="flex items-center justify-center md:justify-start gap-3 pt-1"
              >
                <a
                  href={SOCIAL_LINKS.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 dark:bg-[#182238] text-gray-600 dark:text-gray-300 hover:text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-500/10 transition-colors"
                >
                  <FaGithub className="text-base" />
                </a>
                <a
                  href={SOCIAL_LINKS.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 dark:bg-[#182238] text-gray-600 dark:text-gray-300 hover:text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-500/10 transition-colors"
                >
                  <FaLinkedin className="text-base" />
                </a>
              </motion.div>
            </motion.div>

            {/* Image column */}
            <motion.div
              className="relative"
              variants={imageVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="relative mt-4 md:m-0 w-60 h-60 md:w-[330px] md:h-[385px] 2xl:w-[450px] 2xl:h-[450px]">
                {/* gradient frame */}
                <div
                  className="absolute -inset-2 rounded-xl opacity-70 blur-sm"
                  style={{
                    background:
                      "linear-gradient(135deg, #ec4899, #a855f7, #ec4899)",
                  }}
                />
                <img
                  src="/formal.jpeg"
                  alt="Fahad — software engineer and traveler behind Fahad Blog"
                  className="relative w-full h-full object-cover rounded-xl shadow-xl"
                />

                {/* floating badge: post count */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                  className="absolute -bottom-4 -left-4 sm:-left-6 flex items-center gap-2 rounded-xl bg-white dark:bg-[#182238] shadow-lg px-3.5 py-2.5 border border-gray-100 dark:border-gray-700"
                >
                  <span className="w-8 h-8 rounded-lg bg-pink-500/10 text-pink-500 flex items-center justify-center">
                    <HiOutlineNewspaper className="text-base" />
                  </span>
                  <span>
                    <p className="text-sm font-bold text-gray-800 dark:text-white leading-none">
                      {posts.length}+
                    </p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                      Stories shared
                    </p>
                  </span>
                </motion.div>

                {/* floating badge: writing focus */}
                <motion.div
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1, duration: 0.5 }}
                  className="hidden sm:flex absolute -top-4 -right-4 items-center gap-2 rounded-xl bg-white dark:bg-[#182238] shadow-lg px-3.5 py-2.5 border border-gray-100 dark:border-gray-700"
                >
                  <span className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
                    <FaPenNib className="text-sm" />
                  </span>
                  <span>
                    <p className="text-sm font-bold text-gray-800 dark:text-white leading-none">
                      Code &amp; travel
                    </p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                      What I write about
                    </p>
                  </span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* What I do — engineer / traveler split */}
      <div className="md:px-5 px-3 mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-[#182238] p-5 flex items-start gap-4"
          >
            <span className="w-10 h-10 shrink-0 rounded-xl bg-pink-500/10 text-pink-500 flex items-center justify-center">
              <FaCode className="text-lg" />
            </span>
            <div>
              <h3 className="text-base font-bold text-gray-800 dark:text-white">
                Software Engineer
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                I write about the projects, tools, and lessons that come
                from building software day to day.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-[#182238] p-5 flex items-start gap-4"
          >
            <span className="w-10 h-10 shrink-0 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <FaPlaneDeparture className="text-lg" />
            </span>
            <div>
              <h3 className="text-base font-bold text-gray-800 dark:text-white">
                Traveler
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                Between sprints, I try to get out and see somewhere new —
                and write down what I find.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tech stack strip */}
      <div className="md:px-5 px-3 mt-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center justify-center md:justify-start gap-2"
        >
          <span className="text-xs font-semibold tracking-widest uppercase text-gray-400 dark:text-gray-500 mr-1">
            Tools I use
          </span>
          {TECH_STACK.map((tech) => (
            <span
              key={tech}
              className="text-xs font-medium px-3 py-1.5 rounded-full bg-gray-100 dark:bg-[#182238] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
            >
              {tech}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Visited places */}
      <div className="md:px-5 px-3 mt-8 pb-4">
        <SectionHeading
          eyebrow={
            <span className="inline-flex items-center gap-1.5">
              <FaMapMarkedAlt className="text-sm" /> Where I&apos;ve been
            </span>
          }
          title="Visited Places"
        />
        <VisitedPlace />
      </div>


      <div className="max-w-full mx-auto p-3 flex flex-col py-6">
        {posts && posts.length > 0 && (
          <div className="flex flex-col gap-6">
            <div className="md:px-5">
              <SectionHeading eyebrow="From the blog" title="Latest Posts" />
            </div>
            <div className="md:px-5 flex flex-col lg:flex-row gap-6">
              {/* Feed — 1 col mobile, 3 col from md up */}
              <div className="w-full lg:w-2/3 flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {posts.map((post) => (
                    <PostCardVertical key={post._id} post={post} />
                  ))}
                </div>
                <Link
                  to="/search"
                  className="inline-flex items-center justify-center gap-1.5 text-sm text-center text-pink-500 hover:text-pink-600 dark:hover:text-pink-400 mt-2 font-semibold transition-colors border border-pink-200 dark:border-pink-500/20 rounded-full py-2.5 hover:bg-pink-50 dark:hover:bg-pink-500/10"
                >
                  View all posts
                  <FaArrowRight className="text-xs" />
                </Link>
              </div>

              {/* Sidebar */}
              <div className="w-full lg:w-1/3 hidden lg:block">
                <div className="hidden lg:block w-full sticky top-20">
                  <Aboutme />
                  <div className="mt-6">
                    <ShowRecentPost />
                  </div>
                  <div className="mt-6">
                    <MeOnFB />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}