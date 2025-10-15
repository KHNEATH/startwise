import axios from 'axios';

// Dynamic API URL configuration for different environments
const getApiBaseUrl = () => {
  // Production environment
  if (process.env.NODE_ENV === 'production') {
    return process.env.REACT_APP_API_URL || 'https://startwise-api.vercel.app/api';
  }
  // Development environment
  return process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
};

const API_BASE_URL = getApiBaseUrl();

console.log('🌐 API Configuration:', {
  environment: process.env.NODE_ENV,
  apiUrl: API_BASE_URL,
  reactAppApiUrl: process.env.REACT_APP_API_URL
});


export const fetchJobs = async (filters = {}) => {
  try {
    const params = {};
    if (filters.title) params.title = filters.title;
    if (filters.type) params.type = filters.type;
    if (filters.location) params.location = filters.location;
    
    const url = `${API_BASE_URL}/jobs/browse`;
    console.log('🌐 API Request URL:', url);
    console.log('📋 API Request params:', params);
    
    const response = await axios.get(url, { params });
    
    console.log('📡 API Response status:', response.status);
    console.log('📊 API Response data:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('🚨 API Error in fetchJobs:', error);
    console.error('📱 Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    
    // If backend is unavailable in production, return demo data
    if (process.env.NODE_ENV === 'production' || 
        error.code === 'NETWORK_ERROR' || 
        error.code === 'ERR_NETWORK' ||
        error.message.includes('Network Error') ||
        error.message.includes('ERR_NETWORK') ||
        !error.response) {
      console.log('🔄 Backend unavailable, returning demo data...');
      return getDemoJobs(filters);
    }
    
    throw error;
  }
};

// Demo data for when backend is unavailable
const getDemoJobs = (filters = {}) => {
  const demoJobs = [
    {
      id: 'demo-1',
      title: 'Frontend Developer',
      company: 'Tech Startup',
      location: 'Phnom Penh, Cambodia',
      type: 'Full-time',
      description: 'Join our team to build amazing web applications using React and modern technologies. Perfect for developers looking to grow their skills in a startup environment.'
    },
    {
      id: 'demo-2',
      title: 'Part-time English Tutor',
      company: 'Education Center',
      location: 'Siem Reap, Cambodia',
      type: 'Part-time',
      description: 'Teach English to local students. No experience required, training provided. Perfect for students or recent graduates.'
    },
    {
      id: 'demo-3',
      title: 'Social Media Assistant',
      company: 'Digital Agency',
      location: 'Remote',
      type: 'Internship',
      description: 'Help manage social media accounts for various clients. Learn digital marketing skills while earning money.'
    }
  ];
  
  // Apply basic filtering
  return demoJobs.filter(job => {
    if (filters.title && !job.title.toLowerCase().includes(filters.title.toLowerCase())) return false;
    if (filters.type && job.type !== filters.type) return false;
    if (filters.location && !job.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
    return true;
  });
};

export const postJob = async (jobData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/jobs/post`, jobData);
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === 'production' || 
        error.code === 'NETWORK_ERROR' || 
        error.code === 'ERR_NETWORK' ||
        error.message.includes('Network Error') ||
        !error.response) {
      console.log('🔄 Demo mode: Job posting simulated');
      return { ...jobData, id: `demo-${Date.now()}`, message: 'Job posted successfully (demo mode)' };
    }
    throw error;
  }
};

export const updateJob = async (jobId, jobData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/jobs/${jobId}`, jobData);
    console.log('📝 Job updated:', response.data);
    return response.data;
  } catch (error) {
    console.error('🚨 Error updating job:', error);
    if (process.env.NODE_ENV === 'production' || 
        error.code === 'NETWORK_ERROR' || 
        error.code === 'ERR_NETWORK' ||
        error.message.includes('Network Error') ||
        !error.response) {
      console.log('🔄 Demo mode: Job update simulated');
      return { ...jobData, id: jobId, message: 'Job updated successfully (demo mode)' };
    }
    throw error;
  }
};

export const deleteJob = async (jobId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/jobs/${jobId}`);
    console.log('🗑️ Job deleted:', jobId);
    return response.data;
  } catch (error) {
    console.error('🚨 Error deleting job:', error);
    if (process.env.NODE_ENV === 'production' || 
        error.code === 'NETWORK_ERROR' || 
        error.code === 'ERR_NETWORK' ||
        error.message.includes('Network Error') ||
        !error.response) {
      console.log('🔄 Demo mode: Job deletion simulated');
      return { message: 'Job deleted successfully (demo mode)', id: jobId };
    }
    throw error;
  }
};

export const applyToJob = async (jobId, applicationData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/applications`, {
      job_id: jobId,
      ...applicationData
    });
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === 'production' || 
        error.code === 'NETWORK_ERROR' || 
        error.code === 'ERR_NETWORK' ||
        error.message.includes('Network Error') ||
        !error.response) {
      console.log('🔄 Demo mode: Job application simulated');
      return { message: 'Application submitted successfully (demo mode)', job_id: jobId };
    }
    throw error;
  }
};

export const quickApply = async (applicationData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/applications/quick`, applicationData);
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === 'production' || 
        error.code === 'NETWORK_ERROR' || 
        error.code === 'ERR_NETWORK' ||
        error.message.includes('Network Error') ||
        !error.response) {
      console.log('🔄 Demo mode: Quick application simulated');
      return { message: 'Quick application submitted successfully (demo mode)' };
    }
    throw error;
  }
};

export const fetchJobById = async (jobId) => {
  const response = await axios.get(`${API_BASE_URL}/jobs/${jobId}`);
  return response.data;
};
