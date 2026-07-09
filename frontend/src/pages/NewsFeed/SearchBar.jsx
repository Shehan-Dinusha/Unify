import React from 'react';
import { Search, X, Loader2, User } from 'lucide-react';

const SearchBar = ({ showSearch, searchQuery, searchLoading, searchResults, searchInputRef, onToggle, onChange, onSelectResult }) => {
    if (!showSearch) {
        return (
            <button onClick={onToggle} className="p-2 flex items-center justify-center shrink-0 rounded-full transition-colors hover:bg-white/5">
                <img src="/icon_search.svg" alt="Search" className="w-6 h-6 opacity-70" />
            </button>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <div className="relative">
                <div className="flex items-center bg-dark-2 border border-primary-blue/30 rounded-full px-4 py-1.5 animate-in slide-in-from-right-4 duration-200">
                    <Search size={16} className="text-text-secondary mr-2 shrink-0" />
                    <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search businesses & clubs..."
                        value={searchQuery}
                        onChange={(e) => onChange(e.target.value)}
                        className="bg-transparent text-sm text-white placeholder-text-secondary outline-none w-48 sm:w-64"
                    />
                    {searchQuery && (
                        <button onClick={() => onChange('')} className="ml-1 text-text-secondary hover:text-white transition-colors">
                            <X size={14} />
                        </button>
                    )}
                </div>
                {searchQuery.trim().length >= 2 && (
                    <div className="absolute top-full mt-2 left-0 right-0 bg-dark-2 border border-white/10 rounded-xl shadow-xl z-50 max-h-72 overflow-y-auto">
                        {searchLoading ? (
                            <div className="flex items-center justify-center py-6">
                                <Loader2 className="w-5 h-5 text-primary-blue animate-spin" />
                            </div>
                        ) : searchResults.length > 0 ? (
                            searchResults.map((result) => (
                                <div
                                    key={result.id}
                                    onClick={() => onSelectResult(result)}
                                    className="flex items-center gap-3 p-3 hover:bg-white/10 cursor-pointer transition-colors border-b border-white/5 last:border-b-0"
                                >
                                    <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-dark-4 flex items-center justify-center">
                                        {result.avatar ? (
                                            <img src={result.avatar} alt={result.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <User size={18} className="text-text-secondary" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white text-sm font-semibold truncate">{result.name}</p>
                                        <span className="text-xs text-primary-blue">{result.role}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-6 text-text-secondary text-sm">
                                No profiles found for &quot;{searchQuery}&quot;
                            </div>
                        )}
                    </div>
                )}
            </div>
            <button onClick={onToggle} className="p-2 flex items-center justify-center shrink-0 rounded-full bg-primary-blue/20 text-primary-blue transition-colors">
                <X size={20} className="text-primary-blue" />
            </button>
        </div>
    );
};

export default SearchBar;
