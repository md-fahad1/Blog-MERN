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
    <section className="max-w-7xl mx-auto p-6">
      <h2 className="text-center text-4xl font-extrabold mb-12 text-indigo-700">
        Something About Me
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-4 sm:px-0">
        {/* Education */}
        <motion.div
          className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center"
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 0.6 }}
          variants={cardVariants}
        >
          <img
            src="/education.jpg"
            alt="Education"
            className="w-28 h-28 rounded-full object-cover mb-6 shadow-md"
          />
          <h3 className="text-2xl font-semibold mb-4 border-b-4 border-indigo-500 pb-2 w-full text-center">
            Education
          </h3>
          <p className="text-gray-700 leading-relaxed text-center">
            Graduated with a Bachelor's in Computer Science Engineering from
            American International University. Studied algorithms, data
            structures, and software engineering fundamentals.
          </p>
        </motion.div>

        {/* Experience */}
        <motion.div
          className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center"
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 0.6 }}
          variants={cardVariants}
          transition={{ delay: 0.2 }}
        >
          <img
            src="/experience.jpg"
            alt="Experience"
            className="w-28 h-28 rounded-full object-cover mb-6 shadow-md"
          />
          <h3 className="text-2xl font-semibold mb-4 border-b-4 border-indigo-500 pb-2 w-full text-center">
            Experience
          </h3>
          <p className="text-gray-700 leading-relaxed text-center">
            Worked on various web development projects using MERN stack, React,
            and Django backend. Skilled in building scalable, maintainable,
            user-friendly apps.
          </p>
        </motion.div>

        {/* Hobbies & Interests */}
        <motion.div
          className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center"
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 0.6 }}
          variants={cardVariants}
          transition={{ delay: 0.4 }}
        >
          <img
            src="/hobby.jpg"
            alt="Hobbies and Interests"
            className="w-28 h-28 rounded-full object-cover mb-6 shadow-md"
          />
          <h3 className="text-2xl font-semibold mb-4 border-b-4 border-indigo-500 pb-2 w-full text-center">
            Hobbies & Interests
          </h3>
          <p className="text-gray-700 leading-relaxed text-center">
            Traveling, photography, exploring new cultures, and keeping up with
            tech trends are my passions.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
