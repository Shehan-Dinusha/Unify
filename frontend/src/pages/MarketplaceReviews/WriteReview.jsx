import { useState } from "react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import StarRating from "../../components/common/StarRating";
import { ArrowRightIcon } from "../../components/common/Icons";

const WriteReview = ({ onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  return (
    <Card
      variant="card"
      className="w-full lg:w-[560px] h-auto lg:h-[470px] min-h-[470px] flex flex-col justify-between"
    >
      <div>
        <h3 className="text-white text-xl font-bold font-inter mb-2">
          Write a Review
        </h3>
        <p className="text-gray-400 text-sm font-inter mb-6">
          Share your experience to help other students make better choices.
        </p>

        <div className="mb-6">
          <label className="block text-zinc-400 text-sm font-bold font-inter mb-2">
            Your Rating
          </label>
          <StarRating rating={rating} interactive onRate={setRating} />
        </div>

        <div className="mb-4">
          <label className="block text-zinc-400 text-sm font-bold font-inter mb-2">
            Your Review
          </label>
          <div className="relative">
            <textarea
              className="w-full h-28 bg-gray-800 rounded-lg p-3 text-gray-300 text-base font-inter placeholder-gray-400 outline outline-1 outline-gray-900 focus:outline-primary-blue resize-none pb-8"
              placeholder="What did you like or dislike? How was the service?"
              value={review}
              maxLength={500}
              onChange={(e) => setReview(e.target.value)}
            />
            <div className="absolute bottom-3 left-3 right-3 flex justify-end items-center pointer-events-none">
              <span className="text-gray-400 text-xs font-inter">
                {review.length}/500
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-blue-500/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mt-2">
        <label className="flex items-center gap-2 cursor-pointer group">
          <div className="relative flex items-center justify-center">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="w-4 h-4 rounded appearance-none border border-gray-900 bg-gray-800 checked:bg-primary-blue transition-colors outline-none"
            />
            {isAnonymous && (
              <svg className="w-3 h-3 text-white absolute pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <span className="text-slate-400 text-sm font-inter group-hover:text-slate-300 transition-colors">
            Post anonymously
          </span>
        </label>
        <Button
          className="w-full sm:w-48 shadow-[0_4px_6px_-4px_rgba(43,140,238,0.25),0_10px_15px_-3px_rgba(43,140,238,0.25)] flex justify-center items-center gap-2 disabled:bg-gray-600 disabled:text-gray-400 disabled:shadow-none"
          disabled={rating === 0}
          onClick={() => onSubmit({ rating, review, isAnonymous })}
        >
          <span className="text-white text-base font-bold font-inter">
            Submit Review
          </span>
          <ArrowRightIcon />
        </Button>
      </div>
    </Card>
  );
};

export default WriteReview;
