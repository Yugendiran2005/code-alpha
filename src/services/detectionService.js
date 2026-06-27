import api from './api';

export const detectionService = {
  // Start webcam detection
  startWebcam: async (config) => {
    try {
      const response = await api.post('/detection/webcam', config);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Upload and process video
  uploadVideo: async (formData, onUploadProgress) => {
    try {
      const response = await api.post('/detection/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress,
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get detection history
  getHistory: async (params) => {
    try {
      const response = await api.get('/detection/history', { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get detection statistics
  getStatistics: async () => {
    try {
      const response = await api.get('/detection/statistics');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete detection record
  deleteDetection: async (id) => {
    try {
      const response = await api.delete(`/detection/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get detection by ID
  getDetectionById: async (id) => {
    try {
      const response = await api.get(`/detection/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Export detection history
  exportHistory: async (format = 'csv') => {
    try {
      const response = await api.get(`/detection/export/${format}`, {
        responseType: 'blob',
      });
      return response;
    } catch (error) {
      throw error;
    }
  },
};
