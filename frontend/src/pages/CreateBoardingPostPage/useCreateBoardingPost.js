import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import postService from "../../services/postService";
import { getCurrentUser } from "../../services/authService";

export const useCreateBoardingPost = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [roomType, setRoomType] = useState("");
  const [gender, setGender] = useState("Any");
  const [amenityInput, setAmenityInput] = useState("");
  const [amenities, setAmenities] = useState([]);
  const [price, setPrice] = useState("");
  const [capacity, setCapacity] = useState("");
  const [phone, setPhone] = useState("");
  const [slots, setSlots] = useState("");

  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFiles = (files) => {
    const newImages = Array.from(files)
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => ({
        id: Date.now() + Math.random(),
        url: URL.createObjectURL(file),
        file,
      }));
    if (newImages.length > 0) {
      setImages((prev) => [...prev, ...newImages]);
    }
  };

  const removeImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleAddAmenity = () => {
    if (amenityInput.trim() && !amenities.includes(amenityInput.trim())) {
      setAmenities([...amenities, amenityInput.trim()]);
      setAmenityInput("");
    }
  };

  const handleRemoveAmenity = (item) => {
    setAmenities(amenities.filter((a) => a !== item));
  };

  const handleCancel = () => navigate("/boarding-owner/marketplace");

  const handleLocationChange = ({ lat, lng, address }) => {
    setLatitude(lat);
    setLongitude(lng);
    setLocation(address);
  };

  const handlePublish = async () => {
    if (!title || !description || !location || !price || !capacity || !phone || !slots || !roomType) {
      alert("Please fill in all required fields.");
      return;
    }
    if (!latitude || !longitude) {
      alert("Please pin your boarding location on the map.");
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();
      data.append("title", title);
      data.append("description", description);
      data.append("location", location);
      data.append("roomType", roomType);
      data.append("gender", gender);
      data.append("price", price);
      data.append("capacity", capacity);
      data.append("slots", slots);
      data.append("phone", phone);
      data.append("amenities", JSON.stringify(amenities));
      data.append("latitude", latitude);
      data.append("longitude", longitude);

      images.forEach((img) => {
        if (img.file) {
          data.append("images", img.file);
        }
      });

      data.append("userId", 1);

      await postService.createPost("boarding", data);
      navigate("/boarding-owner/marketplace");
    } catch (error) {
      console.error("Failed to publish boarding post:", error);
      alert(error.message || "Failed to publish boarding post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    title, setTitle,
    description, setDescription,
    location,
    latitude, longitude,
    roomType, setRoomType,
    gender, setGender,
    amenityInput, setAmenityInput,
    amenities,
    price, setPrice,
    capacity, setCapacity,
    phone, setPhone,
    slots, setSlots,
    loading,
    images,
    isDragging, setIsDragging,
    fileInputRef,
    handleFiles,
    removeImage,
    handleAddAmenity,
    handleRemoveAmenity,
    handleCancel,
    handleLocationChange,
    handlePublish,
  };
};
