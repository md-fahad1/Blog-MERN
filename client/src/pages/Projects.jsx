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
} from "react-icons/si";
import React, { useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import projectData from "../../public/projectData"; // Adjust the import path as needed

const iconComponents = {
  FaReact: FaReact,
  FaJsSquare: FaJsSquare,
  FaHtml5: FaHtml5,
  FaCss3Alt: FaCss3Alt,
  FaNodeJs: FaNodeJs,
  SiExpress: SiExpress,
  SiMongodb: SiMongodb,
  SiNextdotjs: SiNextdotjs,
  SiNestjs: SiNestjs,
  SiPostgresql: SiPostgresql,
  SiTailwindcss: SiTailwindcss,
  SiDotnet: SiDotnet,
  SiMysql: SiMysql,
  FaBootstrap: FaBootstrap,
  FaSass: FaSass,

  SiCsharp: SiCsharp,
  SiOracle: SiOracle,
  // Add more icons as needed
};
const divVariants = {
  initial: {
    x: -100,
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 1,
      staggerChildren: 0.1,
    },
  },
  scrollButton: {
    opacity: 0,
    y: 10,
    transition: {
      duration: 2,
      repeat: Infinity,
    },
  },
};

const containerVariants = {
  hidden: { opacity: 0.3 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

const iconContainerVariants = {
  hidden: { opacity: 0.3 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3, // Adjust stagger duration for icons
    },
  },
};

const iconVariants = {
  hidden: { opacity: 0, y: 20 },
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
          { threshold: 0.9 }
        )
    );

    projectRefs.current.forEach((ref, index) => {
      if (ref) {
        observers[index].observe(ref);
      }
    });

    return () => {
      projectRefs.current.forEach((ref, index) => {
        if (ref) {
          observers[index].unobserve(ref);
        }
      });
    };
  }, []);

  return (
    <section className="min-h-screen" id="projects">
      <h1 className="text-center font-bold my-6 text-3xl">
        Projects with demo
      </h1>
      <div className="container mx-auto px-12">
        {projectData.map((project, index) => {
          const controls = controlsArray.current[index];
          const isEven = index % 2 === 0;

          return (
            <motion.div
              key={index}
              className="flex flex-col px-4 md:flex-row text-white my-10 md:gap-5"
              initial="hidden"
              animate={controls}
              variants={containerVariants}
              ref={(el) => (projectRefs.current[index] = el)}
            >
              <motion.div
                className={`w-full h-[280px]  md:mt-10 md:w-1/2 p-5 bg-[#061E3D] rounded-md ${
                  isEven ? "md:order-1" : "md:order-2"
                }`}
                variants={divVariants}
                initial="initial"
                whileInView="animate"
              >
                <motion.img
                  src={project.image}
                  alt={project.title}
                  className="w-full object-cover "
                  initial={{ opacity: 0.5 }}
                  whileHover={{ scale: 1.02, opacity: 1 }}
                  animate={{ opacity: 0.7 }}
                />
              </motion.div>
              <div
                className={`w-full md:w-1/2 p-1 ${
                  isEven
                    ? "md:order-2 md:text-right"
                    : "md:order-1 md:text-left"
                }`}
              >
                <h1
                  className={`text-[23px] font-extrabold mb-2 bg-gradient-to-r from-[#6CD7F6] via-teal-500 to-pink-500 bg-clip-text text-transparent ${
                    isEven ? "md:text-right" : "md:text-left"
                  }`}
                >
                  {project.title}
                </h1>
                <p className="mb-4 text-[17px] text-justify text-black dark:text-white">
                  {project.description}
                </p>
                <motion.div
                  className={`mb-4 flex justify-center md:justify-start gap-3 ${
                    isEven ? "md:flex md:justify-end" : "md:text-left"
                  }`}
                  initial="hidden"
                  animate={controls}
                  variants={iconContainerVariants}
                >
                  {project.languages.map((language) => {
                    const IconComponent =
                      iconComponents[project.icons[language]];
                    return (
                      <motion.div key={language} variants={iconVariants}>
                        <IconComponent className="inline-block h-8 w-8 mr-2 justify-end animate-glow-border text-black dark:text-white font-bold " />
                      </motion.div>
                    );
                  })}
                </motion.div>
                <div
                  className={`flex justify-center md:justify-start gap-3 text-black dark:text-white ${
                    isEven ? "md:flex md:justify-end" : "md:text-left"
                  }`}
                >
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaGithub className="inline-block h-8 w-8 mr-2 ball1  relative cursor-pointer  justify-center items-center p-2 text-4xl " />
                  </a>
                  <a
                    href={project.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaExternalLinkAlt className="inline-block h-8 w-8 mr-2 ball1  relative cursor-pointer  justify-center items-center p-2 text-2xl" />
                  </a>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default Projects;
