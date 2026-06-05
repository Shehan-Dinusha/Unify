import { useState } from "react";
import {
  ThumbsUp,
  ThumbsDown,
  CornerDownRight,
  Heart,
} from "lucide-react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import StarRating from "../../components/common/StarRating";
import Avatar from "../../components/common/Avatar";

const ReceivedReviewCard = ({ review, onReply, onLike }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isPostingReply, setIsPostingReply] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isLikedLocally, setIsLikedLocally] = useState(review.isLikedByOwner);

  const hasOwnerReplied = review.hasOwnerReplied;
  const ownerReplyData = review.ownerReply;

  const handleEditReply = () => {
    setReplyText(ownerReplyData ? ownerReplyData.content : "");
    setIsReplying(true);
  };

  const handlePostReply = async () => {
    if (!replyText.trim() || isPostingReply) return;
    setIsPostingReply(true);
    try {
      await onReply(review.id, replyText);
      setIsReplying(false);
    } finally {
      setIsPostingReply(false);
    }
  };

  const handleToggleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      const result = await onLike(review.id);
      if (result) {
        setIsLikedLocally(result.isLikedByOwner);
      }
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <Card variant="container" className="w-full relative">
      <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-2 sm:gap-0">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Avatar
            className="w-10 h-10 rounded-full object-cover shadow-[0px_0px_0px_1px_rgba(40,46,57,1.00)] shrink-0"
            src={review.author.avatar}
            alt={review.author.name}
          />
          <div className="flex flex-col flex-1 sm:flex-none overflow-hidden">
            <span className="text-white text-base font-bold font-inter leading-5 truncate">
              {review.author.name}
            </span>
            <span className="text-slate-400 text-xs font-normal font-inter leading-5 mt-0.5 truncate">
              {review.author.role} &bull; {review.createdAt}
            </span>
          </div>
        </div>
        <div className="flex items-start shrink-0">
          <StarRating rating={review.rating} />
        </div>
      </div>

      <div className="flex flex-col gap-3 mb-6">
        <p className="text-slate-200 text-sm font-normal font-inter leading-5 whitespace-pre-line">
          {review.content}
        </p>
      </div>

      {hasOwnerReplied && ownerReplyData && !isReplying && (
        <div className="pl-4 pb-4 w-full">
          <div className="p-4 bg-gray-800 rounded-lg border-l-2 border-blue-500 flex flex-col gap-2">
            <div className="flex justify-between items-center h-6">
              <div className="flex items-center gap-2">
                <span className="text-white text-xs font-bold font-inter leading-5">You</span>
                <span className="px-1.5 py-0.5 bg-blue-600/10 text-blue-600 text-xs font-bold font-inter rounded leading-none">
                  Owner
                </span>
              </div>
              <span className="text-gray-400 text-xs font-normal font-inter leading-5">
                {ownerReplyData.createdAt}
              </span>
            </div>
            <p className="text-neutral-100 text-sm font-normal font-inter leading-5 whitespace-pre-line">
              {ownerReplyData.content}
            </p>
          </div>
        </div>
      )}

      {isReplying && (
        <div className="pl-0 sm:pl-2 pb-4 w-full">
          <div className="p-3 bg-gray-800 rounded-lg outline outline-1 outline-gray-700 flex flex-col gap-2">
            <textarea
              className="w-full h-24 sm:h-32 px-2 sm:px-3 py-2 bg-transparent outline-none text-gray-400 text-sm font-lexend leading-5 resize-none placeholder:text-gray-500"
              placeholder="Type your reply here..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mt-2">
              <span className="text-gray-400 text-xs font-normal font-lexend leading-4">
                Replying as {review.businessName || "Business"}
              </span>
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <Button
                  variant="ghost-hoverless"
                  className="!p-0 !h-auto px-3 py-1.5 text-slate-400 text-sm font-medium font-lexend hover:text-white transition-colors"
                  onClick={() => setIsReplying(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="small"
                  variant="primary"
                  className="h-7 w-24 flex justify-center text-xs"
                  onClick={handlePostReply}
                  disabled={!replyText.trim() || isPostingReply}
                >
                  {isPostingReply ? "Posting..." : "Post Reply"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="pt-4 border-t border-blue-500/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-0 overflow-hidden w-full sm:w-auto">
          <div className="flex items-center gap-2 text-gray-400">
            <ThumbsUp className="w-4 h-4" />
            <span className="text-sm font-medium font-inter">
              Helpful {review.helpfulCount > 0 && `(${review.helpfulCount})`}
            </span>
            <ThumbsDown className="w-4 h-4 text-gray-400 shrink-0 ml-2" />
            <span className="text-sm font-medium font-inter">
              {review.notHelpfulCount > 0 && `(${review.notHelpfulCount})`}
            </span>
          </div>

          <div className="hidden sm:block h-5 w-px bg-gray-800 mx-1 shrink-0" />

          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            {hasOwnerReplied ? (
              <Button
                variant="ghost-hoverless"
                className="!p-0 !h-auto flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                onClick={handleEditReply}
              >
                <span className="text-sm font-bold font-inter">Edit Reply</span>
              </Button>
            ) : (
              <Button
                variant="ghost-hoverless"
                className="!p-0 !h-auto flex items-center gap-2 text-blue-500 hover:text-blue-400 transition-colors"
                onClick={() => setIsReplying(!isReplying)}
              >
                <CornerDownRight className="w-4 h-4" />
                <span className="text-sm font-bold font-inter">Reply</span>
              </Button>
            )}

            <div className="h-5 w-px bg-gray-800 mx-0 sm:mx-1 shrink-0" />

            <Button
              variant="ghost-hoverless"
              className="!p-0 !h-auto flex items-center gap-1.5 transition-colors group"
              onClick={handleToggleLike}
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  isLikedLocally
                    ? "fill-red-500 text-red-500"
                    : "text-gray-400 group-hover:text-red-400"
                }`}
              />
              <span
                className={`text-sm font-medium font-inter transition-colors ${
                  isLikedLocally ? "text-red-500" : "text-gray-400 group-hover:text-red-400"
                }`}
              >
                {isLikedLocally ? "Liked by Owner" : "Like"}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ReceivedReviewCard;
