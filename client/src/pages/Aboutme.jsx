import React from "react";
import { motion } from "framer-motion";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
const Aboutme = () => {
  return (
    <div className=" hidden md:block">
      <section className="flex flex-col items-center justify-center text-center px-1  bg-gray-50 dark:bg-gray-800">
        {/* Title */}
        <div className="flex items-center w-full my-0 mb-3">
          <div className="flex-grow border-t border-pink-700 dark:border-gray-600"></div>
          <span className="px-4 text-lg font-semibold text-gray-700 dark:text-gray-200">
            ABOUT ME
          </span>
          <div className="flex-grow border-t border-pink-700 dark:border-gray-600"></div>
        </div>

        {/* Image */}
        <motion.img
          src="/faha.png"
          alt="Faha"
          className="w-60 h-60 rounded-full object-cover shadow-lg mb-6"
          animate={{
            y: [0, -15, 0, 15, 0],
            rotate: [0, 2, 0, -2, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
        />
        {/* Tagline */}
        <h2 className="text-xl md:text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
          Solo Traveler ✈️
        </h2>

        {/* Description */}
        <p className="max-w-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
          Hi, I’m Fahad! I love exploring new places, experiencing cultures, and
          capturing memories through travel. From mountains to beaches, every
          journey inspires me to live freely and share my adventures.
        </p>

        {/* Keep in touch */}
        <div className="flex items-center w-full my-6">
          <div className="flex-grow border-t border-pink-700 dark:border-gray-600"></div>
          <span className="px-4 text-lg font-semibold text-gray-700 dark:text-gray-200">
            KEEP IN TOUCH
          </span>
          <div className="flex-grow border-t border-pink-700 dark:border-gray-600"></div>
        </div>

        {/* Social Media */}
        <div className="flex gap-6 text-2xl text-gray-600 dark:text-gray-300 mb-3">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600"
          >
            <FaFacebook />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400"
          >
            <FaTwitter />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-500"
          >
            <FaInstagram />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-700"
          >
            <FaLinkedin />
          </a>
        </div>
      </section>
    </div>
  );
};

export default Aboutme;
