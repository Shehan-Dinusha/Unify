import React from 'react';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
    return (
        <div className="relative bg-gradient-to-b from-gray-900 to-slate-800 overflow-hidden min-h-screen flex items-center justify-center pt-20">
            {/* Background Blurs */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-[#2B8CEE]/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#6A3093]/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

            {/* Content Container */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
                <div className="space-y-16 max-w-4xl">
                    {/* Headline */}
                    <h1 className="flex flex-col items-center gap-6">
                        <span className="text-white text-5xl md:text-7xl font-black font-['Inter'] leading-tight md:leading-[72px]">The University<br/>Experience, </span>
                        <span className="text-[#2B8CEE] text-5xl md:text-7xl font-black font-['Inter'] leading-tight md:leading-[72px]">Unified</span>
                    </h1>

                    {/* Subheadline */}
                    <p className="text-[#94A3B8] text-lg md:text-xl font-bold font-['Inter'] leading-5 max-w-[645px] mx-auto">
                        Explore university updates, university services<br className="hidden md:block" />
                        and interact with university communities
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button className="w-48 h-12 bg-[#2B8CEE] hover:bg-[#2B8CEE]/90 text-white rounded-2xl shadow-[0px_4px_6px_-4px_rgba(43,140,238,0.25)] shadow-[0px_10px_15px_-3px_rgba(43,140,238,0.25)] text-base font-bold font-['Inter'] leading-5 transition-all transform hover:scale-105 flex items-center justify-center">
                            Create Account
                        </button>
                        <button className="w-48 h-12 rounded-2xl outline outline-2 outline-offset-[-2px] outline-[#2B8CEE] text-white hover:bg-[#2B8CEE]/10 text-base font-bold font-['Inter'] leading-5 transition-all transform hover:scale-105 flex items-center justify-center">
                            Sign In
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
