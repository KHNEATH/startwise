import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';


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
    throw error;
  }
};

export const postJob = async (jobData) => {
  const response = await axios.post(`${API_BASE_URL}/jobs/post`, jobData);
  return response.data;
};

export const updateJob = async (jobId, jobData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/jobs/${jobId}`, jobData);
    console.log('📝 Job updated:', response.data);
    return response.data;
  } catch (error) {
    console.error('🚨 Error updating job:', error);
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
    throw error;
  }
};

export const applyToJob = async (jobId, applicationData) => {
  const response = await axios.post(`${API_BASE_URL}/applications`, {
    job_id: jobId,
    ...applicationData
  });
  return response.data;
};

export const quickApply = async (applicationData) => {
  const response = await axios.post(`${API_BASE_URL}/applications/quick`, applicationData);
  return response.data;
};

export const fetchJobById = async (jobId) => {
  const response = await axios.get(`${API_BASE_URL}/jobs/${jobId}`);
  return response.data;
};
