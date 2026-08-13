import moment from "moment";
import { useEffect, useState } from "react";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Button, Textarea } from "flowbite-react";
import { IoTrashOutline } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";

export default function Comment({ comment, onLike, onEdit, onDelete }) {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/user/${comment.userId}`
        );
        const data = await res.json();
        if (res.ok) setUser(data);
      } catch (error) {
        console.log(error.message);
      }
    };
    getUser();
  }, [comment]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(comment.content);
  };

  const handleSave = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/comment/editComment/${comment._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ content: editedContent }),
        }
      );
      if (res.ok) {
        setIsEditing(false);
        onEdit(comment, editedContent);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="flex p-3 border-b border-gray-100 dark:border-gray-700 text-sm">
      <div className="flex-shrink-0 mr-3">
        <img
          className="w-8 h-8 rounded-full bg-gray-200 object-cover"
          src={user.profilePicture}
          alt={user.username}
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-semibold mr-1 text-xs text-gray-800 dark:text-gray-100 truncate">
            {user ? `@${user.username}` : "anonymous user"}
          </span>
          <span className="text-gray-400 text-xs">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        {isEditing ? (
          <>
            <Textarea
              className="mb-2 text-xs"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <div className="flex justify-end gap-2 text-xs">
              <Button
                type="button"
                size="xs"
                color="blue"
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                type="button"
                size="xs"
                color="gray"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-600 dark:text-gray-300 text-xs pb-2">
              {comment.content}
            </p>
            <div className="flex items-center pt-1 text-xs gap-2">
              <button
                type="button"
                onClick={() => onLike(comment._id)}
                className={`text-gray-400 hover:text-blue-600 ${
                  currentUser &&
                  comment.likes.includes(currentUser._id) &&
                  "!text-blue-600"
                }`}
              >
                <FaThumbsUp className="text-xs" />
              </button>
              <p className="text-gray-400 text-[11px]">
                {comment.numberOfLikes > 0 &&
                  comment.numberOfLikes +
                    " " +
                    (comment.numberOfLikes === 1 ? "like" : "likes")}
              </p>
              {currentUser &&
                (currentUser._id === comment.userId ||
                  currentUser.isAdmin) && (
                  <>
                    <button
                      type="button"
                      onClick={handleEdit}
                      className="text-gray-400 hover:text-blue-600"
                    >
                      <CiEdit className="text-sm cursor-pointer" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(comment._id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <IoTrashOutline className="text-sm cursor-pointer" />
                    </button>
                  </>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}