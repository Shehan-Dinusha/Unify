import React, { useState, useEffect } from "react";
import Card from "../common/Card";
import Button from "../common/Button";
import { ArrowLeft, Timer } from "lucide-react";
import { verifyOTP, verifyResetOTP, resendOTP } from "../../services/authService";

const OtpForm = ({ email, onVerify, onBack, mode = "registration" }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(299); // 04:59 = 299 seconds
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const isEmail = email?.includes("@");
  const contactType = isEmail ? "email" : "phone number";

  const interval = React.useRef(null);

  useEffect(() => {
    interval.current = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval.current);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")} : ${secs.toString().padStart(2, "0")}`;
  };

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length === 6) {
      setLoading(true);
      setError("");
      setSuccess("");
      try {
        const payload = {
          [isEmail ? "email" : "phone"]: email,
          otp: otpValue,
        };

        let result;
        if (mode === "reset") {
          result = await verifyResetOTP(payload);
        } else {
          result = await verifyOTP(payload);
        }
        // Pass the full result so callers can detect special flows (e.g. linking)
        onVerify(otpValue, result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleResend = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      await resendOTP({ [isEmail ? "email" : "phone"]: email });
      setTimer(299); // Reset timer
      setSuccess("OTP resent successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-[480px]">
      {/* Messages */}
      {error && (
        <div className="mb-6 p-4 bg-state-error/10 border border-state-error/20 rounded-2xl text-state-error text-body-small text-center w-full">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 p-4 bg-state-success/10 border border-state-success/20 rounded-2xl text-state-success text-body-small text-center w-full">
          {success}
        </div>
      )}

      <Card variant="card" className="w-full">
        <div className="flex flex-col items-center gap-10">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="w-16 h-16 bg-primary-blue/10 rounded-2xl flex items-center justify-center overflow-hidden border border-white/10">
              <Timer className="text-primary-blue w-8 h-8" />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-white text-heading-medium">
                Verification Code
              </h2>
              <p className="text-text-secondary text-body-small px-4 leading-relaxed max-w-[360px]">
                Please enter the 6-digit code sent to your {contactType}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-8 w-full">
            {/* OTP Input Fields */}
            <div className="flex gap-1.5 sm:gap-3 justify-center w-full">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-10 h-14 sm:w-12 bg-white/5 border border-white/10 rounded-xl text-center text-white text-lg font-bold focus:border-primary-blue focus:bg-white/10 outline-none transition-all"
                />
              ))}
            </div>

            <div className="flex items-center gap-2 text-text-secondary text-body-small">
              <Timer size={16} className="text-primary-blue" />
              <span>Code expires in </span>
              <span className="text-primary-blue body-small-bold tracking-wider">
                {formatTime(timer)}
              </span>
            </div>

            <div className="w-full flex flex-col gap-6 items-center">
              <Button
                variant="primary"
                fullWidth
                disabled={loading || otp.join("").length < 6}
                onClick={handleVerify}
                className="shadow-custom-shadow"
              >
                {loading ? "Verifying..." : "Next"}
              </Button>

              <div className="flex flex-col items-center gap-4">
                <p className="text-text-secondary text-body-small text-center">
                  Didn't receive the {isEmail ? "email" : "code"}?{" "}
                  <button
                    type="button"
                    className="text-primary-blue hover:underline body-small-bold disabled:text-text-tertiary"
                    disabled={timer > 0 || loading}
                    onClick={handleResend}
                  >
                    Click to resend
                  </button>
                </p>

                <button
                  type="button"
                  className="flex items-center gap-2 text-text-tertiary hover:text-white transition-colors text-body-small font-medium"
                  onClick={onBack}
                >
                  <ArrowLeft size={16} />
                  Wrong {contactType}?
                </button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default OtpForm;
