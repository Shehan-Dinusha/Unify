import api from "./api";
import { getMyProfile } from "./profileService";

/**
 * Standardized error handling for all services.
 */
const handleError = (error) => {
  throw new Error(error.response?.data?.message || "Something went wrong");
};

// ─── Standard Auth Data ───────────────────────────────────────────────────────
// Normal login/OTP: just sets the active session. Does NOT auto-add to any linked list.

const setAuthData = (data) => {
  if (data.accessToken) localStorage.setItem("token", data.accessToken);
  if (data.refreshToken) localStorage.setItem("refreshToken", data.refreshToken);
  if (data.user) {
    localStorage.setItem("user", JSON.stringify(data.user));
  }
  window.dispatchEvent(new Event("auth-changed"));
};

// ─── Auth Operations ──────────────────────────────────────────────────────────

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
    // Always set auth data for the new account.
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

export const refreshCurrentUser = async () => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) return null;

    const role = currentUser.role?.toLowerCase();
    
    // Admins do not have a specific profile endpoint
    if (role === "admin") {
      return currentUser;
    }

    const profile = await getMyProfile(role);

    const updatedUser = {
      id: currentUser.id,
      email: profile.user?.email || currentUser.email,
      phone: currentUser.phone,
      name: profile.user?.name || currentUser.name,
      role: profile.user?.role || currentUser.role,
      avatar: profile.user?.avatar || currentUser.avatar,
    };

    if (role === "student") {
      updatedUser.isBatchRep = profile.isBatchRep || false;
      updatedUser.repVerificationStatus = profile.repVerificationStatus || "NOT_SUBMITTED";
    }

    if (role === "business" || role === "club") {
      updatedUser.category = profile.category;
    }

    if (role === "club") {
      updatedUser.isVerified = profile.isVerified || false;
    }

    localStorage.setItem("user", JSON.stringify(updatedUser));
    return updatedUser;
  } catch {
    return getCurrentUser();
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
    return null;
  }
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};
