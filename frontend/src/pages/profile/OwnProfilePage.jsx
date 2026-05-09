import React, { useState, useEffect } from "react";
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
import { getMyProfile, deleteAccount } from "../../services/profileService";
import { getCurrentUser, logout } from "../../services/authService";
import { useToast } from "../../components/common/Toast";
import Button from "../../components/common/Button";
import { Loader2 } from "lucide-react";

// Mapping between backend roles/categories and frontend "activeRole"
const getFrontendRole = (backendUser, profile) => {
  if (!backendUser) return "student";
  const role = backendUser.role?.toLowerCase();

  if (role === "student") return "student";
  if (role === "club") return "club_society";
  if (role === "business" && profile?.category) {
    switch (profile.category.toLowerCase()) {
      case "boarding":
        return "boarding_owner";
      case "food":
        return "food_cafe";
      case "self_employed":
        return "self_employed";
      default:
        return "boarding_owner";
    }
  }
  return "student";
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
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [activeRole, setActiveRole] = useState(searchParams.get("role") || "student");

  // State to track verification status
  const [verificationStatus, setVerificationStatus] = useState("NOT_SUBMITTED");
  const [repStatus, setRepStatus] = useState("NOT_SUBMITTED");
  const [repReason, setRepReason] = useState("");

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const currentUser = getCurrentUser();
      if (!currentUser) {
        navigate("/login");
        return;
      }

      // Backend role is Student, Business, or Club
      const backendRole = currentUser.role?.toLowerCase();
      // Service needs 'student', 'business', or 'club'
      const serviceRole = backendRole === "admin" ? "student" : backendRole;
      
      const data = await getMyProfile(serviceRole);
      
      // Map backend data to frontend profile structure
      let mappedProfile = {};
      if (backendRole === "student") {
        mappedProfile = {
          id: data.id,
          name: `${data.firstName} ${data.lastName}`,
          role: "student",
          subtitle: data.batch?.name || "",
          badge: data.degree?.name || "",
          description: data.faculty?.name || "",
          profileImage: data.user?.avatar || null,
          memberSince: new Date(data.createdAt).getFullYear().toString(),
          ...data
        };
        setRepStatus(data.repVerificationStatus || "NOT_SUBMITTED");
        if (data.repVerificationReason) setRepReason(data.repVerificationReason);
      } else if (backendRole === "club") {
        mappedProfile = {
          id: data.id,
          name: data.clubName,
          role: "club_society",
          subtitle: "",
          badge: `Member since ${new Date(data.createdAt).getFullYear()}`,
          description: data.about || "",
          profileImage: data.logo || null,
          ...data
        };
        setProfile(mappedProfile);
        setActiveRole("club_society");
        
        // Use top-level verificationStatus from backend (robust, no nested parsing)
        setVerificationStatus(data.verificationStatus || "NOT_SUBMITTED");
        if (data.verificationReason) setVerificationReason(data.verificationReason);
      } else if (backendRole === "business") {
        const fRole = getFrontendRole(currentUser, data);
        mappedProfile = {
          id: data.id,
          name: data.displayName || data.businessName,
          role: fRole,
          subtitle: data.category === "BOARDING" ? "Registered Boarding Owner" : 
                    data.category === "FOOD" ? "Registered Food Provider" : "Registered Service Provider",
          badge: `Member since ${new Date(data.createdAt).getFullYear()}`,
          description: data.about || "",
          profileImage: data.user?.avatar || null,
          ...data
        };
        setActiveRole(fRole);
      }

      setProfile(mappedProfile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Error", error.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Show a toast when returning from account linking flow (Deprecated but kept empty to avoid error)

  const [verificationReason, setVerificationReason] = useState(
    "Verification rejected. Please resubmit documents."
  );


  // URL-based Modal state
  const activeModal = searchParams.get("modal");
  const deleteOpen = activeModal === "delete";

  const handleEditProfile = () => navigate(`/profile/edit?role=${activeRole}`);
  const handleSecurity = () => navigate(`/profile/security?role=${activeRole}`);

  const handleDeleteAccount = () =>
    navigate(`/profile?role=${activeRole}&modal=delete`);

  // Closing modals goes back in history (closing the modal)
  const closeModal = () => navigate(-1);

  const handleConfirmDelete = async (password) => {
    try {
      await deleteAccount(password);
      toast.success("Success", "Account deleted successfully");
      logout(); // Logout and redirect to login
    } catch (error) {
      // Re-throw so the modal can show inline error
      throw error;
    }
  };

  const getPageTitle = () => {
    if (deleteOpen) return "Delete account";
    return "Profile";
  };

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

  const user = {
    name: profile.name,
    role: roleToSidebarRole[profile.role] || "student",
    displayRole: roleDisplayNames[profile.role] || profile.role,
    avatar: profile.profileImage,
  };

  const isUnverifiedClub = activeRole === "club_society" && verificationStatus !== "APPROVED";

  return (
    <MainLayout
      user={user}
      pageTitle={getPageTitle()}
      verificationCount={0}
      sidebarDisabled={isUnverifiedClub}
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
            onDeleteAccount={handleDeleteAccount}
            disabled={false}
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
    </MainLayout>
  );
};

export default OwnProfilePage;
