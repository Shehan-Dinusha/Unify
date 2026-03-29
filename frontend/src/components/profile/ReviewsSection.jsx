import React from "react";
import Card from "../common/Card";
import Button from "../common/Button";
import { Star } from "lucide-react";

/**
 * ReviewsSection — shows rating and Add Review button for public views.
 * Props:
 *  rating: number (0-5)
 *  reviewCount: number
 *  onAddReview: function
 */
const ReviewsSection = ({ rating = 0, reviewCount = 0, onAddReview }) => {
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);

  return (
    <Card variant="container" padding="p-lg">
      <div className="flex items-center justify-between flex-wrap gap-md">
        {/* Rating */}
        <div className="flex flex-col gap-xs">
          <h3 className="text-body-large-bold text-text-primary">Rating</h3>
          <div className="flex items-center gap-sm">
            <div className="flex items-center gap-xs">
              {stars.map((s) => (
                <Star
                  key={s}
                  size={18}
                  className={
                    s <= Math.round(rating)
                      ? "text-state-warning fill-state-warning"
                      : "text-text-tertiary"
                  }
                />
              ))}
            </div>
            <span className="text-body-medium-bold text-text-primary">
              {rating.toFixed(1)}
            </span>
            <span className="text-body-extra-small text-text-secondary">
              ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
            </span>
          </div>
        </div>

        {/* CTA */}
        {onAddReview && (
          <Button variant="outline" size="small" onClick={onAddReview}>
            + Add Review
          </Button>
        )}
      </div>
    </Card>
  );
};

export default ReviewsSection;
