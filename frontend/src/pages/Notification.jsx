import React, { useState, useEffect, useRef } from "react";
import { Search, CornerUpLeft, Loader2, Heart, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Card from "../components/common/Card";
import notificationService from "../services/notificationService";
import { getCurrentUser } from "../services/authService";
import { useNotifications } from "../context/NotificationContext";
import { getImageUrl } from "../utils/formatters";

/**
 * Returns a valid avatar URL.
 * If the user has a real avatar, use it. Otherwise generate a ui-avatar matching the profile page.
 */
const getAvatarUrl = (avatar, name) => {
  if (avatar && !avatar.includes("placehold") && !avatar.includes("dicebear")) return avatar;
  const seed = encodeURIComponent(name || "User");
  return `https://ui-avatars.com/api/?name=${seed}&background=2666F1&color=fff`;
};

/* --- Helper Components --- */

// Avatar for Reply
const ReplyAvatar = ({ avatar }) => (
  <div className="relative w-10 h-10 shrink-0">
    <img src={avatar} alt="Reply" className="w-full h-full rounded-full object-cover" />
    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary-blue rounded-full border-2 border-dark-1 flex items-center justify-center">
      <CornerUpLeft size={10} className="text-white" />
    </div>
  </div>
);

// Avatar for Like
const LikeAvatar = ({ avatar }) => (
  <div className="relative w-10 h-10 shrink-0">
    <img src={avatar} alt="Like" className="w-full h-full rounded-full object-cover" />
    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-state-error rounded-full border-2 border-dark-1 flex items-center justify-center">
      <Heart size={10} className="text-white" fill="currentColor" />
    </div>
  </div>
);

// Match Icon for Lost & Found
const MatchIcon = () => (
  <div className="w-10 h-10 shrink-0 rounded-full bg-[#2D2A4A] flex items-center justify-center">
    <Search size={18} className="text-[#A78BFA]" />
  </div>
);

/* --- Main Notification Card --- */
const NotificationCard = ({ notification, onMarkRead, onNavigate }) => {
  const { type, title, content, time, isUnread, avatar, avatars, image } = notification;

  // Render correct icon/avatar
  const renderIcon = () => {
    switch (type) {
      case "reply":
        return <ReplyAvatar avatar={avatar} />;
      case "like":
        return <LikeAvatar avatar={avatar} />;
      case "match":
        return <MatchIcon />;
      default:
        return <div className="w-10 h-10 bg-white/10 rounded-full" />;
    }
  };

  // Format title (Make names blue for replies if we loosely split)
  const renderTitle = () => {
    if (type === "reply" || type === "like") {
      const words = title.split(" ");
      if (words.length >= 2) {
        return (
          <>
            <span className="text-primary-blue">{words[0]} {words[1]}</span>{" "}
            <span className="text-text-primary">{words.slice(2).join(" ")}</span>
          </>
        );
      }
    }
    return <span className="text-text-primary">{title}</span>;
  };

  const handleClick = () => {
    if (isUnread && onMarkRead) {
      onMarkRead(notification.id);
    }
    // Navigate to the NewsFeed and scroll to the related post
    if (notification.referenceId && notification.referenceType && onNavigate) {
      onNavigate(notification.referenceId, notification.referenceType);
    }
  };

  return (
    <Card
      variant="container"
      padding="p-0"
      className={`transition-all duration-300 ${
        isUnread
          ? "!bg-[#162743] !border-primary-blue/30 cursor-pointer"
          : "hover:!bg-white/10 hover:!border-white/15 cursor-pointer"
      }`}
    >
      <div className="flex items-start gap-4 p-5 sm:p-6 w-full h-full relative" onClick={handleClick}>
        {/* Icon Area */}
        {renderIcon()}

        {/* Content Area */}
        <div className="flex-1 flex flex-col gap-1.5 pt-0.5">
          <h3 className="text-body-small-bold sm:text-body-medium-bold">
            {renderTitle()}
          </h3>
          <p className={`text-body-small ${type === "reply" ? "text-text-secondary italic" : "text-text-secondary"}`}>
            {content}
          </p>
          <span className="text-[12px] text-text-tertiary mt-1">{time}</span>
        </div>

        {/* Right Area (Unread Dot or Thumbnail) */}
        <div className="flex flex-col items-end gap-2 shrink-0 h-full">
          {isUnread && <div className="w-2.5 h-2.5 rounded-full bg-primary-blue mt-2" />}
          {image && (
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border border-white/10 mt-auto mb-auto">
              <img src={image} alt="Match thumbnail" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

/* --- Page --- */
const BASE_FILTERS = ["All", "Unread"];
const STUDENT_FILTERS = ["All", "Unread", "Lost & Found"];

const Notification = () => {
  const navigate = useNavigate();
  const authUser = getCurrentUser();
  const isStudent = authUser?.role === "Student";
  const FILTERS = isStudent ? STUDENT_FILTERS : BASE_FILTERS;
  const { refreshUnreadCount } = useNotifications();

  const [activeFilter, setActiveFilter] = useState("All");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const searchInputRef = useRef(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  // Map frontend filter labels to backend query params
  const getBackendFilter = (filter) => {
    switch (filter) {
      case "Unread":
        return "unread";
      case "Lost & Found":
        return "match";
      default:
        return "all";
    }
  };

  // Normalize backend notification shape to match what the UI components expect
  const normalizeNotification = (n) => {
    const typeLower = (n.type || "general").toLowerCase();
    const actorName = n.actorName || n.actor?.name || "User";
    const actorAvatar = getAvatarUrl(n.avatar || n.actor?.avatar, actorName);
    return {
      id: n.id,
      type: typeLower,
      title: n.title,
      content: n.content,
      time: n.time,
      isUnread: n.isUnread,
      image: n.image ? getImageUrl(n.image) : null,
      // Post reference — used for navigation on click
      referenceId: n.referenceId || null,
      referenceType: n.referenceType || null,
      // For reply/like notifications, use the actor's real avatar (or Dicebear fallback)
      avatar: actorAvatar,
    };
  };

  const fetchNotifications = async (filter = activeFilter) => {
    try {
      setLoading(true);
      setError(null);
      const backendFilter = getBackendFilter(filter);
      const data = await notificationService.getNotifications(backendFilter);
      const normalized = (data.notifications || []).map(normalizeNotification);
      setNotifications(normalized);
    } catch (err) {
      setError(err.error || err.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    refreshUnreadCount();
  }, [activeFilter, refreshUnreadCount]);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const handleMarkRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      // Optimistically update local state
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, isUnread: false } : n
        )
      );
      refreshUnreadCount(); // update the sidebar badge
    } catch (err) {
      // Silently fail — notification read status is non-critical
      console.error("Failed to mark notification as read:", err);
    }
  };

  const handleNavigateToPost = (referenceId, referenceType) => {
    if (referenceType === "LostAndFound") {
      navigate(`/lost-and-found?view=detail&id=${referenceId}`);
    } else {
      navigate("/news-feed", {
        state: {
          targetPostId: referenceId,
          targetPostType: referenceType,
        },
      });
    }
  };

  const unreadCount = notifications.filter((n) => n.isUnread).length;

  const user = authUser ? { name: authUser.name, role: authUser.role || "student" } : { name: "Guest", role: "student" };

  const filteredNotifications = searchQuery.trim()
    ? notifications.filter(
        (n) =>
          n.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.content?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : notifications;

  const headerRight = (
    <div className="flex items-center gap-2">
      {showSearch && (
        <div className="flex items-center bg-dark-2 border border-primary-blue/30 rounded-full px-4 py-1.5 animate-in slide-in-from-right-4 duration-200">
          <Search size={16} className="text-text-secondary mr-2 shrink-0" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search notifications..."
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
    <MainLayout user={user} pageTitle="Notifications" headerRight={headerRight}>
      <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto px-2 sm:px-0">
        
        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => handleFilterChange(filter)}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-body-small font-semibold transition-all duration-150 whitespace-nowrap ${
                activeFilter === filter
                  ? "bg-primary-blue text-white"
                  : "bg-white/5 text-text-secondary hover:bg-white/10 border border-white/10"
              }`}
            >
              {filter}
              {/* Badge for Unread */}
              {filter === "Unread" && unreadCount > 0 && (
                <span
                  className={`w-5 h-5 flex items-center justify-center rounded-full text-[11px] font-bold ${
                    activeFilter === filter
                      ? "bg-white text-primary-blue"
                      : "bg-primary-blue text-white"
                  }`}
                >
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="flex flex-col gap-3 sm:gap-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-10 h-10 text-primary-blue animate-spin" />
              <p className="text-text-secondary animate-pulse">Loading notifications...</p>
            </div>
          ) : error ? (
            <div className="bg-state-error/10 border border-state-error/20 rounded-2xl p-6 text-center">
              <p className="text-state-error font-semibold">{error}</p>
              <button
                onClick={() => fetchNotifications()}
                className="mt-4 text-sm text-text-secondary hover:text-white underline"
              >
                Try again
              </button>
            </div>
          ) : filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onMarkRead={handleMarkRead}
                onNavigate={handleNavigateToPost}
              />
            ))
          ) : (
            <div className="py-20 text-center flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                <span className="text-heading-medium opacity-50">📭</span>
              </div>
              <p className="text-body-medium text-text-secondary">No notifications found.</p>
            </div>
          )}
        </div>
        
      </div>
    </MainLayout>
  );
};

export default Notification;
