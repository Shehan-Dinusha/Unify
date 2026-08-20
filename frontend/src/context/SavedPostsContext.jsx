import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import newsfeedService from "../services/newsfeedService";

const SavedPostsContext = createContext();

export const useSavedPosts = () => useContext(SavedPostsContext);

export const SavedPostsProvider = ({ children }) => {
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedPosts = useCallback(async () => {
    if (!localStorage.getItem("token")) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const { savedItems } = await newsfeedService.getSavedPosts();
      setSavedPosts(savedItems || []);
    } catch (error) {
      // silently fail — saved posts are non-critical
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load on mount
  useEffect(() => {
    fetchSavedPosts();
  }, [fetchSavedPosts]);

  /**
   * Optimistically toggle a post in/out of the saved list.
   * Matches on BOTH id AND postType to avoid cross-type collisions
   * (e.g. NormalPost id=5 vs ClubEventPost id=5).
   */
  const toggleSavePost = (post) => {
    const postType = post?.postType;
    setSavedPosts((prev) => {
      const exists = prev.find(
        (p) => p.id === post.id && p.postType === postType
      );
      if (exists) {
        return prev.filter(
          (p) => !(p.id === post.id && p.postType === postType)
        );
      }
      return [...prev, post];
    });
  };

  /**
   * Check whether a post (by id + postType) is currently saved.
   */
  const isPostSaved = (postId, postType) =>
    savedPosts.some((p) => p.id === postId && p.postType === postType);

  /**
   * Re-fetch saved posts from the backend.
   * Call this from pages that need fresh data (e.g. MySavedPosts on mount).
   */
  const refresh = fetchSavedPosts;

  return (
    <SavedPostsContext.Provider
      value={{ savedPosts, loading, toggleSavePost, isPostSaved, refresh }}
    >
      {children}
    </SavedPostsContext.Provider>
  );
};

export default SavedPostsContext;
