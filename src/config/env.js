/**
 * Environment configuration.
 *
 * Expo SDK 54 auto-loads the .env file at the project root.
 * The values below read from process.env first, then fall back
 * to hardcoded defaults so the app works without a .env file.
 *
 * Required .env keys:
 *  - SUPABASE_ANON_PUBLIC   (Supabase anon / public API key)
 *  - SUPABASE_PUBLISHABLE_KEY (unused for now — kept for reference)
 */

/** Supabase project URL derived from the anon key's JWT `ref` claim. */
export const SUPABASE_URL =
  process.env.EXPO_PUBLIC_SUPABASE_URL ||
  'https://pkshgjlggqfuostxpllo.supabase.co';

/** Supabase anon / public key — safe to ship in client bundles. */
export const SUPABASE_ANON_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_PUBLIC ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrc2hqZ2xnZ3FmdW9zdHhwbGxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyMTA0NDcsImV4cCI6MjA4Njc4NjQ0N30.JHg-amPOe03p7WN92wIFn590BJw8La9KMC7We5VZbVE';

/** Base URL for any custom backend API (not used yet). */
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export default {
  API_BASE_URL,
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
};
