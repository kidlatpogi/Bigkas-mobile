// Custom hook for sessions
import { useSessionContext } from '../context/SessionContext';

/**
 * Hook for session functionality
 * Provides access to session state and actions
 */
export const useSessions = () => {
  const {
    sessions,
    currentSession,
    practiceWords,
    practicePhrases,
    isLoading,
    error,
    pagination,
    fetchSessions,
    loadMoreSessions,
    fetchSessionById,
    uploadAudio,
    fetchPracticeWords,
    fetchPracticePhrases,
    deleteSession,
    clearCurrentSession,
    clearError,
    reset,
  } = useSessionContext();

  return {
    // State
    sessions,
    currentSession,
    practiceWords,
    practicePhrases,
    isLoading,
    error,
    pagination,

    // Actions
    fetchSessions,
    loadMoreSessions,
    fetchSessionById,
    uploadAudio,
    fetchPracticeWords,
    fetchPracticePhrases,
    deleteSession,
    clearCurrentSession,
    clearError,
    reset,
  };
};

export default useSessions;
