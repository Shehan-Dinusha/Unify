import api from "./api";

/**
 * Fetch a list of lost and found items.
 *
 * @param {string} type - "Lost", "Found", or "All"
 */
export const getItems = async (type = "All") => {
  try {
    const params = new URLSearchParams();
    if (type && type !== "All") {
      params.append("type", type);
    }

    const response = await api.get(
      `/lost-and-found?${params.toString()}`,
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};

/**
 * Fetch a list of lost and found items created by the logged in user.
 */
export const getMyItems = async () => {
  try {
    const response = await api.get(`/lost-and-found/my-items`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching my items:", error);
    throw error;
  }
};

/**
 * Fetch exactly one lost and found item by ID.
 *
 * @param {number|string} id - The ID of the item
 */
export const getItemById = async (id) => {
  try {
    const response = await api.get(`/lost-and-found/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching single item:", error);
    throw error;
  }
};

/**
 * Create a new lost and found item.
 *
 * @param {FormData} formData - The item data including images
 */
export const createItem = async (formData) => {
  try {
    const response = await api.post(`/lost-and-found`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error creating item:", error);
    throw error;
  }
};

/**
 * Edit an existing lost and found item.
 *
 * @param {number|string} id - The ID of the item
 * @param {FormData} formData - The updated item data including images
 */
export const editItem = async (id, formData) => {
  try {
    const response = await api.put(`/lost-and-found/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error updating item:", error);
    throw error;
  }
};

/**
 * Delete a lost and found item.
 *
 * @param {number|string} id - The ID of the item
 */
export const deleteItem = async (id) => {
  try {
    const response = await api.delete(`/lost-and-found/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error deleting item:", error);
    throw error;
  }
};

/**
 * Fetch All matches for an item.
 *
 * @param {number|string} id - The ID of the item
 */
export const getItemMatches = async (id) => {
  try {
    const response = await api.get(`/lost-and-found/${id}/matches`);
    return response.data.data;
  } catch (error) {
    if (error.response?.status === 403) return null; // Not the owner
    console.error("Error fetching item matches:", error);
    throw error;
  }
};
