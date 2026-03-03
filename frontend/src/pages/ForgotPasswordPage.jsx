import React, { useState, useEffect } from "react";
import LandingLayout from "../components/layout/LandingLayout";
import AuthenticationHeader from "../components/auth/AuthenticationHeader";
import ForgotPasswordForm from "../components/auth/ForgotPasswordForm";
import OtpForm from "../components/auth/OtpForm";
import ResetPasswordForm from "../components/auth/ResetPasswordForm";
import SuccessMessage from "../components/auth/SuccessMessage";

const ForgotPasswordPage = () => {
  const [step, setStep] = useState("email");
  const [userIdentifier, setUserIdentifier] = useState("");

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
      main.style.overflow = "hidden";
      main.style.display = "flex";
      main.style.flexDirection = "column";
      main.style.justifyContent = "center";
    }

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
    };
  }, []);

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
            onVerify={() => setStep("reset")}
            onBack={() => setStep("email")}
          />
        );
      case "reset":
        return <ResetPasswordForm onReset={() => setStep("success")} />;
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
