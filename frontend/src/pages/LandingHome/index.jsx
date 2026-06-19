import React from "react";
import LandingLayout from "../../components/layout/LandingLayout";
import LandingHero from "../../components/LandingHero";

const LandingHome = () => {
  return (
    <LandingLayout>
      <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        <LandingHero />
      </div>
    </LandingLayout>
  );
};

export default LandingHome;
