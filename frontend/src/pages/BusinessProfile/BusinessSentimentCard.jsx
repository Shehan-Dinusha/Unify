import React from 'react';
import { Star } from 'lucide-react';
import Card from '../../components/common/Card';

const BusinessSentimentCard = ({ sentiment }) => (
  <Card variant="container" className="h-full">
    <div className="flex items-center gap-sm mb-lg">
      <span className="w-8 h-8 rounded-lg bg-state-error/20 flex items-center justify-center"><span className="text-sm">📊</span></span>
      <h3 className="text-body-large-bold text-text-primary font-inter">User Sentiment & Reviews</h3>
    </div>

    <div className="flex flex-col gap-md mb-xl">
      {sentiment.ratings.map((rating) => (
        <div key={rating.stars} className="flex items-center gap-md">
          <span className="text-body-small-bold text-text-primary font-inter w-4 text-right shrink-0">{rating.stars}</span>
          <Star size={14} className="text-state-warning shrink-0" fill="#FBBF24" />
          <div className="flex-1 h-2.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${rating.percentage}%`, backgroundColor: rating.color }} />
          </div>
          <span className="text-body-extra-small text-text-secondary font-inter w-10 text-right shrink-0">{rating.percentage}%</span>
        </div>
      ))}
    </div>

    <div className="border-t border-white/10 pt-lg">
      <p className="text-body-small text-text-secondary font-inter mb-xs">Overall Rating</p>
      <div className="flex items-center gap-sm">
        <span className="text-heading-medium text-text-primary font-inter">{sentiment.overallRating}</span>
        <Star size={22} className="text-state-warning" fill="#FBBF24" />
      </div>
    </div>
  </Card>
);

export default BusinessSentimentCard;
