import React, { useState } from "react";
import { Mail } from "lucide-react";
import Input from "../common/Input";
import Button from "../common/Button";

const ForgotPasswordForm = () => {
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    let tempErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^0\d{9}$/;

    if (!identifier) {
      tempErrors.identifier = "Email or Phone Number is required";
    } else if (!emailRegex.test(identifier) && !phoneRegex.test(identifier)) {
      tempErrors.identifier = "Please enter a valid email or 10-digit phone number";
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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("OTP Sent to:", identifier);
      // Handle success
    } catch (err) {
      setErrors({ form: "Failed to send OTP. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[480px] bg-white/10 rounded-3xl p-1 px-8 py-10 shadow-[0px_8px_32px_0px_rgba(31,38,135,0.37)] border border-white/10 backdrop-blur-md">
      <div className="flex flex-col items-center gap-10 mb-8">
        {/* Icon and Title */}
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 bg-primary-blue/10 rounded-2xl flex items-center justify-center overflow-hidden">
            <img 
              src="/icon_forgot_password.svg" 
              alt="Forgot Password" 
              className="w-8 h-8 object-contain"
            />
          </div>
          <div className="w-full inline-flex flex-col justify-center items-center gap-2">
            <div className="self-stretch text-center justify-center text-white text-3xl text-heading-medium leading-9">
              Forgot Password?
            </div>
            <div className="self-stretch text-center justify-center text-slate-400 text-body-small leading-5 px-4">
              No worries, it happens. Enter your email or phone number below and we'll send you an OTP to reset your password.
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
          <Input
            label="Email or Phone number"
            placeholder="Enter your email or Phone Number"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            error={errors.identifier}
            className="text-white"
            icon={Mail}
          />

          {/* General Error Message */}
          {errors.form && (
            <div className="text-state-error text-sm text-center bg-state-error/10 p-2 rounded-lg">
              {errors.form}
            </div>
          )}

          <div className="pt-2">
            <Button
              variant="primary"
              fullWidth
              className="h-12 rounded-2xl shadow-[0px_4px_6px_-4px_rgba(43,140,238,0.25)] mt-4"
              disabled={loading}
              type="submit"
            >
              {loading ? "Sending..." : "Send OTP"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;

