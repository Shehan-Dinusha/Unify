const Header = ({ title = "News Feed", rightContent, onMenuClick }) => {
  return (
    <header className="h-16 w-full px-4 lg:px-8 bg-dark-1/80 backdrop-blur-md border-b border-primary-blue/20 flex justify-between items-center sticky top-0 z-10 font-inter">
      {/* Dynamic Title */}
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button
            className="lg:hidden p-2 -ml-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            onClick={onMenuClick}
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        )}
        <div className="flex flex-col justify-center">
          <h2 className="text-white text-2xl font-bold leading-8 tracking-tight">
            {title}
          </h2>
        </div>
      </div>

      {/* Action Icons / Search Slot*/}
      <div className="flex items-center gap-4">
        {rightContent ? (
          rightContent
        ) : (
          <div className="flex items-center gap-2">

            <button className="p-2 relative flex items-center justify-center shrink-0 hover:bg-white/5 rounded-full transition-colors" onClick={() => console.log('Search')}>
              <img src="/icon_search.svg" alt="Search" className="w-6 h-6 opacity-70" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
