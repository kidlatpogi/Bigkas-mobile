import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from '../config/env';

/**
 * Supabase client instance configured for React Native.
 *
 * - Uses AsyncStorage for persisting the auth session across app restarts.
 * - Auto-refreshes JWT tokens.
 * - URL and anon key are loaded from config/env.js (reads .env at build time).
 *
 * @see https://supabase.com/docs/reference/javascript/initializing
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // not applicable in React Native
  },
});

export default supabase;
