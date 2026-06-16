import { ThumbsUp, ThumbsDown, Trash2, Heart } from "lucide-react";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import StarRating from "../../components/common/StarRating";
import Avatar from "../../components/common/Avatar";
import useOptimisticFeedback from "../../hooks/useOptimisticFeedback";

const ReviewCard = ({ review, onDelete, onFeedback }) => {
  const { feedback, helpfulCount, notHelpfulCount, isUpdating, handleHelpful, handleNotHelpful } =
    useOptimisticFeedback(review.id, review, onFeedback);

  return (
    <Card
      variant="container"
      className="w-full max-w-[1000px]"
      id={review.isOwn ? "own-review" : undefined}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
        <div className="flex items-center gap-3">
          <Avatar
            src={review.author.avatar}
            alt={review.author.name}
            className="w-10 h-10 rounded-full object-cover shrink-0"
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-white text-sm font-bold font-inter leading-5">
                {review.author.name}
              </span>
              {review.isOwn && (
                <div className="px-2 py-0.5 bg-gray-800 rounded-full inline-flex justify-center items-center">
                  <span className="text-gray-400 text-xs font-normal font-inter leading-5">
                    You
                  </span>
                </div>
              )}
            </div>
            <span className="text-zinc-400 text-xs font-normal font-inter leading-5">
              {review.author.role} • {review.createdAt}
            </span>
          </div>
        </div>
        <StarRating rating={review.rating} />
      </div>

      <p className="text-neutral-100 text-sm font-normal font-inter leading-5 mb-6 whitespace-pre-line">
        {review.content}
      </p>

      {!review.isOwn ? (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-2 sm:mt-0">
          <div className="flex flex-wrap items-center gap-4">
            <Button
              variant="ghost-hoverless"
              className="!p-0 !h-auto flex items-center gap-1.5"
              onClick={handleHelpful}
            >
              <ThumbsUp
                className={`w-4 h-4 stroke-[2.5] transition-colors ${feedback === "helpful" ? "text-primary-blue fill-primary-blue/20" : "text-zinc-400"}`}
              />
              <span
                className={`text-xs font-bold font-inter leading-5 transition-colors ${feedback === "helpful" ? "text-primary-blue" : "text-zinc-400"}`}
              >
                Helpful {helpfulCount > 0 && `(${helpfulCount})`}
              </span>
            </Button>
            <Button
              variant="ghost-hoverless"
              className="!p-0 !h-auto flex items-center gap-1.5"
              onClick={handleNotHelpful}
            >
              <ThumbsDown
                className={`w-4 h-4 stroke-[2.5] transition-colors ${feedback === "not_helpful" ? "text-red-500 fill-red-500/20" : "text-zinc-400"}`}
              />
              <span
                className={`text-xs font-bold font-inter leading-5 transition-colors ${feedback === "not_helpful" ? "text-red-500" : "text-zinc-400"}`}
              >
                Not Helpful {notHelpfulCount > 0 && `(${notHelpfulCount})`}
              </span>
            </Button>
          </div>

          {review.isLikedByOwner && (
            <div className="flex items-center gap-1.5 bg-red-500/10 px-2 py-1 rounded-full border border-red-500/20">
              <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
              <span className="text-[10px] font-bold font-inter text-red-500 uppercase tracking-wide">
                Liked by Owner
              </span>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-2 sm:mt-0">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <ThumbsUp className="w-4 h-4 stroke-[2.5] text-zinc-400" />
                <span className="text-xs font-bold font-inter leading-5 text-zinc-400">
                  Helpful {helpfulCount > 0 && `(${helpfulCount})`}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <ThumbsDown className="w-4 h-4 stroke-[2.5] text-zinc-400" />
                <span className="text-xs font-bold font-inter leading-5 text-zinc-400">
                  Not Helpful {notHelpfulCount > 0 && `(${notHelpfulCount})`}
                </span>
              </div>
            </div>

            {review.isLikedByOwner && (
              <div className="flex items-center gap-1.5 bg-red-500/10 px-2 py-1 rounded-full border border-red-500/20">
                <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                <span className="text-[10px] font-bold font-inter text-red-500 uppercase tracking-wide">
                  Liked by Owner
                </span>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-blue-500/20 flex justify-start items-center mt-4">
            <button
              className="w-full sm:w-36 h-12 bg-red-400/5 hover:bg-red-400/10 transition-colors rounded-2xl outline outline-2 outline-offset-[-2px] outline-red-400 flex justify-center items-center gap-2 overflow-hidden"
              onClick={() => onDelete && onDelete(review.id)}
            >
              <Trash2 className="w-4 h-4 text-red-400" />
              <span className="text-red-400 text-sm font-bold font-inter leading-5">
                Delete Review
              </span>
            </button>
          </div>
        </>
      )}

      {review.ownerReply && (
        <div className="mt-6 pt-4 border-t border-gray-800 flex gap-3">
          <Avatar
            src={review.ownerReply.author?.avatar}
            alt={review.ownerReply.author?.name}
            className="w-9 h-9 rounded-full object-cover shrink-0"
          />
          <div className="flex-1 bg-gray-800 rounded-tr-lg rounded-bl-lg rounded-br-lg p-3 outline outline-1 outline-gray-800 flex flex-col gap-1">
            <div className="flex justify-between items-center h-6">
              <div className="flex items-center gap-2">
                <span className="text-white text-xs font-bold font-inter leading-5">
                  {review.ownerReply.author.name}
                </span>
                <span className="px-1.5 py-0.5 bg-blue-600/10 text-blue-600 text-xs font-bold font-inter rounded leading-none">
                  Owner
                </span>
              </div>
              <span className="text-gray-400 text-xs font-normal font-inter leading-5">
                {review.ownerReply.createdAt}
              </span>
            </div>
            <p className="text-slate-300 text-sm font-normal font-inter leading-5">
              {review.ownerReply.content}
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ReviewCard;
