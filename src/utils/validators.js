// Validation utility functions

/**
 * Validate email format
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password
 * @returns {{ isValid: boolean, message: string }}
 */
export const validatePassword = (password) => {
  if (!password || password.length < 8) {
    return {
      isValid: false,
      message: 'Password must be at least 8 characters long',
    };
  }

  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one uppercase letter',
    };
  }

  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one lowercase letter',
    };
  }

  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one number',
    };
  }

  return { isValid: true, message: '' };
};

/**
 * Validate that a string is not empty
 * @param {string} value
 * @returns {boolean}
 */
export const isNotEmpty = (value) => {
  return value && value.trim().length > 0;
};

/**
 * Validate username format
 * @param {string} username
 * @returns {boolean}
 */
export const isValidUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

/**
 * Validate phone number format (basic)
 * @param {string} phone
 * @returns {boolean}
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^[+]?[\d\s-]{10,}$/;
  return phoneRegex.test(phone);
};

export default {
  isValidEmail,
  validatePassword,
  isNotEmpty,
  isValidUsername,
  isValidPhone,
};
