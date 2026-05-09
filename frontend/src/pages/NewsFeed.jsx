import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, X, Loader2 } from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import StatsCard from "../components/common/StatsCard";
import PostCard from "../components/feed/PostCard";
import postService from "../services/postService";
import newsfeedService from "../services/newsfeedService";
import { formatTimeAgo, getImageUrl } from "../utils/formatters";

const NewsFeed = ({ userRole = 'student' }) => {
  const location = useLocation();
  const postRefs = useRef({});
  const searchInputRef = useRef(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Highlight counts
  const [highlightCounts, setHighlightCounts] = useState({
    announcements: 0,
    marketplace: 0,
    events: 0
  });

  const user = {
    name: "Alex Johnson",
    role: userRole,
    ...(userRole === 'business' ? { displayRole: 'Business & Organization' } : {}),
  };

  useEffect(() => {
    const fetchFeedAndHighlights = async () => {
      try {
        setLoading(true);
        const [feedData, events, marketplace, announcements] = await Promise.all([
          postService.getFeed("all"),
          newsfeedService.getEventsToday().catch(() => ({ events: [] })),
          newsfeedService.getMarketplaceItemsToday().catch(() => ({ items: [] })),
          newsfeedService.getNewAnnouncements().catch(() => ({ announcements: [] }))
        ]);
        
        setPosts(feedData.feed);
        setHighlightCounts({
          events: events.events?.length || 0,
          marketplace: marketplace.items?.length || 0,
          announcements: announcements.announcements?.length || 0
        });
      } catch (err) {
        setError(err.error || "Failed to load feed");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedAndHighlights();
  }, []);

  useEffect(() => {
    // Check if we arrived with a targetPostId in state
    if (location.state?.targetPostId && posts.length > 0) {
      const targetId = location.state.targetPostId;
      const targetType = location.state.targetPostType;
      const refKey = targetType ? `${targetType}-${targetId}` : targetId;
      const targetRef = postRefs.current[refKey];

      if (targetRef) {
        setTimeout(() => {
          targetRef.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
      }
    }
  }, [location.state, posts]);

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  const filteredPosts = searchQuery.trim()
    ? posts.filter(
        (post) =>
          (post.title || post.name)?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.author?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : posts;

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
          <Link to="/new-announcements">
            <StatsCard
              iconSrc="/icon_new_announcement.svg"
              iconAlt="Announcements"
              iconBgClass="bg-yellow-500/20"
              title="New Announcements"
              value={highlightCounts.announcements}
            />
          </Link>

          <Link to="/marketplace-items">
            <StatsCard
              iconSrc="/icon_marketplace.svg"
              iconAlt="Marketplace"
              iconBgClass="bg-green-500/20"
              title="New Marketplace Items"
              value={highlightCounts.marketplace}
            />
          </Link>

          <Link to="/events-today">
            <StatsCard
              iconSrc="/icon_event_today.svg"
              iconAlt="Events"
              iconBgClass="bg-purple-500/20"
              title="Events Today"
              iconSize="w-7 h-7"
              value={highlightCounts.events}
            />
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-primary-blue animate-spin" />
            <p className="text-text-secondary animate-pulse">Fetching latest updates...</p>
          </div>
        ) : error ? (
          <div className="bg-state-error/10 border border-state-error/20 rounded-2xl p-6 text-center">
            <p className="text-state-error font-semibold">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 text-sm text-text-secondary hover:text-white underline"
            >
              Try again
            </button>
          </div>
        ) : (
          <>
            {searchQuery.trim() && (
              <div className="text-text-secondary text-sm">
                {filteredPosts.length > 0
                  ? `Showing ${filteredPosts.length} result${filteredPosts.length !== 1 ? "s" : ""} for "${searchQuery}"`
                  : `No posts found for "${searchQuery}"`}
              </div>
            )}

            <div className="flex flex-col gap-6 w-full">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <div key={`${post.postType}-${post.id}`} ref={(el) => (postRefs.current[`${post.postType}-${post.id}`] = el)}>
                    <PostCard
                      post={post}
                      author={post.author?.name || "Unknown User"}
                      authorInitial={post.author?.name?.charAt(0) || "?"}
                      time={formatTimeAgo(post.createdAt)}
                      title={post.title || post.name}
                      location={post.location || post.pickupNote}
                      description={post.description}
                      image={getImageUrl(post.coverImage || post.image || post.images?.[0])}
                      likes={post.likesCount || 0}
                      comments={post.commentsCount || 0}
                      initialIsLiked={post.isLiked}
                      initialIsSaved={post.isSaved}
                      isPromoted={post.isPromoted}
                      boostMeta={post.boostMeta}
                      showBoost={user.role === 'business'}
                    />
                  </div>
                ))
              ) : (
                <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                  <p className="text-text-secondary">No posts to show right now.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default NewsFeed;
