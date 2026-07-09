import React, { createContext, useContext, useState, useEffect } from "react";
import newsfeedService from "../services/newsfeedService";

const SavedPostsContext = createContext();

export const useSavedPosts = () => useContext(SavedPostsContext);

export const SavedPostsProvider = ({ children }) => {
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      setLoading(false);
      return;
    }
    const fetchSavedPosts = async () => {
      try {
        const { savedItems } = await newsfeedService.getSavedPosts();
        setSavedPosts(savedItems || []);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchSavedPosts();
  }, []);

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
