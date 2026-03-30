import React, { createContext, useContext, useState } from "react";

const SavedPostsContext = createContext();

export const useSavedPosts = () => useContext(SavedPostsContext);

export const SavedPostsProvider = ({ children }) => {
  const [savedPosts, setSavedPosts] = useState([]);

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
