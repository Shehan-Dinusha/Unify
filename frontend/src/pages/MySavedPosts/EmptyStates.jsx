import React from "react";
import { Bookmark, Search } from "lucide-react";

const EmptyStates = ({ savedPosts, filteredPosts, searchQuery, onBrowseFeed }) => {
  if (savedPosts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-primary-blue/10 flex items-center justify-center mb-5">
          <Bookmark size={36} className="text-primary-blue" />
        </div>
        <h2 className="text-body-large-bold text-text-primary mb-2">No saved posts yet</h2>
        <p className="text-body-medium text-text-secondary max-w-sm mb-6">When you save posts from the News Feed, they&apos;ll appear here for easy access.</p>
        <button onClick={onBrowseFeed}
          className="px-6 py-2.5 bg-primary-blue hover:bg-primary-blue/90 text-white text-body-small-bold rounded-full transition-colors">Browse News Feed</button>
      </div>
    );
  }

  if (filteredPosts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
          <Search size={28} className="text-text-tertiary" />
        </div>
        <h2 className="text-body-large-bold text-text-primary mb-1">No results matching &quot;{searchQuery}&quot;</h2>
        <p className="text-body-small text-text-secondary">Try adjusting your search terms.</p>
      </div>
    );
  }

  return null;
};

export default EmptyStates;
