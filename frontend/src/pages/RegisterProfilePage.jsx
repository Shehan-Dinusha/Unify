import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LandingLayout from "../components/layout/LandingLayout";
import StudentDetailsForm from "../components/auth/StudentDetailsForm";
import BoardingDetailsForm from "../components/auth/BoardingDetailsForm";
import ClubDetailsForm from "../components/auth/ClubDetailsForm";
import CafeDetailsForm from "../components/auth/CafeDetailsForm";
import SelfEmployedDetailsForm from "../components/auth/SelfEmployedDetailsForm";
import { 
  updateStudentProfile, 
  updateBusinessProfile, 
  updateClubProfile
} from "../services/profileService";

const RegisterProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mainType, businessType } = location.state || {};
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  // Guard: redirect if state is missing
  if (!mainType) {
    navigate("/register", { replace: true });
    return null;
  }

  const handleSuccess = async (formData) => {
    setLoading(true);
    setError("");
    try {
      if (mainType === "student") {
        await updateStudentProfile(formData);
      } else if (mainType === "business") {
        if (businessType === "club") {
          const { document, ...rest } = formData;
          await updateClubProfile({ ...rest, clubDoc: document });
        } else {
          let category = businessType.toUpperCase();
          if (category === "CAFE") category = "FOOD";
          if (category === "SELF-EMPLOYED") category = "SELF_EMPLOYED";
          await updateBusinessProfile({ ...formData, category });
        }
      }


      navigate("/register/success");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
        {error && (
          <div className="mb-4 p-3 bg-status-error/10 border border-status-error/20 rounded-xl text-status-error text-body-small text-center w-full max-w-[680px]">
            {error}
          </div>
        )}
        {loading && (
          <div className="mb-4 text-primary-blue text-body-small-bold animate-pulse">
            Updating your profile...
          </div>
        )}
        {renderForm()}
      </div>
    </LandingLayout>
  );
};

export default RegisterProfilePage;
