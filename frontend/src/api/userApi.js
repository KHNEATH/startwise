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
  try {
    const response = await axios.post(`${API_BASE_URL}/profile`, profileData);
    return response.data;
  } catch (error) {
    console.error('saveProfile error:', error);
    
    // In production without backend, provide demo response
    if (process.env.NODE_ENV === 'production' && 
        (!error.response || 
         error.code === 'ERR_NETWORK' || 
         error.message.includes('Network') ||
         error.message.includes('localhost') ||
         error.message.includes('Not allowed to request resource'))) {
      
      console.log('🎭 Using demo profile save for production (backend not available)');
      
      // Simulate successful profile save
      const demoResponse = {
        id: 'demo-profile-' + Date.now(),
        message: 'Demo profile saved successfully! (Backend not connected)',
        profile: profileData.profile || profileData,
        saved: true
      };
      
      // Store demo profile data locally
      localStorage.setItem('demoProfile', JSON.stringify(demoResponse.profile));
      
      return demoResponse;
    }
    
    throw error;
  }
};

export const saveCV = async (cvData) => {
  try {
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
  } catch (error) {
    console.error('saveCV error:', error);
    
    // In production without backend, provide demo response
    if (process.env.NODE_ENV === 'production' && 
        (!error.response || 
         error.code === 'ERR_NETWORK' || 
         error.message.includes('Network') ||
         error.message.includes('localhost') ||
         error.message.includes('Not allowed to request resource'))) {
      
      console.log('🎭 Using demo CV save for production (backend not available)');
      
      // Simulate successful CV save
      const demoResponse = {
        id: 'demo-cv-' + Date.now(),
        message: 'Demo CV saved successfully! (Backend not connected)',
        cv: cvData,
        saved: true
      };
      
      // Store demo CV data locally
      localStorage.setItem('demoCV', JSON.stringify(cvData));
      
      return demoResponse;
    }
    
    throw error;
  }
};

export const getProfile = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/profile`);
    return response.data;
  } catch (error) {
    console.error('getProfile error:', error);
    
    // In production, try to load demo profile from localStorage
    if (process.env.NODE_ENV === 'production' && 
        (!error.response || 
         error.code === 'ERR_NETWORK' || 
         error.message.includes('Network') ||
         error.message.includes('localhost') ||
         error.message.includes('Not allowed to request resource'))) {
      
      console.log('🎭 Loading demo profile for production');
      
      // Try to get saved demo profile first
      const savedProfile = localStorage.getItem('demoProfile');
      if (savedProfile) {
        return JSON.parse(savedProfile);
      }
      
      // Default demo profile if none saved
      return {
        name: 'Demo User',
        education: 'Computer Science Graduate',
        skills: 'React, Node.js, JavaScript, CSS',
        location: 'Phnom Penh, Cambodia',
        age: '22',
        isDemo: true
      };
    }
    
    throw error;
  }
};

export const getCV = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cv`);
    return response.data;
  } catch (error) {
    console.error('getCV error:', error);
    
    // In production, try to load demo CV from localStorage
    if (process.env.NODE_ENV === 'production' && 
        (!error.response || 
         error.code === 'ERR_NETWORK' || 
         error.message.includes('Network') ||
         error.message.includes('localhost') ||
         error.message.includes('Not allowed to request resource'))) {
      
      console.log('🎭 Loading demo CV for production');
      
      // Try to get saved demo CV first
      const savedCV = localStorage.getItem('demoCV');
      if (savedCV) {
        return JSON.parse(savedCV);
      }
      
      // Default demo CV if none saved
      return {
        name: 'Demo User',
        email: 'demo@startwise.com',
        phone: '+855 12 345 678',
        experience: 'Software Developer with 2+ years experience',
        education: 'Bachelor in Computer Science',
        skills: ['React', 'Node.js', 'JavaScript', 'CSS', 'MongoDB'],
        isDemo: true
      };
    }
    
    throw error;
  }
};
