import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Card from "../common/Card";
import Input from "../common/Input";
import Button from "../common/Button";
import { login } from "../../services/authService";
import { Link, useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

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
      const data = await login(identifier, password);
      
      // Navigate based on user role (Navigation occurs AFTER tokens are stored in authService)
      const role = data.user.role.toLowerCase();
      
      if (role === "admin") {
        navigate("/admin");
      } else if (role === "student") {
        navigate("/newsfeed");
      } else if (role === "business") {
        navigate("/business/dashboard");
      } else if (role === "club") {
        navigate("/club/dashboard");
      } else {
        // Fallback or generic dashboard
        navigate("/newsfeed");
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
