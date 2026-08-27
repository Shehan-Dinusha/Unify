import React, { useState } from "react";
import { Mail, Lock } from "lucide-react";
import Card from "../common/Card";
import Input from "../common/Input";
import Button from "../common/Button";
import { validatePassword } from "../../utils/validation";
import { register } from "../../services/authService";

const BusinessRegisterForm = ({ onNext, _onBack, businessType }) => {
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    let tempErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9+]{10,15}$/;

    if (!contact) {
      tempErrors.contact = "Contact information is required";
    } else if (contact.includes("@")) {
      if (!emailRegex.test(contact)) {
        tempErrors.contact = "Please enter a valid email";
      }
    } else if (!phoneRegex.test(contact.replace(/\s/g, ""))) {
      tempErrors.contact = "Please enter a valid email or phone number";
    }

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
    try {
      let formattedContact = contact.trim();
      const isEmail = formattedContact.includes("@");

      // Auto-format local Sri Lankan numbers to international format for Twilio
      if (!isEmail && formattedContact.startsWith("0") && formattedContact.length === 10) {
        formattedContact = "+94" + formattedContact.substring(1);
      } else if (!isEmail && /^\d{9}$/.test(formattedContact)) {
        // If they enter 9 digits without the 0, e.g. 771234567
        formattedContact = "+94" + formattedContact;
      }

      await register({
        [isEmail ? "email" : "phone"]: formattedContact,
        password,
        role: businessType === "club" ? "Club" : "Business",
        name: formattedContact.split("@")[0] || "Business User",
      });
      onNext(formattedContact);
    } catch (err) {
      setErrors({ form: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-[1200px] mx-auto">
      {/* Title Section - Outside Card */}
      <div className="text-center mb-3 md:mb-6 lg:mb-10 w-full px-6">
        <h1 className="text-white text-xl sm:text-2xl md:text-heading-large font-black font-inter tracking-tight leading-tight mb-2 md:mb-5">
          Create your Unify Business Account
        </h1>
        <p className="hidden sm:block text-text-secondary text-body-large-bold">
          Create your business account and connect with students.
        </p>
      </div>

      {/* Form Section - Inside Card */}
      <Card
        variant="card"
        className="w-full max-w-[480px] mx-auto shadow-custom-shadow"
      >
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="space-y-6">
            <Input
              label="Business Email or Phone Number"
              placeholder="email@example.com or +94771234567"
              value={contact}
              onChange={(e) => {
                setContact(e.target.value);
                if (errors.contact)
                  setErrors((prev) => ({ ...prev, contact: undefined }));
              }}
              error={errors.contact}
              icon={Mail}
            />

            <Input
              label="Password"
              type="password"
              showPasswordToggle
              placeholder="Enter your password"
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
              label="Re-enter Password"
              type="password"
              showPasswordToggle
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword)
                  setErrors((prev) => ({
                    ...prev,
                    confirmPassword: undefined,
                  }));
              }}
              error={errors.confirmPassword}
              icon={Lock}
            />
          </div>

          {errors.form && (
            <div className="mt-4 p-2 bg-status-error/10 border border-status-error/20 rounded-lg text-status-error text-body-extra-small text-center">
              {errors.form}
            </div>
          )}

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
      <div className="hidden sm:block mt-8 text-center w-full">
        <p className="text-text-secondary text-body-small">
          By clicking continue, You agree to our Terms of Service and Privacy
          Policy.
        </p>
      </div>
    </div>
  );
};

export default BusinessRegisterForm;
