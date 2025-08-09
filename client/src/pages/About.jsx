import { motion } from "framer-motion";

const cardVariants = {
  offscreen: { y: 50, opacity: 0 },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", bounce: 0.3, duration: 0.8 },
  },
};

const About = () => {
  return (
    <section className="max-w-7xl mx-auto p-6 text-gray-800 dark:text-white">
      <h2 className="text-center font-fenix text-3xl dark:text-white  font-semibold mb-12 text-black">
        Something About Me
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-4 sm:px-0">
        {/* Education */}
        <motion.div
          className="bg-white dark:text-white dark:bg-slate-800 rounded-xl shadow-lg p-6 flex flex-col items-center"
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 0.6 }}
          variants={cardVariants}
        >
          <img
            src="/f.jpg"
            alt="Education"
            className="w-28 h-28 rounded-full object-cover mb-6 shadow-md"
          />
          <h3 className="text-2xl font-semibold mb-4 border-b-4 border-[#EEDCF5] pb-2 w-full text-center">
            Education
          </h3>
          <p className=" leading-relaxed text-justify">
            I completed my Bachelor of Science (BSc) degree in Computer Science
            Engineering from American International University-Bangladesh
            (AIUB). During my studies, I gained strong knowledge of algorithms,
            data structures, and software engineering principles. This academic
            foundation helped me build a solid understanding of computer science
            fundamentals.
          </p>
        </motion.div>

        {/* Experience */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col items-center"
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 0.6 }}
          variants={cardVariants}
          transition={{ delay: 0.2 }}
        >
          <img
            src="/faha.png"
            alt="Experience"
            className="w-28 h-28 rounded-full object-cover mb-6 shadow-md"
          />
          <h3 className="text-2xl font-semibold mb-4 border-b-4 border-[#EEDCF5] pb-2 w-full text-center">
            Experience
          </h3>
          <p className=" leading-relaxed text-justify ">
            I have worked on many group projects throughout my career, which
            helped me develop teamwork and collaboration skills. I completed an
            internship at Genex Infosys Ltd where I gained practical experience.
            After that, I joined a startup called PI Alpha Lab. Later, I
            switched jobs and currently work at Connect Auzz software company.
            My work focuses on web development using the MERN stack, React, and
            Django backend, building scalable and user-friendly applications.
          </p>
        </motion.div>

        {/* Hobbies & Interests */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col items-center"
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 0.6 }}
          variants={cardVariants}
          transition={{ delay: 0.4 }}
        >
          <img
            src="/sreemangal.jpg"
            alt="Hobbies and Interests"
            className="w-28 h-28 rounded-full object-cover mb-6 shadow-md"
          />
          <h3 className="text-2xl font-semibold mb-4 border-b-4 border-[#EEDCF5] pb-2 w-full text-center">
            Hobbies & Interests
          </h3>
          <p className=" leading-relaxed text-justify">
            Traveling is one of my biggest passions — I have visited almost
            every popular place in Bangladesh, from the serene hills of
            Bandarban to the vibrant streets of Dhaka. Exploring new places
            helps me gain fresh perspectives and inspiration. Besides traveling,
            I enjoy photography, capturing moments that tell unique stories. I’m
            also fascinated by learning about different cultures and traditions,
            which broadens my understanding of the world. These hobbies keep me
            motivated, curious, and continuously growing both personally and
            professionally.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
