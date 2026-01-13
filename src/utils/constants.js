// App-wide constants

// Storage keys for AsyncStorage
export const STORAGE_KEYS = {
  AUTH_TOKEN: '@bigkas/auth_token',
  USER_DATA: '@bigkas/user_data',
  SETTINGS: '@bigkas/settings',
  ONBOARDING_COMPLETE: '@bigkas/onboarding_complete',
};

// API endpoints
export const ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  PROFILE: '/auth/profile',

  // Sessions
  SESSIONS: '/sessions',
  SESSION_DETAIL: (id) => `/sessions/${id}`,
  UPLOAD_AUDIO: '/sessions/upload',
  SESSION_SCORES: (id) => `/sessions/${id}/scores`,

  // Practice
  PRACTICE_WORDS: '/practice/words',
  PRACTICE_PHRASES: '/practice/phrases',
};

// Audio recording settings
export const AUDIO_CONFIG = {
  SAMPLE_RATE: 44100,
  CHANNELS: 1,
  BIT_DEPTH: 16,
  MAX_DURATION_MS: 60000, // 60 seconds max recording
  FILE_EXTENSION: '.wav',
};

// UI constants
export const UI = {
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 500,
  TOAST_DURATION: 3000,
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Unable to connect. Please check your internet connection.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
  AUTH_EXPIRED: 'Your session has expired. Please login again.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  REGISTRATION_FAILED: 'Registration failed. Please try again.',
};

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Welcome back!',
  REGISTER_SUCCESS: 'Account created successfully!',
  LOGOUT_SUCCESS: 'You have been logged out.',
  UPLOAD_SUCCESS: 'Audio uploaded successfully!',
};

export default {
  STORAGE_KEYS,
  ENDPOINTS,
  AUDIO_CONFIG,
  UI,
  PAGINATION,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
};
