// Custom hook for sessions
import { useSessionContext } from '../context/SessionContext';

/**
 * Default pagination object for initial state
 * @type {Object} DEFAULT_PAGINATION
 * @property {number} DEFAULT_PAGINATION.page - Current page number
 * @property {number} DEFAULT_PAGINATION.perPage - Items per page
 * @property {number} DEFAULT_PAGINATION.total - Total items count
 */
const DEFAULT_PAGINATION = {
  page: 1,
  perPage: 10,
  total: 0,
};

/**
 * Hook for session functionality with error handling
 * Provides access to session state and actions with fallback values
 * 
 * @returns {Object} Session context with fallback values
 * @returns {Array} sessions.sessions - List of sessions
 * @returns {Object|null} sessions.currentSession - Currently active session
 * @returns {Array} sessions.practiceWords - Words to practice
 * @returns {Array} sessions.practicePhrases - Phrases to practice
 * @returns {boolean} sessions.isLoading - Loading state
 * @returns {Error|null} sessions.error - Error message if any
 * @returns {Object} sessions.pagination - Pagination info
 * @returns {Function} sessions.fetchSessions - Fetch sessions function
 * @returns {Function} sessions.loadMoreSessions - Load more sessions
 * @returns {Function} sessions.fetchSessionById - Fetch specific session
 * @returns {Function} sessions.uploadAudio - Upload audio file
 * @returns {Function} sessions.fetchPracticeWords - Fetch practice words
 * @returns {Function} sessions.fetchPracticePhrases - Fetch practice phrases
 * @returns {Function} sessions.deleteSession - Delete a session
 * @returns {Function} sessions.clearCurrentSession - Clear current session
 * @returns {Function} sessions.clearError - Clear error state
 * @returns {Function} sessions.reset - Reset all sessions
 */
export const useSessions = () => {
  try {
    const context = useSessionContext();
    
    if (!context) {
      throw new Error('useSessions must be used within SessionProvider');
    }

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
    } = context;

    return {
      // State with fallback values
      sessions: sessions || [],
      currentSession: currentSession || null,
      practiceWords: practiceWords || [],
      practicePhrases: practicePhrases || [],
      isLoading: isLoading ?? false,
      error: error || null,
      pagination: pagination || DEFAULT_PAGINATION,

      // Actions
      fetchSessions: fetchSessions || async () => { throw new Error('Sessions not available'); },
      loadMoreSessions: loadMoreSessions || async () => { throw new Error('Sessions not available'); },
      fetchSessionById: fetchSessionById || async () => { throw new Error('Sessions not available'); },
      uploadAudio: uploadAudio || async () => { throw new Error('Sessions not available'); },
      fetchPracticeWords: fetchPracticeWords || async () => { throw new Error('Sessions not available'); },
      fetchPracticePhrases: fetchPracticePhrases || async () => { throw new Error('Sessions not available'); },
      deleteSession: deleteSession || async () => { throw new Error('Sessions not available'); },
      clearCurrentSession: clearCurrentSession || (() => {}),
      clearError: clearError || (() => {}),
      reset: reset || (() => {}),
    };
  } catch (error) {
    console.error('Error in useSessions hook:', error);
    // Return safe defaults if context is unavailable
    return {
      sessions: [],
      currentSession: null,
      practiceWords: [],
      practicePhrases: [],
      isLoading: false,
      error: 'Sessions context unavailable',
      pagination: DEFAULT_PAGINATION,
      fetchSessions: async () => { throw new Error('Sessions not available'); },
      loadMoreSessions: async () => { throw new Error('Sessions not available'); },
      fetchSessionById: async () => { throw new Error('Sessions not available'); },
      uploadAudio: async () => { throw new Error('Sessions not available'); },
      fetchPracticeWords: async () => { throw new Error('Sessions not available'); },
      fetchPracticePhrases: async () => { throw new Error('Sessions not available'); },
      deleteSession: async () => { throw new Error('Sessions not available'); },
      clearCurrentSession: () => {},
      clearError: () => {},
      reset: () => {},
    };
  }
};

export default useSessions;
