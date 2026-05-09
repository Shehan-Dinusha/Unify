import React, { useState, useRef, useEffect } from "react";
import { useSavedPosts } from "../../context/SavedPostsContext";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../services/authService";
import {
  MapPin,
  Send,
  Heart,
  MessageCircle,
  Zap,
  Bookmark,
  Calendar,
  ShoppingBag,
  Home,
  MessageSquare,
} from "lucide-react";
import newsfeedService from "../../services/newsfeedService";
import { formatTimeAgo } from "../../utils/formatters";

/* ─── Comment Section (from ClubPostCard) ───────────────────── */
const CommentSection = ({ postComments, onAddComment, loading, currentUser }) => {
  const [text, setText] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onAddComment(trimmed);
    setText("");
    // Reset height if ref exists
    if (inputRef.current) {
      inputRef.current.style.height = "inherit";
    }
  };

  return (
    <div className="mt-4 border-t border-white/10 pt-4 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
      {/* Loading state */}
      {loading && (
        <div className="text-center text-text-secondary text-sm py-2">
          Loading comments...
        </div>
      )}

      {/* Existing comments */}
      {!loading && postComments.length > 0 && (
        <div className="flex flex-col gap-3 max-h-56 overflow-y-auto pr-1 scrollbar-hide">
          {postComments.map((c) => (
            <div key={c.id} className="flex gap-3 items-start">
              <img
                src={c.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(c.user?.name || c.user || "User")}`}
                alt={c.user?.name || c.user || "User"}
                className="w-8 h-8 rounded-full border border-white/15 flex-shrink-0 mt-0.5 object-cover"
              />
              <div className="flex-1 min-w-0 bg-white/5 rounded-xl px-3 py-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[13px] font-semibold text-text-primary">
                    {c.user?.name || c.user || "User"}
                  </span>
                  <span className="text-[11px] text-text-tertiary">
                    {c.time || "just now"}
                  </span>
                </div>
                <p className="text-[13px] text-text-secondary leading-relaxed whitespace-pre-wrap break-words">
                  {c.content || c.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <img
          src={currentUser?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(currentUser?.name || "Me")}`}
          alt="You"
          className="w-8 h-8 rounded-full border border-white/15 flex-shrink-0 mb-1 object-cover"
        />
        <div className="flex-1 flex items-end bg-white/5 border border-white/10 rounded-2xl px-4 py-2 gap-2 focus-within:border-primary-blue/50 transition-colors">
          <textarea
            ref={inputRef}
            rows={1}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              // Auto-resize
              e.target.style.height = "inherit";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Write a comment…"
            className="flex-1 bg-transparent text-[13px] text-text-primary placeholder:text-text-tertiary outline-none resize-none py-1 max-h-32 scrollbar-hide"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className="text-primary-blue disabled:text-text-tertiary transition-colors p-1"
          >
            <Send size={18} strokeWidth={2} />
          </button>
        </div>
      </form>
    </div>
  );
};

/* ─── PostCard ───────────────────────────────────────────────── */
const PostCard = ({
  post,
  author,
  authorInitial,
  time,
  title,
  location,
  description,
  image,
  likes,
  comments,
  initialIsLiked = false,
  initialIsSaved = false,
  isPromoted,
  boostMeta,
  showBoost = false,
}) => {
  const { toggleSavePost, isPostSaved } = useSavedPosts();
  // const isSavedLocal = post ? isPostSaved(post.id) : false; // Use initialIsSaved from props instead
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(likes);
  const [showComments, setShowComments] = useState(false);
  const reportNavigate = useNavigate();
  const [postComments, setPostComments] = useState([]);
  const [commentCount, setCommentCount] = useState(comments);
  const [loadingComments, setLoadingComments] = useState(false);
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [imgFailed, setImgFailed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const currentUser = getCurrentUser();

  const DESCRIPTION_LIMIT = 250;
  const isLongDescription =
    description && description.length > DESCRIPTION_LIMIT;

  const postType = post?.postType || "normal";
  const postId = post?.id;

  // Detect invalid/placeholder image values — show styled placeholder instead of broken icon
  const isValidImage =
    image && !image.includes("placeholder-post") && !imgFailed;
  const showImage = isValidImage;

  const handleToggleLike = async () => {
    // Optimistic update
    const wasLiked = isLiked;
    setIsLiked(!wasLiked);
    setLikeCount(wasLiked ? likeCount - 1 : likeCount + 1);

    try {
      await newsfeedService.toggleLike(postType, postId);
    } catch (err) {
      // Revert on failure
      console.error("Failed to toggle like:", err);
      setIsLiked(wasLiked);
      setLikeCount(wasLiked ? likeCount : likeCount - 1);
    }
  };

  const handleToggleSave = async () => {
    const wasSaved = isSaved;
    setIsSaved(!wasSaved);
    // Also toggle in context for SavedPosts page
    if (post) toggleSavePost(post);

    try {
      await newsfeedService.toggleSave(postType, postId);
    } catch (err) {
      console.error("Failed to toggle save:", err);
      setIsSaved(wasSaved);
      if (post) toggleSavePost(post); // revert context too
    }
  };

  const handleToggleComments = async () => {
    const shouldShow = !showComments;
    setShowComments(shouldShow);

    // Fetch comments from backend when opening for the first time
    if (shouldShow && postComments.length === 0) {
      try {
        setLoadingComments(true);
        const data = await newsfeedService.getComments(postType, postId);
        const fetchedComments = (data.comments || []).map((c) => ({
          id: c.id,
          user: c.user?.name || "User",
          avatar: c.user?.avatar,
          seed: c.user?.name || "User",
          time: c.createdAt ? formatTimeAgo(c.createdAt) : "just now",
          text: c.content,
        }));
        setPostComments(fetchedComments);
        setCommentCount(fetchedComments.length);
      } catch (err) {
        console.error("Failed to fetch comments:", err);
      } finally {
        setLoadingComments(false);
      }
    }
  };

  const handleAddComment = async (text) => {
    // Optimistic add
    const tempComment = {
      id: `new-${Date.now()}`,
      user: currentUser?.name || "You",
      avatar: currentUser?.avatar,
      seed: currentUser?.name || "Me",
      time: "just now",
      text,
    };
    setPostComments((prev) => [...prev, tempComment]);
    setCommentCount((c) => c + 1);

    try {
      const data = await newsfeedService.addComment(postType, postId, text);
      // Replace temp with real comment from backend
      if (data.comment) {
        const realComment = {
          id: data.comment.id,
          user: data.comment.user?.name || currentUser?.name || "You",
          avatar: data.comment.user?.avatar || currentUser?.avatar,
          seed: data.comment.user?.name || currentUser?.name || "Me",
          time: "just now",
          text: data.comment.content,
        };
        setPostComments((prev) =>
          prev.map((c) => (c.id === tempComment.id ? realComment : c)),
        );
      }
    } catch (err) {
      console.error("Failed to add comment:", err);
      // Remove temp comment on failure
      setPostComments((prev) => prev.filter((c) => c.id !== tempComment.id));
      setCommentCount((c) => c - 1);
    }
  };

  // Determine boost visual style from boostMeta
  const highlightStyle = boostMeta?.highlightStyle || "none";

  // Build card border classes based on highlightStyle
  const cardBorderClass = (() => {
    if (!isPromoted || !boostMeta) return "border border-white/5";
    switch (highlightStyle) {
      case "gold":
        return "border-2 border-yellow-400/60";
      case "blue":
        return "border-2 border-blue-500/50";
      case "subtle":
        return "border border-white/15";
      default:
        return "border border-white/5";
    }
  })();

  // Glow shadow for premium tiers (applied via inline style to avoid Babel parse issues)
  const cardGlowStyle = (() => {
    if (!isPromoted || !boostMeta) return {};
    switch (highlightStyle) {
      case "gold":
        return { boxShadow: "0 0 20px rgba(251, 191, 36, 0.15)" };
      case "blue":
        return { boxShadow: "0 0 16px rgba(59, 130, 246, 0.12)" };
      default:
        return {};
    }
  })();

  return (
    <div
      className={"w-full bg-[#1A2634] rounded-[24px] overflow-hidden font-inter text-white transition-all duration-300 " + cardBorderClass}
      style={cardGlowStyle}
    >
      {/* Post Image */}
      {showImage && (
        <div className="relative w-full bg-black/20 flex justify-center items-center min-h-[200px] max-h-[500px] overflow-hidden">
          <img
            src={image}
            alt="post"
            className="w-full h-auto object-contain max-h-[500px]"
            loading="lazy"
            onError={() => {
              setImgFailed(true);
            }}
          />
        </div>
      )}

      {/* Content Container */}
      <div className="p-5 sm:p-lg flex flex-col gap-4">
        {/* Author Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#7551FF] flex items-center justify-center text-white text-body-medium-bold">
              {authorInitial}
            </div>
            <div>
              <p className="text-body-small-bold sm:text-body-medium-bold text-[#E2E8F0]">
                {author}
              </p>
              <p className="text-[11px] sm:text-body-extra-small text-[#94A3B8]">
                {time}
              </p>
            </div>
          </div>

          {isPromoted && (
            (() => {
              const style = boostMeta?.highlightStyle || "none";
              switch (style) {
                case "gold":
                  return (
                    <span className="text-[11px] font-bold bg-gradient-to-r from-[#FBBF24]/20 to-[#F59E0B]/20 text-[#FBBF24] px-3 py-1 rounded-full border border-[#FBBF24]/30 flex items-center gap-1">
                      ⚡ Featured
                    </span>
                  );
                case "blue":
                  return (
                    <span className="text-[11px] font-bold bg-[#3B82F6]/15 text-[#60A5FA] px-3 py-1 rounded-full border border-[#3B82F6]/30">
                      Promoted
                    </span>
                  );
                case "subtle":
                  return (
                    <span className="text-[10px] font-medium text-[#94A3B8]/70 tracking-wider uppercase">
                      Sponsored
                    </span>
                  );
                default:
                  return (
                    <span className="text-[11px] font-bold bg-[#FBBF24]/10 text-[#FBBF24] px-3 py-1 rounded-full">
                      Promoted
                    </span>
                  );
              }
            })()
          )}
        </div>

        {/* Title */}
        {title && (
          <h3 className="text-xl sm:text-heading-small text-white font-bold leading-tight mt-1">
            {title}
          </h3>
        )}

        {/* Location */}
        {location && (
          <div className="flex items-center gap-1.5 text-[#94A3B8] -mt-2">
            <MapPin size={14} />
            <span className="text-xs sm:text-body-small">{location}</span>
          </div>
        )}

        {/* Description */}
        {description && (
          <div className="text-sm sm:text-body-medium text-[#94A3B8] leading-relaxed">
            <p className="inline">
              {isLongDescription && !isExpanded
                ? `${description.slice(0, DESCRIPTION_LIMIT).trimEnd()}...`
                : description}
            </p>
            {isLongDescription && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="ml-1 text-primary-blue hover:text-primary-blue/80 text-sm font-medium transition-colors inline"
              >
                {isExpanded ? "See less" : "See more"}
              </button>
            )}
          </div>
        )}

        {/* Divider */}
        <div className="h-px bg-white/5 w-full my-2" />

        {/* Actions */}
        <div className="grid grid-cols-4 text-[#94A3B8] text-xs sm:text-body-small">
          {/* Like */}
          <button
            onClick={handleToggleLike}
            className={`flex flex-col items-center justify-center gap-0.5 py-2 hover:bg-white/5 rounded-lg transition-colors ${isLiked ? "text-primary-blue" : ""}`}
          >
            <div className="flex items-center gap-1.5">
              <Heart
                size={20}
                className={isLiked ? "fill-current" : ""}
                strokeWidth={isLiked ? 0 : 1.8}
              />
              <span>{likeCount}</span>
            </div>
            <span className="text-[11px]">Like</span>
          </button>

          {/* Comment */}
          <button
            onClick={handleToggleComments}
            className={`flex flex-col items-center justify-center gap-0.5 py-2 hover:bg-white/5 rounded-lg transition-colors ${showComments ? "text-primary-blue" : ""}`}
          >
            <div className="flex items-center gap-1.5">
              <MessageCircle size={20} strokeWidth={1.8} />
              <span>{commentCount}</span>
            </div>
            <span className="text-[11px]">Comment</span>
          </button>

          {/* Save */}
          <button
            onClick={handleToggleSave}
            className={`flex flex-col items-center justify-center gap-0.5 py-2 hover:bg-white/5 rounded-lg transition-colors ${isSaved ? "text-primary-blue" : ""}`}
          >
            <div className="flex items-center gap-1.5">
              <Bookmark
                size={20}
                className={isSaved ? "fill-current" : ""}
                strokeWidth={isSaved ? 0 : 1.8}
              />
            </div>
            <span className="text-[11px]">{isSaved ? "Saved" : "Save"}</span>
          </button>

          {/* Report */}
          <button
            onClick={() =>
              reportNavigate("/student/report-issue", {
                state: { postData: post, from: "/news-feed" },
              })
            }
            className="flex flex-col items-center justify-center gap-0.5 py-2 hover:bg-white/5 rounded-lg transition-colors group hover:text-state-error"
          >
            {" "}
            <div className="flex items-center gap-1.5">
              <img
                src="/icon_report_marketplace.svg"
                alt="Report"
                className="w-5 h-5 opacity-70 group-hover:opacity-100"
              />
            </div>
            <span className="text-[11px]">Report</span>
          </button>
        </div>

        {/* Comment Section (ClubPostCard style) */}
        {showComments && (
          <CommentSection
            postComments={postComments}
            onAddComment={handleAddComment}
            loading={loadingComments}
            currentUser={currentUser}
          />
        )}
      </div>
    </div>
  );
};

export default PostCard;
