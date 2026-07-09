import React from "react";
import { Search, X } from "lucide-react";

const SearchBar = ({ searchInputRef, searchQuery, setSearchQuery, showSearch, setShowSearch }) => (
  <div className="flex items-center gap-2">
    {showSearch && (
      <div className="flex items-center bg-dark-2 border border-primary-blue/30 rounded-full px-4 py-1.5 animate-in slide-in-from-right-4 duration-200">
        <Search size={16} className="text-text-secondary mr-2 shrink-0" />
        <input ref={searchInputRef} type="text" placeholder="Search saved posts..." value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent text-sm text-white placeholder-text-secondary outline-none w-48 sm:w-64" />
        {searchQuery && (
          <button onClick={() => setSearchQuery("")} className="ml-1 text-text-secondary hover:text-white transition-colors"><X size={14} /></button>
        )}
      </div>
    )}
    <button onClick={() => { setShowSearch(!showSearch); if (showSearch) setSearchQuery(""); }}
      className={`p-2 flex items-center justify-center shrink-0 rounded-full transition-colors ${showSearch ? "bg-primary-blue/20 text-primary-blue" : "hover:bg-white/5"}`}>
      {showSearch ? <X size={20} className="text-primary-blue" /> : <img src="/icon_search.svg" alt="Search" className="w-6 h-6 opacity-70" />}
    </button>
  </div>
);

export default SearchBar;
