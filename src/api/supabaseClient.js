import { createClient } from '@supabase/supabase-js';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from '../config/env';

/**
 * Supabase client instance for auth and database access.
 * Keep keys in config/env.js and replace placeholders with real values.
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
