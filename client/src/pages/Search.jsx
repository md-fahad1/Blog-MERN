import { Button } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { IoFilterOutline, IoCloseOutline } from "react-icons/io5";
import PostCard from "../Components/PostCard";

const CATEGORIES = [
  { value: "uncategorized", label: "All topics" },
  { value: "coding", label: "Coding" },
  { value: "traveling", label: "Traveling" },
  { value: "study", label: "Study" },
];

const SkeletonCard = () => (
  <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse">
    <div className="h-40 bg-gray-100 dark:bg-gray-800" />
    <div className="p-3.5 space-y-2">
      <div className="h-3.5 bg-gray-100 dark:bg-gray-800 rounded w-4/5" />
      <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-2/5" />
      <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-full" />
    </div>
  </div>
);

export default function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "uncategorized",
  });

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [totalPosts, setTotalPosts] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const debounceRef = useRef(null);
  const isFirstRun = useRef(true);

  // Sync state FROM the URL (covers back/forward nav and initial load)
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    setSidebarData({
      searchTerm: urlParams.get("searchTerm") || "",
      sort: urlParams.get("sort") || "desc",
      category: urlParams.get("category") || "uncategorized",
    });

    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/post/getposts?${urlParams.toString()}`
        );
        if (!res.ok) {
          setLoading(false);
          return;
        }
        const data = await res.json();
        setPosts(data.posts);
        setTotalPosts(data.totalPosts ?? data.posts.length);
        setShowMore(data.posts.length === 9);
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [location.search]);

  // Push state TO the URL whenever filters change — debounced for typing,
  // instant for category/sort clicks (called directly, see below)
  const pushToUrl = (data) => {
    const urlParams = new URLSearchParams();
    if (data.searchTerm) urlParams.set("searchTerm", data.searchTerm);
    urlParams.set("sort", data.sort);
    urlParams.set("category", data.category);
    navigate(`/search?${urlParams.toString()}`, { replace: true });
  };

  // Debounced auto-apply while typing in the search box
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      pushToUrl(sidebarData);
    }, 400);
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sidebarData.searchTerm]);

  const handleSearchTermChange = (e) => {
    setSidebarData((prev) => ({ ...prev, searchTerm: e.target.value }));
  };

  const handleSortChange = (e) => {
    const next = { ...sidebarData, sort: e.target.value || "desc" };
    setSidebarData(next);
    pushToUrl(next); // applies immediately, no debounce needed for a select
  };

  const handleCategorySelect = (value) => {
    const next = { ...sidebarData, category: value };
    setSidebarData(next);
    pushToUrl(next); // applies immediately on click
  };

  const handleReset = () => {
    const next = { searchTerm: "", sort: "desc", category: "uncategorized" };
    setSidebarData(next);
    navigate("/search");
    setFiltersOpen(false);
  };

  const handleShowMore = async () => {
    setLoadingMore(true);
    const startIndex = posts.length;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/post/getposts?${urlParams.toString()}`
      );
      if (res.ok) {
        const data = await res.json();
        setPosts((prev) => [...prev, ...data.posts]);
        setShowMore(data.posts.length === 9);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoadingMore(false);
    }
  };

  const activeCategoryLabel =
    CATEGORIES.find((c) => c.value === sidebarData.category)?.label ||
    "All topics";

  const FiltersPanel = (
    <div className="flex flex-col gap-6">
      <div>
        <label
          htmlFor="searchTerm"
          className="block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2"
        >
          Search
        </label>
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
          <input
            id="searchTerm"
            type="text"
            placeholder="Search posts..."
            value={sidebarData.searchTerm}
            onChange={handleSearchTermChange}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <p className="mt-1.5 text-[10px] text-gray-400">
          Results update automatically as you type
        </p>
      </div>

      <div>
        <span className="block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
          Topic
        </span>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => handleCategorySelect(c.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                sidebarData.category === c.value
                  ? "bg-indigo-600 border-indigo-600 text-white"
                  : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-indigo-400 hover:text-indigo-600"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label
          htmlFor="sort"
          className="block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2"
        >
          Order
        </label>
        <select
          onChange={handleSortChange}
          value={sidebarData.sort}
          id="sort"
          className="w-full text-sm py-2 px-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="desc">Newest first</option>
          <option value="asc">Oldest first</option>
        </select>
      </div>

      <Button type="button" color="light" onClick={handleReset}>
        Reset filters
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-8xl mx-auto flex flex-col md:flex-row gap-8 px-4 sm:px-6 py-8">
        {/* Desktop sidebar */}
        <aside className="hidden md:block w-64 shrink-0">
          <div className="sticky top-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-[#F8F7F4] dark:bg-gray-800 p-5">
            {FiltersPanel}
          </div>
        </aside>

        {/* Main column */}
        <main className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="font-serif text-3xl text-gray-900 dark:text-white">
                Browse posts
              </h1>
              <p className="mt-1 text-xs font-mono tracking-wide text-gray-400 dark:text-gray-500">
                {loading
                  ? "searching…"
                  : `№ ${String(posts.length).padStart(3, "0")} shown${
                      totalPosts != null ? ` · ${totalPosts} total` : ""
                    }`}
              </p>
            </div>

            {/* Mobile filter toggle */}
            <button
              type="button"
              onClick={() => setFiltersOpen((prev) => !prev)}
              className="md:hidden inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200"
            >
              <IoFilterOutline className="text-sm" />
              Filters
            </button>
          </div>

          {/* Active filter summary (mobile + desktop, compact) */}
          {(sidebarData.searchTerm || sidebarData.category !== "uncategorized") && (
            <div className="flex flex-wrap items-center gap-2 mb-5 text-xs">
              {sidebarData.searchTerm && (
                <span className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                  "{sidebarData.searchTerm}"
                </span>
              )}
              {sidebarData.category !== "uncategorized" && (
                <span className="px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300">
                  {activeCategoryLabel}
                </span>
              )}
            </div>
          )}

          {/* Mobile filter drawer */}
          {filtersOpen && (
            <div className="md:hidden mb-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-[#F8F7F4] dark:bg-gray-800 p-5 relative">
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              >
                <IoCloseOutline className="text-lg" />
              </button>
              {FiltersPanel}
            </div>
          )}

          {/* Results grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
              <p className="font-serif text-xl text-gray-700 dark:text-gray-200">
                No posts found
              </p>
              <p className="mt-1 text-sm text-gray-400">
                Try a different search term or topic.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )}

          {showMore && !loading && (
            <div className="flex justify-center mt-8">
              <Button
                color="light"
                onClick={handleShowMore}
                disabled={loadingMore}
              >
                {loadingMore ? "Loading..." : "Show more posts"}
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}