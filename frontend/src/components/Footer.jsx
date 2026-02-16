import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-900 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    {/* Copyright */}
                    <div className="text-[#94A3B8] text-sm font-normal font-['Inter'] leading-5 order-2 md:order-1">
                        © 2025 Unify. All rights reserved.
                    </div>

                    {/* Links */}
                    <div className="flex flex-wrap justify-center gap-6 order-1 md:order-2">
                        <Link to="/privacy" className="text-[#94A3B8] text-sm font-normal font-['Inter'] leading-5 hover:text-white transition-colors">
                            Privacy Policy
                        </Link>
                        <Link to="/terms" className="text-[#94A3B8] text-sm font-normal font-['Inter'] leading-5 hover:text-white transition-colors">
                            Terms of Service
                        </Link>
                        <Link to="/help" className="text-[#94A3B8] text-sm font-normal font-['Inter'] leading-5 hover:text-white transition-colors">
                            Help Center
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
