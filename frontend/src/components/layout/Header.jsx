import React from 'react';
import { Search, Bell } from 'lucide-react';
import Button from '../common/Button';

const Header = ({ title = "News Feed", rightContent }) => {
  return (
    <header className="h-16 w-full px-8 bg-dark-1/80 backdrop-blur-md border-b border-primary-blue/20 flex justify-between items-center sticky top-0 z-10 font-inter">
      {/* Dynamic Title */}
      <div className="flex flex-col justify-center">
        <h2 className="text-white text-2xl font-bold leading-8 tracking-tight">
          {title}
        </h2>
      </div>

      {/* Action Icons / Search Slot */}
      <div className="flex items-center gap-4">
        {rightContent ? (
          rightContent
        ) : (
          <div className="flex items-center gap-2">
            {/* Default Search Icon Toggle */}
            <button className="p-2 relative flex items-center justify-center shrink-0 hover:bg-white/5 rounded-full transition-colors" onClick={() => console.log('Search')}>
               <img src="/icon_search.svg" alt="Search" className="w-6 h-6 opacity-70" />
            </button>
            
            <Button 
                variant="ghost" 
                className="w-12 h-12 p-0 relative flex items-center justify-center shrink-0" 
                onClick={() => console.log('Notifications')}
            >
              <Bell size={24} />
              <span className="absolute top-3 right-3 w-2 h-2 bg-state-error rounded-full border border-dark-1"></span>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;