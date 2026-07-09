import { Menu } from "lucide-react";

const Header = ({ title = "News Feed", rightContent, onMenuToggle }) => {
  return (
    <header className="h-16 w-full px-4 md:px-8 bg-dark-1/80 backdrop-blur-md border-b border-primary-blue/20 flex justify-between items-center sticky top-0 z-30 font-inter">
      {/* Dynamic Title */}
      <div className="flex items-center gap-2 md:gap-3 min-w-0 mr-2">
        {onMenuToggle && (
          <button
            className="md:hidden p-2 -ml-2 text-text-secondary hover:text-white transition-colors rounded-lg"
            onClick={onMenuToggle}
            aria-label="Toggle Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}
        <h2 className="text-white text-xl md:text-2xl font-bold leading-8 tracking-tight truncate">
          {title}
        </h2>
      </div>

      {/* Action Icons / Custom Right Content */}
      <div className="flex items-center gap-4">
        {rightContent}
      </div>
    </header>
  );
};

export default Header;
