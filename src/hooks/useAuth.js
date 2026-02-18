// Custom hook for authentication
import { useAuthContext } from '../context/AuthContext';

/**
 * Hook for authentication functionality.
 * Must be used within an AuthProvider.
 *
 * @returns {Object} auth
 * @returns {Object|null}  auth.user                         - Authenticated user object
 * @returns {boolean}      auth.isLoading                    - Whether auth state is loading
 * @returns {boolean}      auth.isAuthenticated              - Whether the user is logged in
 * @returns {string|null}  auth.error                        - Error message if any
 * @returns {boolean}      auth.emailVerified                - Whether email is verified
 * @returns {boolean}      auth.pendingEmailVerification     - Whether awaiting email confirmation
 * @returns {string|null}  auth.pendingEmail                 - Email awaiting verification
 * @returns {Function}     auth.login                        - (email, password) => Promise
 * @returns {Function}     auth.register                     - (name, email, password) => Promise
 * @returns {Function}     auth.logout                       - () => Promise
 * @returns {Function}     auth.clearError                   - Clears the current error
 * @returns {Function}     auth.updateNickname               - (nickname) => Promise (with Supabase)
 * @returns {Function}     auth.updateNicknameLocal          - (nickname) => Promise (local only)
 * @returns {Function}     auth.resendVerificationEmail      - (email) => Promise
 * @returns {Function}     auth.resetPassword                - (email) => Promise
 * @returns {Function}     auth.clearPendingEmailVerification - () => void
 */
export const useAuth = () => {
  const context = useAuthContext();

  return {
    user: context.user ?? null,
    isLoading: context.isLoading ?? false,
    isAuthenticated: context.isAuthenticated ?? false,
    error: context.error ?? null,
    emailVerified: context.emailVerified ?? false,
    pendingEmailVerification: context.pendingEmailVerification ?? false,
    pendingEmail: context.pendingEmail ?? null,
    login: context.login,
    register: context.register,
    logout: context.logout,
    clearError: context.clearError,
    updateNickname: context.updateNickname,
    updateNicknameLocal: context.updateNicknameLocal,
    resendVerificationEmail: context.resendVerificationEmail,
    resetPassword: context.resetPassword,
    clearPendingEmailVerification: context.clearPendingEmailVerification,
  };
};

export default useAuth;
