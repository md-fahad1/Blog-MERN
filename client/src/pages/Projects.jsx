import {
  FaReact,
  FaJsSquare,
  FaHtml5,
  FaCss3Alt,
  FaNodeJs,
  FaGithub,
  FaExternalLinkAlt,
  FaBootstrap,
  FaSass,
} from "react-icons/fa";
import {
  SiExpress,
  SiMongodb,
  SiNextdotjs,
  SiNestjs,
  SiPostgresql,
  SiTailwindcss,
  SiDotnet,
  SiMysql,
  SiCsharp,
  SiOracle,
  SiGraphql,
  SiPrisma,
} from "react-icons/si";
import React, { useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import projectData from "../../public/projectData";

const iconComponents = {
  FaReact,
  FaJsSquare,
  FaHtml5,
  FaCss3Alt,
  FaNodeJs,
  SiExpress,
  SiMongodb,
  SiNextdotjs,
  SiNestjs,
  SiPostgresql,
  SiTailwindcss,
  SiDotnet,
  SiMysql,
  FaBootstrap,
  FaSass,
  SiCsharp,
  SiOracle,
  SiGraphql,
  SiPrisma,
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const chipVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

const Projects = () => {
  const controlsArray = useRef(projectData.map(() => useAnimation()));
  const projectRefs = useRef([]);

  useEffect(() => {
    projectRefs.current = projectRefs.current.slice(0, projectData.length);

    const observers = projectRefs.current.map(
      (ref, index) =>
        new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              controlsArray.current[index].start("visible");
            } else {
              controlsArray.current[index].start("hidden");
            }
          },
          { threshold: 0.25 }
        )
    );

    projectRefs.current.forEach((ref, index) => {
      if (ref) observers[index].observe(ref);
    });

    return () => {
      projectRefs.current.forEach((ref, index) => {
        if (ref) observers[index].unobserve(ref);
      });
    };
  }, []);

  return (
    <section className="min-h-screen font-fenix py-10" id="projects">
      <h1 className="text-center font-fenix font-bold my-10 text-3xl md:text-4xl">
        Projects with demo
      </h1>

      <div className="w-full md:container mx-auto px-4 md:px-12 flex flex-col gap-14">
        {projectData.map((project, index) => {
          const controls = controlsArray.current[index];
          const isEven = index % 2 === 0;

          return (
            <motion.div
              key={index}
              ref={(el) => (projectRefs.current[index] = el)}
              initial="hidden"
              animate={controls}
              variants={containerVariants}
              className={`relative flex flex-col md:flex-row gap-6 md:gap-10 items-center
                rounded-2xl border border-white/10 bg-[#061E3D]/60 backdrop-blur-sm
                p-4 md:p-6 transition-colors duration-300 hover:border-teal-400/40
                hover:bg-[#061E3D]/90 ${isEven ? "" : "md:flex-row-reverse"}`}
            >
              {/* index badge */}
              <span className="absolute -top-4 left-4 md:left-6 text-xs font-mono tracking-widest text-teal-300/70 bg-[#061E3D] px-2 py-1 rounded-full border border-white/10">
                {String(index + 1).padStart(2, "0")}
              </span>

              {/* image */}
              <motion.div
                variants={cardVariants}
                className="w-full md:w-1/2 shrink-0 overflow-hidden rounded-xl border border-white/10 shadow-lg"
              >
                <div className="aspect-[16/10] w-full overflow-hidden">
                  <motion.img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                </div>
              </motion.div>

              {/* content */}
              <motion.div
                variants={cardVariants}
                className="w-full md:w-1/2 text-left"
              >
                <h2 className="text-2xl md:text-[26px] font-extrabold mb-3 bg-gradient-to-r from-[#6CD7F6] via-teal-400 to-pink-400 bg-clip-text text-transparent">
                  {project.title}
                </h2>

                <p className="mb-5 text-[15px] md:text-[16px] leading-relaxed text-slate-200/90">
                  {project.description}
                </p>

                {/* tech stack chips */}
                <motion.div
                  className="mb-6 flex flex-wrap gap-2"
                  initial="hidden"
                  animate={controls}
                  variants={{
                    visible: { transition: { staggerChildren: 0.06 } },
                  }}
                >
                  {project.languages.map((language) => {
                    const IconComponent = iconComponents[project.icons[language]];
                    return (
                      <motion.span
                        key={language}
                        variants={chipVariants}
                        className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border border-white/15 bg-white/5 text-slate-200"
                      >
                        {IconComponent && <IconComponent className="h-3.5 w-3.5" />}
                        {language}
                      </motion.span>
                    );
                  })}
                </motion.div>

                {/* links */}
                <div className="flex items-center gap-3">
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full border border-white/15 text-slate-100 hover:bg-white/10 hover:border-teal-400/50 transition-colors"
                  >
                    <FaGithub className="h-4 w-4" />
                    Code
                  </a>

                  <a
                    href={project.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full bg-teal-500/90 text-[#061E3D] hover:bg-teal-400 transition-colors"
                  >
                    <FaExternalLinkAlt className="h-3.5 w-3.5" />
                    Live demo
                  </a>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default Projects;