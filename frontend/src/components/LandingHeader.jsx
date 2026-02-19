import React from "react";
import { Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Button from "./common/Button";

const NavLink = ({ label, href = "#", active = false }) => (
  <Link
    to={href}
    className={`text-sm font-semibold transition-colors duration-200 ${
      active ? "text-white" : "text-text-secondary hover:text-white"
    }`}
  >
    {label}
  </Link>
);

const LandingHeader = () => {
  const location = useLocation();

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Features", href: "/features" },
    { label: "Support", href: "/support" },
    { label: "Pricing", href: "/pricing" },
  ];

  return (
    <header className="w-full fixed top-0 left-0 z-50 bg-gradient-to-b from-dark-1 to-dark-2 border-b border-white/10 backdrop-blur-md">
      <div className="max-w-[1440px] mx-auto h-20 px-8 lg:px-28 flex justify-between items-center">
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <img
            src="/icon_unify_logo.svg"
            alt="Unify Logo"
            className="w-10 h-10 object-contain"
          />

          <div className="flex flex-col leading-none">
            <h1 className="text-white text-2xl font-bold">Unify</h1>
            <p className="text-text-secondary text-xs font-medium">
              University Social & Learning Platform
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-10">
          {navItems.map((item, index) => (
            <NavLink
              key={index}
              {...item}
              active={location.pathname === item.href}
            />
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4 md:hidden">
          {/* Mobile Menu */}
          <div>
            <Menu className="w-6 h-6 text-white cursor-pointer" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default LandingHeader;
