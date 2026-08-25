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
  Trash2,
  BarChart2,
} from "lucide-react";
import Card from "../common/Card";
import newsfeedService from "../../services/newsfeedService";
import postService from "../../services/postService";
import boostService from "../../services/boostService";
import { formatTimeAgo } from "../../utils/formatters";

/* ─── Comment Section (from ClubPostCard) ───────────────────── */
const CommentSection = ({
  postComments,
  onAddComment,
  loading,
  currentUser,
}) => {
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
                src={
                  c.avatar &&
                  !c.avatar.includes("placehold") &&
                  !c.avatar.includes("dicebear")
                    ? c.avatar
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(c.user?.name || c.user || "User")}&background=2666F1&color=fff`
                }
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
          src={
            currentUser?.avatar &&
            !currentUser.avatar.includes("placehold") &&
            !currentUser.avatar.includes("dicebear")
              ? currentUser.avatar
              : `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || "Me")}&background=2666F1&color=fff`
          }
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

const PostCard = ({
  post,
  author,
  authorAvatar,
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
  isManagementMode = false,
  onPostUpdate,
  imageStyle = "contain",
}) => {
  const { toggleSavePost, isPostSaved } = useSavedPosts();
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
  const cardRef = useRef(null);

  const DESCRIPTION_LIMIT = 250;
  const isLongDescription =
    description && description.length > DESCRIPTION_LIMIT;

  const postType = post?.postType || "normal";
  const postId = post?.id;

  // Handle case where author is passed as an object instead of a string
  const displayAuthor =
    typeof author === "string" ? author : author?.name || "User";

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
      if (!wasLiked && isPromoted && postId) {
        // Track the like for boost analytics
        boostService.trackBoostMetrics({
          postId,
          postType,
          action: 'Like',
          content: 'Liked the post',
          impact: 'Medium',
          userId: currentUser?.id || currentUser?.userId
        });
      }
    } catch (err) {
      // Revert on failure
      setIsLiked(wasLiked);
      setLikeCount(wasLiked ? likeCount : likeCount - 1);
    }
  };

  const handleToggleSave = async () => {
    const wasSaved = isSaved;
    setIsSaved(!wasSaved);
    // Optimistically update context (matched by id + postType to avoid cross-type collisions)
    if (post) toggleSavePost({ ...post, postType });

    try {
      await newsfeedService.toggleSave(postType, postId);
    } catch (err) {
      // Revert both local state and context on failure
      setIsSaved(wasSaved);
      if (post) toggleSavePost({ ...post, postType });
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
        
        if (isPromoted && postId) {
          // Track the comment for boost analytics
          boostService.trackBoostMetrics({
            postId,
            postType,
            action: 'Comment',
            content: text.substring(0, 500),
            impact: 'High',
            userId: currentUser?.id || currentUser?.userId
          });
        }
      }
    } catch (err) {
      // Remove temp comment on failure
      setPostComments((prev) => prev.filter((c) => c.id !== tempComment.id));
      setCommentCount((c) => c - 1);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this post? This action cannot be undone.",
      )
    )
      return;

    try {
      await postService.deletePost(postType, postId);
      if (onPostUpdate) onPostUpdate();
    } catch (err) {
      alert(err.error || "Failed to delete post. Please try again.");
    }
  };

  const handleAuthorClick = () => {
    const profileId = post?.authorId || post?.author?.id || post?.userId;
    if (profileId) {
      reportNavigate(`/profile/${profileId}`);
    } else {

    }
  };

  // Determine boost visual style from boostMeta
  const highlightStyle = boostMeta?.highlightStyle || "none";

  // Build card border classes and styles based on highlightStyle
  const boostStyles = (() => {
    if (!isPromoted || !boostMeta)
      return {
        borderClass: "border border-white/5",
        glowStyle: {},
      };

    switch (highlightStyle) {
      case "gold":
        return {
          borderClass: "border-2 border-[#FBBF24] animate-pulse-slow",
          glowStyle: { boxShadow: "0 0 30px rgba(251, 191, 36, 0.4)" },
        };
      case "blue":
        return {
          borderClass: "border-2 border-[#3B82F6]",
          glowStyle: { boxShadow: "0 0 25px rgba(59, 130, 246, 0.3)" },
        };
      case "subtle":
        return {
          borderClass: "border-2 border-white/30",
          glowStyle: { boxShadow: "0 0 15px rgba(255, 255, 255, 0.1)" },
        };
      default:
        return {
          borderClass: "border border-white/5",
          glowStyle: {},
        };
    }
  })();

  // Impression tracking for promoted posts
  useEffect(() => {
    if (!isPromoted || !postId) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Track impression
          boostService.trackBoostMetrics({
            postId,
            postType,
            action: 'impression'
          });
          // Stop observing once tracked
          if (cardRef.current) {
            observer.unobserve(cardRef.current);
          }
        }
      },
      { threshold: 0.5 } // 50% of the post must be visible
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [isPromoted, postId, postType]);

  const handleTrackClick = () => {
    if (isPromoted && postId) {
      boostService.trackBoostMetrics({
        postId,
        postType,
        action: 'click'
      });
    }
  };

  return (
    <Card
      ref={cardRef}
      variant="card"
      padding="p-0"
      onClick={handleTrackClick}
      className={
        "w-full overflow-hidden transition-all duration-300 !border-0 " +
        boostStyles.borderClass
      }
      style={boostStyles.glowStyle}
    >
      {/* Post Image */}
      {showImage && (
        <div className="relative w-full bg-black/20 flex justify-center items-center min-h-[200px] max-h-[500px] overflow-hidden">
          <img
            src={image}
            alt="post"
            className={`w-full h-auto max-h-[500px] ${imageStyle === "cover" ? "h-full object-cover" : "object-contain"}`}
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
          <div
            className="flex items-center gap-3 cursor-pointer group hover:opacity-80 transition-opacity"
            onClick={handleAuthorClick}
          >
            <img
              src={
                authorAvatar &&
                !authorAvatar.includes("placehold") &&
                !authorAvatar.includes("dicebear")
                  ? authorAvatar
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(displayAuthor)}&background=2666F1&color=fff`
              }
              alt={displayAuthor}
              className="w-10 h-10 rounded-full border border-white/20 object-cover"
            />
            <div>
              <p className="text-body-small-bold sm:text-body-medium-bold text-[#E2E8F0]">
                {displayAuthor}
              </p>
              <p className="text-[11px] sm:text-body-extra-small text-[#94A3B8]">
                {time}
              </p>
            </div>
          </div>

          {isPromoted &&
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
            })()}
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
            <p className="inline whitespace-pre-wrap">
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
        <div
          className={`grid ${isManagementMode ? "grid-cols-2" : "grid-cols-4"} text-[#94A3B8] text-xs sm:text-body-small`}
        >
          {isManagementMode ? (
            <>
              {/* Boost / Analytics */}
              {isPromoted && boostMeta?.analyticsAccess ? (
                <button
                  onClick={() => {
                    if (boostMeta?.purchaseId) {
                      reportNavigate(`/boost-analytics/${boostMeta.purchaseId}`);
                    }
                  }}
                  disabled={!boostMeta?.purchaseId}
                  title={!boostMeta?.purchaseId ? 'Analytics not available yet' : 'View Analytics'}
                  className={`flex flex-col items-center justify-center gap-0.5 py-2 rounded-lg transition-colors group ${
                    boostMeta?.purchaseId
                      ? 'hover:bg-white/5 hover:text-primary-blue'
                      : 'opacity-40 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <BarChart2
                      size={20}
                      className="group-hover:text-primary-blue"
                      strokeWidth={1.8}
                    />
                  </div>
                  <span className="text-[11px]">Analytics</span>
                </button>
              ) : (
                <button
                  onClick={() =>
                    !isPromoted &&
                    reportNavigate("/business/boost-post", {
                      state: { postId: postId, postType: postType },
                    })
                  }
                  disabled={isPromoted}
                  className={`flex flex-col items-center justify-center gap-0.5 py-2 rounded-lg transition-colors group ${
                    isPromoted
                      ? "opacity-40 cursor-not-allowed"
                      : "hover:bg-white/5 hover:text-[#FBBF24]"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Zap
                      size={20}
                      className={
                        !isPromoted ? "group-hover:fill-[#FBBF24]/20" : ""
                      }
                      strokeWidth={1.8}
                    />
                  </div>
                  <span className="text-[11px]">
                    {isPromoted ? "Active Boost" : "Boost"}
                  </span>
                </button>
              )}

              {/* Delete */}
              <button
                onClick={handleDelete}
                className="flex flex-col items-center justify-center gap-0.5 py-2 hover:bg-white/5 rounded-lg transition-colors group hover:text-state-error"
              >
                <div className="flex items-center gap-1.5">
                  <Trash2
                    size={20}
                    className="group-hover:fill-state-error/10"
                    strokeWidth={1.8}
                  />
                </div>
                <span className="text-[11px]">Delete</span>
              </button>
            </>
          ) : (
            <>
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
                <span className="text-[11px]">
                  {isSaved ? "Saved" : "Save"}
                </span>
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
                <div className="flex items-center gap-1.5">
                  <img
                    src="/icon_report_marketplace.svg"
                    alt="Report"
                    className="w-5 h-5 opacity-70 group-hover:opacity-100"
                  />
                </div>
                <span className="text-[11px]">Report</span>
              </button>
            </>
          )}
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
    </Card>
  );
};

export default PostCard;
