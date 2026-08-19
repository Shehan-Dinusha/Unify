import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Card from "../common/Card";
import Input from "../common/Input";
import Button from "../common/Button";
import { login, linkAccountServer } from "../../services/authService";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const LoginForm = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isAddAccount = searchParams.get("addAccount") === "true";

  const validate = () => {
    let tempErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9+]{10,15}$/;

    if (!identifier) {
      tempErrors.identifier = "Email or Phone Number is required";
    } else if (!emailRegex.test(identifier) && !phoneRegex.test(identifier.replace(/\s/g, ""))) {
      tempErrors.identifier =
        "Please enter a valid email or phone number";
    }

    if (!password) {
      tempErrors.password = "Password is required";
    } else if (password.length < 8) {
      tempErrors.password = "Password must be at least 8 characters";
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
      let formattedIdentifier = identifier.trim();
      const isEmail = formattedIdentifier.includes("@");

      // Auto-format local Sri Lankan numbers to international format (+94)
      if (!isEmail && formattedIdentifier.startsWith("0") && formattedIdentifier.length === 10) {
        formattedIdentifier = "+94" + formattedIdentifier.substring(1);
      } else if (!isEmail && /^\d{9}$/.test(formattedIdentifier)) {
        formattedIdentifier = "+94" + formattedIdentifier;
      }

      let data;
      if (isAddAccount && localStorage.getItem("token")) {
        data = await linkAccountServer(formattedIdentifier, password);
      } else {
        data = await login(formattedIdentifier, password);
      }

      // Navigate based on user role (Navigation occurs AFTER tokens are stored in authService)
      const role = data.user.role.toLowerCase();

      if (role === "admin") {
        navigate("/admin");
      } else if (role === "student") {
        navigate("/news-feed");
      } else if (role === "business") {
        // Redirection based on business category
        const category = data.user.category?.toUpperCase();

        if (category === "BOARDING") {
          navigate("/boarding-owner/marketplace");
        } else if (category === "FOOD") {
          navigate("/food-cafe-owner/marketplace");
        } else if (category === "SELF_EMPLOYED") {
          navigate("/services-owner/marketplace");
        } else {
          navigate("/marketplace");
        }
      } else if (role === "club") {
        // Always land on profile first — profile page handles verified vs unverified UX
        navigate("/profile?role=club_society");
      } else {
        navigate("/news-feed");
      }
    } catch (err) {
      setErrors({ form: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card variant="card" className="w-full max-w-[480px]">
      <div className="flex flex-col gap-10">
        <div className="w-full flex flex-col items-center gap-2">
          <h2 className="text-white text-heading-medium text-center">
            Welcome Back
          </h2>
          <p className="text-text-secondary text-body-small text-center">
            Sign in to access your courses and community.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
          <Input
            label="Email or Phone number"
            placeholder="Enter your email or Phone Number"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            error={errors.identifier}
            icon={Mail}
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              icon={Lock}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-[38px] text-text-tertiary hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            <div className="flex justify-end absolute right-0 top-0">
              <Link
                to="/forgot-password"
                className="text-primary-blue text-body-extra-small-bold hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          {errors.form && (
            <div className="text-state-error text-sm text-center bg-state-error/10 p-2 rounded-lg">
              {errors.form}
            </div>
          )}

          <Button
            variant="primary"
            fullWidth
            className="mt-4"
            disabled={loading}
            type="submit"
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>

          <div className="flex flex-wrap justify-center items-center gap-1 text-center">
            <span className="text-text-secondary text-body-medium">
              Don't have an account?
            </span>
            <Link
              to="/register"
              className="text-primary-blue text-body-medium-bold hover:underline"
            >
              Create Account
            </Link>
          </div>
        </form>
      </div>
    </Card>
  );
};

export default LoginForm;
