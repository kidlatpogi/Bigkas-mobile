// Custom hook for authentication
import { useAuthContext } from '../context/AuthContext';

/**
 * Hook for authentication functionality
 * Provides access to auth state and actions
 */
export const useAuth = () => {
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
    // State
    user,
    isLoading,
    isAuthenticated,
    error,

    // Actions
    login,
    register,
    logout,
    clearError,
    updateNickname,
  };
};

export default useAuth;
