import React from "react";
import Card from "../common/Card";
import Button from "../common/Button";
import StarRating from "../common/StarRating";

/**
 * ReviewsSection — shows rating and Add Review button for public views.
 * Props:
 *  rating: number (0-5)
 *  reviewCount: number
 *  onAddReview: function
 *  onViewReviews: function
 */
const ReviewsSection = ({ rating = 0, reviewCount = 0, onAddReview, onViewReviews }) => {
  return (
    <Card variant="container" padding="p-4 md:p-lg text-start">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 md:gap-md">
        {/* Rating */}
        <div className="flex flex-col gap-1 md:gap-xs text-start">
          <h3 className="text-base md:text-body-large-bold text-text-primary font-bold">Rating</h3>
          <div className="flex items-center gap-2 md:gap-sm">
            <StarRating rating={rating} />
            <span className="text-sm md:text-body-medium-bold text-text-primary font-bold">
              {rating.toFixed(1)}
            </span>
            <span 
              className="text-[11px] md:text-body-extra-small text-text-secondary transition-colors"
            >
              ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
            </span>
          </div>
        </div>

        {/* CTA */}
        {onAddReview && (
          <Button variant="outline" size="small" onClick={onAddReview} className="w-full sm:w-auto text-[12px] md:text-body-small py-1.5 md:py-2">
            + Add Review
          </Button>
        )}
      </div>
    </Card>
  );
};

export default ReviewsSection;
