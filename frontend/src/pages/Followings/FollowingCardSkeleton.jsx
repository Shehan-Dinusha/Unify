import SkeletonBlock from "../../components/common/skeletons/SkeletonBlock";
import SkeletonCircle from "../../components/common/skeletons/SkeletonCircle";

const FollowingCardSkeleton = () => (
  <div className="w-full min-h-24 md:h-24 p-4 bg-white/5 rounded-2xl border border-white/20 flex flex-row items-center justify-between gap-4 animate-pulse">
    <div className="flex items-center gap-4 flex-1 overflow-hidden">
      <SkeletonCircle size="w-12 h-12 md:w-16 md:h-16" />
      <div className="flex flex-col gap-2 flex-1">
        <SkeletonBlock height="h-4" width="w-32" />
        <SkeletonBlock height="h-3" width="w-48" className="hidden md:block" />
      </div>
    </div>
    <div className="flex items-center gap-3 shrink-0">
      <SkeletonCircle size="w-10 h-10" />
      <SkeletonBlock height="h-9" width="w-24" rounded="rounded-2xl" className="hidden md:block" />
    </div>
  </div>
);

export default FollowingCardSkeleton;
