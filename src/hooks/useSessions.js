// Custom hook for sessions
import { useSessionContext } from '../context/SessionContext';

/**
 * Hook for session functionality.
 * Must be used within a SessionProvider.
 *
 * @returns {Object} session
 * @returns {Array}        session.sessions            - List of sessions
 * @returns {Object|null}  session.currentSession      - Currently active session
 * @returns {Array}        session.practiceWords        - Words to practice
 * @returns {Array}        session.practicePhrases      - Phrases to practice
 * @returns {boolean}      session.isLoading            - Loading state
 * @returns {string|null}  session.error                - Error message if any
 * @returns {Object}       session.pagination           - Pagination info
 * @returns {Function}     session.fetchSessions        - Fetch sessions
 * @returns {Function}     session.loadMoreSessions     - Load next page
 * @returns {Function}     session.fetchSessionById     - Fetch one session
 * @returns {Function}     session.uploadAudio          - Upload audio file
 * @returns {Function}     session.fetchPracticeWords   - Fetch practice words
 * @returns {Function}     session.fetchPracticePhrases - Fetch practice phrases
 * @returns {Function}     session.deleteSession        - Delete a session
 * @returns {Function}     session.clearCurrentSession  - Clear current session
 * @returns {Function}     session.clearError           - Clear error state
 * @returns {Function}     session.reset                - Reset all sessions
 */
export const useSessions = () => {
  const context = useSessionContext();

  return {
    sessions: context.sessions ?? [],
    currentSession: context.currentSession ?? null,
    practiceWords: context.practiceWords ?? [],
    practicePhrases: context.practicePhrases ?? [],
    isLoading: context.isLoading ?? false,
    error: context.error ?? null,
    pagination: context.pagination ?? { page: 1, perPage: 10, total: 0 },
    fetchSessions: context.fetchSessions,
    loadMoreSessions: context.loadMoreSessions,
    fetchSessionById: context.fetchSessionById,
    uploadAudio: context.uploadAudio,
    fetchPracticeWords: context.fetchPracticeWords,
    fetchPracticePhrases: context.fetchPracticePhrases,
    deleteSession: context.deleteSession,
    clearCurrentSession: context.clearCurrentSession,
    clearError: context.clearError,
    reset: context.reset,
  };
};

export default useSessions;
