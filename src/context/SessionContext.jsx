import React, { createContext, useContext, useReducer, useCallback } from 'react';
import * as sessionApi from '../api/sessionApi';

// Initial state
const initialState = {
  sessions: [],
  currentSession: null,
  practiceWords: [],
  practicePhrases: [],
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    total: 0,
    hasMore: true,
  },
};

// Action types
const SESSION_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_SESSIONS: 'SET_SESSIONS',
  APPEND_SESSIONS: 'APPEND_SESSIONS',
  SET_CURRENT_SESSION: 'SET_CURRENT_SESSION',
  SET_PRACTICE_WORDS: 'SET_PRACTICE_WORDS',
  SET_PRACTICE_PHRASES: 'SET_PRACTICE_PHRASES',
  ADD_SESSION: 'ADD_SESSION',
  REMOVE_SESSION: 'REMOVE_SESSION',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  RESET: 'RESET',
};

// Reducer
const sessionReducer = (state, action) => {
  switch (action.type) {
    case SESSION_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };

    case SESSION_ACTIONS.SET_SESSIONS:
      return {
        ...state,
        sessions: action.payload.sessions,
        pagination: {
          page: action.payload.page,
          total: action.payload.total,
          hasMore: action.payload.sessions.length > 0,
        },
        isLoading: false,
        error: null,
      };

    case SESSION_ACTIONS.APPEND_SESSIONS:
      return {
        ...state,
        sessions: [...state.sessions, ...action.payload.sessions],
        pagination: {
          page: action.payload.page,
          total: action.payload.total,
          hasMore: action.payload.sessions.length > 0,
        },
        isLoading: false,
      };

    case SESSION_ACTIONS.SET_CURRENT_SESSION:
      return {
        ...state,
        currentSession: action.payload,
        isLoading: false,
      };

    case SESSION_ACTIONS.SET_PRACTICE_WORDS:
      return {
        ...state,
        practiceWords: action.payload,
        isLoading: false,
      };

    case SESSION_ACTIONS.SET_PRACTICE_PHRASES:
      return {
        ...state,
        practicePhrases: action.payload,
        isLoading: false,
      };

    case SESSION_ACTIONS.ADD_SESSION:
      return {
        ...state,
        sessions: [action.payload, ...state.sessions],
        currentSession: action.payload,
      };

    case SESSION_ACTIONS.REMOVE_SESSION:
      return {
        ...state,
        sessions: state.sessions.filter((s) => s.id !== action.payload),
        currentSession:
          state.currentSession?.id === action.payload ? null : state.currentSession,
      };

    case SESSION_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case SESSION_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };

    case SESSION_ACTIONS.RESET:
      return initialState;

    default:
      return state;
  }
};

// Create context
const SessionContext = createContext(null);

// Provider component
export const SessionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(sessionReducer, initialState);

  // Fetch sessions
  const fetchSessions = useCallback(async (page = 1, refresh = false) => {
    dispatch({ type: SESSION_ACTIONS.SET_LOADING, payload: true });

    try {
      const response = await sessionApi.getSessions({ page });

      if (refresh || page === 1) {
        dispatch({
          type: SESSION_ACTIONS.SET_SESSIONS,
          payload: {
            sessions: response.sessions || [],
            page,
            total: response.total || 0,
          },
        });
      } else {
        dispatch({
          type: SESSION_ACTIONS.APPEND_SESSIONS,
          payload: {
            sessions: response.sessions || [],
            page,
            total: response.total || 0,
          },
        });
      }

      return { success: true };
    } catch (error) {
      dispatch({
        type: SESSION_ACTIONS.SET_ERROR,
        payload: error.message,
      });
      return { success: false, error: error.message };
    }
  }, []);

  // Load more sessions
  const loadMoreSessions = useCallback(async () => {
    if (!state.pagination.hasMore || state.isLoading) return;
    return fetchSessions(state.pagination.page + 1);
  }, [state.pagination, state.isLoading, fetchSessions]);

  // Fetch session by ID
  const fetchSessionById = useCallback(async (sessionId) => {
    dispatch({ type: SESSION_ACTIONS.SET_LOADING, payload: true });

    try {
      const session = await sessionApi.getSessionById(sessionId);
      dispatch({
        type: SESSION_ACTIONS.SET_CURRENT_SESSION,
        payload: session,
      });
      return { success: true, session };
    } catch (error) {
      dispatch({
        type: SESSION_ACTIONS.SET_ERROR,
        payload: error.message,
      });
      return { success: false, error: error.message };
    }
  }, []);

  // Upload audio and create session
  const uploadAudio = useCallback(async ({ audioUri, targetText, language }) => {
    dispatch({ type: SESSION_ACTIONS.SET_LOADING, payload: true });

    try {
      const session = await sessionApi.uploadAudio({ audioUri, targetText, language });
      dispatch({
        type: SESSION_ACTIONS.ADD_SESSION,
        payload: session,
      });
      return { success: true, session };
    } catch (error) {
      dispatch({
        type: SESSION_ACTIONS.SET_ERROR,
        payload: error.message,
      });
      return { success: false, error: error.message };
    }
  }, []);

  // Fetch practice words
  const fetchPracticeWords = useCallback(async (options = {}) => {
    dispatch({ type: SESSION_ACTIONS.SET_LOADING, payload: true });

    try {
      const words = await sessionApi.getPracticeWords(options);
      dispatch({
        type: SESSION_ACTIONS.SET_PRACTICE_WORDS,
        payload: words,
      });
      return { success: true, words };
    } catch (error) {
      dispatch({
        type: SESSION_ACTIONS.SET_ERROR,
        payload: error.message,
      });
      return { success: false, error: error.message };
    }
  }, []);

  // Fetch practice phrases
  const fetchPracticePhrases = useCallback(async (options = {}) => {
    dispatch({ type: SESSION_ACTIONS.SET_LOADING, payload: true });

    try {
      const phrases = await sessionApi.getPracticePhrases(options);
      dispatch({
        type: SESSION_ACTIONS.SET_PRACTICE_PHRASES,
        payload: phrases,
      });
      return { success: true, phrases };
    } catch (error) {
      dispatch({
        type: SESSION_ACTIONS.SET_ERROR,
        payload: error.message,
      });
      return { success: false, error: error.message };
    }
  }, []);

  // Delete session
  const deleteSession = useCallback(async (sessionId) => {
    try {
      await sessionApi.deleteSession(sessionId);
      dispatch({
        type: SESSION_ACTIONS.REMOVE_SESSION,
        payload: sessionId,
      });
      return { success: true };
    } catch (error) {
      dispatch({
        type: SESSION_ACTIONS.SET_ERROR,
        payload: error.message,
      });
      return { success: false, error: error.message };
    }
  }, []);

  // Clear current session
  const clearCurrentSession = useCallback(() => {
    dispatch({ type: SESSION_ACTIONS.SET_CURRENT_SESSION, payload: null });
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: SESSION_ACTIONS.CLEAR_ERROR });
  }, []);

  // Reset state (e.g., on logout)
  const reset = useCallback(() => {
    dispatch({ type: SESSION_ACTIONS.RESET });
  }, []);

  const value = {
    ...state,
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

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};

// Custom hook to use session context
export const useSessionContext = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSessionContext must be used within a SessionProvider');
  }
  return context;
};

export default SessionContext;
