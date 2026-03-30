import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, X } from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import StatsCard from "../components/common/StatsCard";
import PostCard from "../components/feed/PostCard";
import mockPosts from "../data/mockData";

const NewsFeed = () => {
  const location = useLocation();
  const postRefs = useRef({});
  const searchInputRef = useRef(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const user = {
    name: "Alex Johnson",
    role: "student",
  };

  useEffect(() => {
    // Check if we arrived with a targetPostId in state
    if (location.state?.targetPostId) {
      const targetId = location.state.targetPostId;
      const targetRef = postRefs.current[targetId];

      if (targetRef) {
        // Add a slight delay to ensure rendering is complete before scrolling
        setTimeout(() => {
          targetRef.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
      }
    }
  }, [location.state]);

  // Auto-focus search input when search bar opens
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  // Filter posts based on search query
  const filteredPosts = searchQuery.trim()
    ? mockPosts.filter(
        (post) =>
          post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : mockPosts;

  // Custom header right content with search toggle
  const headerRight = (
    <div className="flex items-center gap-2">
      {showSearch && (
        <div className="flex items-center bg-dark-2 border border-primary-blue/30 rounded-full px-4 py-1.5 animate-in slide-in-from-right-4 duration-200">
          <Search size={16} className="text-text-secondary mr-2 shrink-0" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-sm text-white placeholder-text-secondary outline-none w-48 sm:w-64"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="ml-1 text-text-secondary hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
      )}
      <button
        onClick={() => {
          setShowSearch(!showSearch);
          if (showSearch) setSearchQuery("");
        }}
        className={`p-2 flex items-center justify-center shrink-0 rounded-full transition-colors ${
          showSearch
            ? "bg-primary-blue/20 text-primary-blue"
            : "hover:bg-white/5"
        }`}
      >
        {showSearch ? (
          <X size={20} className="text-primary-blue" />
        ) : (
          <img
            src="/icon_search.svg"
            alt="Search"
            className="w-6 h-6 opacity-70"
          />
        )}
      </button>
    </div>
  );

  return (
    <MainLayout
      user={user}
      pageTitle="News Feed"
      verificationCount={0}
      headerRight={headerRight}
    >
      <div className="flex flex-col gap-8 w-full max-w-3xl mx-auto">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
          <Link to="/new-announcements">
            <StatsCard
              iconSrc="/icon_new_announcement.svg"
              iconAlt="Announcements"
              iconBgClass="bg-yellow-500/20"
              title="New Announcements"
              value="10"
            />
          </Link>

          <Link to="/marketplace-items">
            <StatsCard
              iconSrc="/icon_marketplace.svg"
              iconAlt="Marketplace"
              iconBgClass="bg-green-500/20"
              title="New Marketplace Items"
              value="10"
            />
          </Link>

          <Link to="/events-today">
            <StatsCard
              iconSrc="/icon_event_today.svg"
              iconAlt="Events"
              iconBgClass="bg-purple-500/20"
              title="Events Today"
              iconSize="w-7 h-7"
              value="10"
            />
          </Link>
        </div>

        {/* Search Results Info */}
        {searchQuery.trim() && (
          <div className="text-text-secondary text-sm">
            {filteredPosts.length > 0
              ? `Showing ${filteredPosts.length} result${filteredPosts.length !== 1 ? "s" : ""} for "${searchQuery}"`
              : `No posts found for "${searchQuery}"`}
          </div>
        )}

        {/* Posts Section */}
        <div className="flex flex-col gap-6 w-full">
          {filteredPosts.map((post) => (
            <div key={post.id} ref={(el) => (postRefs.current[post.id] = el)}>
              <PostCard
                post={post}
                author={post.author}
                authorInitial={post.authorInitial}
                time={post.time}
                title={post.title}
                location={post.location}
                description={post.description}
                image={post.image}
                likes={post.likes}
                comments={post.comments}
                isPromoted={post.isPromoted}
              />
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default NewsFeed;
