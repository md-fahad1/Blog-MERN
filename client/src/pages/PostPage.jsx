import { Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { IoShareSocialOutline } from "react-icons/io5";
import CommentSection from "../Components/CommentSection";
import PostCard from "../Components/PostCard";

const CATEGORY_STYLE = {
  coding: "text-blue-700 bg-blue-50 border border-blue-200",
  traveling: "text-emerald-700 bg-emerald-50 border border-emerald-200",
  study: "text-amber-700 bg-amber-50 border border-amber-200",
  uncategorized: "text-gray-600 bg-gray-50 border border-gray-200",
};

const getReadingMinutes = (html) => {
  if (!html) return 1;
  const text = html.replace(/<[^>]*>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};

export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(false);
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/post/getposts?slug=${postSlug}`
        );
        const data = await res.json();
        if (!res.ok || !data.posts || data.posts.length === 0) {
          setError(true);
          setLoading(false);
          return;
        }
        setPost(data.posts[0]);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/post/getposts?limit=4`
        );
        const data = await res.json();
        if (res.ok) {
          setRecentPosts(data.posts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchRecentPosts();
  }, []);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: post?.title, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
      }
    } catch (error) {
      // user cancelled share sheet — ignore
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white dark:bg-gray-900">
        <Spinner size="xl" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900 px-4 text-center">
        <p className="font-serif text-2xl text-gray-800 dark:text-gray-100">
          Post not found
        </p>
        <p className="mt-2 text-sm text-gray-400">
          The article you're looking for doesn't exist or was removed.
        </p>
        <Link
          to="/search"
          className="mt-5 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
        >
          Browse all posts →
        </Link>
      </div>
    );
  }

  const otherRecentPosts = recentPosts
    .filter((p) => p._id !== post._id)
    .slice(0, 3);

  return (
    <main className="bg-white dark:bg-gray-900">
      <article className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-4">
        {/* Category + meta */}
        <div className="flex flex-wrap items-center gap-3 justify-center mb-4">
          <Link to={`/search?category=${post.category}`}>
            <span
              className={`text-[11px] font-medium uppercase tracking-wide px-2.5 py-1 rounded ${
                CATEGORY_STYLE[post.category] || CATEGORY_STYLE.uncategorized
              }`}
            >
              {post.category}
            </span>
          </Link>
        </div>

        <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-center text-gray-900 dark:text-white leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center justify-center gap-3 mt-4 text-xs text-gray-500 dark:text-gray-400">
          <span>Fahad</span>
          <span className="text-gray-300 dark:text-gray-600">·</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          <span className="text-gray-300 dark:text-gray-600">·</span>
          <span>{getReadingMinutes(post.content)} min read</span>
          <button
            type="button"
            onClick={handleShare}
            title="Share"
            className="ml-1 text-gray-400 hover:text-indigo-600 transition-colors"
          >
            <IoShareSocialOutline className="text-base" />
          </button>
        </div>
      </article>

      {/* Hero image */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img
            src={post.image}
            alt={post.title}
            className="w-full max-h-[480px] object-cover"
          />
        </div>
      </div>

      {/* Body */}
      <div
        className="post-content max-w-7xl mx-auto px-4 sm:px-6 py-10 text-[15px] leading-relaxed text-gray-700 dark:text-gray-300
          [&_h1]:font-serif [&_h1]:text-2xl [&_h1]:mt-8 [&_h1]:mb-3 [&_h1]:text-gray-900 dark:[&_h1]:text-white
          [&_h2]:font-serif [&_h2]:text-xl [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-gray-900 dark:[&_h2]:text-white
          [&_h3]:font-semibold [&_h3]:text-lg [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-gray-900 dark:[&_h3]:text-white
          [&_p]:mb-4
          [&_a]:text-indigo-600 [&_a]:underline [&_a]:underline-offset-2
          [&_img]:rounded-md [&_img]:my-6
          [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4
          [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4
          [&_blockquote]:border-l-4 [&_blockquote]:border-indigo-200 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-500
          [&_code]:bg-gray-100 dark:[&_code]:bg-gray-800 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-[13px]"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Comments */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 border-t border-gray-100 dark:border-gray-800">
        <CommentSection postId={post._id} />
      </div>

      {/* Recent articles */}
      {otherRecentPosts.length > 0 && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 border-t border-gray-100 dark:border-gray-800">
          <h2 className="font-serif text-2xl text-gray-900 dark:text-white text-center mb-8">
            More to read
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherRecentPosts.map((p) => (
              <PostCard key={p._id} post={p} />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}