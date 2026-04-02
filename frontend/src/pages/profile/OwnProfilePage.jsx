import React, { useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
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

// ------------------------------------------------------------------
// MOCK DATA — swap with GET /api/profile when backend is ready
// ------------------------------------------------------------------
const mockProfiles = {
  student: {
    id: "1",
    name: "Alex Johnson",
    role: "student",
    subtitle: "Batch 23",
    badge: "B.Sc. Information Technology",
    description: "Faculty of Information Technology",
    profileImage: null,
    memberSince: "2023",
  },
  boarding_owner: {
    id: "2",
    name: "John Doe",
    role: "boarding_owner",
    subtitle: "Registered Boarding Owner",
    badge: "Member since 2021",
    description: "Safe student accommodation",
    profileImage: null,
  },
  club_society: {
    id: "3",
    name: "Reader's Club",
    role: "club_society",
    subtitle: "",
    badge: "Member since 2023",
    description: "A community for book lovers and writers",
    profileImage: null,
  },
  food_cafe: {
    id: "4",
    name: "John Doe",
    role: "food_cafe",
    subtitle: "Registered Food Provider",
    badge: "Member since 2021",
    description: "Serving quality meals for students",
    profileImage: null,
  },
  self_employed: {
    id: "5",
    name: "John Doe",
    role: "self_employed",
    subtitle: "Registered Service Provider",
    badge: "Member since 2021",
    description: "Student-focused support services",
    profileImage: null,
  },
};

// Role → sidebar config mapping
const roleToSidebarRole = {
  student: "student",
  boarding_owner: "business",
  club_society: "club",
  food_cafe: "business",
  self_employed: "business",
  admin: "admin",
};

const roleDisplayNames = {
  student: "Student",
  boarding_owner: "Business & Organization",
  club_society: "Clubs & Societies",
  food_cafe: "Business & Organization",
  self_employed: "Business & Organization",
};

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
const ROLE_OPTIONS = [
  { value: "student", label: "Student" },
  { value: "boarding_owner", label: "Boarding Owner" },
  { value: "club_society", label: "Club / Society" },
  { value: "food_cafe", label: "Food & Cafe" },
  { value: "self_employed", label: "Self Employed" },
];

const OwnProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Read role from ?role=boarding_owner — defaults to "student"
  const activeRole = searchParams.get("role") || "student";

  const profile = mockProfiles[activeRole] || mockProfiles.student;

  // State to track verification status
  const [verificationStatus, setVerificationStatus] = useState(
    () =>
      localStorage.getItem("unify_club_verification_status") || "NOT_SUBMITTED",
  );

  const [repStatus, setRepStatus] = useState(
    () => localStorage.getItem("unify_student_rep_status") || "NOT_SUBMITTED",
  );

  // Sync with localStorage on every navigation (e.g., coming back from verification pages)
  React.useEffect(() => {
    // Club Status
    const clubStatus =
      localStorage.getItem("unify_club_verification_status") || "NOT_SUBMITTED";
    setVerificationStatus(clubStatus);

    // Rep Status
    const repStatus =
      localStorage.getItem("unify_student_rep_status") || "NOT_SUBMITTED";
    setRepStatus(repStatus);
  }, [location.pathname, location.search]);

  const verificationReason =
    localStorage.getItem("unify_club_verification_reason") ||
    "Verification rejected. Please resubmit documents.";

  const repReason =
    localStorage.getItem("unify_student_rep_reason") ||
    "Verification rejected. Please resubmit documents.";

  const isClub = activeRole === "club_society";
  const isApproved = verificationStatus === "APPROVED";
  const shouldDisable = isClub && !isApproved;

  const user = {
    name: profile.name,
    role: roleToSidebarRole[profile.role] || "student",
    displayRole: roleDisplayNames[profile.role] || profile.role,
  };

  // URL-based Modal state
  const activeModal = searchParams.get("modal");
  const deleteOpen = activeModal === "delete";
  const switchOpen = activeModal === "switch";

  const handleEditProfile = () => navigate(`/profile/edit?role=${activeRole}`);
  const handleSecurity = () => navigate(`/profile/security?role=${activeRole}`);

  // Opening modals adds to history
  const handleSwitchAccount = () =>
    navigate(`/profile?role=${activeRole}&modal=switch`);
  const handleDeleteAccount = () =>
    navigate(`/profile?role=${activeRole}&modal=delete`);

  // Closing modals goes back in history (closing the modal)
  const closeModal = () => navigate(-1);

  const handleConfirmDelete = () => {
    // Clear modal param on confirm
    navigate(`/profile?role=${activeRole}`, { replace: true });
    // TODO: call DELETE /api/profile when backend is ready
  };

  const getPageTitle = () => {
    if (switchOpen) return "Switch account";
    if (deleteOpen) return "Delete account";
    return "Profile";
  };

  return (
    <MainLayout
      user={user}
      pageTitle={getPageTitle()}
      verificationCount={0}
      sidebarDisabled={shouldDisable}
    >
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[280px_1fr] gap-4 md:gap-x-lg md:gap-y-md text-start px-1 md:px-0">
        {/* Row 1, Col 1 — Profile Card */}
        <ProfileHeader profile={profile} className="h-full" />

        {/* Row 1, Col 2 — Role Dashboard */}
        <OwnerViewSwitch
          profile={profile}
          verificationStatus={verificationStatus}
          verificationReason={verificationReason}
          repStatus={repStatus}
          repReason={repReason}
        />

        {/* Row 2 — Account Settings (Full Width) */}
        <div className="md:col-span-2 flex flex-col gap-4 md:gap-lg">
          <AccountSettingsSection
            onEditProfile={handleEditProfile}
            onSecurity={handleSecurity}
            onSwitchAccount={handleSwitchAccount}
            onDeleteAccount={handleDeleteAccount}
            disabled={shouldDisable}
          />
        </div>
      </div>

      {/* Modals */}
      {deleteOpen && (
        <DeleteAccountModal
          onClose={closeModal}
          onConfirm={handleConfirmDelete}
        />
      )}
      {switchOpen && (
        <SwitchAccountModal
          onClose={closeModal}
          currentUser={user}
        />
      )}
    </MainLayout>
  );
};

export default OwnProfilePage;
