import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { ShieldAlert } from 'lucide-react';
import { getCurrentUser } from '../../services/authService';
import { useSuspendedUserProfile } from './useSuspendedUserProfile';
import ProfileSkeleton from './ProfileSkeleton';
import AccountStatusBanner from './AccountStatusBanner';
import ProfileInfoCard from './ProfileInfoCard';
import SuspensionDetailsCard from './SuspensionDetailsCard';

const SuspendedUserProfile = () => {
    const { navigate, loading, error, user, suspension, id } = useSuspendedUserProfile();

    if (!loading && error) {
        return (
            <MainLayout user={getCurrentUser() || { name: 'Admin', role: 'Admin' }} pageTitle="Suspended Profile" verificationCount={0}>
                <div className="flex flex-col items-center justify-center py-xl text-center">
                    <div className="w-16 h-16 rounded-full bg-state-error/10 flex items-center justify-center mb-lg">
                        <ShieldAlert size={28} className="text-state-error" />
                    </div>
                    <h2 className="text-heading-small text-text-primary font-inter mb-sm">Unable to Load Profile</h2>
                    <p className="text-body-small text-text-secondary font-inter mb-lg max-w-md">{error}</p>
                    <button
                        onClick={() => navigate('/suspended-users')}
                        className="h-11 px-8 rounded-2xl bg-primary-blue text-white font-inter font-bold text-sm hover:brightness-110 active:scale-[0.98] transition-all duration-200"
                    >
                        Back to Suspended Users
                    </button>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout user={getCurrentUser() || { name: 'Admin', role: 'Admin' }} pageTitle="Suspended Profile" verificationCount={0}>
            {loading && <ProfileSkeleton />}

            {!loading && (
                <>
                    <AccountStatusBanner suspension={suspension} user={user} />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
                        <ProfileInfoCard user={user} suspension={suspension} />
                        <SuspensionDetailsCard
                            suspension={suspension}
                            onReactivate={() => navigate(`/suspended-users/${id}/reactivate`)}
                        />
                    </div>
                </>
            )}
        </MainLayout>
    );
};

export default SuspendedUserProfile;
