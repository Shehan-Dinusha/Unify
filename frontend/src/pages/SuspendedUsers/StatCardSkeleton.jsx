import SkeletonBlock from "../../components/common/skeletons/SkeletonBlock";
import SkeletonCard from "../../components/common/skeletons/SkeletonCard";

const StatCardSkeleton = () => (
  <SkeletonCard variant="container" className="h-auto">
    <div className="flex items-start justify-between mb-sm">
      <SkeletonBlock height="h-4" width="w-28" />
      <SkeletonBlock height="h-5" width="w-14" rounded="rounded-lg" />
    </div>
    <div className="flex items-end gap-sm">
      <SkeletonBlock height="h-8" width="w-12" />
      <SkeletonBlock height="h-4" width="w-8" className="bg-white/5" />
    </div>
  </SkeletonCard>
);

export default StatCardSkeleton;
