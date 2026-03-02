import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "./common/Button";

const LandingHero = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full flex flex-col items-center text-center">
      {/* Heading */}
      <h1
        className="
        text-heading-display 
        text-white 
        leading-[72px] 
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
        mt-6 
        text-body-large-bold 
        text-text-secondary 
        max-w-[600px]
      "
      >
        Explore university updates, university services and interact with
        university communities
      </p>

      {/* CTA Buttons */}
      <div className="mt-10 flex items-center justify-center gap-6 flex-wrap">
        <Button
          size="large"
          variant="primary"
          className="min-w-[220px]"
          onClick={() => navigate("/register")}
        >
          Create Account
        </Button>

        <Button
          size="large"
          variant="outline"
          className="min-w-[220px]"
          onClick={() => navigate("/login")}
        >
          Sign In
        </Button>
      </div>
    </section>
  );
};

export default LandingHero;
