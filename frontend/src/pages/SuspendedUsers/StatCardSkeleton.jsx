import Card from "../../components/common/Card";

const StatCardSkeleton = () => (
  <Card variant="container" className="h-auto animate-pulse">
    <div className="flex items-start justify-between mb-sm">
      <div className="h-4 bg-white/10 rounded w-28" />
      <div className="h-5 bg-white/10 rounded-lg w-14" />
    </div>
    <div className="flex items-end gap-sm">
      <div className="h-8 bg-white/10 rounded w-12" />
      <div className="h-4 bg-white/5 rounded w-8" />
    </div>
  </Card>
);

export default StatCardSkeleton;
