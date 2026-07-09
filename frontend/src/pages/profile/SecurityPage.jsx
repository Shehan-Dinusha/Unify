import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Lock, Loader2 } from "lucide-react";
import MainLayout from "../../components/layout/MainLayout";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { validatePassword } from "../../utils/validation";
import { changePassword, getMyProfile } from "../../services/profileService";
import { getCurrentUser } from "../../services/authService";
import { useToast } from "../../components/common/Toast";

// Data will be fetched from getCurrentUser

/* ─── Page ──────────────────────────────────────────────────────── */
const SecurityPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const toast = useToast();
  const activeRole = searchParams.get("role") || "student";

  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const user = getCurrentUser();
        if (!user) {
          navigate("/login");
          return;
        }
        const backendRole = user.role?.toLowerCase();
        const data = await getMyProfile(backendRole);
        setProfile(data);
      } catch (error) {
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfileData();
  }, []);

  const currentUser = getCurrentUser();
  const user = {
    name: profile?.clubName || profile?.displayName || profile?.businessName || currentUser?.name || "User",
    role: (profile?.user?.role || currentUser?.role)?.toLowerCase() === "business" ? "business" : 
          (profile?.user?.role || currentUser?.role)?.toLowerCase() === "club" ? "club" : "student",
    displayRole: (profile?.user?.role || currentUser?.role) === "Club" ? "CLUBS & SOCIETIES" : 
                 (profile?.user?.role || currentUser?.role) === "Business" ? "BUSINESS & ORGANIZATION" : 
                 (profile?.user?.role || currentUser?.role)?.toUpperCase() || "STUDENT",
    avatar: profile?.user?.avatar || profile?.logo || currentUser?.avatar,
  };

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!currentPassword) errs.currentPassword = "Current password is required";
    if (!newPassword) {
      errs.newPassword = "New password is required";
    } else if (!validatePassword(newPassword)) {
      errs.newPassword =
        "Must be at least 8 characters with uppercase, lowercase, and a number";
    }
    if (!confirmPassword) {
      errs.confirmPassword = "Please confirm your new password";
    } else if (newPassword !== confirmPassword) {
      errs.confirmPassword = "Passwords do not match";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      toast.success("Success", "Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      navigate(`/profile?role=${activeRole}`);
    } catch (error) {
      setErrors({ currentPassword: error.message || "Failed to update password" });
      toast.error("Error", error.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const isUnverifiedClub = activeRole === "club_society" && (!profile || !profile.isVerified);

  if (loadingProfile) {
    return (
      <MainLayout user={user} pageTitle="Security & Password" verificationCount={0}>
        <div className="flex justify-center items-center h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary-blue" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout user={user} pageTitle="Security & Password" verificationCount={0} sidebarDisabled={isUnverifiedClub}>
      <div className="w-full flex flex-col items-center justify-start pt-4 md:pt-10 px-4 min-h-full">
        <Card variant="card" className="w-full max-w-md md:max-w-[480px] p-4 md:p-lg">
          <div className="flex flex-col gap-4 md:gap-6">
            {/* Header */}
            <div className="flex flex-col items-center gap-3 md:gap-4">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center overflow-hidden">
                <img
                  src="/icon_forgot_password.svg"
                  alt="Security"
                  className="w-6 h-8 md:w-7 md:h-9 object-contain"
                />
              </div>
              <div className="w-full flex flex-col gap-1 text-center">
                <h2 className="text-white text-xl md:text-2xl font-bold font-inter leading-tight md:leading-8">
                  Security & Password
                </h2>
                <p className="text-text-secondary text-[12px] md:text-body-small">
                  Keep your account safe by using a strong, unique password.
                </p>
              </div>
            </div>



            {/* Form */}
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
              <Input
                label="Current Password"
                type="password"
                showPasswordToggle
                placeholder="Enter your current password"
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  if (errors.currentPassword)
                    setErrors((prev) => ({ ...prev, currentPassword: undefined }));
                }}
                error={errors.currentPassword}
                icon={Lock}
              />

              <Input
                label="New Password"
                type="password"
                showPasswordToggle
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (errors.newPassword)
                    setErrors((prev) => ({ ...prev, newPassword: undefined }));
                }}
                error={errors.newPassword}
                icon={Lock}
              />

              <Input
                label="Confirm New Password"
                type="password"
                showPasswordToggle
                placeholder="Re-enter your new password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword)
                    setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                }}
                error={errors.confirmPassword}
                icon={Lock}
              />

              {/* Actions */}
              <div className="pt-6 border-t border-blue-500/20">
                <Button
                  variant="primary"
                  fullWidth
                  disabled={loading}
                  type="submit"
                  className="shadow-[0px_4px_6px_-4px_rgba(43,140,238,0.25)]"
                >
                  {loading ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </form>
          </div>
        </Card>

        {/* Back link - Mobile Only */}
        <button
          onClick={() => navigate(`/profile?role=${activeRole}`)}
          className="md:hidden mt-8 flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors text-body-small"
        >
          ← Back to Profile
        </button>
      </div>
    </MainLayout>
  );
};

export default SecurityPage;
