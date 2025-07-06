import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

const PostCardVertical = ({ post }) => {
  const truncateContent = (content, maxLength) => {
    if (!content) return ""; // Handle case where content is empty or undefined
    return content.length > maxLength
      ? content.substring(0, maxLength) + "..."
      : content;
  };
  return (
    <div className="  group bg-slate-100 dark:bg-gray-600 rounded-md flex flex-row relative gap-5   w-full  h-[220px]  md:h-[250px] overflow-hidden  transition-all">
      <div>
        <Link to={`/post/${post.slug}`}>
          <img
            src={post.image}
            alt="post cover"
            className="h-[200px] mt-2 ml-2 w-[220px] rounded-md hover:scale-105 object-cover  transition-all duration-300 z-20"
          />
        </Link>
      </div>
      <Link to={`/post/${post.slug}`}>
        <div className="p-3 flex flex-col gap-1 w-full dark:text-gray-200">
          <div className="flex justify-between p-1 md:p-3  mx-auto w-full max-w-full text-md">
            <div className="flex gap-2 md:gap-5">
              <span className="bg-[#FFCEA3] text-[11px] md:text-[16px] rounded-md h-5 md:h-8 py-0 md:py-0.5 px-2 w-14 md:w-20 font-semibold text-gray-700">
                {post.category}
              </span>
              <span className="text-[10px] mt-1 md:mt-1 md:text-[13px]">
                {post && new Date(post.createdAt).toLocaleDateString()}
              </span>{" "}
              {/* <span className="italic text-[10px] mt-1.5 md:mt-0 md:text-[13px] text-blue-[#14385E] font-semibold"></span> */}
            </div>

            <span className="italic text-[10px] mt-1 md:mt-1 md:text-[13px] justify-end">
              {post && (post.content.length / 1000).toFixed(0)} comments
              {console.log(post.content.length)}
            </span>
          </div>
          <p className=" text-[12px] md:text-[18px] font-bold line-clamp-2 ">
            {post.title}
          </p>
          <div className="text-[11px] md:text-[14px] pl-3 max-w-3xl mx-auto w-full post-content">
            {post && (
              <p
                dangerouslySetInnerHTML={{
                  __html: truncateContent(post.content, 100),
                }}
              />
            )}
          </div>

          <button className=" flex">
            <span className="text-[14px] font-bold text-[#F26259] ">
              Read More
            </span>
            <FaArrowRight className="ml-2 text-[12px] mt-1.5 text-[#F26259]" />
          </button>
        </div>
      </Link>
    </div>
  );
};

export default PostCardVertical;
