import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

const PostCardVertical = ({ post }) => {
  console.log("PostCardVertical", post);
  const truncateContent = (content, maxLength) => {
    if (!content) return "";
    return content.length > maxLength
      ? content.substring(0, maxLength) + "..."
      : content;
  };

  return (
    <div className="group font-fenix bg-white dark:bg-gray-700 overflow-hidden transition-all w-full max-w-md flex flex-col">
      {/* Image */}
      <Link to={`/post/${post.slug}`}>
        <div className="w-full h-48 md:h-56 overflow-hidden">
          <img
            src={post.image}
            alt="post cover"
            className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Category */}
        <span className="text-sm text-gray-500 dark:text-gray-300 font-medium">
          {post.category}
        </span>

        {/* Title */}
        <Link to={`/post/${post.slug}`}>
          <h2 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-white group-hover:text-[#e74694] transition-colors duration-300 line-clamp-2 min-h-[56px]">
            {post.title}
          </h2>
        </Link>

        {/* Meta Info */}
        <div className="text-xs text-gray-500 dark:text-gray-300 mb-2">
          by <span className="font-semibold">Fahad</span> |{" "}
          {new Date(post.createdAt).toLocaleDateString()}
        </div>

        {/* Description */}
        {post && (
          <p
            className="text-sm text-gray-600 dark:text-gray-200 line-clamp-3 min-h-[60px] mb-4"
            dangerouslySetInnerHTML={{
              __html: truncateContent(post.content, 100),
            }}
          />
        )}

        {/* Button (sticks at bottom) */}
        <div className="mt-auto">
          <Link to={`/post/${post.slug}`}>
            <button className="inline-flex items-center px-4 py-2 bg-[#e74694] text-white text-sm font-semibold uppercase tracking-wide rounded-sm shadow hover:bg-[#ad2366] transition-colors duration-300">
              Read The Article <FaArrowRight className="ml-2 text-xs" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostCardVertical;
