import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Input from "../common/Input";
import Button from "../common/Button";
import { login } from "../../services/authService";
import { Link, useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    let tempErrors = {};

    // Identifier Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^0\d{9}$/;

    if (!identifier) {
      tempErrors.identifier = "Email or Phone Number is required";
    } else if (!emailRegex.test(identifier) && !phoneRegex.test(identifier)) {
      tempErrors.identifier =
        "Please enter a valid email or 10-digit phone number";
    }

    // Password Validation
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
    setErrors({}); // Clear previous errors

    try {
      await login(identifier, password);
      console.log("Login Successful");
      // navigate('/dashboard');
    } catch (err) {
      setErrors({ form: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[480px] bg-white/10 rounded-3xl p-1 px-8 py-10 shadow-[0px_8px_32px_0px_rgba(31,38,135,0.37)] border border-white/10 backdrop-blur-md">
      <div className="flex flex-col items-center gap-10 mb-8">
        <div className="w-full inline-flex flex-col justify-center items-center gap-2">
          <div className="self-stretch text-center justify-center text-white text-3xl text-heading-medium leading-9">
            Welcome Back
          </div>
          <div className="self-stretch text-center justify-center text-slate-400 text-body-small leading-5">
            Sign in to access your courses and community.
          </div>
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
          {/* Identifier Input */}
          <Input
            label="Email or Phone number"
            placeholder="Enter your email or Phone Number"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            error={errors.identifier}
            className="text-white"
          />

          {/* Password Input */}
          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              className="text-white"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-[38px] text-gray-400 hover:text-white transition-colors"
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

          {/* General Error Message */}
          {errors.form && (
            <div className="text-state-error text-sm text-center bg-state-error/10 p-2 rounded-lg">
              {errors.form}
            </div>
          )}

          <Button
            variant="primary"
            fullWidth
            className="h-12 rounded-2xl shadow-[0px_4px_6px_-4px_rgba(43,140,238,0.25)] mt-8"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>

          <div className="flex justify-center items-center gap-2">
            <span className="text-slate-400 text-body-medium">
              Don't have an account?
            </span>
            <a
              href="#"
              className="text-primary-blue text-body-medium-bold hover:underline"
            >
              Create Account
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
