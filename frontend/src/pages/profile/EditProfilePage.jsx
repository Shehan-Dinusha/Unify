import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import StudentDetailsForm from "../../components/auth/StudentDetailsForm";
import BoardingDetailsForm from "../../components/auth/BoardingDetailsForm";
import CafeDetailsForm from "../../components/auth/CafeDetailsForm";
import ClubDetailsForm from "../../components/auth/ClubDetailsForm";
import SelfEmployedDetailsForm from "../../components/auth/SelfEmployedDetailsForm";
import { getMyProfile, updateStudentProfile, updateBusinessProfile, updateClubProfile } from "../../services/profileService";
import { getCurrentUser } from "../../services/authService";
import { useToast } from "../../components/common/Toast";
import { Loader2 } from "lucide-react";

/* ─── Page ──────────────────────────────────────────────────────── */
const EditProfilePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);
  const [activeRole, setActiveRole] = useState(searchParams.get("role") || "student");

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const currentUser = getCurrentUser();
      if (!currentUser) {
        navigate("/login");
        return;
      }

      const backendRole = currentUser.role?.toLowerCase();
      const serviceRole = backendRole === "admin" ? "student" : backendRole;
      const data = await getMyProfile(serviceRole);
      setProfile(data);
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

  const currentUser = getCurrentUser();

  // Derive sidebar user info reactively from profile state
  const user = useMemo(() => {
    const backendRole = (profile?.user?.role || currentUser?.role)?.toLowerCase();
    
    // Pick correct display name based on role
    let displayName = currentUser?.name || "User";
    if (backendRole === "club") {
      displayName = profile?.clubName || currentUser?.name || "User";
    } else if (backendRole === "business") {
      displayName = profile?.displayName || profile?.businessName || currentUser?.name || "User";
    } else if (backendRole === "student") {
      displayName = profile ? `${profile.firstName || ""} ${profile.lastName || ""}`.trim() || currentUser?.name : currentUser?.name || "User";
    }

    // Pick correct sidebar role key
    let sidebarRole = "student";
    if (backendRole === "club") sidebarRole = "club";
    else if (backendRole === "business") sidebarRole = "business";

    // Pick correct display role label
    let displayRole = "STUDENT";
    if (backendRole === "club") displayRole = "CLUBS & SOCIETIES";
    else if (backendRole === "business") displayRole = "BUSINESS & ORGANIZATION";

    return {
      name: displayName,
      role: sidebarRole,
      displayRole,
      avatar: profile?.user?.avatar || profile?.logo || currentUser?.avatar,
    };
  }, [profile, currentUser]);

  // Called when the form's save button is submitted
  const handleSave = async (formData) => {
    try {
      setSaving(true);
      const currentUser = getCurrentUser();
      const backendRole = currentUser.role?.toLowerCase();

      const roleToCategory = {
        boarding_owner: "BOARDING",
        food_cafe: "FOOD",
        self_employed: "SELF_EMPLOYED",
      };
      
      if (backendRole === "student") {
        await updateStudentProfile(formData);
      } else if (backendRole === "business") {
        const category = roleToCategory[activeRole];
        await updateBusinessProfile({ ...formData, category });
      } else if (backendRole === "club") {
        await updateClubProfile(formData);
      }

      toast.success("Success", "Profile updated successfully");
      navigate(`/profile?role=${activeRole}`);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error", error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const renderForm = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary-blue animate-spin" />
        </div>
      );
    }

    if (!profile) return <p className="text-text-secondary">Failed to load profile.</p>;

    switch (activeRole) {
      case "boarding_owner":
        return <BoardingDetailsForm onNext={handleSave} initialData={profile} loading={saving} />;
      case "food_cafe":
        return <CafeDetailsForm onNext={handleSave} initialData={profile} loading={saving} />;
      case "club_society":
        return <ClubDetailsForm onNext={handleSave} initialData={profile} loading={saving} />;
      case "self_employed":
        return <SelfEmployedDetailsForm onNext={handleSave} initialData={profile} loading={saving} />;
      case "student":
      default:
        return <StudentDetailsForm onNext={handleSave} initialData={profile} loading={saving} />;
    }
  };

  const isUnverifiedClub = activeRole === "club_society" && (!profile || !profile.isVerified);

  return (
    <MainLayout user={user} pageTitle="Edit info" verificationCount={0} sidebarDisabled={isUnverifiedClub}>
      <div className="w-full flex flex-col items-center justify-start pt-4 md:pt-10 px-4 min-h-full">
        {renderForm()}

        {/* Back link - Mobile Only */}
        <button
          onClick={() => navigate(`/profile?role=${activeRole}`)}
          className="md:hidden mt-10 mb-6 flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors text-body-small"
        >
          ← Back to Profile
        </button>
      </div>
    </MainLayout>
  );
};

export default EditProfilePage;
