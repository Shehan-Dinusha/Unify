import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LandingLayout from "../components/layout/LandingLayout";
import StudentDetailsForm from "../components/auth/StudentDetailsForm";
import BoardingDetailsForm from "../components/auth/BoardingDetailsForm";
import ClubDetailsForm from "../components/auth/ClubDetailsForm";
import CafeDetailsForm from "../components/auth/CafeDetailsForm";
import SelfEmployedDetailsForm from "../components/auth/SelfEmployedDetailsForm";

const RegisterProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mainType, businessType } = location.state || {};

  // Guard: redirect if state is missing
  if (!mainType) {
    navigate("/register", { replace: true });
    return null;
  }

  const handleSuccess = () => {
    navigate("/register/success");
  };

  const renderForm = () => {
    if (mainType === "student") {
      return <StudentDetailsForm onNext={handleSuccess} />;
    }
    switch (businessType) {
      case "boarding":
        return <BoardingDetailsForm onNext={handleSuccess} />;
      case "club":
        return <ClubDetailsForm onNext={handleSuccess} />;
      case "cafe":
        return <CafeDetailsForm onNext={handleSuccess} />;
      case "self-employed":
        return <SelfEmployedDetailsForm onNext={handleSuccess} />;
      default:
        navigate("/register", { replace: true });
        return null;
    }
  };

  return (
    <LandingLayout>
      <div className="flex-1 flex flex-col items-center justify-center py-4 px-4">
        {renderForm()}
      </div>
    </LandingLayout>
  );
};

export default RegisterProfilePage;
