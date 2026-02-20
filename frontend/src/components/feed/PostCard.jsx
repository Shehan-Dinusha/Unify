import React from "react";
import { Heart, MessageSquare, Bookmark, Flag, MapPin } from "lucide-react";

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
          <button className="flex items-center justify-center gap-2 py-2 hover:bg-white/5 rounded-lg transition-colors group">
            <Heart size={18} className="group-hover:text-primary-blue transition-colors" />
            <span>{likes}</span>
            <span className="hidden sm:inline ml-1">Like</span>
          </button>

          {/* Comments */}
          <button className="flex items-center justify-center gap-2 py-2 hover:bg-white/5 rounded-lg transition-colors group">
            <MessageSquare size={18} className="group-hover:text-primary-blue transition-colors" />
            <span>{comments}</span>
            <span className="hidden sm:inline ml-1">Comments</span>
          </button>

          {/* Save */}
          <button className="flex items-center justify-center gap-2 py-2 hover:bg-white/5 rounded-lg transition-colors group">
            <Bookmark size={18} className="group-hover:text-primary-blue transition-colors" />
            <span className="hidden sm:inline">Save</span>
          </button>

          {/* Report */}
          <button className="flex items-center justify-center gap-2 py-2 hover:bg-white/5 rounded-lg transition-colors group hover:text-state-error">
            <Flag size={18} className="group-hover:text-state-error transition-colors" />
            <span className="hidden sm:inline">Report</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default PostCard;
