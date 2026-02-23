import React, { useState } from "react";
import { Heart, MessageSquare, Bookmark, Flag, MapPin, Send } from "lucide-react";

// Sample existing comments for each post
const sampleComments = [
  {
    id: 1,
    author: "Sarah Miller",
    authorInitial: "SM",
    time: "2h ago",
    text: "That looks delicious! Is it available on the regular menu or is it a special?",
    likes: 0,
    isLiked: false,
  },
  {
    id: 2,
    author: "Mark Thompson",
    authorInitial: "MT",
    time: "4h ago",
    text: "The location is actually super convenient, just a 2-minute walk from the main entrance.",
    likes: 1,
    isLiked: true,
  },
];

const PostCard = ({
  author,
  authorInitial,
  time,
  title,
  location,
  description,
  image,
  likes,
  comments,
  isPromoted
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [showComments, setShowComments] = useState(false);
  const [commentsList, setCommentsList] = useState(
    sampleComments.map(c => ({ ...c }))
  );
  const [newComment, setNewComment] = useState("");
  const [commentCount, setCommentCount] = useState(comments);
  const [isSaved, setIsSaved] = useState(false);

  const toggleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const handleAddComment = () => {
    if (newComment.trim() === "") return;
    const comment = {
      id: Date.now(),
      author: "You",
      authorInitial: "Y",
      time: "Just now",
      text: newComment.trim(),
      likes: 0,
      isLiked: false,
    };
    setCommentsList([comment, ...commentsList]);
    setNewComment("");
    setCommentCount(commentCount + 1);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  const toggleCommentLike = (commentId) => {
    setCommentsList(
      commentsList.map((c) =>
        c.id === commentId
          ? { ...c, isLiked: !c.isLiked, likes: c.isLiked ? c.likes - 1 : c.likes + 1 }
          : c
      )
    );
  };

  // Show only first 2 comments, rest behind "View more"
  const [showAllComments, setShowAllComments] = useState(false);
  const visibleComments = showAllComments ? commentsList : commentsList.slice(0, 2);
  const hiddenCount = commentsList.length - 2;

  return (
    <div className="w-full bg-[#1A2634] rounded-[24px] overflow-hidden border border-white/5 font-inter text-white">
      {/* Post Image */}
      {image && (
        <div className="w-full h-[300px] sm:h-[400px] overflow-hidden">
          <img
            src={image}
            alt="post"
            className="w-full h-full object-cover"
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
            className={`flex items-center justify-center gap-2 py-2 hover:bg-white/5 rounded-lg transition-colors ${isLiked ? 'text-state-info' : ''}`}
          >
            <Heart
              size={18}
              className={`transition-colors ${isLiked ? 'fill-state-info text-state-info' : 'group-hover:text-primary-blue'}`}
            />
            <span>{likeCount}</span>
            <span className="hidden sm:inline ml-1">Like</span>
          </button>

          {/* Comments */}
          <button
            onClick={toggleComments}
            className={`flex items-center justify-center gap-2 py-2 hover:bg-white/5 rounded-lg transition-colors group ${showComments ? 'text-state-info' : ''}`}
          >
            <MessageSquare size={18} className={`transition-colors ${showComments ? 'text-state-info' : 'group-hover:text-primary-blue'}`} />
            <span>{commentCount}</span>
            <span className="hidden sm:inline ml-1">Comments</span>
          </button>

          {/* Save */}
          <button
            onClick={() => setIsSaved(!isSaved)}
            className={`flex items-center justify-center gap-2 py-2 hover:bg-white/5 rounded-lg transition-colors ${isSaved ? 'text-state-info' : ''}`}
          >
            <Bookmark
              size={18}
              className={`transition-colors ${isSaved ? 'fill-state-info text-state-info' : 'group-hover:text-primary-blue'}`}
            />
            <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
          </button>

          {/* Report */}
          <button className="flex items-center justify-center gap-2 py-2 hover:bg-white/5 rounded-lg transition-colors group hover:text-state-error">
            <Flag size={18} className="group-hover:text-state-error transition-colors" />
            <span className="hidden sm:inline">Report</span>
          </button>
        </div>

        {/* Comment Section */}
        {showComments && (
          <div className="flex flex-col gap-4 mt-2 animate-in slide-in-from-top-2">

            {/* Comment Input */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#7551FF] flex items-center justify-center text-white text-body-small-bold shrink-0">
                Y
              </div>
              <div className="flex-1 flex items-center bg-[#0F1923] rounded-full border border-white/10 px-4 py-2.5">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent text-sm text-white placeholder-[#94A3B8] outline-none"
                />
                <button
                  onClick={handleAddComment}
                  className="ml-2 text-state-info hover:text-primary-blue transition-colors"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>

            {/* Comments List */}
            {visibleComments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-[#2A3A4A] flex items-center justify-center text-white text-body-small-bold shrink-0">
                  {comment.authorInitial}
                </div>

                {/* Comment Body */}
                <div className="flex-1 flex flex-col gap-1.5">
                  {/* Comment Bubble */}
                  <div className="bg-[#0F1923] rounded-2xl px-4 py-3 border border-white/5">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-bold text-[#E2E8F0]">{comment.author}</p>
                      <span className="text-[11px] text-[#94A3B8]">{comment.time}</span>
                    </div>
                    <p className="text-sm text-[#94A3B8] leading-relaxed">{comment.text}</p>
                  </div>

                  {/* Comment Actions */}
                  <div className="flex items-center gap-4 px-2">
                    <button
                      onClick={() => toggleCommentLike(comment.id)}
                      className={`text-xs font-semibold transition-colors ${comment.isLiked ? 'text-state-info' : 'text-[#94A3B8] hover:text-state-info'}`}
                    >
                      {comment.isLiked ? 'Liked' : 'Like'}
                    </button>
                    <button className="text-xs font-semibold text-[#94A3B8] hover:text-primary-blue transition-colors">
                      Reply
                    </button>
                    {comment.likes > 0 && (
                      <div className="ml-auto flex items-center gap-1 text-state-info">
                        <Heart size={12} className="fill-state-info" />
                        <span className="text-xs">{comment.likes}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* View More Comments */}
            {!showAllComments && hiddenCount > 0 && (
              <button
                onClick={() => setShowAllComments(true)}
                className="text-sm text-[#94A3B8] hover:text-primary-blue transition-colors text-center py-2"
              >
                View {hiddenCount} more comment{hiddenCount > 1 ? 's' : ''}
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default PostCard;
