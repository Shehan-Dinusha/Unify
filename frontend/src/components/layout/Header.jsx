import { Menu } from 'lucide-react';

const Header = ({ title = "News Feed", rightContent, onMenuClick }) => {
  return (
    <header className="h-14 md:h-16 w-full px-4 md:px-8 bg-dark-1/80 backdrop-blur-md border-b border-primary-blue/20 flex justify-between items-center sticky top-0 z-10 font-inter">
      {/* Left: Hamburger + Title */}
      <div className="flex items-center gap-sm">
        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-1.5 rounded-lg hover:bg-white/10 transition-colors text-text-primary"
        >
          <Menu size={22} />
        </button>

        {/* Dynamic Title */}
        <div className="flex flex-col justify-center">
          <h2 className="text-white text-lg md:text-2xl font-bold leading-8 tracking-tight">
            {title}
          </h2>
        </div>
      </div>

      {/* Right content — hidden on very small screens if needed */}
      {rightContent && (
        <div className="flex items-center">
          {rightContent}
        </div>
      )}
    </header>
  );
};

export default Header;