import React from "react";
import MainLayout from "../../components/layout/MainLayout";
import ProfileHeader from "../../components/profile/ProfileHeader";
import AccountSettingsSection from "../../components/profile/AccountSettingsSection";
import StudentOwnerView from "../../components/profile/owner/StudentOwnerView";
import BoardingOwnerOwnerView from "../../components/profile/owner/BoardingOwnerOwnerView";
import ClubOwnerView from "../../components/profile/owner/ClubOwnerView";
import FoodCafeOwnerView from "../../components/profile/owner/FoodCafeOwnerView";
import SelfEmployedOwnerView from "../../components/profile/owner/SelfEmployedOwnerView";
import DeleteAccountModal from "../../components/profile/modals/DeleteAccountModal";
import SwitchAccountModal from "../../components/profile/modals/SwitchAccountModal";
import Button from "../../components/common/Button";
import { Loader2 } from "lucide-react";
import { useOwnProfile } from "./useOwnProfile";

// ------------------------------------------------------------------
// Role-based owner view switcher
// ------------------------------------------------------------------
const OwnerViewSwitch = ({
  profile,
  verificationStatus,
  verificationReason,
  repStatus,
  repReason,
}) => {
  const role = profile?.role || "student";
  switch (role) {
    case "boarding_owner":
      return <BoardingOwnerOwnerView profile={profile} />;
    case "club_society":
      return (
        <ClubOwnerView
          profile={profile}
          verificationStatus={verificationStatus}
          verificationReason={verificationReason}
        />
      );
    case "food_cafe":
      return <FoodCafeOwnerView profile={profile} />;
    case "self_employed":
      return <SelfEmployedOwnerView profile={profile} />;
    case "student":
    default:
      return (
        <StudentOwnerView
          profile={profile}
          repStatus={repStatus}
          repReason={repReason}
        />
      );
  }
};

// ------------------------------------------------------------------
// Page component
// ------------------------------------------------------------------
const OwnProfilePage = () => {
  const {
    navigate, user, loading, profile, activeRole,
    verificationStatus, verificationReason, repStatus, repReason,
    deleteOpen, switchOpen, savedAccounts, serverLinkedAccounts, activeUserId, isUnverifiedClub, getPageTitle,
    handleEditProfile, handleSecurity, handleSwitchAccount, handleDeleteAccount, closeModal, handleConfirmDelete,
    handleSelectSwitchAccount, handleAddAccount, handleRemoveAccount, handleUnlinkAccount, fetchProfile,
  } = useOwnProfile();

  if (loading) {
    return (
      <MainLayout user={{ name: "Loading...", role: "student", displayRole: "Loading..." }} pageTitle="Profile" verificationCount={0}>
        <div className="w-full h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary-blue animate-spin" />
        </div>
      </MainLayout>
    );
  }

  if (!profile) {
    return (
      <MainLayout user={{ name: "Error", role: "student", displayRole: "Error" }} pageTitle="Profile" verificationCount={0}>
        <div className="w-full h-[60vh] flex flex-col items-center justify-center gap-4">
          <p className="text-text-secondary">Failed to load profile data.</p>
          <Button onClick={() => fetchProfile()}>Retry</Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      user={user}
      pageTitle={getPageTitle()}
      verificationCount={0}
      sidebarDisabled={isUnverifiedClub}
    >
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[280px_1fr] gap-4 md:gap-x-lg md:gap-y-md text-start px-1 md:px-0">
        <ProfileHeader profile={profile} className="h-full" />

        <OwnerViewSwitch
          profile={profile}
          verificationStatus={verificationStatus}
          verificationReason={verificationReason}
          repStatus={repStatus}
          repReason={repReason}
        />

        <div className="md:col-span-2 flex flex-col gap-4 md:gap-lg">
          <AccountSettingsSection
            onEditProfile={handleEditProfile}
            onSecurity={handleSecurity}
            onSwitchAccount={handleSwitchAccount}
            onDeleteAccount={handleDeleteAccount}
            disabled={false}
          />
        </div>
      </div>

      {switchOpen && (
        <SwitchAccountModal
          savedAccounts={savedAccounts}
          serverLinkedAccounts={serverLinkedAccounts}
          activeUserId={activeUserId}
          onClose={closeModal}
          onSelectAccount={handleSelectSwitchAccount}
          onAddAccount={handleAddAccount}
          onRemoveAccount={handleRemoveAccount}
          onUnlinkAccount={handleUnlinkAccount}
        />
      )}

      {deleteOpen && (
        <DeleteAccountModal
          onClose={closeModal}
          onConfirm={handleConfirmDelete}
        />
      )}
    </MainLayout>
  );
};

export default OwnProfilePage;
