/**
 * Shared utility / helper functions.
 */

/**
 * Extracts user initials from name for avatar fallback.
 * @param {string} name
 * @returns {string} 1-2 character initials
 */
export const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/**
 * Extracts error message from API error response.
 * @param {Error} error - Axios error or generic error.
 * @returns {string}
 */
export const getErrorMessage = (error) => {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.message) return error.message;
  return 'Something went wrong. Please try again.';
};

/**
 * Formats a date to readable string.
 * @param {string|Date} date
 * @returns {string}
 */
export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Debounce function.
 * @param {Function} fn
 * @param {number} delay
 * @returns {Function}
 */
export const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

/**
 * Classname concatenation utility (replaces clsx).
 * @param  {...(string|false|null|undefined)} classes
 * @returns {string}
 */
export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};
