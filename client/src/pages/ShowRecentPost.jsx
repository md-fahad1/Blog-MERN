import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
const ShowRecentPost = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch("/api/post/getPosts");
      const data = await res.json();
      setPosts(data.posts);
    };
    fetchPosts();
  }, []);

  // 🔍 Filter dynamically as user types
  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full bg-white dark:bg-gray-800 font-fenix p-4 rounded-md">
      {/* 🔎 Dynamic Search Input */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search by title or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 
                     dark:bg-gray-700 dark:text-white
                     focus:outline-none focus:ring-2 focus:ring-pink-300"
        />
        <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-300" />
      </div>

      {/* Heading */}
      <div className="flex items-center mb-6">
        <div className="flex-grow border-t border-pink-700 dark:border-gray-600"></div>
        <span className="px-4 text-lg font-semibold text-gray-700 dark:text-gray-200">
          RECENT POSTS
        </span>
        <div className="flex-grow border-t border-pink-700 dark:border-gray-600"></div>
      </div>

      {/* Posts List */}
      <div className="flex flex-col gap-6">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <div
              key={post._id}
              className="flex items-start gap-4 border-b pb-4"
            >
              {/* Image */}
              <Link to={`/post/${post.slug}`} className="flex-shrink-0">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-28 h-20 object-cover rounded-sm"
                />
              </Link>

              {/* Content */}
              <div className="flex flex-col">
                <Link to={`/post/${post.slug}`}>
                  <h3 className="text-base font-semibold text-gray-800 dark:text-white hover:text-[#F26259] transition-colors">
                    {post.title}
                  </h3>
                </Link>
                <span className="text-sm text-gray-500 dark:text-gray-300">
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-300 text-center">
            No posts found.
          </p>
        )}
      </div>
    </div>
  );
};

export default ShowRecentPost;
