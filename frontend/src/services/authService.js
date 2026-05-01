import api from "./api";

/**
 * Standardized error handling for all services.
 */
const handleError = (error) => {
  throw new Error(error.response?.data?.message || "Something went wrong");
};

/**
 * Store authentication data in localStorage.
 * Maps 'accessToken' to 'token' for interceptor compatibility.
 */
const setAuthData = (data) => {
  if (data.accessToken) localStorage.setItem("token", data.accessToken);
  if (data.refreshToken) localStorage.setItem("refreshToken", data.refreshToken);
  if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
};

export const login = async (identifier, password) => {
  try {
    const response = await api.post("/auth/login", { identifier, password });
    const { data } = response.data;
    setAuthData(data);
    return data;
  } catch (error) {
    handleError(error);
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);
    return response.data.data;
  } catch (error) {
    handleError(error);
  }
};

export const verifyOTP = async (otpData) => {
  try {
    const response = await api.post("/auth/verify-otp", otpData);
    const { data } = response.data;
    setAuthData(data);
    return data;
  } catch (error) {
    handleError(error);
  }
};

export const resendOTP = async (data) => {
  try {
    const response = await api.post("/auth/resend-otp", data);
    return response.data.data;
  } catch (error) {
    handleError(error);
  }
};

export const forgotPassword = async (data) => {
  try {
    const response = await api.post("/auth/forgot-password", data);
    return response.data.data;
  } catch (error) {
    handleError(error);
  }
};

export const verifyResetOTP = async (data) => {
  try {
    const response = await api.post("/auth/verify-reset-otp", data);
    return response.data.data;
  } catch (error) {
    handleError(error);
  }
};

export const resetPassword = async (data) => {
  try {
    const response = await api.post("/auth/reset-password", data);
    return response.data.data;
  } catch (error) {
    handleError(error);
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  window.location.href = "/login";
};

export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Failed to parse user data:", error);
    return null;
  }
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};
