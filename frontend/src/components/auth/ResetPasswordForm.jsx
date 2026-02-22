import React, { useState } from "react";
import { Lock, Eye, EyeOff, RotateCcw } from "lucide-react";
import Card from "../common/Card";
import Input from "../common/Input";
import Button from "../common/Button";

const ResetPasswordForm = ({ onReset }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    let tempErrors = {};
    const uppercaseRegex = /[A-Z]/;
    const numberRegex = /[0-9]/;

    if (!password) {
      tempErrors.password = "Password is required";
    } else {
      if (password.length < 8)
        tempErrors.password = "Min 8 characters required";
      else if (!uppercaseRegex.test(password))
        tempErrors.password = "At least one uppercase required";
      else if (!numberRegex.test(password))
        tempErrors.password = "At least one number required";
    }

    if (!confirmPassword) {
      tempErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    // Simulate reset
    setTimeout(() => {
      setLoading(false);
      onReset();
    }, 1500);
  };

  return (
    <Card variant="card" className="w-full max-w-[480px]">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col items-center gap-6">
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
            <p className="text-gray-400 text-sm font-normal font-inter leading-5 px-4 leading-relaxed">
              Please enter your new password to secure your Unify account.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
          <Input
            label="New Password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            icon={Lock}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            }
          />

          <Input
            label="Confirm new password"
            type="password"
            placeholder="Re-enter your Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
            icon={Lock}
          />

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
