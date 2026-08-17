import React from 'react';
import Card from '../../components/common/Card';

const ProfileSkeleton = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg animate-pulse">
        <Card variant="card" padding="p-0">
            <div className="p-lg">
                <div className="flex flex-col items-center text-center mb-lg">
                    <div className="w-20 h-20 rounded-full bg-white/10 mb-md" />
                    <div className="h-6 bg-white/10 rounded w-40 mb-sm" />
                    <div className="h-4 bg-white/5 rounded w-32" />
                </div>
                <div className="border-t border-white/10 space-y-0">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="flex items-center justify-between py-md border-b border-white/5">
                            <div className="h-4 bg-white/10 rounded w-20" />
                            <div className="h-4 bg-white/10 rounded w-32" />
                        </div>
                    ))}
                </div>
                <div className="mt-lg rounded-2xl bg-white/5 border border-white/10 p-lg">
                    <div className="h-5 bg-white/10 rounded w-36 mb-md" />
                    <div className="space-y-md">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center gap-md">
                                <div className="w-4 h-4 bg-white/10 rounded" />
                                <div className="h-4 bg-white/5 rounded w-48" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Card>
        <Card variant="card" padding="p-0">
            <div className="p-lg space-y-lg">
                <div className="flex items-start justify-between">
                    <div className="h-6 bg-white/10 rounded w-40" />
                    <div className="h-6 bg-white/10 rounded-lg w-24" />
                </div>
                <div className="h-4 bg-white/5 rounded w-56" />
                <div className="grid grid-cols-2 gap-lg">
                    <div className="space-y-2"><div className="h-3 bg-white/5 rounded w-24" /><div className="h-4 bg-white/10 rounded w-full" /></div>
                    <div className="space-y-2"><div className="h-3 bg-white/5 rounded w-20" /><div className="h-4 bg-white/10 rounded w-32" /></div>
                </div>
                <div className="border-t border-white/10 pt-lg">
                    <div className="h-5 bg-white/10 rounded w-28 mb-md" />
                    <div className="h-20 bg-white/5 rounded-xl" />
                </div>
                <div className="h-12 bg-white/10 rounded-2xl" />
            </div>
        </Card>
    </div>
);

export default ProfileSkeleton;
