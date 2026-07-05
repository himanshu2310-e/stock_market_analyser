import api from '../config/api';

export const newsService = {
  getNews: (params = {}) => api.get('/news', { params }),
};

export default newsService;
