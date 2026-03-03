import React from "react";
import { Link } from "react-router-dom";

const LandingHeader = () => {
  return (
    <header className="w-full fixed top-0 left-0 z-50 bg-gradient-to-b from-dark-1 to-dark-2 border-b border-white/10 backdrop-blur-md">
      <div className="max-w-[1440px] mx-auto h-20 px-8 lg:px-28 flex items-center bg-dark-1/80 backdrop-blur-sm lg:bg-transparent lg:backdrop-blur-none transition-all duration-300">
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <img
            src="/icon_unify_logo.svg"
            alt="Unify Logo"
            className="w-10 h-10 object-contain"
          />

          <div className="flex flex-col leading-none">
            <h1 className="text-white text-heading-small font-bold">Unify</h1>
            <p className="text-text-secondary text-body-extra-small font-medium">
              University Social & Learning Platform
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default LandingHeader;
