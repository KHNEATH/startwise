import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';


export const fetchJobs = async (filters = {}) => {
  const params = {};
  if (filters.title) params.title = filters.title;
  if (filters.type) params.type = filters.type;
  if (filters.location) params.location = filters.location;
  const response = await axios.get(`${API_BASE_URL}/jobs/browse`, { params });
  return response.data;
};

export const postJob = async (jobData) => {
  const response = await axios.post(`${API_BASE_URL}/jobs/post`, jobData);
  return response.data;
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
