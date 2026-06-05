import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { getMyProfile, deleteAccount } from "../../services/profileService";
import { getCurrentUser, logout, refreshCurrentUser } from "../../services/authService";
import { useToast } from "../../components/common/Toast";

const getFrontendRole = (backendUser, profile) => {
  if (!backendUser) return "student";
  const role = backendUser.role?.toLowerCase();
  if (role === "student") return "student";
  if (role === "club") return "club_society";
  if (role === "business" && profile?.category) {
    switch (profile.category.toLowerCase()) {
      case "boarding": return "boarding_owner";
      case "food": return "food_cafe";
      case "self_employed": return "self_employed";
      default: return "boarding_owner";
    }
  }
  return "student";
};

const roleToSidebarRole = {
  student: "student", boarding_owner: "business", club_society: "club",
  food_cafe: "business", self_employed: "business", admin: "admin",
};

const roleDisplayNames = {
  student: "Student", boarding_owner: "Business & Organization",
  club_society: "Clubs & Societies", food_cafe: "Business & Organization",
  self_employed: "Business & Organization",
};

export const useOwnProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [activeRole, setActiveRole] = useState(searchParams.get("role") || "student");
  const [verificationStatus, setVerificationStatus] = useState("NOT_SUBMITTED");
  const [verificationReason, setVerificationReason] = useState("Verification rejected. Please resubmit documents.");
  const [repStatus, setRepStatus] = useState("NOT_SUBMITTED");
  const [repReason, setRepReason] = useState("");

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const currentUser = getCurrentUser();
      if (!currentUser) { navigate("/login"); return; }
      const backendRole = currentUser.role?.toLowerCase();
      const serviceRole = backendRole === "admin" ? "student" : backendRole;
      const data = await getMyProfile(serviceRole);
      let mappedProfile = {};
      if (backendRole === "student") {
        mappedProfile = {
          id: data.id, name: `${data.firstName} ${data.lastName}`, role: "student",
          subtitle: data.batch?.name || "", badge: data.degree?.name || "",
          description: data.faculty?.name || "", profileImage: data.user?.avatar || null,
          memberSince: new Date(data.createdAt).getFullYear().toString(), ...data,
        };
        setRepStatus(data.repVerificationStatus || "NOT_SUBMITTED");
        if (data.repVerificationReason) setRepReason(data.repVerificationReason);
      } else if (backendRole === "club") {
        mappedProfile = {
          id: data.id, name: data.clubName, role: "club_society", subtitle: "",
          badge: `Member since ${new Date(data.createdAt).getFullYear()}`,
          description: data.about || "", profileImage: data.logo || null, ...data,
        };
        setActiveRole("club_society");
        setVerificationStatus(data.verificationStatus || "NOT_SUBMITTED");
        if (data.verificationReason) setVerificationReason(data.verificationReason);
      } else if (backendRole === "business") {
        const fRole = getFrontendRole(currentUser, data);
        mappedProfile = {
          id: data.id, name: data.displayName || data.businessName, role: fRole,
          subtitle: data.category === "BOARDING" ? "Registered Boarding Owner"
            : data.category === "FOOD" ? "Registered Food Provider" : "Registered Service Provider",
          badge: `Member since ${new Date(data.createdAt).getFullYear()}`,
          description: data.about || "", profileImage: data.user?.avatar || null, ...data,
        };
        setActiveRole(fRole);
      }
      setProfile(mappedProfile);
      refreshCurrentUser();
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Error", error.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const activeModal = searchParams.get("modal");
  const deleteOpen = activeModal === "delete";

  const handleEditProfile = () => navigate(`/profile/edit?role=${activeRole}`);
  const handleSecurity = () => navigate(`/profile/security?role=${activeRole}`);
  const handleDeleteAccount = () => navigate(`/profile?role=${activeRole}&modal=delete`);
  const closeModal = () => navigate(-1);

  const handleConfirmDelete = async (password) => {
    try {
      await deleteAccount(password);
      toast.success("Success", "Account deleted successfully");
      logout();
    } catch (error) { throw error; }
  };

  const getPageTitle = () => deleteOpen ? "Delete account" : "Profile";

  const user = profile ? {
    name: profile.name,
    role: roleToSidebarRole[profile.role] || "student",
    displayRole: roleDisplayNames[profile.role] || profile.role,
    avatar: profile.profileImage,
  } : { name: "Loading...", role: "student", displayRole: "Loading..." };

  const isUnverifiedClub = activeRole === "club_society" && verificationStatus !== "APPROVED";

  return {
    navigate, user, loading, profile, activeRole, setActiveRole,
    verificationStatus, verificationReason, repStatus, repReason,
    deleteOpen, isUnverifiedClub, getPageTitle,
    handleEditProfile, handleSecurity, handleDeleteAccount, closeModal, handleConfirmDelete, fetchProfile,
  };
};
