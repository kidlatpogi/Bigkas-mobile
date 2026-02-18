import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/constants';
import { supabase } from '../api/supabaseClient';
import * as authApi from '../api/authApi';

// ──────────────────────────────────────────────
// Initial state
// ──────────────────────────────────────────────
const initialState = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
  emailVerified: false,
  pendingEmailVerification: false,
  pendingEmail: null,
};

// ──────────────────────────────────────────────
// Action types
// ──────────────────────────────────────────────
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  RESTORE_SESSION: 'RESTORE_SESSION',
  UPDATE_PROFILE: 'UPDATE_PROFILE',
  SET_EMAIL_VERIFIED: 'SET_EMAIL_VERIFIED',
  SET_PENDING_EMAIL_VERIFICATION: 'SET_PENDING_EMAIL_VERIFICATION',
  SET_PENDING_EMAIL: 'SET_PENDING_EMAIL',
};

// ──────────────────────────────────────────────
// Reducer
// ──────────────────────────────────────────────
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
        emailVerified: action.payload.emailVerified || false,
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        emailVerified: false,
        pendingEmailVerification: false,
        pendingEmail: null,
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
        emailVerified: action.payload.emailVerified || false,
      };

    case AUTH_ACTIONS.UPDATE_PROFILE:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case AUTH_ACTIONS.SET_EMAIL_VERIFIED:
      return {
        ...state,
        emailVerified: action.payload,
      };

    case AUTH_ACTIONS.SET_PENDING_EMAIL_VERIFICATION:
      return {
        ...state,
        pendingEmailVerification: action.payload,
      };

    case AUTH_ACTIONS.SET_PENDING_EMAIL:
      return {
        ...state,
        pendingEmail: action.payload,
      };

    default:
      return state;
  }
};

/**
 * Map a Supabase auth user object to the app-level user shape.
 * @param {import('@supabase/supabase-js').User} sbUser
 * @param {string|null} [nickname]
 * @returns {{ id:string, name:string, email:string, nickname:string|null, createdAt:string }}
 */
const mapSupabaseUser = (sbUser, nickname = null) => ({
  id: sbUser.id,
  name:
    sbUser.user_metadata?.full_name ||
    sbUser.user_metadata?.name ||
    sbUser.email?.split('@')[0] ||
    'User',
  email: sbUser.email || '',
  nickname:
    nickname ?? sbUser.user_metadata?.nickname ?? null,
  avatar_url: sbUser.user_metadata?.avatar_url ?? null,
  createdAt: sbUser.created_at,
});

// ──────────────────────────────────────────────
// Context
// ──────────────────────────────────────────────
const AuthContext = createContext(null);

/**
 * AuthProvider — wraps the app and manages Supabase-based authentication.
 *
 * Public API exposed via `useAuthContext()`:
 *  - user, isLoading, isAuthenticated, error
 *  - login(email, password)
 *  - register({ name, email, password })
 *  - logout()
 *  - clearError()
 *  - updateNickname(nickname)
 *
 * @component
 */
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // ── Restore / listen for Supabase session ──────────────────
  useEffect(() => {
    /** Restore the existing Supabase session on mount. */
    const restoreSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          // Try to load cached nickname from AsyncStorage
          const cachedData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
          const cached = cachedData ? JSON.parse(cachedData) : {};

          const appUser = mapSupabaseUser(session.user, cached.nickname);

          await AsyncStorage.setItem(
            STORAGE_KEYS.USER_DATA,
            JSON.stringify(appUser),
          );

          dispatch({
            type: AUTH_ACTIONS.RESTORE_SESSION,
            payload: { user: appUser },
          });
        } else {
          dispatch({
            type: AUTH_ACTIONS.RESTORE_SESSION,
            payload: { user: null },
          });
        }
      } catch (err) {
        console.error('Failed to restore session:', err);
        dispatch({
          type: AUTH_ACTIONS.RESTORE_SESSION,
          payload: { user: null },
        });
      }
    };

    restoreSession();

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
          dispatch({ type: AUTH_ACTIONS.LOGOUT });
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          const cachedData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
          const cached = cachedData ? JSON.parse(cachedData) : {};
          const appUser = mapSupabaseUser(session.user, cached.nickname);

          await AsyncStorage.setItem(
            STORAGE_KEYS.USER_DATA,
            JSON.stringify(appUser),
          );

          dispatch({
            type: AUTH_ACTIONS.LOGIN_SUCCESS,
            payload: { user: appUser },
          });
        }
      },
    );

    return () => subscription.unsubscribe();
  }, []);

  // ── Login ──────────────────────────────────────────────────
  /**
   * Sign in with email + password via Supabase Auth.
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{ success: boolean, error?: string }>}
   */
  const login = async (email, password) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Check if email is verified
      const emailVerified = !!data.user?.email_confirmed_at;

      if (!emailVerified) {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        dispatch({
          type: AUTH_ACTIONS.SET_ERROR,
          payload: 'Please verify your email address before logging in',
        });
        dispatch({
          type: AUTH_ACTIONS.SET_PENDING_EMAIL_VERIFICATION,
          payload: true,
        });
        dispatch({
          type: AUTH_ACTIONS.SET_PENDING_EMAIL,
          payload: email,
        });
        return { 
          success: false, 
          error: 'Please verify your email address first',
          requiresEmailVerification: true,
        };
      }

      const appUser = mapSupabaseUser(data.user);

      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_DATA,
        JSON.stringify(appUser),
      );

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user: appUser, emailVerified: true },
      });

      return { success: true };
    } catch (err) {
      const message = err?.message || 'Login failed';
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: message });
      return { success: false, error: message };
    }
  };

  // ── Register ───────────────────────────────────────────────
  /**
   * Create a new account via Supabase Auth.
   * @param {{ name: string, email: string, password: string }} userData
   * @returns {Promise<{ success: boolean, error?: string }>}
   */
  const register = async (userData) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

    try {
      const result = await authApi.register(userData);

      if (result.error) throw new Error(result.error);

      if (result.user) {
        // Set pending email verification - user needs to confirm email before login
        dispatch({
          type: AUTH_ACTIONS.SET_PENDING_EMAIL_VERIFICATION,
          payload: true,
        });
        dispatch({
          type: AUTH_ACTIONS.SET_PENDING_EMAIL,
          payload: userData.email,
        });
        
        dispatch({
          type: AUTH_ACTIONS.SET_LOADING,
          payload: false,
        });
      }

      return { success: true };
    } catch (err) {
      const message = err?.message || 'Registration failed';
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: message });
      return { success: false, error: message };
    }
  };

  // ── Logout ─────────────────────────────────────────────────
  /**
   * Sign out the current user from Supabase and clear local storage.
   * Optimized for fast UI response - clears local state immediately.
   */
  const logout = async () => {
    // Clear UI state immediately for fast UX
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
    
    // Do cleanup in background (don't block UI)
    Promise.all([
      // Clear local storage
      AsyncStorage.multiRemove([
        STORAGE_KEYS.AUTH_TOKEN,
        STORAGE_KEYS.USER_DATA,
      ]).catch(err => console.warn('AsyncStorage cleanup failed:', err)),
      
      // Sign out from Supabase (network can be slow)
      supabase.auth.signOut().catch(err => console.warn('Supabase signOut failed:', err))
    ]).catch(err => {
      console.error('Background logout cleanup failed:', err);
    });
  };

  // ── Clear error ────────────────────────────────────────────
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // ── Update nickname ────────────────────────────────────────
  /**
   * Persist a display-name nickname locally (and in Supabase user_metadata).
   * @param {string} nickname
   * @returns {Promise<{ success: boolean, error?: string }>}
   */
  const updateNickname = async (nickname) => {
    const trimmedNickname = nickname.trim();
    if (!trimmedNickname) {
      return { success: false, error: 'Nickname is required' };
    }

    try {
      // Update Supabase user_metadata
      await supabase.auth.updateUser({
        data: { nickname: trimmedNickname },
      });

      const updatedUser = { ...state.user, nickname: trimmedNickname };
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_DATA,
        JSON.stringify(updatedUser),
      );

      dispatch({
        type: AUTH_ACTIONS.UPDATE_PROFILE,
        payload: updatedUser,
      });

      return { success: true };
    } catch (err) {
      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: err.message || 'Failed to update nickname',
      });
      return { success: false, error: err.message };
    }
  };

  /**
   * Update nickname in local state only (when Supabase was already updated).
   * @param {string} nickname
   * @returns {Promise<{ success: boolean }>}
   */
  const updateNicknameLocal = async (nickname) => {
    try {
      const updatedUser = { ...state.user, nickname: nickname.trim() };
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_DATA,
        JSON.stringify(updatedUser),
      );

      dispatch({
        type: AUTH_ACTIONS.UPDATE_PROFILE,
        payload: updatedUser,
      });

      return { success: true };
    } catch (err) {
      console.warn('Failed to update local nickname:', err);
      return { success: false };
    }
  };

  // ── Resend Verification Email ───────────────────────────────
  /**
   * Resend email verification link to user's email.
   * @param {string} email
   * @returns {Promise<{ success: boolean, error?: string }>}
   */
  const resendVerificationEmail = async (email) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

    try {
      const result = await authApi.resendVerificationEmail(email);

      if (!result.success) throw new Error(result.error);

      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      return { success: true };
    } catch (err) {
      const message = err?.message || 'Failed to resend verification email';
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: message });
      return { success: false, error: message };
    }
  };

  // ── Reset Password ──────────────────────────────────────────
  /**
   * Send password reset link via email.
   * @param {string} email
   * @returns {Promise<{ success: boolean, error?: string }>}
   */
  const resetPassword = async (email) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

    try {
      const result = await authApi.resetPassword(email);

      if (!result.success) throw new Error(result.error);

      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      return { success: true };
    } catch (err) {
      const message = err?.message || 'Failed to send password reset link';
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: message });
      return { success: false, error: message };
    }
  };

  // ── Clear Pending Verification ──────────────────────────────
  /**
   * Clear pending email verification state.
   */
  const clearPendingEmailVerification = () => {
    dispatch({
      type: AUTH_ACTIONS.SET_PENDING_EMAIL_VERIFICATION,
      payload: false,
    });
    dispatch({
      type: AUTH_ACTIONS.SET_PENDING_EMAIL,
      payload: null,
    });
  };

  // ── Context value ──────────────────────────────────────────
  const value = {
    ...state,
    login,
    register,
    logout,
    clearError,
    updateNickname,
    updateNicknameLocal,
    resendVerificationEmail,
    resetPassword,
    clearPendingEmailVerification,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to consume AuthContext.
 * Must be used inside `<AuthProvider>`.
 */
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
