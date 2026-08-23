import api from "./api";
import { getMyProfile } from "./profileService";

/**
 * Standardized error handling for all services.
 */
const handleError = (error) => {
  throw new Error(error.response?.data?.message || "Something went wrong");
};

// ─── Standard Auth Data & Multi-Account Storage ───────────────────────────────

export const getSavedAccounts = () => {
  try {
    const raw = localStorage.getItem("savedAccounts");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveAccountSession = (data) => {
  if (!data?.user || !data.user.id) return;
  const accounts = getSavedAccounts();
  const token = data.accessToken || localStorage.getItem("token");
  const refreshToken =
    data.refreshToken || localStorage.getItem("refreshToken");

  const accountEntry = {
    id: data.user.id,
    user: data.user,
    token,
    refreshToken,
    lastActive: Date.now(),
  };

  const index = accounts.findIndex(
    (a) => String(a.id) === String(data.user.id),
  );
  if (index >= 0) {
    accounts[index] = { ...accounts[index], ...accountEntry };
  } else {
    accounts.push(accountEntry);
  }

  localStorage.setItem("savedAccounts", JSON.stringify(accounts));
};

export const updateActiveAccountTokens = (
  accessToken,
  refreshToken,
  userId,
) => {
  const accounts = getSavedAccounts();
  const targetId = userId || getCurrentUser()?.id;
  if (!targetId) return;

  const index = accounts.findIndex((a) => String(a.id) === String(targetId));
  if (index >= 0) {
    if (accessToken) accounts[index].token = accessToken;
    if (refreshToken) accounts[index].refreshToken = refreshToken;
    accounts[index].lastActive = Date.now();
    localStorage.setItem("savedAccounts", JSON.stringify(accounts));
  }
};

export const switchAccount = (userId) => {
  const accounts = getSavedAccounts();
  const target = accounts.find((a) => String(a.id) === String(userId));
  if (!target) return false;

  if (target.token) localStorage.setItem("token", target.token);
  if (target.refreshToken)
    localStorage.setItem("refreshToken", target.refreshToken);
  if (target.user) localStorage.setItem("user", JSON.stringify(target.user));

  saveAccountSession({
    user: target.user,
    accessToken: target.token,
    refreshToken: target.refreshToken,
  });

  window.dispatchEvent(new Event("auth-changed"));
  return target;
};

export const removeSavedAccount = (userId) => {
  let accounts = getSavedAccounts();
  const currentUser = getCurrentUser();
  const isActiveAccount =
    currentUser && String(currentUser.id) === String(userId);

  accounts = accounts.filter((a) => String(a.id) !== String(userId));
  localStorage.setItem("savedAccounts", JSON.stringify(accounts));

  if (isActiveAccount) {
    if (accounts.length > 0) {
      switchAccount(accounts[0].id);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      window.dispatchEvent(new Event("auth-changed"));
    }
  }
};

const setAuthData = (data) => {
  if (data.accessToken) localStorage.setItem("token", data.accessToken);
  if (data.refreshToken)
    localStorage.setItem("refreshToken", data.refreshToken);
  if (data.user) {
    localStorage.setItem("user", JSON.stringify(data.user));
    saveAccountSession(data);
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

    // Capture the userId before the async fetch so we can detect whether
    // switchAccount() ran while the request was in-flight. If it did, the
    // fetched profile belongs to the OLD account — writing it to localStorage
    // would restore a stale user object and cause 403s on role-restricted
    // endpoints (e.g. /profiles/club/me called with a Student token).
    const snapshotId = currentUser.id;
    const role = currentUser.role?.toLowerCase();

    // Admins do not have a specific profile endpoint
    if (role === "admin") {
      return currentUser;
    }

    const profile = await getMyProfile(role);

    // After the await, verify that the active account has not changed.
    // If a switch happened while this fetch was in-flight, discard silently.
    const activeUser = getCurrentUser();
    if (!activeUser || String(activeUser.id) !== String(snapshotId)) {
      return null;
    }

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
      updatedUser.repVerificationStatus =
        profile.repVerificationStatus || "NOT_SUBMITTED";
    }

    if (role === "business" || role === "club") {
      updatedUser.category = profile.category;
    }

    if (role === "club") {
      updatedUser.isVerified = profile.isVerified || false;
    }

    localStorage.setItem("user", JSON.stringify(updatedUser));
    saveAccountSession({ user: updatedUser });
    return updatedUser;
  } catch {
    return getCurrentUser();
  }
};

export const logout = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  // Clear only the active authentication state.
  // savedAccounts is intentionally NOT modified here — accounts remain
  // remembered on this device so they appear in the Switch Account modal.
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  window.dispatchEvent(new Event("auth-changed"));

  try {
    if (refreshToken) {
      await api.post("/auth/logout", { refreshToken });
    }
  } catch {
    // Ignore network error on logout
  }
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

// ─── Server-Side Account Linking API Integrations ─────────────────────────────

export const fetchServerLinkedAccounts = async () => {
  try {
    const response = await api.get("/auth/linked-accounts");
    return response.data.data || [];
  } catch {
    return [];
  }
};

export const linkAccountServer = async (identifier, password) => {
  try {
    const response = await api.post("/auth/link-account", {
      identifier,
      password,
    });
    const { data } = response.data;
    setAuthData(data);
    return data;
  } catch (error) {
    handleError(error);
  }
};

export const switchAccountServer = async (targetUserId) => {
  try {
    const response = await api.post("/auth/switch-account", { targetUserId });
    const { data } = response.data;
    setAuthData(data);
    return data;
  } catch (error) {
    handleError(error);
  }
};

export const unlinkAccountServer = async (targetUserId) => {
  try {
    await api.delete(`/auth/unlink-account/${targetUserId}`);
    return true;
  } catch (error) {
    handleError(error);
  }
};
