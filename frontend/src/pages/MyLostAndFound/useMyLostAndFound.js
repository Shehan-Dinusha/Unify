import { useState, useCallback, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useToast } from "../../components/common/Toast";
import { getCurrentUser } from "../../services/authService";
import { getMyItems, deleteItem, editItem } from "../../services/lostAndFoundService";

export const FILTERS = ["All", "Lost Items", "Found Items", "Resolved"];

export const useMyLostAndFound = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const currentUser = getCurrentUser();
  const [activeFilter, setActiveFilter] = useState("All");
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);
  const [deleteModal, setDeleteModal] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const view = searchParams.get("view") || "list";
  const editingItemId = searchParams.get("edit") ? Number(searchParams.get("edit")) : null;

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  const setView = useCallback(
    (newView) => {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);
          if (newView === "list") {
            params.delete("view");
          } else {
            params.set("view", newView);
          }
          return params;
        },
        { replace: false }
      );
    },
    [setSearchParams]
  );

  const clearEdit = useCallback(() => {
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        params.delete("edit");
        return params;
      },
      { replace: false }
    );
  }, [setSearchParams]);

  const user = {
    name: currentUser?.name || "Unknown User",
    role: currentUser?.role?.toLowerCase() || "student",
    avatar: currentUser?.avatar,
  };

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      try {
        const data = await getMyItems();
        setItems(data);
      } catch (err) {
        // intentionally empty
      } finally {
        setIsLoading(false);
      }
    };
    fetchItems();
  }, []);

  const handleResolve = async (id) => {
    try {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: "Resolved" } : item))
      );
      const formData = new FormData();
      formData.append("status", "Resolved");
      await editItem(id, formData);
    } catch (err) {
      // intentionally empty
    }
  };

  const handleEdit = (id) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("edit", id);
      return params;
    }, { replace: false });
  };

  const handleSaveEdit = (updatedItem) => {
    setItems((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
    clearEdit();
  };

  const handleDeleteClick = (id) => {
    setDeleteModal({ id, step: "confirm" });
  };

  const confirmDelete = async () => {
    if (!deleteModal) return;
    try {
      await deleteItem(deleteModal.id);
      setItems((prev) => prev.filter((item) => item.id !== deleteModal.id));
      if (editingItemId === deleteModal.id) {
        clearEdit();
      }
      setDeleteModal({ ...deleteModal, step: "success" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete post.");
    }
  };

  const closeDeleteModal = () => {
    setDeleteModal(null);
  };

  const getFilteredItems = () => {
    switch (activeFilter) {
      case "Lost Items":
        return items.filter((i) => i.type === "lost" && i.status !== "Resolved");
      case "Found Items":
        return items.filter((i) => i.type === "found" && i.status !== "Resolved");
      case "Resolved":
        return items.filter((i) => i.status === "Resolved");
      default:
        return items;
    }
  };

  const filteredItems = getFilteredItems();
  const displayedItems = filteredItems.slice(0, visibleCount);
  const hasMore = displayedItems.length < filteredItems.length;

  return {
    currentUser, user,
    view, setView,
    editingItemId,
    clearEdit,
    activeFilter, setActiveFilter,
    items,
    isLoading,
    visibleCount, setVisibleCount,
    displayedItems, hasMore,
    deleteModal,
    handleResolve,
    handleEdit,
    handleSaveEdit,
    handleDeleteClick,
    confirmDelete,
    closeDeleteModal,
  };
};
