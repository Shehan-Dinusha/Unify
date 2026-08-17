import SkeletonBlock from "../../components/common/skeletons/SkeletonBlock";
import SkeletonCard from "../../components/common/skeletons/SkeletonCard";

const BoostControllerSkeleton = () => (
  <div className="flex flex-col gap-lg">
    <div className="flex flex-col md:flex-row items-start justify-between gap-md">
      <div className="space-y-2">
        <SkeletonBlock height="h-7" width="w-64" />
        <SkeletonBlock height="h-4" width="w-96" />
      </div>
      <SkeletonBlock height="h-12" width="w-40" rounded="rounded-2xl" />
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
      {[1, 2, 3, 4].map((i) => (
        <SkeletonCard key={i} variant="container" padding="p-md">
          <div className="flex flex-col gap-sm">
            <SkeletonBlock height="h-3" width="w-20" />
            <div className="flex items-end justify-between">
              <SkeletonBlock height="h-6" width="w-16" />
              <SkeletonBlock height="h-3" width="w-10" />
            </div>
          </div>
        </SkeletonCard>
      ))}
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
      {[1, 2, 3].map((i) => (
        <SkeletonCard key={i} variant="card" padding="p-lg">
          <div className="flex flex-col gap-md">
            <div className="flex items-start justify-between">
              <SkeletonBlock height="h-5" width="w-32" />
              <div className="flex gap-1">
                <SkeletonBlock height="h-8" width="w-8" rounded="rounded-lg" />
                <SkeletonBlock height="h-8" width="w-8" rounded="rounded-lg" />
              </div>
            </div>
            <SkeletonBlock height="h-6" width="w-24" />
            <SkeletonBlock height="h-3" width="w-full" />
            <SkeletonBlock height="h-3" width="w-full" />
            <div className="space-y-2 mt-2">
              {[1, 2, 3].map((j) => (
                <div key={j} className="flex items-center gap-2">
                  <SkeletonBlock height="h-4" width="w-4" rounded="rounded-full" />
                  <SkeletonBlock height="h-3" width="w-3/4" />
                </div>
              ))}
            </div>
          </div>
        </SkeletonCard>
      ))}
    </div>
  </div>
);

export default BoostControllerSkeleton;
