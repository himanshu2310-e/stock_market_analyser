/**
 * Format a number as currency (USD).
 */
export const formatCurrency = (value, decimals = 2) => {
  if (value === null || value === undefined || isNaN(value)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * Format large numbers with abbreviations (K, M, B, T).
 */
export const formatLargeNumber = (num) => {
  if (!num || isNaN(num)) return '0';
  const n = parseFloat(num);
  if (n >= 1e12) return (n / 1e12).toFixed(2) + 'T';
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(2) + 'K';
  return n.toFixed(2);
};

/**
 * Format percentage string, adding + sign for positive values.
 */
export const formatPercentage = (value) => {
  if (!value) return '0.00%';
  const str = String(value).replace('%', '');
  const num = parseFloat(str);
  if (isNaN(num)) return '0.00%';
  const sign = num >= 0 ? '+' : '';
  return `${sign}${num.toFixed(2)}%`;
};

/**
 * Format a date string to locale format.
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format a date to relative time (e.g., "2 hours ago").
 */
export const formatRelativeTime = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diff = (now - date) / 1000;

  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return formatDate(dateStr);
};

/**
 * Format volume with commas.
 */
export const formatVolume = (vol) => {
  if (!vol || isNaN(vol)) return '0';
  return new Intl.NumberFormat('en-US').format(parseInt(vol, 10));
};

/**
 * Return CSS classes for positive/negative values.
 */
export const getChangeColor = (value) => {
  const num = parseFloat(String(value).replace('%', ''));
  if (isNaN(num) || num === 0) return 'text-dark-400';
  return num > 0 ? 'text-positive' : 'text-negative';
};

/**
 * Return background CSS classes for positive/negative values.
 */
export const getChangeBgColor = (value) => {
  const num = parseFloat(String(value).replace('%', ''));
  if (isNaN(num) || num === 0) return 'bg-dark-700/50';
  return num > 0 ? 'bg-positive' : 'bg-negative';
};
