import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Response Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      url: error.config?.url
    });
    return Promise.reject(error);
  }
);

// OTP Service
export const otpService = {
  sendOTP: async (phone) => {
    const response = await api.post('/api/free-otp/send', { 
      phone // Send phone directly to free OTP service
    });
    return response.data;
  },

  verifyOTP: async (phone, otp) => {
    const response = await api.post('/api/free-otp/verify', { 
      phone, // Send phone directly to free OTP service
      otp 
    });
    return response.data;
  },

  getOTPStatus: async (phone) => {
    const response = await api.get(`/api/free-otp/status/${phone}`);
    return response.data;
  },

  getConfig: async () => {
    const response = await api.get('/api/free-otp/config');
    return response.data;
  },
};

// Complaint Service
export const complaintService = {
  submitComplaint: async (complaintData) => {
    const response = await api.post('/api/complaints/submit', complaintData);
    return response.data;
  },

  getComplaints: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== '') {
        params.append(key, filters[key]);
      }
    });
    
    const response = await api.get(`/api/complaints/?${params}`);
    return response.data;
  },

  getComplaint: async (complaintId) => {
    const response = await api.get(`/api/complaints/${complaintId}`);
    return response.data;
  },

  updateComplaint: async (complaintId, updateData) => {
    const response = await api.put(`/api/complaints/${complaintId}`, updateData);
    return response.data;
  },

  deleteComplaint: async (complaintId) => {
    const response = await api.delete(`/api/complaints/${complaintId}`);
    return response.data;
  },

  getComplaintsByPhone: async (phone) => {
    const response = await api.get(`/api/complaints/phone/${phone}`);
    return response.data;
  },

  searchComplaints: async (query, limit = 20) => {
    const response = await api.get(`/api/complaints/search/?q=${query}&limit=${limit}`);
    return response.data;
  },
};

// Dashboard Service
export const dashboardService = {
  getSummary: async (days = 30) => {
    const response = await api.get(`/api/dashboard/summary?days=${days}`);
    return response.data;
  },

  getHeatmapData: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== '') {
        params.append(key, filters[key]);
      }
    });
    
    const response = await api.get(`/api/dashboard/heatmap?${params}`);
    return response.data;
  },

  getTrends: async (days = 30, category = null) => {
    const params = new URLSearchParams({ days });
    if (category) params.append('category', category);
    
    const response = await api.get(`/api/dashboard/trends?${params}`);
    return response.data;
  },

  getOverviewStats: async () => {
    const response = await api.get('/api/dashboard/stats/overview');
    return response.data;
  },

  getPerformanceMetrics: async () => {
    const response = await api.get('/api/dashboard/performance');
    return response.data;
  },

  getPredictions: async () => {
    const response = await api.get('/api/dashboard/predictions');
    return response.data;
  },

  getCategoryPrediction: async (category) => {
    const response = await api.get(`/api/dashboard/predictions/${category}`);
    return response.data;
  },
};

// Sentiment Service
export const sentimentService = {
  getSentimentAnalysis: async (days = 30) => {
    const response = await api.get(`/api/sentiment/analysis?days=${days}`);
    return response.data;
  },
};

// Utility functions
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const message = error.response.data?.detail || error.response.data?.message || 'An error occurred';
    return {
      message,
      status: error.response.status,
      data: error.response.data,
    };
  } else if (error.request) {
    // Request was made but no response received
    return {
      message: 'Network error. Please check your connection.',
      status: null,
      data: null,
    };
  } else {
    // Something else happened
    return {
      message: error.message || 'An unexpected error occurred',
      status: null,
      data: null,
    };
  }
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export default api;
