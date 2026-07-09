import Card from "../../components/common/Card";
import StarRating from "../../components/common/StarRating";

const RatingSummary = ({ summary }) => {
  return (
    <Card
      variant="card"
      className="w-full lg:w-96 h-auto lg:h-[470px] flex flex-col justify-start"
    >
      <h3 className="text-white text-xl font-bold font-inter mb-6">
        Rating Summary
      </h3>
      <div className="flex items-center gap-4 mb-8">
        <div className="text-white text-[48px] font-bold font-inter leading-[48px]">
          {Number(summary.averageRating).toFixed(1)}
        </div>
        <div className="flex flex-col gap-1">
          <StarRating rating={summary.averageRating} />
          <div className="text-gray-400 text-sm font-inter mt-1">
            Based on {summary.totalReviews} reviews
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {summary.distribution.map((dist) => (
          <div key={dist.stars} className="flex items-center gap-3">
            <div className="w-4 text-gray-400 text-sm font-inter">
              {dist.stars}
            </div>
            <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full"
                style={{ width: `${dist.percentage}%` }}
              />
            </div>
            <div className="w-10 text-right text-gray-400 text-sm font-inter">
              {dist.percentage}%
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RatingSummary;
