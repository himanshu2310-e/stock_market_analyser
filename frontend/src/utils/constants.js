export const CHART_RANGES = [
  { label: '1D', value: '1d' },
  { label: '5D', value: '5d' },
  { label: '1M', value: '1m' },
  { label: '3M', value: '3m' },
  { label: '6M', value: '6m' },
  { label: '1Y', value: '1y' },
  { label: '5Y', value: '5y' },
  { label: 'MAX', value: 'max' },
];

export const POPULAR_STOCKS = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corp.' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  { symbol: 'TSLA', name: 'Tesla Inc.' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.' },
  { symbol: 'META', name: 'Meta Platforms Inc.' },
  { symbol: 'NFLX', name: 'Netflix Inc.' },
  { symbol: 'JPM', name: 'JPMorgan Chase' },
  { symbol: 'V', name: 'Visa Inc.' },
];

export const NAV_LINKS = [
  { label: 'Dashboard', path: '/dashboard', icon: 'HiOutlineViewGrid' },
  { label: 'Search', path: '/search', icon: 'HiOutlineSearch' },
  { label: 'Watchlist', path: '/watchlist', icon: 'HiOutlineStar' },
  { label: 'Portfolio', path: '/portfolio', icon: 'HiOutlineBriefcase' },
  { label: 'News', path: '/news', icon: 'HiOutlineNewspaper' },
];

export const INDICATOR_OPTIONS = [
  { key: 'sma20', label: 'SMA 20', color: '#f59e0b' },
  { key: 'sma50', label: 'SMA 50', color: '#8b5cf6' },
  { key: 'sma200', label: 'SMA 200', color: '#ec4899' },
  { key: 'ema12', label: 'EMA 12', color: '#06b6d4' },
  { key: 'ema26', label: 'EMA 26', color: '#14b8a6' },
  { key: 'bollinger', label: 'Bollinger Bands', color: '#6366f1' },
];

export const CHART_COLORS = {
  primary: '#3b82f6',
  success: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b',
  purple: '#8b5cf6',
  cyan: '#06b6d4',
  pink: '#ec4899',
  grid: 'rgba(148, 163, 184, 0.1)',
  gridLight: 'rgba(148, 163, 184, 0.05)',
  tooltip: 'rgba(15, 23, 42, 0.95)',
};
