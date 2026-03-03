import React, { useState, useEffect } from "react";
import Card from "../common/Card";
import Button from "../common/Button";
import { ArrowLeft, Timer } from "lucide-react";

const OtpForm = ({ email, onVerify, onBack }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(299); // 04:59 = 299 seconds
  const [loading, setLoading] = useState(false);
  const isEmail = email?.includes("@");
  const contactType = isEmail ? "email" : "phone number";

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

    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

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
      clearInterval(interval);
    };
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

  const handleVerify = (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length === 6) {
      setLoading(true);
      // Simulate verification
      setTimeout(() => {
        setLoading(false);
        onVerify();
      }, 1000);
    }
  };

  return (
    <Card variant="card" className="w-full max-w-[480px]">
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
              <p className="text-text-secondary text-body-small">
                Didn't receive the {isEmail ? "email" : "code"}?{" "}
                <button
                  type="button"
                  className="text-primary-blue hover:underline body-small-bold"
                  onClick={() => {
                    /* Resend Logic */
                  }}
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
  );
};

export default OtpForm;
