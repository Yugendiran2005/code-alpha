import api from './api';

export const analyticsService = {
  // Get dashboard analytics
  getDashboard: async () => {
    try {
      const response = await api.get('/analytics/dashboard');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get object distribution
  getObjectDistribution: async (period = 'all') => {
    try {
      const response = await api.get('/analytics/objects', {
        params: { period },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get detection timeline
  getTimeline: async (period = 'week') => {
    try {
      const response = await api.get('/analytics/timeline', {
        params: { period },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get recent detections
  getRecentDetections: async (limit = 10) => {
    try {
      const response = await api.get('/analytics/recent', {
        params: { limit },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },
};
