// Session API functions
import apiClient from './client';
import { ENDPOINTS } from '../utils/constants';

/**
 * Get all sessions for the current user
 * @param {Object} options
 * @param {number} [options.page=1]
 * @param {number} [options.limit=20]
 * @returns {Promise<{ sessions: Array, total: number, page: number }>}
 */
export const getSessions = async ({ page = 1, limit = 20 } = {}) => {
  return apiClient.get(ENDPOINTS.SESSIONS, { page, limit });
};

/**
 * Get a specific session by ID
 * @param {string} sessionId
 * @returns {Promise<Object>}
 */
export const getSessionById = async (sessionId) => {
  return apiClient.get(ENDPOINTS.SESSION_DETAIL(sessionId));
};

/**
 * Upload audio for pronunciation analysis
 * @param {Object} params
 * @param {string} params.audioUri - Local file URI of the audio
 * @param {string} params.targetText - The text that was supposed to be spoken
 * @param {string} [params.language='tl'] - Language code (e.g., 'tl' for Tagalog)
 * @returns {Promise<Object>}
 */
export const uploadAudio = async ({ audioUri, targetText, language = 'tl' }) => {
  const formData = new FormData();

  // Create file object for React Native
  const filename = audioUri.split('/').pop();
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `audio/${match[1]}` : 'audio/wav';

  formData.append('audio', {
    uri: audioUri,
    name: filename,
    type,
  });
  formData.append('target_text', targetText);
  formData.append('language', language);

  return apiClient.uploadFile(ENDPOINTS.UPLOAD_AUDIO, formData);
};

/**
 * Get scores for a specific session
 * @param {string} sessionId
 * @returns {Promise<Object>}
 */
export const getSessionScores = async (sessionId) => {
  return apiClient.get(ENDPOINTS.SESSION_SCORES(sessionId));
};

/**
 * Get practice words
 * @param {Object} options
 * @param {string} [options.difficulty] - 'easy', 'medium', 'hard'
 * @param {string} [options.category] - Word category
 * @param {number} [options.limit=10]
 * @returns {Promise<Array>}
 */
export const getPracticeWords = async ({ difficulty, category, limit = 10 } = {}) => {
  return apiClient.get(ENDPOINTS.PRACTICE_WORDS, { difficulty, category, limit });
};

/**
 * Get practice phrases
 * @param {Object} options
 * @param {string} [options.difficulty] - 'easy', 'medium', 'hard'
 * @param {number} [options.limit=10]
 * @returns {Promise<Array>}
 */
export const getPracticePhrases = async ({ difficulty, limit = 10 } = {}) => {
  return apiClient.get(ENDPOINTS.PRACTICE_PHRASES, { difficulty, limit });
};

/**
 * Delete a session
 * @param {string} sessionId
 * @returns {Promise<void>}
 */
export const deleteSession = async (sessionId) => {
  return apiClient.delete(ENDPOINTS.SESSION_DETAIL(sessionId));
};

export default {
  getSessions,
  getSessionById,
  uploadAudio,
  getSessionScores,
  getPracticeWords,
  getPracticePhrases,
  deleteSession,
};
