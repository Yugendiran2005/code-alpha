// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Object Detection Classes
export const DETECTION_CLASSES = [
  { id: 0, name: 'Person', color: '#FF6B6B' },
  { id: 1, name: 'Car', color: '#4ECDC4' },
  { id: 2, name: 'Bus', color: '#45B7D1' },
  { id: 3, name: 'Truck', color: '#FFA07A' },
  { id: 4, name: 'Motorcycle', color: '#98D8C8' },
  { id: 5, name: 'Bicycle', color: '#F7DC6F' },
  { id: 6, name: 'Dog', color: '#BB8FCE' },
  { id: 7, name: 'Cat', color: '#F8B739' },
];

// Detection Sources
export const DETECTION_SOURCES = {
  WEBCAM: 'webcam',
  UPLOAD: 'upload',
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
};

// Confidence Threshold
export const DEFAULT_CONFIDENCE = 0.5;
export const MIN_CONFIDENCE = 0.1;
export const MAX_CONFIDENCE = 1.0;

// Video Settings
export const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
export const ALLOWED_VIDEO_FORMATS = ['video/mp4', 'video/avi', 'video/mov', 'video/mkv'];

// Pagination
export const ITEMS_PER_PAGE = 10;

// Chart Colors
export const CHART_COLORS = [
  '#667eea',
  '#764ba2',
  '#f093fb',
  '#4facfe',
  '#43e97b',
  '#fa709a',
  '#fee140',
  '#30cfd0',
];

// Status Types
export const STATUS_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};
