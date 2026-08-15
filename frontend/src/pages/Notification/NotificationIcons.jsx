import React from "react";
import {
  CornerUpLeft,
  Heart,
  Search,
  ShieldCheck,
  BookOpen,
  Star,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  UserPlus,
  PackageCheck,
  PackageSearch,
  AlertTriangle,
  Ban,
  Info,
} from "lucide-react";

export const WarningIcon = () => (
  <div className="w-10 h-10 shrink-0 rounded-full bg-yellow-500/10 flex items-center justify-center">
    <AlertTriangle size={18} className="text-yellow-500" />
  </div>
);

export const SuspensionIcon = () => (
  <div className="w-10 h-10 shrink-0 rounded-full bg-state-error/10 flex items-center justify-center">
    <Ban size={18} className="text-state-error" />
  </div>
);

export const AdminIcon = () => (
  <div className="w-10 h-10 shrink-0 rounded-full bg-primary-blue/10 flex items-center justify-center">
    <Info size={18} className="text-primary-blue" />
  </div>
);
export const ReplyAvatar = ({ avatar }) => (
  <div className="relative w-10 h-10 shrink-0">
    <img
      src={avatar}
      alt="Reply"
      className="w-full h-full rounded-full object-cover"
    />
    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary-blue rounded-full border-2 border-dark-1 flex items-center justify-center">
      <CornerUpLeft size={10} className="text-white" />
    </div>
  </div>
);

export const LikeAvatar = ({ avatar }) => (
  <div className="relative w-10 h-10 shrink-0">
    <img
      src={avatar}
      alt="Like"
      className="w-full h-full rounded-full object-cover"
    />
    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-state-error rounded-full border-2 border-dark-1 flex items-center justify-center">
      <Heart size={10} className="text-white" fill="currentColor" />
    </div>
  </div>
);

export const MatchIcon = () => (
  <div className="w-10 h-10 shrink-0 rounded-full bg-[#2D2A4A] flex items-center justify-center">
    <Search size={18} className="text-[#A78BFA]" />
  </div>
);

export const VerificationIcon = () => (
  <div className="w-10 h-10 shrink-0 rounded-full bg-[#162743] flex items-center justify-center">
    <ShieldCheck size={18} className="text-primary-blue" />
  </div>
);

export const SemesterIcon = () => (
  <div className="w-10 h-10 shrink-0 rounded-full bg-[#162743] flex items-center justify-center">
    <BookOpen size={18} className="text-primary-blue" />
  </div>
);

export const OrderIcon = () => (
  <div className="w-10 h-10 shrink-0 rounded-full bg-state-success/10 flex items-center justify-center">
    <PackageCheck size={18} className="text-state-success" />
  </div>
);

export const ReviewStarAvatar = ({ avatar }) => (
  <div className="relative w-10 h-10 shrink-0">
    <img
      src={avatar}
      alt="Review"
      className="w-full h-full rounded-full object-cover"
    />
    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full border-2 border-dark-1 flex items-center justify-center">
      <Star size={10} className="text-white" fill="currentColor" />
    </div>
  </div>
);

export const ReviewReplyAvatar = ({ avatar }) => (
  <div className="relative w-10 h-10 shrink-0">
    <img
      src={avatar}
      alt="Review reply"
      className="w-full h-full rounded-full object-cover"
    />
    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary-blue rounded-full border-2 border-dark-1 flex items-center justify-center">
      <MessageSquare size={10} className="text-white" />
    </div>
  </div>
);

export const FollowerAvatar = ({ avatar }) => (
  <div className="relative w-10 h-10 shrink-0">
    <img
      src={avatar}
      alt="Follower"
      className="w-full h-full rounded-full object-cover"
    />
    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-dark-1 flex items-center justify-center">
      <UserPlus size={10} className="text-white" />
    </div>
  </div>
);

export const ReviewFeedbackAvatar = ({ avatar }) => (
  <div className="relative w-10 h-10 shrink-0">
    <img
      src={avatar}
      alt="Feedback"
      className="w-full h-full rounded-full object-cover"
    />
    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#2D2A4A] rounded-full border-2 border-dark-1 flex items-center justify-center">
      <ThumbsUp size={10} className="text-[#A78BFA]" />
    </div>
  </div>
);

export const ReviewFeedbackNotHelpfulAvatar = ({ avatar }) => (
  <div className="relative w-10 h-10 shrink-0">
    <img
      src={avatar}
      alt="Not helpful"
      className="w-full h-full rounded-full object-cover"
    />
    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-state-error rounded-full border-2 border-dark-1 flex items-center justify-center">
      <ThumbsDown size={10} className="text-white" />
    </div>
  </div>
);

export const ClaimAvatar = ({ avatar }) => (
  <div className="relative w-10 h-10 shrink-0">
    <img
      src={avatar}
      alt="Claim"
      className="w-full h-full rounded-full object-cover"
    />
    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#2D2A4A] rounded-full border-2 border-dark-1 flex items-center justify-center">
      <PackageSearch size={10} className="text-[#A78BFA]" />
    </div>
  </div>
);
