import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

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
    throw error;
  }
};

export const signup = async (name, email, password) => {
  const response = await axios.post(`${API_BASE_URL}/auth/register`, { name, email, password });
  return response.data;
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
