import React from 'react';
import LandingHeader from '../components/layout/LandingHeader';
import LandingFooter from '../components/layout/LandingFooter';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-app-bg text-white font-inter relative overflow-hidden">
      
      {/* Background Glow Effect (Optional implementation of the 'blue haze' in design) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-blue/20 blur-[150px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[50%] bg-primary-accent/10 blur-[150px] rounded-full pointer-events-none z-0"></div>

      <LandingHeader />

      <main className="flex-grow flex flex-col items-center justify-center text-center px-4 relative z-10 pt-20">
        
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-heading-large md:text-heading-display font-black tracking-tight leading-tight">
            The University<br />
            Experience, <span className="text-primary-blue">Unified</span>
          </h1>
          
          <p className="text-text-secondary text-body-large md:text-2xl max-w-2xl mx-auto leading-relaxed">
            Explore university updates, university services<br className="hidden md:block" />
            and interact with university communities
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <button className="w-full sm:w-auto px-8 py-3 bg-primary-blue hover:bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:shadow-primary-blue/30 transition-all duration-300 transform hover:-translate-y-1">
              Create Account
            </button>
            <button className="w-full sm:w-auto px-8 py-3 bg-transparent border border-white/20 hover:border-white text-white font-bold rounded-lg hover:bg-white/5 transition-all duration-300">
              Sign In
            </button>
          </div>
        </div>

      </main>

      <LandingFooter />
    </div>
  );
};

export default LandingPage;
