import Card from "../../components/common/Card";
import StarRating from "../../components/common/StarRating";

const ReviewSummaryCard = ({ metrics }) => (
  <Card variant="card" className="w-full !p-6 flex flex-col justify-start">
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 sm:gap-12 pt-2 pb-2 px-0 sm:pl-4">
      <div className="flex flex-col gap-1 w-full sm:w-48 shrink-0 items-center sm:items-start text-center sm:text-left">
        <div className="flex items-baseline justify-center sm:justify-start gap-2">
          <span className="text-white text-5xl font-bold font-inter leading-6">
            {metrics.averageRating}
          </span>
          <span className="text-gray-400 text-base font-bold font-inter leading-5">
            out of 5
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <StarRating rating={metrics.averageRating} />
          <div className="text-gray-400 text-sm font-inter mt-1">
            Based on {metrics.totalReviews} reviews
          </div>
        </div>
      </div>

      <div className="flex-1 w-full flex flex-col justify-between pt-1 pb-1 gap-[11px]">
        {metrics.distribution.map((dist) => (
          <div key={dist.stars} className="flex items-center gap-4">
            <span className="text-white text-sm font-medium font-lexend w-3">
              {dist.stars}
            </span>
            <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-amber-400 rounded-full" style={{ width: `${dist.percentage}%` }} />
            </div>
            <span className="text-gray-400 text-sm font-normal font-lexend w-8 text-right">
              {dist.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  </Card>
);

export default ReviewSummaryCard;
