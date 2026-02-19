import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Button from "./common/Button";

const NavLink = ({ label, href = "#", active = false, onClick }) => (
  <Link
    to={href}
    onClick={onClick}
    className={`text-sm font-semibold transition-colors duration-200 ${
      active ? "text-white" : "text-text-secondary hover:text-white"
    }`}
  >
    {label}
  </Link>
);

const LandingHeader = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Features", href: "/features" },
    { label: "Support", href: "/support" },
    { label: "Pricing", href: "/pricing" },
  ];

  return (
    <header className="w-full fixed top-0 left-0 z-50 bg-gradient-to-b from-dark-1 to-dark-2 border-b border-white/10 backdrop-blur-md">
      <div className="max-w-[1440px] mx-auto h-20 px-8 lg:px-28 flex justify-between items-center bg-dark-1/80 backdrop-blur-sm lg:bg-transparent lg:backdrop-blur-none transition-all duration-300">
        {/* Logo Section */}
        <Link 
          to="/" 
          className="flex items-center gap-3 shrink-0"
          onClick={() => setIsMenuOpen(false)}
        >
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
        <nav className="hidden lg:flex items-center gap-10">
          {navItems.map((item, index) => (
            <NavLink
              key={index}
              {...item}
              active={location.pathname === item.href}
            />
          ))}
        </nav>

        {/* Right Actions - Mobile Menu Toggle */}
        <div className="flex items-center gap-4 lg:hidden">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`lg:hidden absolute top-20 left-0 w-full bg-dark-1 border-b border-white/10 shadow-xl transition-all duration-300 ease-in-out overflow-hidden ${
          isMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col p-6 gap-6">
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.href}
              onClick={() => setIsMenuOpen(false)}
              className={`text-lg font-medium ${
                location.pathname === item.href 
                  ? "text-primary-blue" 
                  : "text-white hover:text-primary-blue transition-colors"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default LandingHeader;
