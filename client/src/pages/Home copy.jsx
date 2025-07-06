import { Link } from "react-router-dom";
import CallToAction from "../Components/CallToAction";
import { useEffect, useState } from "react";
import PostCard from "../Components/PostCard";
import { motion } from "framer-motion";
import PostCardVertical from "../Components/PostCardVertical";

const imgVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,

    transition: {
      duration: 4,
      staggerChildren: 0.1,
    },
  },
};
const textVariants = {
  initial: {
    y: -100,
    opacity: 0,
  },
  animate: {
    y: 0,
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
const textVariants1 = {
  initial: {
    x: -200,
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
const textVariants2 = {
  initial: {
    x: 200,
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
const sliderVariants = {
  initial: {
    y: 0,
  },
  animate: {
    y: "4%",
    transition: {
      repeat: Infinity,
      repeatType: "mirror",
      duration: 2,
    },
  },
};
const sliderVariants1 = {
  initial: {
    y: 0,
  },
  animate: {
    y: "-4%",
    transition: {
      repeat: Infinity,
      repeatType: "mirror",
      duration: 2,
    },
  },
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
    <div className="bg-[#E4E5D7] dark:bg-[#10172A] min-h-[100vh]">
      <div className="flex min-h-[90vh]">
        <div className="w-1/4 ">
          <div className="flex gap-12">
            <motion.div
              className=" hidden md:block "
              variants={sliderVariants}
              initial="initial"
              whileInView="animate"
            >
              <img
                src="/fahad1.jpg" // Adjust the path based on your project structure
                alt="about"
                className="w-28 h-32  ml-10 mt-10    "
                width={16} // Set your desired width
                height={16} // Set your desired height
              />
            </motion.div>
            <motion.div
              className=" hidden md:block "
              variants={sliderVariants}
              initial="initial"
              whileInView="animate"
            >
              <img
                src="/fahad2.jpg" // Adjust the path based on your project structure
                alt="about"
                className="w-24 h-32  ml-3    "
                width={16} // Set your desired width
                height={16} // Set your desired height
              />
            </motion.div>
          </div>
          <div className="flex mt-5 mb-5">
            <motion.div
              className=" hidden md:block "
              variants={sliderVariants}
              initial="initial"
              whileInView="animate"
            >
              <img
                src="/fahad.png" // Adjust the path based on your project structure
                alt="about"
                className="w-28 h-32  ml-32 mt-1    "
                width={16} // Set your desired width
                height={16} // Set your desired height
              />
            </motion.div>
          </div>
          <div className="flex gap-12">
            <motion.div
              className=" hidden md:block rotate-45"
              variants={sliderVariants}
              initial="initial"
              whileInView="animate"
            >
              <img
                src="/fahad3.jpg" // Adjust the path based on your project structure
                alt="about"
                className="w-28 h-32  ml-10 mt-1 rotate-[-10deg]    "
                width={16} // Set your desired width
                height={16} // Set your desired height
              />
            </motion.div>
            <motion.div
              className=" hidden md:block "
              variants={sliderVariants}
              initial="initial"
              whileInView="animate"
            >
              <img
                src="/2.png" // Adjust the path based on your project structure
                alt="about"
                className="w-28 h-32  ml-3    "
                width={16} // Set your desired width
                height={16} // Set your desired height
              />
            </motion.div>
          </div>
        </div>

        <div className="flex flex-col gap-6 p-28 px-3 md:w-2/4 mx-auto text-center ">
          <h1 className="text-3xl font-bold lg:text-4xl">
            Welcome to Fahad Blog
          </h1>
          <p className="text-gray-500 lg:text-2xl font-semibold sm:text-sm">
            Life is short, so treasure every moment. Pursue happiness and build
            joyful memories. Live fully and cherish each experience.
          </p>
          <Link
            to="/search"
            className="text-xs sm:text-sm text-teal-500 font-bold hover:underline"
          >
            View all posts
          </Link>
        </div>
        <div className="w-1/4 ">
          <div className="flex gap-12">
            <motion.div
              className=" hidden md:block "
              variants={sliderVariants}
              initial="initial"
              whileInView="animate"
            >
              <img
                src="/shylet.jpg" // Adjust the path based on your project structure
                alt="about"
                className="w-28 h-32  ml-10 mt-10    "
                width={16} // Set your desired width
                height={16} // Set your desired height
              />
            </motion.div>
            <motion.div
              className=" hidden md:block "
              variants={sliderVariants}
              initial="initial"
              whileInView="animate"
            >
              <img
                src="/kuakata.jpg" // Adjust the path based on your project structure
                alt="about"
                className="w-24 h-32  mr-6 mt-10 rotate-[10deg]    "
                width={16} // Set your desired width
                height={16} // Set your desired height
              />
            </motion.div>
          </div>
          <div className="flex gap-12 mt-5 mb-5">
            <motion.div
              className=" hidden md:block "
              variants={sliderVariants}
              initial="initial"
              whileInView="animate"
            >
              <img
                src="/haour.jpg" // Adjust the path based on your project structure
                alt="about"
                className="w-28 h-32  ml-32 mt-1    "
                width={16} // Set your desired width
                height={16} // Set your desired height
              />
            </motion.div>
          </div>
          <div className="flex gap-12">
            <motion.div
              className=" hidden md:block rotate-45"
              variants={sliderVariants}
              initial="initial"
              whileInView="animate"
            >
              <img
                src="/sreemangal.jpg" // Adjust the path based on your project structure
                alt="about"
                className="w-28 h-32  mr-10 mt-1     "
                width={16} // Set your desired width
                height={16} // Set your desired height
              />
            </motion.div>
            <motion.div
              className=" hidden md:block "
              variants={sliderVariants}
              initial="initial"
              whileInView="animate"
            >
              <img
                src="/bandharban.jpg" // Adjust the path based on your project structure
                alt="about"
                className="w-28 h-32  mr-3    "
                width={16} // Set your desired width
                height={16} // Set your desired height
              />
            </motion.div>
          </div>
        </div>
      </div>
      <div className="p-3 bg-amber-100 dark:bg-slate-700">
        <CallToAction />
      </div>

      <div className="max-w-full mx-auto p-3 flex flex-col py-7">
        {posts && posts.length > 0 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold text-center">Recent Posts</h2>
            <div className=" md:px-28  px-2 gap-5">
              {posts.map((post) => (
                <PostCardVertical key={post._id} post={post} />
              ))}
            </div>
            <Link to={"/search"} className="text-lg text-center">
              View all posts
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
