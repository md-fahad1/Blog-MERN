import { motion } from "framer-motion";
import {
  FaGraduationCap,
  FaBriefcase,
  FaCamera,
  FaGlobeAsia,
  FaCode,
} from "react-icons/fa";
import { HiOutlineSparkles } from "react-icons/hi";

const fadeUp = {
  offscreen: { y: 24, opacity: 0 },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", bounce: 0.25, duration: 0.7 },
  },
};

const stagger = {
  offscreen: {},
  onscreen: { transition: { staggerChildren: 0.15 } },
};

// Chronological — education leads to experience, so this stays a sequence
const TIMELINE = [
  {
    icon: FaGraduationCap,
    tag: "2019 — 2023",
    title: "Education",
    image: "/f.jpg",
    body: "I completed my Bachelor of Science (BSc) in Computer Science Engineering from American International University-Bangladesh (AIUB). That's where I built a solid foundation in algorithms, data structures, and software engineering principles.",
  },
  {
    icon: FaBriefcase,
    tag: "2023 — Present",
    title: "Experience",
    image: "/faha.png",
    body: "I started with an internship at Genex Infosys Ltd, then joined an early-stage startup, PI Alpha Lab. Today I work at Connect Auzz, building scalable, user-friendly applications with the MERN stack, React, and Django.",
  },
];

const INTERESTS = ["Travel", "Photography", "Culture", "Bangladesh"];

const STATS = [
  { label: "Years coding", value: "3+" },
  { label: "Places visited", value: "20+" },
  { label: "Projects shipped", value: "10+" },
];

const About = () => {
  return (
    <section className="relative overflow-hidden py-16 md:py-20">
      {/* ambient glow, consistent with the rest of the site */}
      <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-pink-200/50 dark:bg-pink-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 -left-20 w-64 h-64 rounded-full bg-purple-200/40 dark:bg-purple-500/10 blur-3xl" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-pink-500 bg-pink-50 dark:bg-pink-500/10 px-3 py-1.5 rounded-full mb-4">
            <HiOutlineSparkles className="text-sm" />
            Get to know me
          </span>
          <h2 className="font-fenix text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white">
            Something About Me
          </h2>
          <p className="mt-3 text-gray-500 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
            Engineer by trade, traveler by heart — here's the short version
            of how I got here, and what keeps me curious outside of code.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 0.6 }}
          variants={stagger}
          className="grid grid-cols-3 gap-3 sm:gap-6 mb-16 max-w-2xl mx-auto"
        >
          {STATS.map((stat) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              className="text-center rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-slate-800/60 py-5 px-2"
            >
              <p className="text-2xl sm:text-3xl font-bold text-pink-500">
                {stat.value}
              </p>
              <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wide">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Timeline: Education -> Experience */}
        <div className="relative pl-14 sm:pl-20 mb-16">
          {/* connecting line */}
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            style={{ transformOrigin: "top" }}
            className="absolute left-[27px] sm:left-[35px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-pink-400 via-purple-400 to-transparent"
          />

          <div className="flex flex-col gap-12">
            {TIMELINE.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial="offscreen"
                  whileInView="onscreen"
                  viewport={{ once: true, amount: 0.4 }}
                  variants={fadeUp}
                  transition={{ delay: i * 0.1 }}
                  className="relative"
                >
                  {/* icon node */}
                  <span className="absolute -left-14 sm:-left-20 top-0 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-white dark:bg-slate-800 border-2 border-pink-400 shadow-md flex items-center justify-center text-pink-500">
                    <Icon className="text-lg sm:text-xl" />
                  </span>

                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl p-5 sm:p-6 flex flex-col sm:flex-row gap-5 items-start transition-shadow"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-20 h-20 rounded-xl object-cover shadow-md shrink-0"
                    />
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-widest text-pink-500">
                        {item.tag}
                      </span>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                        {item.body}
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Hobbies & travel — feature card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ type: "spring", bounce: 0.25, duration: 0.7 }}
          className="relative rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-700 bg-white dark:bg-slate-800 shadow-xl"
        >
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500" />

          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-0">
            <div className="relative h-48 md:h-full">
              <img
                src="/sreemangal.jpg"
                alt="Traveling in Bangladesh"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/40 to-transparent" />
              <span className="absolute bottom-3 left-3 md:hidden inline-flex items-center gap-1.5 text-white text-xs font-semibold bg-black/40 backdrop-blur px-2.5 py-1 rounded-full">
                <FaGlobeAsia /> Sreemangal, Bangladesh
              </span>
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                  <FaCode className="text-base" />
                </span>
                <span className="text-gray-300 dark:text-gray-600">×</span>
                <span className="w-9 h-9 rounded-xl bg-pink-500/10 text-pink-500 flex items-center justify-center">
                  <FaGlobeAsia className="text-base" />
                </span>
              </div>

              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                Hobbies &amp; Interests
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300 mb-4">
                Traveling is one of my biggest passions — I've visited almost
                every popular destination in Bangladesh, from the serene
                hills of Bandarban to the vibrant streets of Dhaka. Beyond
                that, I enjoy photography, capturing moments that tell
                unique stories, and I'm always curious about different
                cultures and traditions.
              </p>

              <div className="flex flex-wrap gap-2">
                {INTERESTS.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300"
                  >
                    {tag === "Photography" ? (
                      <FaCamera className="text-[10px]" />
                    ) : null}
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;