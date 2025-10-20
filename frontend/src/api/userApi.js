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

// Auth API
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

    // If running in production and backend is unreachable, return a friendly error
    if (process.env.NODE_ENV === 'production' && (!error.response || error.message.includes('Network'))) {
      console.warn('userApi.login: backend unreachable in production');
      throw new Error('Unable to reach authentication service. Please try again later.');
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
    if (process.env.NODE_ENV === 'production' && (!error.response || error.message.includes('Network'))) {
      throw new Error('Unable to reach registration service. Please try again later.');
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
