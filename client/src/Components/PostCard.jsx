import { Link } from "react-router-dom";

export default function PostCard({ post }) {
  return (
    <div className="relative border border-teal-500 hover:border-2 rounded-lg w-full max-w-[350px] overflow-hidden transition-all">
      <Link to={`/post/${post.slug}`}>
        <img
          src={post.image}
          alt="post cover"
          className="h-[260px] w-full  object-cover group-hover:h-[200px] transition-all duration-300 z-20"
        />
      </Link>
      <div className="p-2 flex flex-col gap-1">
        <p className="text-lg font-semibold line-clamp-1">{post.title}</p>
        {post.title}

        <span className="bg-[#FFCEA3] italic rounded-md py-1 px-3 w-20 font-semibold text-gray-700">
          {post.category}
        </span>
        <Link
          to={`/post/${post.slug}`}
          className="z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-1 rounded-md !rounded-tl-none m-2"
        >
          {" "}
          Read More
        </Link>
      </div>
    </div>
  );
}
