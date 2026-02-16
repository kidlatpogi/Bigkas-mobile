// Custom hook for authentication
import { useAuthContext } from '../context/AuthContext';

/**
 * Default fallback user object when user is not authenticated
 * @type {Object} DEFAULT_USER
 * @property {string} DEFAULT_USER.id - User identifier
 * @property {string} DEFAULT_USER.name - User display name
 * @property {string} DEFAULT_USER.email - User email address
 * @property {string|null} DEFAULT_USER.nickname - User nickname
 * @property {string} DEFAULT_USER.createdAt - User creation timestamp
 */
const DEFAULT_USER = {
  id: null,
  name: 'Guest',
  email: '',
  nickname: null,
  createdAt: null,
};

/**
 * Hook for authentication functionality
 * Provides access to auth state and actions with error handling
 * 
 * @returns {Object} Auth context with fallback values
 * @returns {Object} auth.user - User object or DEFAULT_USER if not authenticated
 * @returns {boolean} auth.isLoading - Loading state
 * @returns {boolean} auth.isAuthenticated - Authentication status
 * @returns {Error|null} auth.error - Error message if any
 * @returns {Function} auth.login - Login function
 * @returns {Function} auth.register - Register function
 * @returns {Function} auth.logout - Logout function
 * @returns {Function} auth.clearError - Clear error function
 * @returns {Function} auth.updateNickname - Update nickname function
 */
export const useAuth = () => {
  try {
    const {
      user,
      isLoading,
      isAuthenticated,
      error,
      login,
      register,
      logout,
      clearError,
      updateNickname,
    } = useAuthContext();

    return {
      // State with fallback values
      user: user || DEFAULT_USER,
      isLoading: isLoading ?? true,
      isAuthenticated: isAuthenticated ?? false,
      error: error || null,

      // Actions
      login,
      register,
      logout,
      clearError,
      updateNickname,
    };
  } catch (error) {
    console.error('Error in useAuth hook:', error);
    // Return safe defaults if context is unavailable
    return {
      user: DEFAULT_USER,
      isLoading: false,
      isAuthenticated: false,
      error: 'Authentication context unavailable',
      login: async () => { throw new Error('Auth not available'); },
      register: async () => { throw new Error('Auth not available'); },
      logout: async () => { throw new Error('Auth not available'); },
      clearError: () => {},
      updateNickname: async () => { throw new Error('Auth not available'); },
    };
  }
};

export default useAuth;
