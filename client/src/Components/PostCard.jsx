import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

const CATEGORY_STYLE = {
  coding: "text-blue-700 bg-blue-50 border border-blue-200",
  traveling: "text-emerald-700 bg-emerald-50 border border-emerald-200",
  study: "text-amber-700 bg-amber-50 border border-amber-200",
  uncategorized: "text-gray-600 bg-gray-50 border border-gray-200",
};

export default function PostCard({ post }) {
  return (
    <div className="group bg-white dark:bg-gray-800 w-full rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
      <Link to={`/post/${post.slug}`} className="block relative">
        <div className="h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-900">
          <img
            src={post.image}
            alt="post cover"
            className="h-full w-full object-cover transform transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        {post.category && (
          <span
            className={`absolute top-2.5 left-2.5 text-[10px] font-medium uppercase tracking-wide px-2 py-1 rounded ${
              CATEGORY_STYLE[post.category] || CATEGORY_STYLE.uncategorized
            }`}
          >
            {post.category}
          </span>
        )}
      </Link>

      <div className="p-3.5">
        <Link to={`/post/${post.slug}`}>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {post.title}
          </h3>
        </Link>

        <Link
          to={`/post/${post.slug}`}
          className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
        >
          Read more
          <FaArrowRight className="text-[10px] transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}