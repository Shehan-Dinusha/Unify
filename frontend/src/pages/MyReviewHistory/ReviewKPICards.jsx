import Card from "../../components/common/Card";

const StarPolygon = () => (
  <div className="w-6 h-7 relative flex justify-center items-center">
    <div
      className="w-5 h-5 bg-amber-400 absolute"
      style={{
        clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
      }}
    />
  </div>
);

const ReviewKPICards = ({ summary }) => (
  <div className="flex flex-col sm:flex-row gap-3 h-auto sm:h-28">
    <Card variant="container" className="flex-1 min-h-[112px] sm:min-h-0 sm:h-full shadow-none flex flex-col justify-center pl-6 sm:pl-0 sm:block relative" padding="p-0">
      <div className="flex flex-col sm:absolute sm:top-[25px] sm:left-[24.5px]">
        <span className="text-gray-400 text-sm font-bold font-inter leading-5 mb-2">Total Reviews</span>
        <span className="text-white text-3xl font-bold font-inter leading-9">{summary.totalReviews}</span>
      </div>
    </Card>

    <Card variant="container" className="flex-1 min-h-[112px] sm:min-h-0 sm:h-full shadow-none flex flex-col justify-center px-6 sm:px-0 sm:block relative" padding="p-0">
      <div className="flex flex-col w-full sm:absolute sm:top-[25px] sm:left-[25px] sm:pr-6">
        <span className="text-gray-400 text-sm font-bold font-inter leading-5 mb-2 whitespace-nowrap overflow-hidden text-ellipsis">Avg Rating Given</span>
        <div className="flex items-center gap-2">
          <span className="text-white text-3xl font-bold font-inter leading-9">{Number(summary.averageRating).toFixed(1)}</span>
          <StarPolygon />
        </div>
      </div>
    </Card>

    <Card variant="container" className="flex-1 min-h-[112px] sm:min-h-0 sm:h-full shadow-none flex flex-col justify-center px-6 sm:px-0 sm:block relative overflow-hidden" padding="p-0">
      <div className="flex flex-col w-full overflow-hidden sm:absolute sm:top-[25px] sm:left-[25px] sm:pr-6">
        <span className="text-gray-400 text-sm font-bold font-inter leading-5 mb-2 whitespace-nowrap overflow-hidden text-ellipsis">Top Category</span>
        <span className="text-blue-500 text-3xl font-bold font-lexend leading-9 truncate w-full">{summary.topCategory}</span>
      </div>
    </Card>
  </div>
);

export default ReviewKPICards;
