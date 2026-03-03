import React, { useState, useEffect } from "react";
import { Lock, RotateCcw } from "lucide-react";
import Card from "../common/Card";
import Input from "../common/Input";
import Button from "../common/Button";
import { validatePassword } from "../../utils/validation";

const ResetPasswordForm = ({ onReset }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Strict fix to screen
    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh";

    const container = document.querySelector(".bg-app-bg");
    const main = document.querySelector("main");

    if (container) {
      container.style.height = "100vh";
      container.style.overflow = "hidden";
    }
    if (main) {
      main.style.overflow = "hidden"; // Strictly no scroll
      main.style.display = "flex";
      main.style.flexDirection = "column";
      main.style.justifyContent = "center";
    }

    // Restore on unmount
    return () => {
      document.body.style.overflow = "auto";
      document.body.style.height = "auto";
      if (container) {
        container.style.height = "auto";
        container.style.overflow = "visible";
      }
      if (main) {
        main.style.overflow = "visible";
      }
    };
  }, []);

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
