import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 10000,
});

// Request interceptor 
api.interceptors.request.use(
  (config) => {
    if (config.url.includes('/auth/login') || config.url.includes('/auth/register')) {
      console.log('Skipping auth for:', config.url);
      return config;
    }
    
    const token = localStorage.getItem('authToken');
    console.log('Making request to:', config.url);
    console.log('Token available:', !!token);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Token added to headers');
      console.log('Full headers:', config.headers);
    } else {
      console.error('No token found for protected route!');
      console.log('LocalStorage contents:', localStorage);
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;