import { useNavigate } from "react-router-dom";
import { Trash2, ThumbsUp, ThumbsDown, Heart } from "lucide-react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Avatar from "../../components/common/Avatar";
import StarRating from "../../components/common/StarRating";

const ReviewHistoryCard = ({ review, onDelete }) => {
  const navigate = useNavigate();

  return (
    <Card variant="container" className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
        <div onClick={() => navigate(`/profile/${review.targetId}`)} className="flex items-center gap-3 cursor-pointer">
          <img className="w-10 h-10 rounded-full object-cover" src={review.targetAvatar} alt={review.targetName} />
          <div className="flex flex-col">
            <span className="text-white text-sm font-bold font-inter leading-5">{review.targetName}</span>
            <span className="text-zinc-400 text-xs font-normal font-inter leading-5">{review.category} &bull; {review.createdAt}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StarRating rating={review.rating} />
        </div>
      </div>

      <p className="text-neutral-100 text-sm font-normal font-inter leading-5 mb-6 whitespace-pre-line">
        {review.content}
      </p>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <ThumbsUp className="w-4 h-4 stroke-[2.5] text-zinc-400" />
            <span className="text-xs font-bold font-inter leading-5 text-zinc-400">
              Helpful {review.helpfulCount > 0 && `(${review.helpfulCount})`}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <ThumbsDown className="w-4 h-4 stroke-[2.5] text-zinc-400" />
            <span className="text-xs font-bold font-inter leading-5 text-zinc-400">
              Not Helpful {review.notHelpfulCount > 0 && `(${review.notHelpfulCount})`}
            </span>
          </div>
        </div>

        {review.isLikedByOwner && (
          <div className="flex items-center gap-1.5 bg-red-500/10 px-2 py-1 rounded-full border border-red-500/20">
            <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
            <span className="text-[10px] font-bold font-inter text-red-500 uppercase tracking-wide">Liked by Owner</span>
          </div>
        )}
      </div>

      {review.ownerReply && (
        <div className="mb-6 pt-4 flex gap-3">
          <Avatar src={review.ownerReply.author?.avatar} alt={review.ownerReply.author?.name} className="w-9 h-9 rounded-full object-cover shrink-0" />
          <div className="flex-1 bg-gray-800 rounded-tr-lg rounded-bl-lg rounded-br-lg p-3 outline outline-1 outline-gray-800 flex flex-col gap-1">
            <div className="flex justify-between items-center h-6">
              <div className="flex items-center gap-2">
                <span className="text-white text-xs font-bold font-inter leading-5">{review.ownerReply.author.name}</span>
                <span className="px-1.5 py-0.5 bg-blue-600/10 text-blue-600 text-xs font-bold font-inter rounded leading-none">Owner</span>
              </div>
              <span className="text-gray-400 text-xs font-normal font-inter leading-5">{review.ownerReply.createdAt}</span>
            </div>
            <p className="text-slate-300 text-sm font-normal font-inter leading-5">{review.ownerReply.content}</p>
          </div>
        </div>
      )}

      <div className="pt-4 border-t border-blue-500/20 flex justify-start items-center">
        <Button
          variant="ghost-hoverless"
          className="w-full sm:w-36 h-12 bg-red-400/5 hover:bg-red-400/10 transition-colors rounded-2xl outline outline-2 outline-offset-[-2px] outline-red-400 flex justify-center items-center gap-2 overflow-hidden !p-0 hover:opacity-100"
          onClick={() => onDelete(review.id)}
        >
          <Trash2 className="w-4 h-4 text-red-400" />
          <span className="text-red-400 text-sm font-bold font-inter leading-5">Delete Review</span>
        </Button>
      </div>
    </Card>
  );
};

export default ReviewHistoryCard;
