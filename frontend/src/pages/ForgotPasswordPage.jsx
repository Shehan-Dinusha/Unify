import React from "react";
import LandingLayout from "../components/layout/LandingLayout";
import AuthenticationHeader from "../components/auth/AuthenticationHeader";
import ForgotPasswordForm from "../components/auth/ForgotPasswordForm";

const ForgotPasswordPage = () => {
  return (
    <LandingLayout Header={AuthenticationHeader}>
      <div className="relative flex items-center justify-center min-h-[calc(100vh-160px)] py-12">
        <ForgotPasswordForm />
      </div>
    </LandingLayout>
  );
};

export default ForgotPasswordPage;
