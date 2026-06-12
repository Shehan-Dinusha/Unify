import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LandingLayout from "../../components/layout/LandingLayout";
import StudentRegisterForm from "../../components/auth/StudentRegisterForm";
import BusinessRegisterForm from "../../components/auth/BusinessRegisterForm";

const RegisterCredentialsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mainType, businessType } = location.state || {};

  // Guard: redirect if state is missing
  if (!mainType) {
    navigate("/register", { replace: true });
    return null;
  }

  const handleNext = (email) => {
    navigate("/register/otp", {
      state: { mainType, businessType, email },
    });
  };

  return (
    <LandingLayout>
      <div className="flex-1 flex flex-col items-center justify-center py-4 px-4">
        {mainType === "student" ? (
          <StudentRegisterForm
            onNext={handleNext}
            onBack={() => navigate(-1)}
          />
        ) : (
          <BusinessRegisterForm
            onNext={handleNext}
            onBack={() => navigate(-1)}
            businessType={businessType}
          />
        )}
      </div>
    </LandingLayout>
  );
};

export default RegisterCredentialsPage;
