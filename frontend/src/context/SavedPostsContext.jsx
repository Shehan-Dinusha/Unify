import React, { createContext, useContext, useState } from "react";
import mockPosts from "../data/mockData";

const SavedPostsContext = createContext();

export const useSavedPosts = () => useContext(SavedPostsContext);

export const SavedPostsProvider = ({ children }) => {
  // Initialize with 3 posts for preview purposes
  const [savedPosts, setSavedPosts] = useState(mockPosts.slice(0, 3));

  const toggleSavePost = (post) => {
    setSavedPosts((prev) => {
      const exists = prev.find((p) => p.id === post.id);
      if (exists) {
        return prev.filter((p) => p.id !== post.id);
      }
      return [...prev, post];
    });
  };

  const isPostSaved = (postId) => savedPosts.some((p) => p.id === postId);

  return (
    <SavedPostsContext.Provider value={{ savedPosts, toggleSavePost, isPostSaved }}>
      {children}
    </SavedPostsContext.Provider>
  );
};

export default SavedPostsContext;
