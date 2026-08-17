import SkeletonBlock from "../../components/common/skeletons/SkeletonBlock";
import SkeletonCircle from "../../components/common/skeletons/SkeletonCircle";

const COLS = "2fr 1.2fr 1fr 1fr";

const SkeletonRow = () => (
  <div className="grid gap-md px-lg py-md items-center border-b border-white/5 animate-pulse" style={{ gridTemplateColumns: COLS }}>
    <div className="flex items-center gap-md">
      <SkeletonCircle size="w-10 h-10" />
      <div className="flex-1 space-y-2">
        <SkeletonBlock height="h-4" width="w-3/4" />
        <SkeletonBlock height="h-3" width="w-1/2" className="bg-white/5" />
      </div>
    </div>
    <div className="space-y-2">
      <SkeletonBlock height="h-4" width="w-2/3" />
      <SkeletonBlock height="h-3" width="w-1/3" className="bg-white/5" />
    </div>
    <div>
      <SkeletonBlock height="h-6" width="w-24" rounded="rounded-lg" />
    </div>
    <div className="flex justify-end">
      <SkeletonBlock height="h-8" width="w-24" rounded="rounded-lg" />
    </div>
  </div>
);

export default SkeletonRow;
