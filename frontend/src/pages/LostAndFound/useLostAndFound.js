import { useState, useCallback, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../services/authService";
import { getItems } from "../../services/lostAndFoundService";

export const FILTERS = ["All", "Lost Items", "Found Items"];

export const useLostAndFound = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [activeFilter, setActiveFilter] = useState("All");
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const view = searchParams.get("view") || "list";

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      try {
        const data = await getItems("All");
        setItems(data);
      } catch (err) {
        // intentionally empty
      } finally {
        setIsLoading(false);
      }
    };
    fetchItems();
  }, []);

  const setView = useCallback(
    (newView) => {
      if (newView === "list") {
        setSearchParams({}, { replace: false });
      } else {
        setSearchParams({ view: newView }, { replace: false });
      }
    },
    [setSearchParams]
  );

  const user = {
    name: currentUser?.name || "Unknown User",
    role: currentUser?.role?.toLowerCase() || "student",
    avatar: currentUser?.avatar,
  };

  const filteredItems =
    activeFilter === "All"
      ? items
      : activeFilter === "Lost Items"
        ? items.filter((i) => i.type === "lost")
        : items.filter((i) => i.type === "found");

  return {
    currentUser, user,
    view, setView,
    searchParams, setSearchParams,
    activeFilter, setActiveFilter,
    filteredItems, isLoading,
  };
};
