import axios from 'axios';

// Helper function to save locally posted jobs
const saveLocallyPostedJob = (job) => {
  try {
    const existingJobs = JSON.parse(localStorage.getItem('localJobs') || '[]');
    existingJobs.push(job);
    localStorage.setItem('localJobs', JSON.stringify(existingJobs));
    console.log('💾 Job saved locally:', job.title);
  } catch (error) {
    console.error('❌ Failed to save job locally:', error);
  }
};

// Helper function to get locally posted jobs
const getLocallyPostedJobs = () => {
  try {
    return JSON.parse(localStorage.getItem('localJobs') || '[]');
  } catch (error) {
    console.error('❌ Failed to get local jobs:', error);
    return [];
  }
};

// Dynamic API URL configuration for different environments
const getApiBaseUrl = () => {
  // Production environment - check if backend is deployed
  if (process.env.NODE_ENV === 'production') {
    // If REACT_APP_API_URL is set, use it (for deployed backend)
    if (process.env.REACT_APP_API_URL) {
      return process.env.REACT_APP_API_URL;
    }
    // Otherwise, use demo mode (no backend deployed)
    console.log('🎭 Production mode: No backend URL configured, using demo mode');
    return null; // This will trigger demo mode in all API calls
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
    // If no API_BASE_URL (production demo mode), return demo data immediately
    if (!API_BASE_URL) {
      console.log('🎭 Demo mode: No backend configured, returning demo jobs');
      const demoJobs = getDemoJobs(filters);
      const localJobs = getLocallyPostedJobs();
      const allJobs = [...localJobs, ...demoJobs];
      return applyFilters(allJobs, filters);
    }

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
    
    // If backend is unavailable in production, return demo data with any posted jobs
    if (process.env.NODE_ENV === 'production' || 
        error.code === 'NETWORK_ERROR' || 
        error.code === 'ERR_NETWORK' ||
        error.message.includes('Network Error') ||
        error.message.includes('ERR_NETWORK') ||
        !error.response) {
      console.log('🔄 Backend unavailable, returning demo data with local jobs...');
      
      // Get demo jobs
      const demoJobs = getDemoJobs(filters);
      
      // Get any locally posted jobs
      const localJobs = getLocallyPostedJobs();
      
      // Combine and return
      const allJobs = [...localJobs, ...demoJobs];
      return applyFilters(allJobs, filters);
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



// Helper function to apply filters to jobs array
const applyFilters = (jobs, filters) => {
  return jobs.filter(job => {
    if (filters.title && !job.title.toLowerCase().includes(filters.title.toLowerCase())) return false;
    if (filters.type && job.type !== filters.type) return false;
    if (filters.location && !job.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
    return true;
  });
};

export const postJob = async (jobData) => {
  try {
    // If no API_BASE_URL (production demo mode), simulate job posting immediately
    if (!API_BASE_URL) {
      console.log('🎭 Demo mode: No backend configured, simulating job post');
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newJob = { 
        ...jobData, 
        id: `demo-production-${Date.now()}`,
        created_at: new Date().toISOString(),
        status: 'active'
      };
      
      // Save locally for persistence
      saveLocallyPostedJob(newJob);
      
      return { 
        success: true,
        message: 'Job posted successfully (demo mode)',
        job: newJob,
        demo: true 
      };
    }

    console.log('🌐 Posting job to API:', `${API_BASE_URL}/jobs/post`);
    console.log('📋 Job data:', jobData);
    
    const response = await axios.post(`${API_BASE_URL}/jobs/post`, jobData);
    console.log('✅ API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Job posting API error:', error);
    
    if (process.env.NODE_ENV === 'production' || 
        error.code === 'NETWORK_ERROR' || 
        error.code === 'ERR_NETWORK' ||
        error.message.includes('Network Error') ||
        error.message.includes('ERR_NETWORK') ||
        !error.response) {
      console.log('🔄 Demo mode: Job posting simulated (frontend fallback)');
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newJob = { 
        ...jobData, 
        id: `demo-frontend-${Date.now()}`,
        created_at: new Date().toISOString(),
        status: 'active'
      };
      
      // Save locally for persistence in demo mode
      saveLocallyPostedJob(newJob);
      
      return { 
        success: true,
        message: 'Job posted successfully (demo mode)',
        job: newJob,
        demo: true 
      };
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
  try {
    // If no API_BASE_URL (production demo mode), search in demo/local jobs
    if (!API_BASE_URL) {
      console.log('🎭 Demo mode: Searching for job ID:', jobId);
      
      const localJobs = getLocallyPostedJobs();
      const demoJobs = getDemoJobs();
      const allJobs = [...localJobs, ...demoJobs];
      
      const job = allJobs.find(j => j.id === jobId);
      if (job) {
        return { success: true, job };
      } else {
        throw new Error(`Job with ID ${jobId} not found`);
      }
    }

    const response = await axios.get(`${API_BASE_URL}/jobs/${jobId}`);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching job by ID:', error);
    throw error;
  }
};
