import api from '../services/api';

// Test backend connection
export const testBackendConnection = async () => {
  try {
    console.log('Testing backend connection...');
    
    // Test root endpoint
    const rootResponse = await api.get('/');
    console.log('✅ Backend root endpoint:', rootResponse.data);
    
    // Test health endpoint
    const healthResponse = await api.get('/health');
    console.log('✅ Backend health check:', healthResponse.data);
    
    // Test API endpoints
    const summaryResponse = await api.get('/api/dashboard/summary');
    console.log('✅ Dashboard API working:', summaryResponse.data);
    
    return {
      success: true,
      message: 'Backend connection successful',
      data: {
        root: rootResponse.data,
        health: healthResponse.data,
        dashboard: summaryResponse.data
      }
    };
    
  } catch (error) {
    console.error('❌ Backend connection failed:', error);
    return {
      success: false,
      message: 'Backend connection failed',
      error: error.message
    };
  }
};

// Auto-test on app load
export const runConnectionTest = () => {
  setTimeout(() => {
    testBackendConnection().then(result => {
      if (result.success) {
        console.log('🎉 LokAI Backend Connection: SUCCESS');
      } else {
        console.error('🚨 LokAI Backend Connection: FAILED');
        console.log('💡 Make sure the backend is running on http://localhost:8000');
      }
    });
  }, 1000);
};
