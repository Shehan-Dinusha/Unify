import React from "react";
import { useNavigate } from "react-router-dom";
import LandingLayout from "../../components/layout/LandingLayout";
import ChooseMainType from "../../components/auth/ChooseMainType";

const RegisterPage = () => {
  const navigate = useNavigate();

  const handleSelect = (mainType) => {
    if (mainType === "student") {
      navigate("/register/credentials", { state: { mainType } });
    } else {
      navigate("/register/account-type", { state: { mainType } });
    }
  };

  return (
    <LandingLayout>
      <div className="flex-1 flex flex-col items-center justify-center py-4 px-4">
        <ChooseMainType onNext={handleSelect} />
      </div>
    </LandingLayout>
  );
};

export default RegisterPage;
