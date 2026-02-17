// Custom hook for authentication
import { useAuthContext } from '../context/AuthContext';

/**
 * Hook for authentication functionality.
 * Must be used within an AuthProvider.
 *
 * @returns {Object} auth
 * @returns {Object|null}  auth.user                - Authenticated user object
 * @returns {boolean}      auth.isLoading           - Whether auth state is loading
 * @returns {boolean}      auth.isAuthenticated     - Whether the user is logged in
 * @returns {string|null}  auth.error               - Error message if any
 * @returns {Function}     auth.login               - (email, password) => Promise
 * @returns {Function}     auth.register            - (name, email, password) => Promise
 * @returns {Function}     auth.logout              - () => Promise
 * @returns {Function}     auth.clearError          - Clears the current error
 * @returns {Function}     auth.updateNickname      - (nickname) => Promise (with Supabase)
 * @returns {Function}     auth.updateNicknameLocal - (nickname) => Promise (local only)
 */
export const useAuth = () => {
  const context = useAuthContext();

  return {
    user: context.user ?? null,
    isLoading: context.isLoading ?? false,
    isAuthenticated: context.isAuthenticated ?? false,
    error: context.error ?? null,
    login: context.login,
    register: context.register,
    logout: context.logout,
    clearError: context.clearError,
    updateNickname: context.updateNickname,
    updateNicknameLocal: context.updateNicknameLocal,
  };
};

export default useAuth;
