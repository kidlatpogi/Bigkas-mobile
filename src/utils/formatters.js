// Formatting utility functions

/**
 * Format date to readable string
 * @param {Date|string} date
 * @param {string} format - 'short', 'long', 'time', 'datetime'
 * @returns {string}
 */
export const formatDate = (date, format = 'short') => {
  const d = new Date(date);

  const options = {
    short: { month: 'short', day: 'numeric', year: 'numeric' },
    long: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' },
    time: { hour: '2-digit', minute: '2-digit' },
    datetime: {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    },
  };

  return d.toLocaleDateString('en-US', options[format] || options.short);
};

/**
 * Format duration in seconds to mm:ss
 * @param {number} seconds
 * @returns {string}
 */
export const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Format score as percentage
 * @param {number} score - Score value between 0 and 1
 * @param {number} decimals - Number of decimal places
 * @returns {string}
 */
export const formatScore = (score, decimals = 0) => {
  return `${(score * 100).toFixed(decimals)}%`;
};

/**
 * Truncate text with ellipsis
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Capitalize first letter of string
 * @param {string} str
 * @returns {string}
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Format file size
 * @param {number} bytes
 * @returns {string}
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export default {
  formatDate,
  formatDuration,
  formatScore,
  truncateText,
  capitalize,
  formatFileSize,
};
