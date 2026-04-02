import React, { useState, useRef, useEffect } from "react";
import { useSavedPosts } from "../../context/SavedPostsContext";
import { useNavigate } from "react-router-dom";
import { MapPin, Send, Heart, MessageCircle, Zap ,Bookmark, } from "lucide-react";

/* ─── Comment Section (from ClubPostCard) ───────────────────── */
const CommentSection = ({ postComments, onAddComment }) => {
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
  };

  return (
    <div className="mt-4 border-t border-white/10 pt-4 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
      {/* Existing comments */}
      {postComments.length > 0 && (
        <div className="flex flex-col gap-3 max-h-56 overflow-y-auto pr-1 scrollbar-hide">
          {postComments.map((c) => (
            <div key={c.id} className="flex gap-3 items-start">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(c.seed || c.user)}`}
                alt={c.user}
                className="w-8 h-8 rounded-full border border-white/15 flex-shrink-0 mt-0.5"
              />
              <div className="flex-1 min-w-0 bg-white/5 rounded-xl px-3 py-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[13px] font-semibold text-text-primary">
                    {c.user}
                  </span>
                  <span className="text-[11px] text-text-tertiary">
                    {c.time}
                  </span>
                </div>
                <p className="text-[13px] text-text-secondary leading-relaxed">
                  {c.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <img
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Me"
          alt="You"
          className="w-8 h-8 rounded-full border border-white/15 flex-shrink-0"
        />
        <div className="flex-1 flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2 gap-2 focus-within:border-primary-blue/50 transition-colors">
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a comment…"
            className="flex-1 bg-transparent text-[13px] text-text-primary placeholder:text-text-tertiary outline-none"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className="text-primary-blue disabled:text-text-tertiary transition-colors"
          >
            <Send size={16} strokeWidth={2} />
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
  isPromoted,
  showBoost = false,
}) => {
  const { toggleSavePost, isPostSaved } = useSavedPosts();
  const isSaved = post ? isPostSaved(post.id) : false;
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [showComments, setShowComments] = useState(false);
  const reportNavigate = useNavigate();
  const [postComments, setPostComments] = useState([
    {
      id: 1,
      user: "Sarah Miller",
      seed: "SarahMiller",
      time: "2h ago",
      text: "That looks delicious! Is it available on the regular menu or is it a special?",
    },
    {
      id: 2,
      user: "Mark Thompson",
      seed: "MarkThompson",
      time: "4h ago",
      text: "The location is actually super convenient, just a 2-minute walk from the main entrance.",
    },
  ]);
  const [commentCount, setCommentCount] = useState(comments);

  const toggleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const handleAddComment = (text) => {
    const newComment = {
      id: `new-${Date.now()}`,
      user: "You",
      seed: "Me",
      time: "just now",
      text,
    };
    setPostComments((prev) => [...prev, newComment]);
    setCommentCount(commentCount + 1);
  };

  return (
    <div className="w-full bg-[#1A2634] rounded-[24px] overflow-hidden border border-white/5 font-inter text-white">
      {/* Post Image */}
      {image && (
        <div className="w-full h-[300px] sm:h-[400px] overflow-hidden">
          <img
            src={image}
            alt="post"
            className="w-full h-full object-cover"
            loading="lazy"
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
            <span className="text-[11px] font-bold bg-[#FBBF24]/10 text-[#FBBF24] px-3 py-1 rounded-full">
              Promoted
            </span>
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
        <p className="text-sm sm:text-body-medium text-[#94A3B8] leading-relaxed">
          {description}
        </p>

        {/* Divider */}
        <div className="h-px bg-white/5 w-full my-2" />

        {/* Actions */}
        <div className="grid grid-cols-4 text-[#94A3B8] text-xs sm:text-body-small">
          {/* Like */}
          <button
            onClick={toggleLike}
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
            onClick={toggleComments}
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
            onClick={() => post && toggleSavePost(post)}
            className={`flex flex-col items-center justify-center gap-0.5 py-2 hover:bg-white/5 rounded-lg transition-colors ${isSaved ? 'text-primary-blue' : ''}`}
          >
            <div className="flex items-center gap-1.5">
              <Bookmark size={20} className={isSaved ? "fill-current" : ""} strokeWidth={isSaved ? 0 : 1.8} />
            onClick={() => setIsSaved(!isSaved)}
            className={`flex flex-col items-center justify-center gap-0.5 py-2 hover:bg-white/5 rounded-lg transition-colors ${isSaved ? "text-state-info" : ""}`}
          >
            <div className="flex items-center gap-1.5">
              <img
                src="/icon_save_marketplace.svg"
                alt="Save"
                className={`w-5 h-5 ${isSaved ? "brightness-150" : "opacity-70"}`}
              />
            </div>
            <span className="text-[11px]">{isSaved ? "Saved" : "Save"}</span>
          </button>

          {/* Report */}
          <button
            onClick={() =>
              reportNavigate("/student/report-issue", {
                state: { postData: { author, title }, from: "/news-feed" },
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
          />
        )}
      </div>
    </div>
  );
};

export default PostCard;
