import SkeletonBlock from '../../components/common/skeletons/SkeletonBlock';
import SkeletonCircle from '../../components/common/skeletons/SkeletonCircle';
import SkeletonCard from '../../components/common/skeletons/SkeletonCard';

const ProfileSkeleton = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg animate-pulse">
        <SkeletonCard variant="card" padding="p-0">
            <div className="p-lg">
                <div className="flex flex-col items-center text-center mb-lg">
                    <SkeletonCircle size="w-20 h-20" className="mb-md" />
                    <SkeletonBlock height="h-6" width="w-40" className="mb-sm" />
                    <SkeletonBlock height="h-4" width="w-32" className="bg-white/5" />
                </div>
                <div className="border-t border-white/10 space-y-0">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="flex items-center justify-between py-md border-b border-white/5">
                            <SkeletonBlock height="h-4" width="w-20" />
                            <SkeletonBlock height="h-4" width="w-32" />
                        </div>
                    ))}
                </div>
                <div className="mt-lg rounded-2xl bg-white/5 border border-white/10 p-lg">
                    <SkeletonBlock height="h-5" width="w-36" className="mb-md" />
                    <div className="space-y-md">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center gap-md">
                                <SkeletonBlock height="h-4" width="w-4" rounded="rounded" />
                                <SkeletonBlock height="h-4" width="w-48" className="bg-white/5" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </SkeletonCard>
        <SkeletonCard variant="card" padding="p-0">
            <div className="p-lg space-y-lg">
                <div className="flex items-start justify-between">
                    <SkeletonBlock height="h-6" width="w-40" />
                    <SkeletonBlock height="h-6" width="w-24" rounded="rounded-lg" />
                </div>
                <SkeletonBlock height="h-4" width="w-56" className="bg-white/5" />
                <div className="grid grid-cols-2 gap-lg">
                    <div className="space-y-2">
                        <SkeletonBlock height="h-3" width="w-24" className="bg-white/5" />
                        <SkeletonBlock height="h-4" width="w-full" />
                    </div>
                    <div className="space-y-2">
                        <SkeletonBlock height="h-3" width="w-20" className="bg-white/5" />
                        <SkeletonBlock height="h-4" width="w-32" />
                    </div>
                </div>
                <div className="border-t border-white/10 pt-lg">
                    <SkeletonBlock height="h-5" width="w-28" className="mb-md" />
                    <SkeletonBlock height="h-20" width="w-full" className="bg-white/5" rounded="rounded-xl" />
                </div>
                <SkeletonBlock height="h-12" width="w-full" rounded="rounded-2xl" />
            </div>
        </SkeletonCard>
    </div>
);

export default ProfileSkeleton;
