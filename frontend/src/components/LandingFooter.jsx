import React from 'react';

const FooterLink = ({ label, href = "#" }) => (
  <a 
    href={href} 
    className="text-text-secondary text-sm font-normal font-inter hover:text-white transition-colors duration-200"
  >
    {label}
  </a>
);

const LandingFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-dark-1 border-t border-primary-blue/20">
      <div className="max-w-[1440px] mx-auto px-8 lg:px-28">
        <div className="w-full py-8 flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Copyright Section */}
          <div className="flex flex-col justify-start items-start">
            <p className="text-text-secondary text-sm font-normal font-inter leading-5">
              © {currentYear} Unify. All rights reserved.
            </p>
          </div>

          {/* Legal & Help Links */}
          <nav className="flex justify-center items-center gap-6 flex-wrap">
            <FooterLink label="Privacy Policy" />
            <FooterLink label="Terms of Service" />
            <FooterLink label="Help Center" />
          </nav>

        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;