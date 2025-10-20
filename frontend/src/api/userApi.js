import axios from 'axios';

// Dynamic API URL configuration for different environments
const getApiBaseUrl = () => {
  // Production environment
  if (process.env.NODE_ENV === 'production') {
    // Use the same domain as the frontend for API calls
    const currentDomain = window.location.origin;
    return process.env.REACT_APP_API_URL || `${currentDomain}/api`;
  }
  // Development environment
  return process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
};

// Normalize API base URL and ensure it ends with '/api'
const _rawApiBase = getApiBaseUrl();
const API_BASE_URL = (_rawApiBase || '').replace(/\/+$/, '').endsWith('/api')
  ? (_rawApiBase || '').replace(/\/+$/, '')
  : (_rawApiBase || '').replace(/\/+$/, '') + '/api';

console.log('🔐 userApi - API_BASE_URL:', API_BASE_URL, 'NODE_ENV:', process.env.NODE_ENV);

export const login = async (email, password) => {
  console.log('userApi.login called with:', { email, password: '***' });
  console.log('API URL:', `${API_BASE_URL}/auth/login`);
  
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
    console.log('userApi.login success:', response.data);
    return response.data;
  } catch (error) {
    console.error('userApi.login error:', error);
    console.error('Error response:', error.response);

    // In production without backend, provide demo response
    if (process.env.NODE_ENV === 'production' && 
        (!error.response || 
         error.code === 'ERR_NETWORK' || 
         error.message.includes('Network') ||
         error.message.includes('localhost') ||
         error.message.includes('Not allowed to request resource'))) {
      
      console.log('🎭 Using demo login for production (backend not available)');
      
      // Simulate successful login
      const demoUser = {
        id: 'demo-user-login',
        name: 'Demo User',
        email: email,
        token: 'demo-token-' + Date.now(),
        message: 'Demo login successful! (Backend not connected)'
      };
      
      // Store demo token
      localStorage.setItem('token', demoUser.token);
      localStorage.setItem('user', JSON.stringify(demoUser));
      
      return demoUser;
    }

    throw error;
  }
};

export const signup = async (name, email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, { name, email, password });
    return response.data;
  } catch (error) {
    console.error('userApi.signup error:', error);
    
    // In production without backend, provide demo response
    if (process.env.NODE_ENV === 'production' && 
        (!error.response || 
         error.code === 'ERR_NETWORK' || 
         error.message.includes('Network') ||
         error.message.includes('localhost') ||
         error.message.includes('Not allowed to request resource'))) {
      
      console.log('🎭 Using demo signup for production (backend not available)');
      
      // Simulate successful signup
      const demoUser = {
        id: 'demo-user-' + Date.now(),
        name: name,
        email: email,
        token: 'demo-token-' + Date.now(),
        message: 'Demo account created successfully! (Backend not connected)'
      };
      
      // Store demo token
      localStorage.setItem('token', demoUser.token);
      localStorage.setItem('user', JSON.stringify(demoUser));
      
      return demoUser;
    }
    
    throw error;
  }
};

export const saveProfile = async (profileData) => {
  const response = await axios.post(`${API_BASE_URL}/profile`, profileData);
  return response.data;
};

export const saveCV = async (cvData) => {
  // Add auth token if available
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  };
  
  const response = await axios.post(`${API_BASE_URL}/cv`, cvData, config);
  return response.data;
};

export const getProfile = async () => {
  const response = await axios.get(`${API_BASE_URL}/profile`);
  return response.data;
};

export const getCV = async () => {
  const response = await axios.get(`${API_BASE_URL}/cv`);
  return response.data;
};
