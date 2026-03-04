import React, { useState } from "react";
import LandingLayout from "../components/layout/LandingLayout";
import AuthenticationHeader from "../components/auth/AuthenticationHeader";
import ChooseMainType from "../components/auth/ChooseMainType";
import ChooseBusinessType from "../components/auth/ChooseBusinessType";
import StudentRegisterForm from "../components/auth/StudentRegisterForm";
import BusinessRegisterForm from "../components/auth/BusinessRegisterForm";
import OtpForm from "../components/auth/OtpForm";
import StudentDetailsForm from "../components/auth/StudentDetailsForm";
import BoardingDetailsForm from "../components/auth/BoardingDetailsForm";
import ClubDetailsForm from "../components/auth/ClubDetailsForm";
import CafeDetailsForm from "../components/auth/CafeDetailsForm";
import SelfEmployedDetailsForm from "../components/auth/SelfEmployedDetailsForm";
import SuccessMessage from "../components/auth/SuccessMessage";

const RegisterPage = () => {
  const [step, setStep] = useState("main"); // main, subtype, register, otp, details, success

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);
  const [mainType, setMainType] = useState(null); // student, business
  const [businessType, setBusinessType] = useState(null); // boarding, club, cafe, self-employed
  const [email, setEmail] = useState("");
  const [formData, setFormData] = useState({});

  const renderStep = () => {
    switch (step) {
      case "main":
        return (
          <ChooseMainType
            onNext={(type) => {
              setMainType(type);
              if (type === "student") {
                setStep("register");
              } else {
                setStep("subtype");
              }
            }}
          />
        );
      case "subtype":
        return (
          <ChooseBusinessType
            onSelect={(type) => {
              setBusinessType(type);
              setStep("register");
            }}
            onBack={() => setStep("main")}
          />
        );
      case "register":
        return mainType === "student" ? (
          <StudentRegisterForm
            onNext={(id) => {
              setEmail(id);
              setStep("otp");
            }}
            onBack={() => setStep("main")}
          />
        ) : (
          <BusinessRegisterForm
            onNext={(id) => {
              setEmail(id);
              setStep("otp");
            }}
            onBack={() => setStep("subtype")}
          />
        );
      case "otp":
        return (
          <OtpForm
            email={email}
            onVerify={() => setStep("details")}
            onBack={() => setStep("register")}
          />
        );
      case "details":
        if (mainType === "student") {
          return (
            <StudentDetailsForm
              onNext={(data) => {
                setFormData({ ...formData, ...data });
                setStep("success");
              }}
            />
          );
        }
        // Business details based on subtype
        switch (businessType) {
          case "boarding":
            return <BoardingDetailsForm onNext={() => setStep("success")} />;
          case "club":
            return <ClubDetailsForm onNext={() => setStep("success")} />;
          case "cafe":
            return <CafeDetailsForm onNext={() => setStep("success")} />;
          case "self-employed":
            return (
              <SelfEmployedDetailsForm onNext={() => setStep("success")} />
            );
          default:
            return null;
        }
      case "success":
        return (
          <SuccessMessage
            title="Account Created Successfully"
            message="Your Unify account has been created. You can now log in and start connecting with your campus community."
          />
        );
      default:
        return <ChooseMainType onNext={(type) => setMainType(type)} />;
    }
  };

  return (
    <LandingLayout Header={AuthenticationHeader}>
      <div className="flex-1 flex flex-col items-center justify-start md:justify-center py-6 md:py-4 px-4 min-h-screen relative z-10 pt-16 md:pt-4">
        <div className="w-full flex flex-col items-center justify-center">
          {renderStep()}
        </div>
      </div>
    </LandingLayout>
  );
};

export default RegisterPage;
