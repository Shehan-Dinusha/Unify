import React, { useState } from "react";
import { Lock, RotateCcw } from "lucide-react";
import Card from "../common/Card";
import Input from "../common/Input";
import Button from "../common/Button";
import { validatePassword } from "../../utils/validation";
import { resetPassword } from "../../services/authService";

const ResetPasswordForm = ({ identifier, otp, onReset }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    let tempErrors = {};

    if (!password) {
      tempErrors.password = "Password is required";
    } else if (!validatePassword(password)) {
      tempErrors.password =
        "Password must be at least 8 characters and include uppercase, lowercase, and a number";
    }

    if (!confirmPassword) {
      tempErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});
    try {
      const isEmail = identifier.includes("@");
      await resetPassword({
        [isEmail ? "email" : "phone"]: identifier,
        otp,
        password,
      });
      onReset();
    } catch (err) {
      setErrors({ form: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card variant="card" className="w-full max-w-[480px]">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center overflow-hidden">
            <img
              src="/icon_forgot_password.svg"
              alt="Reset Password"
              className="w-7 h-9 object-contain"
            />
          </div>
          <div className="w-full flex flex-col gap-2 text-center">
            <h2 className="text-white text-2xl font-bold font-inter leading-8">
              Reset Password
            </h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
          <Input
            label="New Password"
            type="password"
            showPasswordToggle
            placeholder="Enter your Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password)
                setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            error={errors.password}
            icon={Lock}
          />

          <Input
            label="Confirm new password"
            type="password"
            showPasswordToggle
            placeholder="Re-enter your Password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword)
                setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
            }}
            error={errors.confirmPassword}
            icon={Lock}
          />

          {errors.form && (
            <div className="text-status-error text-body-small text-center px-4">
              {errors.form}
            </div>
          )}

          <div className="pt-6 border-t border-blue-500/20">
            <Button
              variant="primary"
              fullWidth
              disabled={loading}
              type="submit"
              className="shadow-[0px_4px_6px_-4px_rgba(43,140,238,0.25)]"
            >
              {loading ? "Changing..." : "Change Password"}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
};

export default ResetPasswordForm;
