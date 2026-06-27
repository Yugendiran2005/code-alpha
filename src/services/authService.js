import api from './api';

export const authService = {
  // Register new user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Login user
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get user profile
  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (userData) => {
    try {
      const response = await api.put('/auth/profile', userData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.put('/auth/change-password', {
        current_password: currentPassword,
        new_password: newPassword,
      });
      return response;
    } catch (error) {
      throw error;
    }
  },
};
