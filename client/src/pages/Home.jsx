import { Link } from "react-router-dom";
import CallToAction from "../Components/CallToAction";
import { useEffect, useState } from "react";
import PostCard from "../Components/PostCard";
import { motion } from "framer-motion";
import PostCardVertical from "../Components/PostCardVertical";
import VisitedPlace from "../Components/VisitedPlace";

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
    <div className="bg-[#FCFCFC] dark:bg-[#10172A] min-h-[100vh]">
      <div className="flex min-h-[90vh] items-center">
        <div className="flex  flex-col-reverse md:flex-row md:px-3 bg-[#F1EDEC] w-[80%]  h-[70vh] rounded-md  mx-auto  ">
          <div className=" w-full md:w-2/3 flex flex-col gap-4 p-3 md:p-10 2xl:pl-20 2xl:pt-20 2xl:pr-10">
            <span className="bg-[#FFCEA3] rounded-md py-1 px-3 w-20 font-semibold text-gray-700">
              Lifestyle
            </span>
            <h1 className="text-xl dark:text-gray-700 2xl:text-6xl font-bold lg:text-4xl">
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
        </div>
      </div>
      {/* <div className="p-3 bg-amber-100 dark:bg-slate-700">
        <CallToAction />
      </div> */}
      <div className="md:px-28 mt-5">
        <h2 className="text-2xl font-bold text-center md:text-left ">
          Visited Places
        </h2>
        <VisitedPlace />
      </div>

      <div className="max-w-full mx-auto p-3 flex flex-col py-7">
        {posts && posts.length > 0 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-center md:text-left md:px-28">
              Latest Posts
            </h2>
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
