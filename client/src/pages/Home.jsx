import { Link } from "react-router-dom";
import CallToAction from "../Components/CallToAction";
import { useEffect, useState } from "react";
import PostCard from "../Components/PostCard";

import PostCardVertical from "../Components/PostCardVertical";
import VisitedPlace from "../Components/VisitedPlace";
import { motion } from "framer-motion";
import Aboutme from "./Aboutme";
import ShowRecentPost from "./ShowRecentPost";
import MeOnFB from "./MeOnFB";

const imageVariants = {
  hidden: { x: 200, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 1.2 } },
};

// Text container animation (stagger children)
const textContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.3, // each child appears 0.3s after previous
    },
  },
};
const textItem = {
  hidden: { y: 50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.8 } },
};
export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch("/api/post/getPosts");
      const data = await res.json();
      setPosts(data.posts);
    };
    fetchPosts();
  }, []);
  return (
    <div className="bg-[#FCFCFC] dark:bg-[#10172A] min-h-[100vh]">
      <div className="flex  min-h-[80vh] items-center ">
        <div className="  md:flex-row mx-auto px-4 md:px-20  grid md:grid-cols-2 items-center md:gap-60 2xl:gap-72">
          <motion.div
            className="space-y-6"
            variants={textContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              variants={textItem}
              className="text-2xl sm:text-3xl 2xl:text-5xl font-bold text-gray-800 leading-snug"
            >
              Welcome to <span className="text-pink-500">Fahad Blog</span>
            </motion.h1>

            <motion.p
              variants={textItem}
              className="text-gray-600 text-lg 2xl:text-2xl"
            >
              Life is short, so treasure every moment. Pursue happiness and
              build joyful memories. Live fully and cherish each experience.
            </motion.p>

            <motion.button variants={textItem} className="learn-more">
              <span className="circle" aria-hidden="true">
                <span className="icon arrow mt-4"></span>
              </span>
              <span className="button-text text-[13px]">
                <Link to="/search">See all posts</Link>
              </span>
            </motion.button>
          </motion.div>

          {/* Right Image */}
          <motion.div
            className="relative mt-5"
            variants={imageVariants}
            initial="hidden"
            animate="visible"
          >
            <img
              src="/formal.jpg"
              alt="about"
              className="w-60 mb-6 shadow-lg h-60 md:w-[330px] md:h-[385px] 2xl:w-[450px] 2xl:h-[450px] rounded-md"
            />
          </motion.div>
        </div>
      </div>
      {/* <div className="p-3 bg-amber-100 dark:bg-slate-700">
        <CallToAction />
      </div> */}
      <div className="md:px-5 mt-1">
        <h2 className="text-2xl  font-fenix font-bold text-center md:text-left ">
          Visited Places
        </h2>
        <VisitedPlace />
      </div>

      <div className="max-w-full mx-auto p-3 flex flex-col py-5">
        {posts && posts.length > 0 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold font-fenix text-center md:text-left md:px-5">
              Latest Posts
            </h2>
            <div className=" md:px-5 flex flex-row  px-2 gap-0">
              <div className="w-full md:w-2/3">
                <div className="grid grid-cols-1  sm:grid-cols-2 gap-1 md:gap-4">
                  {posts.map((post) => (
                    <PostCardVertical key={post._id} post={post} />
                  ))}
                </div>
                <Link to={"/search"} className="text-lg text-center">
                  View all posts
                </Link>
              </div>
              <div className="w-full md:w-1/3 hidden md:block">
                <div className="hidden md:block w-full">
                  <Aboutme />
                </div>
                <div className="hidden md:block mt-10">
                  <ShowRecentPost />
                </div>
                <div className="hidden md:block mt-10">
                  <MeOnFB />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

{
  /* <div className="flex  flex-col-reverse md:flex-row md:px-3 bg-[#EEDCF5] w-[85%] md:w-[80%]  h-[70vh] rounded-md  mx-auto  ">
          <div className=" w-full md:w-2/3 flex flex-col gap-4 p-3 md:p-10 2xl:pl-20 2xl:pt-20 2xl:pr-10">
            <span className="bg-[#FFCEA3] rounded-md py-1 px-3 w-20 font-semibold text-gray-700">
              Lifestyle
            </span>
            <h1 className="text-xl font-fenix dark:text-gray-700 2xl:text-6xl font-bold lg:text-4xl">
              Welcome to Fahad Blog
            </h1>
            <p className="text-gray-500 lg:text-xl 2xl:text-3xl font-semibold sm:text-sm">
              Life is short, so treasure every moment. Pursue happiness and
              build joyful memories. Live fully and cherish each experience.
            </p>

            <button class="learn-more">
              <span class="circle" aria-hidden="true">
                <span class="icon arrow mt-4"></span>
              </span>
              <span class="button-text text-[13px]">
                <Link to="/search">See all posts</Link>
              </span>
            </button>
          </div>
          <div className=" w-full md:w-1/3 ">
            <img
              src="/formal.jpg" // Adjust the path based on your project structure
              alt="about"
              className=" w-60 h-60 md:w-[330px] md:h-[385px] 2xl:w-[520px] relative   2xl:h-[630px] rounded-md md:absolute md:top-[9%] 2xl:top-[7%] ml-9 md:ml-10 md:mt-10    "
              // Set your desired height
            />
          </div>
        </div> */
}
