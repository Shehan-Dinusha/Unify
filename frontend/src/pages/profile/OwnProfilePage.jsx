import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
const OwnerViewSwitch = ({ profile }) => {
  const role = profile?.role || "student";
  switch (role) {
    case "boarding_owner":
      return <BoardingOwnerOwnerView profile={profile} />;
    case "club_society":
      return <ClubOwnerView profile={profile} />;
    case "food_cafe":
      return <FoodCafeOwnerView profile={profile} />;
    case "self_employed":
      return <SelfEmployedOwnerView profile={profile} />;
    case "student":
    default:
      return <StudentOwnerView profile={profile} />;
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
  const [searchParams] = useSearchParams();

  // Read role from ?role=boarding_owner — defaults to "student"
  const activeRole = searchParams.get("role") || "student";

  const profile = mockProfiles[activeRole] || mockProfiles.student;

  const user = {
    name: profile.name,
    role: roleToSidebarRole[profile.role] || "student",
    displayRole: roleDisplayNames[profile.role] || profile.role,
  };

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [switchOpen, setSwitchOpen] = useState(false);

  const handleEditProfile = () => navigate(`/profile/edit?role=${activeRole}`);
  const handleSecurity = () => navigate(`/profile/security?role=${activeRole}`);
  const handleSwitchAccount = () => setSwitchOpen(true);
  const handleDeleteAccount = () => setDeleteOpen(true);
  const handleConfirmDelete = () => {
    setDeleteOpen(false);
    // TODO: call DELETE /api/profile when backend is ready
  };

  return (
    <MainLayout user={user} pageTitle="Profile" verificationCount={0}>
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[280px_1fr] gap-x-lg gap-y-md text-start">
        {/* Row 1, Col 1 — Profile Card */}
        <ProfileHeader profile={profile} className="h-full" />

        {/* Row 1, Col 2 — Role Dashboard */}
        <OwnerViewSwitch profile={profile} />

        {/* Row 2 — Account Settings (Full Width) */}
        <div className="md:col-span-2 flex flex-col gap-lg">
          <AccountSettingsSection
            onEditProfile={handleEditProfile}
            onSecurity={handleSecurity}
            onSwitchAccount={handleSwitchAccount}
            onDeleteAccount={handleDeleteAccount}
          />
        </div>
      </div>

      {/* Modals */}
      {deleteOpen && (
        <DeleteAccountModal
          onClose={() => setDeleteOpen(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
      {switchOpen && (
        <SwitchAccountModal
          onClose={() => setSwitchOpen(false)}
          currentUser={user}
        />
      )}
    </MainLayout>
  );
};

export default OwnProfilePage;
