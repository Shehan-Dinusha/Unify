import React, { useEffect } from "react";
import LandingLayout from "../components/layout/LandingLayout";
import LandingHero from "../components/LandingHero";

const LandingHome = () => {
  useEffect(() => {
    // Strict fix to screen
    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh";

    const container = document.querySelector(".bg-app-bg");
    const main = document.querySelector("main");

    if (container) {
      container.style.height = "100vh";
      container.style.overflow = "hidden";
    }
    if (main) {
      main.style.overflow = "hidden";
      main.style.display = "flex";
      main.style.flexDirection = "column";
      main.style.justifyContent = "center";
    }

    // Restore on unmount
    return () => {
      document.body.style.overflow = "auto";
      document.body.style.height = "auto";
      if (container) {
        container.style.height = "auto";
        container.style.overflow = "visible";
      }
      if (main) {
        main.style.overflow = "visible";
      }
    };
  }, []);

  return (
    <LandingLayout>
      <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        <LandingHero />
      </div>
    </LandingLayout>
  );
};

export default LandingHome;
