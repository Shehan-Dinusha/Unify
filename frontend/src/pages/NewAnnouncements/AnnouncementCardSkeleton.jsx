import SkeletonBlock from "../../components/common/skeletons/SkeletonBlock";

const AnnouncementCardSkeleton = () => (
  <div className="w-full bg-[#1A2634] rounded-2xl overflow-hidden border border-white/5 flex flex-col md:flex-row h-auto md:h-64 animate-pulse">
    <div className="w-full md:w-[30%] h-48 md:h-full bg-white/5 shrink-0" />
    <div className="p-6 md:p-8 flex flex-col justify-center gap-3 flex-1">
      <SkeletonBlock height="h-6" width="w-3/4" />
      <SkeletonBlock height="h-4" width="w-1/3" />
      <div className="space-y-2 mt-2">
        <SkeletonBlock height="h-3" width="w-full" />
        <SkeletonBlock height="h-3" width="w-full" />
        <SkeletonBlock height="h-3" width="w-2/3" />
      </div>
    </div>
  </div>
);

export default AnnouncementCardSkeleton;
