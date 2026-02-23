import React from "react";
import { Star } from "lucide-react";

const StarRating = ({ rating, interactive = false, onRate = () => {} }) => {
  return (
    <div className="flex gap-1.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = rating >= star;
        const isHalf = !isFilled && rating >= star - 0.5;

        return (
          <button
            key={star}
            type="button"
            onClick={() => {
              if (interactive) {
                // If clicking the current rating, reset to 0
                onRate(rating === star ? 0 : star);
              }
            }}
            className={`${interactive ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default"}`}
            disabled={!interactive}
          >
            {isHalf ? (
              <div className="relative w-5 h-5">
                <Star className="w-5 h-5 text-gray-700 fill-gray-700 absolute" />
                <div className="absolute overflow-hidden w-[50%] h-full top-0 left-0">
                  <Star className="w-5 h-5 text-[#FFC107] fill-[#FFC107]" />
                </div>
              </div>
            ) : (
              <Star
                className={`w-5 h-5 ${isFilled ? "text-[#FFC107] fill-[#FFC107]" : "text-gray-700 fill-gray-700"}`}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
