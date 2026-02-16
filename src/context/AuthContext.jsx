import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/constants';
import * as authApi from '../api/authApi';

// Initial state
const initialState = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
};

// Action types
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  RESTORE_SESSION: 'RESTORE_SESSION',
  UPDATE_PROFILE: 'UPDATE_PROFILE',
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };

    case AUTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };

    case AUTH_ACTIONS.RESTORE_SESSION:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: !!action.payload.user,
        isLoading: false,
      };

    case AUTH_ACTIONS.UPDATE_PROFILE:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    default:
      return state;
  }
};

// Create context
const AuthContext = createContext(null);

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Restore session on app start
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const [token, userData] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
          AsyncStorage.getItem(STORAGE_KEYS.USER_DATA),
        ]);

        if (token && userData) {
          // Set token in API client
          authApi.setAuthToken(token);

          dispatch({
            type: AUTH_ACTIONS.RESTORE_SESSION,
            payload: { user: JSON.parse(userData) },
          });
        } else {
          dispatch({
            type: AUTH_ACTIONS.RESTORE_SESSION,
            payload: { user: null },
          });
        }
      } catch (error) {
        console.error('Failed to restore session:', error);
        dispatch({
          type: AUTH_ACTIONS.RESTORE_SESSION,
          payload: { user: null },
        });
      }
    };

    restoreSession();
  }, []);

  // Login action
  const login = async (email, password) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

    try {
      // Mock login for development - accepts any email/password
      const mockUser = {
        id: '1',
        name: email.split('@')[0],
        email: email,
        nickname: null,
        createdAt: new Date().toISOString(),
      };

      const mockToken = 'mock_jwt_token_' + Date.now();

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Store auth data
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, mockToken),
        AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(mockUser)),
      ]);

      // Set token in API client for future requests
      authApi.setAuthToken(mockToken);

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user: mockUser },
      });

      return { success: true };
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: error.message || 'Login failed',
      });
      return { success: false, error: error.message };
    }
  };

  // Register action
  const register = async (userData) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

    try {
      // Mock registration for development
      const mockUser = {
        id: Math.random().toString(36).substr(2, 9),
        name: userData.name,
        email: userData.email,
        nickname: null,
        createdAt: new Date().toISOString(),
      };

      const mockToken = 'mock_jwt_token_' + Date.now();

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Store auth data
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, mockToken),
        AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(mockUser)),
      ]);

      // Set token in API client for future requests
      authApi.setAuthToken(mockToken);

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user: mockUser },
      });

      return { success: true };
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: error.message || 'Registration failed',
      });
      return { success: false, error: error.message };
    }
  };

  // Logout action
  const logout = async () => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout API error:', error);
    }

    // Clear stored data
    await Promise.all([
      AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN),
      AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA),
    ]);

    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Update nickname on first login
  const updateNickname = async (nickname) => {
    const trimmedNickname = nickname.trim();
    if (!trimmedNickname) {
      return { success: false, error: 'Nickname is required' };
    }

    try {
      const updatedUser = { ...state.user, nickname: trimmedNickname };
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_DATA,
        JSON.stringify(updatedUser)
      );

      dispatch({
        type: AUTH_ACTIONS.UPDATE_PROFILE,
        payload: updatedUser,
      });

      return { success: true };
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: error.message || 'Failed to update nickname',
      });
      return { success: false, error: error.message };
    }
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    clearError,
    updateNickname,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
