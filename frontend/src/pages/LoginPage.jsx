import React, { useEffect } from "react";
import LandingLayout from "../components/layout/LandingLayout";
import LoginForm from "../components/auth/LoginForm";

const LoginPage = () => {
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
      main.style.overflow = "hidden"; // Strictly no scroll
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
      <div className="relative flex items-center justify-center min-h-[calc(100vh-80px)]">
        {" "}
        {/* Adjust height for header/footer if needed */}
        <LoginForm />
      </div>
    </LandingLayout>
  );
};

export default LoginPage;
