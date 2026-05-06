import api from "./api";

/**
 * Standardized error handling.
 */
const handleError = (error) => {
  throw new Error(error.response?.data?.message || "Failed to update profile");
};

/**
 * Helper to convert object to FormData for multipart/form-data requests.
 */
const toFormData = (data) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    if (data[key] !== null && data[key] !== undefined) {
      if (key === "addresses" && Array.isArray(data[key])) {
        formData.append(key, JSON.stringify(data[key]));
      } else {
        formData.append(key, data[key]);
      }
    }
  });
  return formData;
};

export const updateStudentProfile = async (profileData) => {
  try {
    const formData = toFormData(profileData);
    const response = await api.put("/profiles/student", formData);
    return response.data.data;
  } catch (error) {
    handleError(error);
  }
};

export const updateBusinessProfile = async (profileData) => {
  try {
    const formData = toFormData(profileData);
    const response = await api.put("/profiles/business", formData);
    return response.data.data;
  } catch (error) {
    handleError(error);
  }
};

export const updateClubProfile = async (profileData) => {
  try {
    const formData = toFormData(profileData);
    const response = await api.put("/profiles/club", formData);
    return response.data.data;
  } catch (error) {
    handleError(error);
  }
};

export const getMyProfile = async (role) => {
  try {
    const endpoint = `/profiles/${role.toLowerCase()}/me`;
    const response = await api.get(endpoint);
    return response.data.data;
  } catch (error) {
    handleError(error);
  }
};

export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await api.put("/profiles/password", {
      currentPassword,
      newPassword,
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const deleteAccount = async () => {
  try {
    const response = await api.delete("/profiles");
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
