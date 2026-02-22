import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import Card from "../common/Card";
import Input from "../common/Input";
import Button from "../common/Button";

const StudentRegisterForm = ({ onNext, onBack }) => {
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    let tempErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const universityDomain = "@uom.lk";
    if (!contact) {
      tempErrors.contact = "University email is required";
    } else if (!emailRegex.test(contact)) {
      tempErrors.contact = "Please enter a valid email";
    } else if (!contact.endsWith(universityDomain)) {
      tempErrors.contact = `Must use official university email (${universityDomain})`;
    }

    if (!password) {
      tempErrors.password = "Password is required";
    } else if (password.length < 8) {
      tempErrors.password = "Password must be at least 8 characters";
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
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      onNext(contact);
    } catch (err) {
      setErrors({ form: "Registration failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-[1200px] mx-auto">
      {/* Title Section - Outside Card */}
      <div className="text-center mb-10 w-full px-6">
        <h1 className="text-white text-heading-large mb-7">
          Create your Unify Student Account
        </h1>
        <p className="text-text-secondary text-body-large-bold">
          Connect with your campus. Enter your details below.
        </p>
      </div>

      {/* Form Section - Inside Card */}
      <Card
        variant="card"
        className="w-full max-w-[480px] mx-auto shadow-custom-shadow"
      >
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <Input
                label="University Email"
                placeholder="email@uom.lk"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                error={errors.contact}
                icon={Mail}
              />
              {!errors.contact && (
                <p className="text-text-tertiary text-body-extra-small px-1">
                  University emails must end with @uom.lk
                </p>
              )}
            </div>

            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              icon={Lock}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-text-tertiary hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              }
            />

            <Input
              label="Re-enter Password"
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
              icon={Lock}
            />
          </div>

          <div className="mt-6">
            <Button
              variant="primary"
              fullWidth
              size="large"
              disabled={loading}
              type="submit"
              className="shadow-custom-shadow"
            >
              Send OTP
            </Button>
          </div>
        </form>
      </Card>

      {/* Footer Section - Outside Card */}
      <div className="mt-8 text-center w-full">
        <p className="text-text-secondary text-body-small whitespace-nowrap">
          By clicking continue, You agree to our Terms of Service and Privacy
          Policy.
        </p>
      </div>
    </div>
  );
};

export default StudentRegisterForm;
