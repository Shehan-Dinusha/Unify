import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LandingLayout from "../components/layout/LandingLayout";
import OtpForm from "../components/auth/OtpForm";

const RegisterOtpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mainType, businessType, email } = location.state || {};

  // Guard: redirect if state is missing
  if (!mainType || !email) {
    navigate("/register", { replace: true });
    return null;
  }

  return (
    <LandingLayout>
      <div className="flex-1 flex flex-col items-center justify-center py-4 px-4">
        <OtpForm
          email={email}
          onVerify={() => {
            navigate("/register/profile", {
              state: { mainType, businessType, email },
            });
          }}
          onBack={() => navigate(-1)}
        />
      </div>
    </LandingLayout>
  );
};

export default RegisterOtpPage;
