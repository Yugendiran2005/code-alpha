// Mock data for development and testing without backend

// Mock users database
const mockUsers = [
  {
    id: 1,
    name: 'Demo User',
    email: 'demo@example.com',
    password: 'demo123', // In real app, this would be hashed
    role: 'user',
    created_at: new Date('2024-01-01').toISOString(),
  },
];

// Mock detection data
const generateMockDetections = (count = 50) => {
  const objects = ['person', 'car', 'bus', 'truck', 'motorcycle', 'bicycle', 'dog', 'cat'];
  const sources = ['webcam', 'upload'];
  const detections = [];

  for (let i = 0; i < count; i++) {
    const date = new Date();
    date.setHours(date.getHours() - Math.floor(Math.random() * 72)); // Last 3 days

    detections.push({
      id: i + 1,
      user_id: 1,
      object_name: objects[Math.floor(Math.random() * objects.length)],
      confidence: 0.5 + Math.random() * 0.5, // 0.5 to 1.0
      tracking_id: Math.floor(Math.random() * 100),
      frame_number: Math.floor(Math.random() * 1000),
      bbox: {
        x1: Math.random() * 500,
        y1: Math.random() * 500,
        x2: Math.random() * 500 + 100,
        y2: Math.random() * 500 + 100,
      },
      source: sources[Math.floor(Math.random() * sources.length)],
      video_name: `video_${Math.floor(Math.random() * 10)}.mp4`,
      timestamp: date.toISOString(),
    });
  }

  return detections.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

const mockDetections = generateMockDetections(100);

// Mock videos
const mockVideos = [
  {
    id: 1,
    filename: 'surveillance_cam1.mp4',
    duration: 125.5,
    fps: 30,
    resolution: '1920x1080',
    file_size: 52428800,
    status: 'completed',
    detections_count: 42,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 2,
    filename: 'traffic_monitor.mp4',
    duration: 240.0,
    fps: 25,
    resolution: '1280x720',
    file_size: 78643200,
    status: 'completed',
    detections_count: 156,
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 3,
    filename: 'parking_lot.mp4',
    duration: 180.5,
    fps: 30,
    resolution: '1920x1080',
    file_size: 65536000,
    status: 'processing',
    detections_count: 0,
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
];

// Mock API functions
export const mockAPI = {
  // Auth
  login: async (email, password) => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const { password: _, ...userWithoutPassword } = user;
    return {
      token: 'mock-jwt-token-' + Math.random().toString(36).substring(7),
      user: userWithoutPassword,
    };
  },

  register: async (userData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (mockUsers.find(u => u.email === userData.email)) {
      throw new Error('Email already exists');
    }

    const newUser = {
      id: mockUsers.length + 1,
      ...userData,
      role: 'user',
      created_at: new Date().toISOString(),
    };

    mockUsers.push(newUser);
    const { password: _, ...userWithoutPassword } = newUser;

    return {
      token: 'mock-jwt-token-' + Math.random().toString(36).substring(7),
      user: userWithoutPassword,
    };
  },

  getProfile: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const { password: _, ...user } = mockUsers[0];
    return user;
  },

  // Detection Statistics
  getStatistics: async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const now = new Date();
    const today = mockDetections.filter(d => {
      const detectionDate = new Date(d.timestamp);
      return detectionDate.toDateString() === now.toDateString();
    });

    const thisWeek = mockDetections.filter(d => {
      const detectionDate = new Date(d.timestamp);
      const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
      return detectionDate >= weekAgo;
    });

    const thisMonth = mockDetections.filter(d => {
      const detectionDate = new Date(d.timestamp);
      return detectionDate.getMonth() === now.getMonth();
    });

    return {
      total_detections: mockDetections.length,
      videos_processed: mockVideos.filter(v => v.status === 'completed').length,
      active_sessions: Math.floor(Math.random() * 5),
      today_count: today.length,
      week_count: thisWeek.length,
      month_count: thisMonth.length,
    };
  },

  // Detection History
  getHistory: async (params = {}) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    let filtered = [...mockDetections];

    // Apply filters
    if (params.object) {
      filtered = filtered.filter(d => d.object_name === params.object);
    }
    if (params.source) {
      filtered = filtered.filter(d => d.source === params.source);
    }
    if (params.min_confidence) {
      filtered = filtered.filter(d => d.confidence >= params.min_confidence);
    }

    // Pagination
    const page = params.page || 1;
    const limit = params.limit || 10;
    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      total: filtered.length,
      page,
      limit,
      pages: Math.ceil(filtered.length / limit),
      data: filtered.slice(start, end),
    };
  },

  // Analytics
  getDashboard: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const stats = await mockAPI.getStatistics();
    
    return {
      overview: {
        total_detections: stats.total_detections,
        videos_processed: stats.videos_processed,
        active_sessions: stats.active_sessions,
        total_users: mockUsers.length,
      },
      today: {
        detections: stats.today_count,
        videos: mockVideos.filter(v => {
          const videoDate = new Date(v.created_at);
          return videoDate.toDateString() === new Date().toDateString();
        }).length,
        most_detected: 'person',
      },
      week: {
        detections: stats.week_count,
        videos: mockVideos.length,
        daily_average: Math.floor(stats.week_count / 7),
      },
      recent_detections: mockDetections.slice(0, 10).map(d => ({
        object: d.object_name,
        confidence: d.confidence,
        time: getTimeAgo(d.timestamp),
      })),
    };
  },

  getObjectDistribution: async (period = 'all') => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    let filtered = mockDetections;
    const now = new Date();

    if (period === 'today') {
      filtered = mockDetections.filter(d => {
        const detectionDate = new Date(d.timestamp);
        return detectionDate.toDateString() === now.toDateString();
      });
    } else if (period === 'week') {
      const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
      filtered = mockDetections.filter(d => new Date(d.timestamp) >= weekAgo);
    } else if (period === 'month') {
      filtered = mockDetections.filter(d => {
        const detectionDate = new Date(d.timestamp);
        return detectionDate.getMonth() === now.getMonth();
      });
    }

    const distribution = {};
    filtered.forEach(d => {
      distribution[d.object_name] = (distribution[d.object_name] || 0) + 1;
    });

    const total = filtered.length;
    const data = Object.entries(distribution).map(([object, count]) => ({
      object,
      count,
      percentage: ((count / total) * 100).toFixed(1),
    })).sort((a, b) => b.count - a.count);

    return { period, data, total };
  },

  getTimeline: async (period = 'week') => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const data = [];
    const now = new Date();

    if (period === 'week') {
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const count = mockDetections.filter(d => {
          const detectionDate = new Date(d.timestamp);
          return detectionDate.toDateString() === date.toDateString();
        }).length;

        data.push({ date: dateStr, count });
      }
    }

    return { period, data };
  },

  // Videos
  getVideos: async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockVideos;
  },
};

// Helper function
function getTimeAgo(timestamp) {
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

export default mockAPI;
