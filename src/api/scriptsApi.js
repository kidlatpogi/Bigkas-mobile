import { supabase } from './supabaseClient';

/**
 * Scripts API — Supabase CRUD operations for user scripts.
 *
 * Expects a `scripts` table in Supabase with this shape:
 *
 * CREATE TABLE public.scripts (
 *   id          uuid NOT NULL DEFAULT uuid_generate_v4(),
 *   user_id     uuid NOT NULL,
 *   title       text NOT NULL,
 *   content     text NOT NULL DEFAULT '',
 *   type        text NOT NULL DEFAULT 'self-authored'
 *                 CHECK (type IN ('self-authored','auto-generated')),
 *   created_at  timestamptz DEFAULT now(),
 *   updated_at  timestamptz DEFAULT now(),
 *   CONSTRAINT scripts_pkey PRIMARY KEY (id),
 *   CONSTRAINT scripts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
 * );
 *
 * Scripts are plain text — no binary blobs — so a regular table (not a
 * Storage bucket) is the right fit. RLS policies should scope rows to
 * the authenticated user's `user_id`.
 */

/**
 * Fetch all scripts belonging to the currently authenticated user.
 * @returns {Promise<{success: boolean, scripts?: Array, error?: string}>}
 */
export const fetchScripts = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Not authenticated' };

    const { data, error } = await supabase
      .from('scripts')
      .select('id, user_id, title, content, type, created_at, updated_at')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return { success: true, scripts: data };
  } catch (err) {
    console.error('fetchScripts error:', err);
    return { success: false, error: err.message };
  }
};

/**
 * Get a single script by ID.
 * @param {string} scriptId
 * @returns {Promise<{success: boolean, script?: object, error?: string}>}
 */
export const fetchScriptById = async (scriptId) => {
  try {
    const { data, error } = await supabase
      .from('scripts')
      .select('id, user_id, title, content, type, created_at, updated_at')
      .eq('id', scriptId)
      .single();

    if (error) throw error;
    return { success: true, script: data };
  } catch (err) {
    console.error('fetchScriptById error:', err);
    return { success: false, error: err.message };
  }
};

/**
 * Create a new script.
 * @param {{ title: string, content: string, type?: string }} params
 * @returns {Promise<{success: boolean, script?: object, error?: string}>}
 */
export const createScript = async ({ title, content, type = 'self-authored' }) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Not authenticated' };

    const { data, error } = await supabase
      .from('scripts')
      .insert({
        user_id: user.id,
        title,
        content,
        type,
      })
      .select('id, user_id, title, content, type, created_at, updated_at')
      .single();

    if (error) throw error;
    return { success: true, script: data };
  } catch (err) {
    console.error('createScript error:', err);
    return { success: false, error: err.message };
  }
};

/**
 * Update an existing script.
 * @param {string} scriptId
 * @param {{ title?: string, content?: string }} updates
 * @returns {Promise<{success: boolean, script?: object, error?: string}>}
 */
export const updateScript = async (scriptId, updates) => {
  try {
    const { data, error } = await supabase
      .from('scripts')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', scriptId)
      .select('id, user_id, title, content, type, created_at, updated_at')
      .single();

    if (error) throw error;
    return { success: true, script: data };
  } catch (err) {
    console.error('updateScript error:', err);
    return { success: false, error: err.message };
  }
};

/**
 * Delete a script by ID.
 * @param {string} scriptId
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteScript = async (scriptId) => {
  try {
    const { error } = await supabase
      .from('scripts')
      .delete()
      .eq('id', scriptId);

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('deleteScript error:', err);
    return { success: false, error: err.message };
  }
};
