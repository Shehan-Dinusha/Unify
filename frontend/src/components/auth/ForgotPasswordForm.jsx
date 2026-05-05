import React, { useState } from "react";
import { Mail } from "lucide-react";
import Card from "../common/Card";
import Input from "../common/Input";
import Button from "../common/Button";
import { forgotPassword } from "../../services/authService";

const ForgotPasswordForm = ({ onNext }) => {
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
      tempErrors.identifier =
        "Please enter a valid email or 10-digit phone number";
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
      await forgotPassword({
        [isEmail ? "email" : "phone"]: identifier,
      });
      onNext(identifier);
    } catch (err) {
      setErrors({ form: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card variant="card" className="w-full max-w-[480px]">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center overflow-hidden">
            <img
              src="/icon_forgot_password.svg"
              alt="Forgot Password"
              className="w-7 h-9 object-contain"
            />
          </div>
          <div className="w-full flex flex-col gap-2 text-center">
            <h2 className="text-white text-2xl font-bold font-inter leading-8">
              Forgot Password?
            </h2>
            <p className="text-gray-400 text-sm font-normal font-inter leading-5 px-4 leading-relaxed">
              No worries, it happens. Enter your email or phone number below and
              we'll send you an OTP to reset your password.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-8">
          <Input
            label="Email or phone number"
            placeholder="Enter your email or Phone Number"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            error={errors.identifier}
            icon={Mail}
          />

          {errors.form && (
            <div className="text-state-error text-sm text-center bg-state-error/10 p-2 rounded-lg">
              {errors.form}
            </div>
          )}

          <Button
            variant="primary"
            fullWidth
            disabled={loading}
            type="submit"
            className="shadow-[0px_4px_6px_-4px_rgba(43,140,238,0.25)]"
          >
            {loading ? "Sending..." : "Send OTP"}
          </Button>
        </form>
      </div>
    </Card>
  );
};

export default ForgotPasswordForm;
