import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LandingLayout from "../../components/layout/LandingLayout";
import ChooseBusinessType from "../../components/auth/ChooseBusinessType";

const RegisterAccountTypePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mainType } = location.state || {};

  // Guard: redirect if state is missing
  if (!mainType) {
    navigate("/register", { replace: true });
    return null;
  }

  return (
    <LandingLayout>
      <div className="flex-1 flex flex-col items-center justify-center py-4 px-4">
        <ChooseBusinessType
          onSelect={(businessType) => {
            navigate("/register/credentials", {
              state: { mainType, businessType },
            });
          }}
          onBack={() => navigate(-1)}
        />
      </div>
    </LandingLayout>
  );
};

export default RegisterAccountTypePage;
