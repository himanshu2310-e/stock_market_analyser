import api from '../config/api';

export const historyService = {
  getHistory: () => api.get('/history'),
  addHistory: (data) => api.post('/history', data),
  deleteHistory: (id) => api.delete(`/history/${id}`),
};

export default historyService;
