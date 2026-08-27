import React, { useState } from "react";
import LandingLayout from "../../components/layout/LandingLayout";
import AuthenticationHeader from "../../components/auth/AuthenticationHeader";
import ForgotPasswordForm from "../../components/auth/ForgotPasswordForm";
import OtpForm from "../../components/auth/OtpForm";
import ResetPasswordForm from "../../components/auth/ResetPasswordForm";
import SuccessMessage from "../../components/auth/SuccessMessage";

const ForgotPasswordPage = () => {
  const [step, setStep] = useState("email");
  const [userIdentifier, setUserIdentifier] = useState("");
  const [otp, setOtp] = useState("");

  const renderStep = () => {
    switch (step) {
      case "email":
        return (
          <ForgotPasswordForm
            onNext={(id) => {
              setUserIdentifier(id);
              setStep("otp");
            }}
          />
        );
      case "otp":
        return (
          <OtpForm
            email={userIdentifier}
            mode="reset"
            onVerify={(code) => {
              setOtp(code);
              setStep("reset");
            }}
            onBack={() => setStep("email")}
          />
        );
      case "reset":
        return (
          <ResetPasswordForm
            identifier={userIdentifier}
            otp={otp}
            onReset={() => setStep("success")}
          />
        );
      case "success":
        return <SuccessMessage />;
      default:
        return <ForgotPasswordForm onNext={() => setStep("otp")} />;
    }
  };

  return (
    <LandingLayout Header={AuthenticationHeader}>
      <div className="flex-1 flex items-center justify-center py-10 px-4 sm:px-0">
        {renderStep()}
      </div>
    </LandingLayout>
  );
};

export default ForgotPasswordPage;
