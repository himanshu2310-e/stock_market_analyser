import api from '../config/api';

export const watchlistService = {
  getWatchlist: () => api.get('/watchlist'),
  addToWatchlist: (data) => api.post('/watchlist', data),
  togglePin: (id) => api.put(`/watchlist/${id}/pin`),
  removeFromWatchlist: (id) => api.delete(`/watchlist/${id}`),
};

export default watchlistService;
