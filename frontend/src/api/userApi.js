import axios from 'axios';

// Dynamic API URL configuration for different environments
const getApiBaseUrl = () => {
  // Check if we're in a browser environment (Vercel deployment)
  const isVercelDeployment = typeof window !== 'undefined' && 
    (window.location.hostname.includes('vercel.app') || 
     window.location.hostname !== 'localhost');
  
  // Force demo mode for Vercel deployments unless explicit backend URL is provided
  if (isVercelDeployment) {
    if (process.env.REACT_APP_API_URL && !process.env.REACT_APP_API_URL.includes('localhost')) {
      console.log('🌐 Using configured backend URL:', process.env.REACT_APP_API_URL);
      return process.env.REACT_APP_API_URL;
    }
    console.log('🎭 Vercel deployment detected: Using demo mode (no backend)');
    return null; // This will trigger demo mode in all API calls
  }
  
  // Production environment - check if backend is deployed
  if (process.env.NODE_ENV === 'production') {
    // If REACT_APP_API_URL is set, use it (for deployed backend)
    if (process.env.REACT_APP_API_URL && !process.env.REACT_APP_API_URL.includes('localhost')) {
      return process.env.REACT_APP_API_URL;
    }
    // Otherwise, use demo mode (no backend deployed)
    console.log('🎭 Production mode: No backend URL configured, using demo mode');
    return null; // This will trigger demo mode in all API calls
  }
  
  // Development environment - only use localhost if actually on localhost
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
  }
  
  // Fallback to demo mode for any other scenario
  console.log('🎭 Fallback: Using demo mode');
  return null;
};

// Normalize API base URL and ensure it ends with '/api'
const _rawApiBase = getApiBaseUrl();
const API_BASE_URL = _rawApiBase ? 
  (_rawApiBase.replace(/\/+$/, '').endsWith('/api')
    ? _rawApiBase.replace(/\/+$/, '')
    : _rawApiBase.replace(/\/+$/, '') + '/api')
  : null;

console.log('🔐 userApi - API_BASE_URL:', API_BASE_URL, 'NODE_ENV:', process.env.NODE_ENV);

export const login = async (email, password) => {
  console.log('userApi.login called with:', { email, password: '***' });
  console.log('API_BASE_URL:', API_BASE_URL);
  
  // If no API_BASE_URL (production demo mode), return demo data immediately
  if (!API_BASE_URL) {
    console.log('🎭 Demo mode: No backend configured, returning demo login');
    
    // Simulate successful login for any credentials
    const demoUser = {
      id: 'demo-user-' + Date.now(),
      name: email.split('@')[0] || 'Demo User',
      email: email,
      role: email.includes('admin') ? 'admin' : 'user',
      token: 'demo-token-' + Date.now(),
      user: {
        id: 'demo-user-' + Date.now(),
        name: email.split('@')[0] || 'Demo User',
        email: email,
        role: email.includes('admin') ? 'admin' : 'user'
      },
      message: 'Demo login successful! (Backend not connected)'
    };
    
    // Store demo token
    localStorage.setItem('token', demoUser.token);
    localStorage.setItem('user', JSON.stringify(demoUser.user));
    
    return demoUser;
  }
  
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
        id: 'demo-user-' + Date.now(),
        name: email.split('@')[0] || 'Demo User',
        email: email,
        role: email.includes('admin') ? 'admin' : 'user',
        token: 'demo-token-' + Date.now(),
        user: {
          id: 'demo-user-' + Date.now(),
          name: email.split('@')[0] || 'Demo User',
          email: email,
          role: email.includes('admin') ? 'admin' : 'user'
        },
        message: 'Demo login successful! (Backend not connected)'
      };
      
      // Store demo token
      localStorage.setItem('token', demoUser.token);
      localStorage.setItem('user', JSON.stringify(demoUser.user));
      
      return demoUser;
    }

    throw error;
  }
};

export const signup = async (name, email, password) => {
  // If no API_BASE_URL (production demo mode), return demo data immediately
  if (!API_BASE_URL) {
    console.log('🎭 Demo mode: No backend configured, returning demo signup');
    
    // Simulate successful signup for any credentials
    const demoUser = {
      id: 'demo-user-' + Date.now(),
      name: name,
      email: email,
      role: 'user',
      token: 'demo-token-' + Date.now(),
      user: {
        id: 'demo-user-' + Date.now(),
        name: name,
        email: email,
        role: 'user'
      },
      message: 'Demo account created successfully! (Backend not connected)'
    };
    
    // Store demo token
    localStorage.setItem('token', demoUser.token);
    localStorage.setItem('user', JSON.stringify(demoUser.user));
    
    return demoUser;
  }

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
        role: 'user',
        token: 'demo-token-' + Date.now(),
        user: {
          id: 'demo-user-' + Date.now(),
          name: name,
          email: email,
          role: 'user'
        },
        message: 'Demo account created successfully! (Backend not connected)'
      };
      
      // Store demo token
      localStorage.setItem('token', demoUser.token);
      localStorage.setItem('user', JSON.stringify(demoUser.user));
      
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

// Job Application Tracking Functions
export const saveJobApplication = (applicationData) => {
  try {
    console.log('💾 Saving job application:', applicationData);
    
    // Get existing applications from localStorage
    const existingApplications = JSON.parse(localStorage.getItem('userApplications') || '[]');
    
    // Create new application with timestamp and ID
    const newApplication = {
      id: `app-${Date.now()}`,
      ...applicationData,
      appliedAt: new Date().toISOString(),
      status: 'Applied'
    };
    
    // Add to existing applications
    const updatedApplications = [newApplication, ...existingApplications];
    
    // Save back to localStorage
    localStorage.setItem('userApplications', JSON.stringify(updatedApplications));
    
    console.log('✅ Application saved successfully:', newApplication);
    return newApplication;
  } catch (error) {
    console.error('❌ Error saving application:', error);
    throw error;
  }
};

export const getUserApplications = async () => {
  try {
    console.log('📊 Fetching user applications...');
    
    // Try to fetch from API first (if backend is available)
    if (process.env.NODE_ENV === 'development') {
      try {
        const response = await axios.get(`${API_BASE_URL}/applications/user`);
        console.log('✅ Applications fetched from API:', response.data);
        return response.data;
      } catch (error) {
        console.log('⚠️ API not available, using localStorage data');
      }
    }
    
    // Fallback to localStorage for production or when API is unavailable
    const applications = JSON.parse(localStorage.getItem('userApplications') || '[]');
    console.log('📱 Applications from localStorage:', applications);
    
    return applications;
  } catch (error) {
    console.error('❌ Error fetching applications:', error);
    return [];
  }
};

export const getUserStatistics = async () => {
  try {
    console.log('📈 Calculating user statistics...');
    
    const applications = await getUserApplications();
    
    const stats = {
      totalApplications: applications.length,
      profileViews: Math.floor(Math.random() * 50) + applications.length * 2, // Simulated
      savedJobs: Math.floor(applications.length / 2), // Simulated
      interviews: Math.floor(applications.length * 0.2) // Simulated 20% interview rate
    };
    
    console.log('📊 User statistics:', stats);
    return stats;
  } catch (error) {
    console.error('❌ Error calculating statistics:', error);
    return {
      totalApplications: 0,
      profileViews: 0,
      savedJobs: 0,
      interviews: 0
    };
  }
};

export const getRecentActivity = async () => {
  try {
    console.log('🕐 Fetching recent activity...');
    
    const applications = await getUserApplications();
    
    // Create activity items from applications
    const applicationActivities = applications.slice(0, 5).map(app => ({
      id: `activity-${app.id}`,
      type: 'application',
      title: `Applied to ${app.jobTitle}`,
      description: `at ${app.company}`,
      timestamp: app.appliedAt,
      icon: 'briefcase'
    }));
    
    // Add profile creation activity if no applications
    const profileActivity = {
      id: 'activity-profile',
      type: 'profile',
      title: 'Profile created',
      description: 'Welcome to StartWise!',
      timestamp: new Date().toISOString(),
      icon: 'user'
    };
    
    const allActivities = applications.length > 0 
      ? applicationActivities 
      : [profileActivity];
    
    console.log('📋 Recent activities:', allActivities);
    return allActivities;
  } catch (error) {
    console.error('❌ Error fetching recent activity:', error);
    return [{
      id: 'activity-profile',
      type: 'profile',
      title: 'Profile created',
      description: 'Welcome to StartWise!',
      timestamp: new Date().toISOString(),
      icon: 'user'
    }];
  }
};
