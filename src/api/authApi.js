// Authentication API functions
import apiClient from './client';
import { ENDPOINTS } from '../utils/constants';
import { supabase } from './supabaseClient';

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
 * Register a new user via Supabase Auth
 * @param {Object} userData
 * @param {string} userData.email
 * @param {string} userData.password
 * @param {string} userData.name
 * @returns {Promise<{ user: Object, error?: string }>}
 */
export const register = async (userData) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          full_name: userData.name,
        },
        emailRedirectTo: undefined, // Will use default email template
      },
    });

    if (error) throw error;

    return { user: data.user, error: null };
  } catch (err) {
    return { user: null, error: err.message };
  }
};

/**
 * Resend email verification link
 * @param {string} email
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export const resendVerificationEmail = async (email) => {
  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    });

    if (error) throw error;

    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

/**
 * Send password reset link via email
 * @param {string} email
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export const resetPassword = async (email) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) throw error;

    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

/**
 * Update password with recovery token
 * @param {string} newPassword
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export const updatePassword = async (newPassword) => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;

    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
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
  resendVerificationEmail,
  resetPassword,
  updatePassword,
};
