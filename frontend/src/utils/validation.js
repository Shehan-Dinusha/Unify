/**
 * Validation utility for Unify Frontend.
 */

/**
 * Validates Sri Lankan NIC (National Identity Card).
 * Supports:
 * - Old format: 9 digits followed by V or X (e.g., 123456789V)
 * - New format: 12 digits (e.g., 200012345678)
 * @param {string} nic
 * @returns {boolean}
 */
export const validateNIC = (nic) => {
  if (!nic) return false;
  const oldNICRegex = /^[0-9]{9}[VXvx]$/;
  const newNICRegex = /^[0-9]{12}$/;
  return oldNICRegex.test(nic) || newNICRegex.test(nic);
};

/**
 * Validates Password strength.
 * Requirements:
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 * @param {string} password
 * @returns {boolean}
 */
export const validatePassword = (password) => {
  if (!password) return false;
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[\W_]/.test(password);
  return hasMinLength && hasUpper && hasLower && hasNumber && hasSpecial;
};

/**
 * Validates Date of Birth.
 * Requirements:
 * - Required
 * - Not in the future
 * @param {string|Date} dob
 * @returns {boolean}
 */
export const validateDOB = (dob) => {
  if (!dob) return false;
  const date = new Date(dob);
  if (isNaN(date.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date <= today;
};

/**
 * Validates Email.
 * @param {string} email
 * @returns {boolean}
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
