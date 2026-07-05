import api from '../config/api';

export const marketService = {
  getOverview: () => api.get('/market/overview'),
  getGainers: () => api.get('/market/gainers'),
  getLosers: () => api.get('/market/losers'),
  getActive: () => api.get('/market/active'),
};

export default marketService;
