import { Menu } from "lucide-react";

const Header = ({ title = "News Feed", rightContent, onMenuClick }) => {
  return (
    <header className="h-16 w-full px-4 md:px-8 bg-dark-1/80 backdrop-blur-md border-b border-primary-blue/20 flex justify-between items-center sticky top-0 z-10 font-inter">
      {/* Dynamic Title */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-white/5 rounded-xl transition-colors text-text-secondary hover:text-text-primary"
        >
          <Menu size={24} />
        </button>

        <h2 className="text-white text-lg md:text-2xl font-bold leading-8 tracking-tight truncate max-w-[150px] sm:max-w-none">
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
            <button
              className="p-2 relative flex items-center justify-center shrink-0 hover:bg-white/5 rounded-full transition-colors"
              onClick={() => console.log("Search")}
            >
              <img
                src="/icon_search.svg"
                alt="Search"
                className="w-6 h-6 opacity-70"
              />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
