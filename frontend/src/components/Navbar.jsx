import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed w-full z-50 bg-gradient-to-b from-gray-900 to-slate-800 border-b border-[#2B8CEE]/20 backdrop-blur-[6px]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo Section */}
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-10 relative">
                            {/* Simple logo representation matching the design blocks */}
                            <div className="w-11 h-8 absolute bg-white rounded-sm" />
                            <div className="w-6 h-6 left-[26px] top-[16px] absolute bg-white rounded-sm" />
                            <div className="w-4 h-3 left-[10px] top-[15px] absolute bg-white rounded-sm" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white text-3xl font-bold font-['Inter'] leading-9">Unify</span>
                            <span className="text-[#94A3B8] text-sm font-bold font-['Inter'] leading-5 hidden sm:block">
                                University Social & Learning Platform
                            </span>
                        </div>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            <Link to="/" className="text-white text-sm font-bold font-['Inter'] leading-5 hover:text-[#2B8CEE] transition-colors">Home</Link>
                            <Link to="/about" className="text-[#94A3B8] text-sm font-normal font-['Inter'] leading-5 hover:text-white transition-colors">About Us</Link>
                            <Link to="/features" className="text-[#94A3B8] text-sm font-normal font-['Inter'] leading-5 hover:text-white transition-colors">Features</Link>
                            <Link to="/support" className="text-[#94A3B8] text-sm font-normal font-['Inter'] leading-5 hover:text-white transition-colors">Support</Link>
                            <Link to="/pricing" className="text-[#94A3B8] text-sm font-normal font-['Inter'] leading-5 hover:text-white transition-colors">Pricing</Link>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            type="button"
                            className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                            aria-controls="mobile-menu"
                            aria-expanded="false"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden" id="mobile-menu">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-900 border-b border-gray-700">
                        <Link to="/" className="text-white block px-3 py-2 rounded-md text-base font-bold">Home</Link>
                        <Link to="/about" className="text-[#94A3B8] hover:text-white block px-3 py-2 rounded-md text-base font-medium">About Us</Link>
                        <Link to="/features" className="text-[#94A3B8] hover:text-white block px-3 py-2 rounded-md text-base font-medium">Features</Link>
                        <Link to="/support" className="text-[#94A3B8] hover:text-white block px-3 py-2 rounded-md text-base font-medium">Support</Link>
                        <Link to="/pricing" className="text-[#94A3B8] hover:text-white block px-3 py-2 rounded-md text-base font-medium">Pricing</Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
