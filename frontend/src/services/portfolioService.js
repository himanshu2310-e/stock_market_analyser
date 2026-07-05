import api from '../config/api';

export const portfolioService = {
  getPortfolio: () => api.get('/portfolio'),
  addInvestment: (data) => api.post('/portfolio', data),
  updateInvestment: (id, data) => api.put(`/portfolio/${id}`, data),
  deleteInvestment: (id) => api.delete(`/portfolio/${id}`),
};

export default portfolioService;
