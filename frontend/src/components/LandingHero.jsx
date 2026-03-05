import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "./common/Button";

const LandingHero = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full flex flex-col items-center text-center px-2">
      {/* Heading */}
      <h1
        className="
        text-4xl sm:text-5xl lg:text-heading-display 
        font-black font-inter
        text-white 
        leading-tight sm:leading-[72px] 
        tracking-tight
        max-w-[900px]
      "
      >
        The University <br />
        Experience, <span className="text-primary-blue">Unified</span>
      </h1>

      {/* Subheading */}
      <p
        className="
        mt-4 sm:mt-6 
        text-sm sm:text-body-large-bold 
        text-text-secondary 
        max-w-[600px]
      "
      >
        Explore university updates, university services and interact with
        university communities
      </p>

      {/* CTA Buttons */}
      <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full max-w-sm sm:max-w-none">
        <Button
          size="large"
          variant="primary"
          className="w-full sm:w-auto sm:min-w-[220px]"
          onClick={() => navigate("/register")}
        >
          Create Account
        </Button>

        <Button
          size="large"
          variant="outline"
          className="w-full sm:w-auto sm:min-w-[220px]"
          onClick={() => navigate("/login")}
        >
          Sign In
        </Button>
      </div>
    </section>
  );
};

export default LandingHero;
