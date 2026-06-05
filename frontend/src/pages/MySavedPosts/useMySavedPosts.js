import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSavedPosts } from "../../context/SavedPostsContext";
import { getCurrentUser } from "../../services/authService";

export const useMySavedPosts = () => {
  const navigate = useNavigate();
  const { savedPosts } = useSavedPosts();
  const currentUser = getCurrentUser();

  useEffect(() => { if (!currentUser) navigate("/login"); }, [currentUser, navigate]);

  const searchInputRef = useRef(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => { if (showSearch && searchInputRef.current) searchInputRef.current.focus(); }, [showSearch]);

  const filteredPosts = searchQuery.trim()
    ? savedPosts.filter(
        (post) =>
          post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.author?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : savedPosts;

  if (!currentUser) return { navigate, user: null, showSearch, setShowSearch, searchQuery, setSearchQuery, searchInputRef, filteredPosts, savedPosts: [] };

  const user = { name: currentUser.name || "Unknown User", role: currentUser.role?.toLowerCase() || "student", avatar: currentUser.avatar };

  return { navigate, user, showSearch, setShowSearch, searchQuery, setSearchQuery, searchInputRef, filteredPosts, savedPosts };
};
