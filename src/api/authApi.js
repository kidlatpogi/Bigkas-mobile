// Authentication API functions
import apiClient from './client';
import { ENDPOINTS } from '../utils/constants';

/**
 * Login with email and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ user: Object, token: string }>}
 */
export const login = async (email, password) => {
  const response = await apiClient.post(ENDPOINTS.LOGIN, {
    email,
    password,
  });

  // Store the token in the API client for subsequent requests
  if (response.token) {
    apiClient.setAuthToken(response.token);
  }

  return response;
};

/**
 * Register a new user
 * @param {Object} userData
 * @param {string} userData.email
 * @param {string} userData.password
 * @param {string} userData.name
 * @param {string} [userData.username]
 * @returns {Promise<{ user: Object, token: string }>}
 */
export const register = async (userData) => {
  const response = await apiClient.post(ENDPOINTS.REGISTER, userData);

  // Store the token in the API client for subsequent requests
  if (response.token) {
    apiClient.setAuthToken(response.token);
  }

  return response;
};

/**
 * Logout the current user
 * @returns {Promise<void>}
 */
export const logout = async () => {
  try {
    await apiClient.post(ENDPOINTS.LOGOUT);
  } finally {
    // Clear the auth token regardless of server response
    apiClient.setAuthToken(null);
  }
};

/**
 * Refresh the authentication token
 * @returns {Promise<{ token: string }>}
 */
export const refreshToken = async () => {
  const response = await apiClient.post(ENDPOINTS.REFRESH_TOKEN);

  if (response.token) {
    apiClient.setAuthToken(response.token);
  }

  return response;
};

/**
 * Get the current user's profile
 * @returns {Promise<Object>}
 */
export const getProfile = async () => {
  return apiClient.get(ENDPOINTS.PROFILE);
};

/**
 * Update the current user's profile
 * @param {Object} profileData
 * @returns {Promise<Object>}
 */
export const updateProfile = async (profileData) => {
  return apiClient.put(ENDPOINTS.PROFILE, profileData);
};

/**
 * Set the auth token (used when restoring session from storage)
 * @param {string} token
 */
export const setAuthToken = (token) => {
  apiClient.setAuthToken(token);
};

export default {
  login,
  register,
  logout,
  refreshToken,
  getProfile,
  updateProfile,
  setAuthToken,
};
