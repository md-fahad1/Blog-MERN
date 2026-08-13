import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaArrowRight,
  FaThumbsUp,
  FaRegThumbsUp,
  FaRegCommentDots,
} from "react-icons/fa";
import { IoShareSocialOutline } from "react-icons/io5";
import { Textarea, Button, Modal } from "flowbite-react";
import Comment from "./Comment";

const CATEGORY_STYLE = {
  coding: "text-blue-700 bg-blue-50 border border-blue-200",
  traveling: "text-emerald-700 bg-emerald-50 border border-emerald-200",
  study: "text-amber-700 bg-amber-50 border border-amber-200",
  uncategorized: "text-gray-600 bg-gray-50 border border-gray-200",
};

const getCookie = (name) => {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
};

const PostCardVertical = ({ post }) => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [likes, setLikes] = useState(post.likes || []);
  const [numberOfLikes, setNumberOfLikes] = useState(post.numberOfLikes || 0);
  const [liking, setLiking] = useState(false);
  const [anonId, setAnonId] = useState(getCookie("anon_id"));

  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [posting, setPosting] = useState(false);
  const [commentError, setCommentError] = useState(null);

  const myLikeId = currentUser ? currentUser._id : anonId;
  const isLiked = !!(myLikeId && likes.includes(myLikeId));

  const truncateContent = (content, maxLength) => {
    if (!content) return "";
    return content.length > maxLength
      ? content.substring(0, maxLength) + "..."
      : content;
  };

  // Comment count for the stats row (list/panel content only fetched once)
  useEffect(() => {
    let cancelled = false;
    const fetchComments = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/comment/getPostComments/${post._id}`
        );
        const data = await res.json();
        if (res.ok && !cancelled) setComments(data);
      } catch (error) {
        console.log(error.message);
      }
    };
    if (post._id) fetchComments();
    return () => {
      cancelled = true;
    };
  }, [post._id]);

  const handleLike = async () => {
    if (liking) return;
    setLiking(true);

    const wasLiked = isLiked;
    const optimisticId = myLikeId; // undefined on a guest's very first-ever like

    if (optimisticId) {
      setLikes((prev) =>
        wasLiked
          ? prev.filter((id) => id !== optimisticId)
          : [...prev, optimisticId]
      );
      setNumberOfLikes((prev) => (wasLiked ? prev - 1 : prev + 1));
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/post/likePost/${post._id}`,
        { method: "PUT", credentials: "include" }
      );
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        console.log(
          "likePost failed:",
          res.status,
          body.message || res.statusText
        );
        throw new Error("Like failed");
      }
      const data = await res.json();
      setLikes(data.likes);
      setNumberOfLikes(data.numberOfLikes);
      if (!currentUser) {
        const freshAnonId = getCookie("anon_id");
        if (freshAnonId) setAnonId(freshAnonId);
      }
    } catch (error) {
      if (optimisticId) {
        setLikes((prev) =>
          wasLiked
            ? [...prev, optimisticId]
            : prev.filter((id) => id !== optimisticId)
        );
        setNumberOfLikes((prev) => (wasLiked ? prev + 1 : prev - 1));
      }
      console.log(error.message);
    } finally {
      setLiking(false);
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/post/${post.slug}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: post.title, url });
      } else {
        await navigator.clipboard.writeText(url);
      }
    } catch (error) {
      // user cancelled share sheet — ignore
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      navigate("/sign-in");
      return;
    }
    if (!newComment.trim() || newComment.length > 200 || posting) return;

    setPosting(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/comment/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            content: newComment,
            postId: post._id,
            userId: currentUser._id,
          }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setComments((prev) => [data, ...prev]);
        setNewComment("");
        setCommentError(null);
      } else {
        setCommentError(data.message || "Could not post comment");
      }
    } catch (error) {
      setCommentError(error.message);
    } finally {
      setPosting(false);
    }
  };

  const handleCommentLike = async (commentId) => {
    if (!currentUser) {
      navigate("/sign-in");
      return;
    }
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/comment/likeComment/${commentId}`,
        { method: "PUT", credentials: "include" }
      );
      if (res.ok) {
        const data = await res.json();
        setComments((prev) =>
          prev.map((c) =>
            c._id === commentId
              ? { ...c, likes: data.likes, numberOfLikes: data.likes.length }
              : c
          )
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleCommentEdit = (comment, editedContent) => {
    setComments((prev) =>
      prev.map((c) =>
        c._id === comment._id ? { ...c, content: editedContent } : c
      )
    );
  };

  const handleCommentDelete = async (commentId) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/comment/deleteComment/${commentId}`,
        { method: "DELETE", credentials: "include" }
      );
      if (res.ok) {
        setComments((prev) => prev.filter((c) => c._id !== commentId));
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="group bg-white dark:bg-gray-800 w-full flex flex-col rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
      {/* Image */}
      <Link to={`/post/${post.slug}`} className="block relative">
        <div className="w-full h-40 overflow-hidden bg-gray-100 dark:bg-gray-900">
          <img
            src={post.image}
            alt="post cover"
            className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
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

      {/* Content */}
      <div className="p-3.5 flex flex-col flex-grow">
        {/* Title */}
        <Link to={`/post/${post.slug}`}>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 line-clamp-2 leading-snug">
            {post.title}
          </h2>
        </Link>

        {/* Meta info */}
        <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 mb-2">
          Fahad · {new Date(post.createdAt).toLocaleDateString()}
        </div>

        {/* Description */}
        {post?.content && (
          <p
            className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mb-3"
            dangerouslySetInnerHTML={{
              __html: truncateContent(post.content, 80),
            }}
          />
        )}

        {/* Stats row */}
        {(numberOfLikes > 0 || comments.length > 0) && (
          <div className="flex items-center gap-3 text-[11px] text-gray-500 dark:text-gray-400 mb-1.5">
            {numberOfLikes > 0 && (
              <span>
                {numberOfLikes} {numberOfLikes === 1 ? "like" : "likes"}
              </span>
            )}
            {comments.length > 0 && (
              <span>
                {comments.length}{" "}
                {comments.length === 1 ? "comment" : "comments"}
              </span>
            )}
          </div>
        )}

        {/* Icon-only action row */}
        <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-2 mt-auto">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleLike}
              disabled={liking}
              title="Like"
              className={`p-1.5 rounded-full transition-colors ${
                isLiked
                  ? "text-blue-600"
                  : "text-gray-500 dark:text-gray-400 hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-white/5"
              }`}
            >
              {isLiked ? (
                <FaThumbsUp className="text-[13px]" />
              ) : (
                <FaRegThumbsUp className="text-[13px]" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setShowComments(true)}
              title="Comment"
              className="p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              <FaRegCommentDots className="text-[13px]" />
            </button>

            <button
              type="button"
              onClick={handleShare}
              title="Share"
              className="p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              <IoShareSocialOutline className="text-sm" />
            </button>
          </div>

          {/* Read article — small text link, not a large button */}
          <Link
            to={`/post/${post.slug}`}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            Read
            <FaArrowRight className="text-[9px] transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      {/* Comment modal — floats above everything, never affects card/grid layout */}
      <Modal
        show={showComments}
        onClose={() => setShowComments(false)}
        size="md"
      >
        <Modal.Header>
          <span className="text-sm font-semibold line-clamp-1">
            {post.title}
          </span>
        </Modal.Header>
        <Modal.Body>
          {currentUser ? (
            <form onSubmit={handleSubmitComment} className="mb-3">
              <Textarea
                placeholder="Add a comment..."
                rows="2"
                maxLength="200"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="text-xs"
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-[10px] text-gray-400">
                  {200 - newComment.length} characters left
                </p>
                <Button
                  size="xs"
                  color="blue"
                  type="submit"
                  disabled={posting || !newComment.trim()}
                >
                  {posting ? "Posting..." : "Post"}
                </Button>
              </div>
              {commentError && (
                <p className="text-[10px] text-red-500 mt-1">
                  {commentError}
                </p>
              )}
            </form>
          ) : (
            <p className="text-[11px] text-gray-500 mb-3">
              <Link to="/sign-in" className="text-blue-600 hover:underline">
                Sign in
              </Link>{" "}
              to leave a comment.
            </p>
          )}

          {comments.length === 0 ? (
            <p className="text-[11px] text-gray-400">No comments yet.</p>
          ) : (
            <div className="max-h-80 overflow-y-auto -mx-4">
              {comments.map((c) => (
                <Comment
                  key={c._id}
                  comment={c}
                  onLike={handleCommentLike}
                  onEdit={handleCommentEdit}
                  onDelete={handleCommentDelete}
                />
              ))}
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PostCardVertical;