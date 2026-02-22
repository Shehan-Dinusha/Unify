import React from 'react';
import { Search, Menu } from 'lucide-react';

import Button from './common/Button';

const NavLink = ({ label, href = "#", active = false }) => (
  <a 
    href={href}
    className={`text-sm font-bold font-inter transition-colors duration-200 ${
      active ? 'text-white' : 'text-text-secondary hover:text-white'
    }`}
  >
    {label}
  </a>
);



const LandingHeader = () => {
  const navItems = [
    { label: "Home", active: true },
    { label: "About Us" },
    { label: "Features" },
    { label: "Support" },
    { label: "Pricing" },
  ];

  return (
    <header className="w-full sticky top-0 z-50 bg-gradient-to-b from-dark-1/90 to-dark-2/80 border-b border-primary-blue/20 backdrop-blur-md">
      <div className="max-w-[1440px] mx-auto h-20 px-8 lg:px-20 flex justify-between items-center">
        
        {/* Logo Section */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-12 h-10 bg-white rounded flex items-center justify-center shadow-custom overflow-hidden">
             {/* Using a stylized 'U' for the white logo block */}
            <img src="/Unify_logo_White.svg" alt="Unify Logo" className="w-full h-full object-contain p-2 filter invert" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-white text-3xl font-bold font-inter leading-none">Unify</h1>
            <p className="text-text-secondary text-[10px] font-bold font-inter uppercase tracking-tighter">
              University Social & Learning
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item, index) => (
            <NavLink key={index} {...item} />
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" icon={Search} iconOnly onClick={() => console.log('Search')} />
          
          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <Button variant="ghost" icon={Menu} iconOnly onClick={() => console.log('Menu')} />
          </div>

          {/* Optional: Get Started Button (fits your style) */}
          <div className="hidden lg:block">
            <Button variant="primary" size="medium">Join Now</Button>
          </div>
        </div>

      </div>
    </header>
  );
};

export default LandingHeader;