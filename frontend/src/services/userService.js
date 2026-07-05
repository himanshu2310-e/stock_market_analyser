import api from '../config/api';

export const userService = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
  changePassword: (data) => api.put('/user/change-password', data),
  deleteAccount: () => api.delete('/user/profile'),
};

export default userService;
