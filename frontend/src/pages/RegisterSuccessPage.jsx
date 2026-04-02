import React from "react";
import LandingLayout from "../components/layout/LandingLayout";
import SuccessMessage from "../components/auth/SuccessMessage";

const RegisterSuccessPage = () => {
  return (
    <LandingLayout>
      <div className="flex-1 flex flex-col items-center justify-center py-4 px-4">
        <SuccessMessage
          title="Account Created Successfully"
          message="Your Unify account has been created. You can now log in and start connecting with your campus community."
        />
      </div>
    </LandingLayout>
  );
};

export default RegisterSuccessPage;
