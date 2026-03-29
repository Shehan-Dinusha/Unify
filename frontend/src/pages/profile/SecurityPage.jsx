import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Lock } from "lucide-react";
import MainLayout from "../../components/layout/MainLayout";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { validatePassword } from "../../utils/validation";

/* ─── role → sidebar mapping (same as OwnProfilePage) ──────────── */
const roleToSidebarRole = {
  student: "student",
  boarding_owner: "business",
  club_society: "club",
  food_cafe: "business",
  self_employed: "business",
};

const roleDisplayNames = {
  student: "Student",
  boarding_owner: "Business & Organization",
  club_society: "Clubs & Societies",
  food_cafe: "Business & Organization",
  self_employed: "Business & Organization",
};

const roleUserNames = {
  student: "Alex Johnson",
  boarding_owner: "John Doe",
  club_society: "Alex Johnson",
  food_cafe: "John Doe",
  self_employed: "John Doe",
};

/* ─── Page ──────────────────────────────────────────────────────── */
const SecurityPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeRole = searchParams.get("role") || "student";

  const user = {
    name: roleUserNames[activeRole] || "Alex Johnson",
    role: roleToSidebarRole[activeRole] || "student",
    displayRole: roleDisplayNames[activeRole] || "Student",
  };

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    // TODO: call PUT /api/profile/password when backend is ready
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }, 1200);
  };

  return (
    <MainLayout user={user} pageTitle="Security & Password" verificationCount={0}>
      <div className="w-full flex flex-col items-center justify-center py-6 px-4">
        <Card variant="card" className="w-full max-w-[480px]">
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center overflow-hidden">
                <img
                  src="/icon_forgot_password.svg"
                  alt="Security"
                  className="w-7 h-9 object-contain"
                />
              </div>
              <div className="w-full flex flex-col gap-1 text-center">
                <h2 className="text-white text-2xl font-bold font-inter leading-8">
                  Security & Password
                </h2>
                <p className="text-text-secondary text-body-small">
                  Keep your account safe by using a strong, unique password.
                </p>
              </div>
            </div>

            {/* Success message */}
            {success && (
              <div className="bg-state-success/10 border border-state-success/30 rounded-xl px-4 py-3 text-state-success text-body-small text-center">
                Password updated successfully!
              </div>
            )}

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
                  setSuccess(false);
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
                  setSuccess(false);
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
                  setSuccess(false);
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

        {/* Back link */}
        <button
          onClick={() => navigate(`/profile?role=${activeRole}`)}
          className="mt-5 flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors text-body-small"
        >
          ← Back to Profile
        </button>
      </div>
    </MainLayout>
  );
};

export default SecurityPage;
