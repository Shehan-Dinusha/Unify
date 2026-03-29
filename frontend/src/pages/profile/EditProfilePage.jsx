import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import StudentDetailsForm from "../../components/auth/StudentDetailsForm";
import BoardingDetailsForm from "../../components/auth/BoardingDetailsForm";
import CafeDetailsForm from "../../components/auth/CafeDetailsForm";
import ClubDetailsForm from "../../components/auth/ClubDetailsForm";
import SelfEmployedDetailsForm from "../../components/auth/SelfEmployedDetailsForm";

/* ─── role → sidebar / display mapping ─────────────────────────── */
const roleToSidebarRole = {
  student: "student",
  boarding_owner: "business",
  club_society: "club",
  food_cafe: "business",
  self_employed: "business",
};

const roleDisplayNames = {
  student: "Student",
  boarding_owner: "Business & Organization",
  club_society: "Clubs & Societies",
  food_cafe: "Business & Organization",
  self_employed: "Business & Organization",
};

const roleUserNames = {
  student: "Alex Johnson",
  boarding_owner: "John Doe",
  club_society: "Alex Johnson",
  food_cafe: "John Doe",
  self_employed: "John Doe",
};

/* ─── Page ──────────────────────────────────────────────────────── */
const EditProfilePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const activeRole = searchParams.get("role") || "student";

  const user = {
    name: roleUserNames[activeRole] || "Alex Johnson",
    role: roleToSidebarRole[activeRole] || "student",
    displayRole: roleDisplayNames[activeRole] || "Student",
  };

  // Called when the form's save button is submitted
  const handleSave = (formData) => {
    // TODO: call PUT /api/profile when backend is ready
    console.log("Profile update:", formData);
    navigate(`/profile?role=${activeRole}`);
  };

  const renderForm = () => {
    switch (activeRole) {
      case "boarding_owner":
        return <BoardingDetailsForm onNext={handleSave} />;
      case "food_cafe":
        return <CafeDetailsForm onNext={handleSave} />;
      case "club_society":
        return <ClubDetailsForm onNext={handleSave} />;
      case "self_employed":
        return <SelfEmployedDetailsForm onNext={handleSave} />;
      case "student":
      default:
        return <StudentDetailsForm onNext={handleSave} />;
    }
  };

  return (
    <MainLayout user={user} pageTitle="Settings" verificationCount={0}>
      <div className="w-full flex flex-col items-center justify-center py-6 px-4">
        {renderForm()}
      </div>
    </MainLayout>
  );
};

export default EditProfilePage;
