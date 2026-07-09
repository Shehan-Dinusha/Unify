import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import postService from "../../services/postService";
import { getCurrentUser } from "../../services/authService";

export const useCreateFoodCafePost = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFiles = (files) => {
    const newImages = Array.from(files)
      .filter(file => file.type.startsWith('image/'))
      .map(file => ({
        id: Date.now() + Math.random(),
        url: URL.createObjectURL(file),
        file,
      }));
    if (newImages.length > 0) setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (id) => setImages(prev => prev.filter(img => img.id !== id));

  const handleCancel = () => navigate("/food-cafe-owner/marketplace");

  const handlePublish = async () => {
    if (!description) { alert("Please fill in all required fields."); return; }
    try {
      setLoading(true);
      const data = new FormData();
      data.append("description", description);
      images.forEach(img => { if (img.file) data.append("images", img.file); });
      data.append("userId", 1);
      data.append("postType", "food-cafe");
      await postService.createPost("food-cafe", data);
      navigate("/food-cafe-owner/marketplace");
    } catch (error) {
      alert(error.error || "Failed to publish post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
    navigate, user, description, setDescription, loading, images, isDragging, setIsDragging,
    fileInputRef, handleFiles, removeImage, handleCancel, handlePublish,
  };
};
