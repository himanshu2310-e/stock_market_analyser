import api from '../config/api';

export const stockService = {
  search: (query) => api.get('/stocks/search', { params: { q: query } }),
  getStock: (symbol) => api.get(`/stocks/${symbol}`),
  getHistorical: (symbol, range = '3m') =>
    api.get(`/stocks/historical/${symbol}`, { params: { range } }),
  getIndicators: (symbol) => api.get(`/stocks/indicators/${symbol}`),
};

export default stockService;
