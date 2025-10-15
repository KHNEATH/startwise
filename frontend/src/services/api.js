// API service for connecting frontend to backend
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export const healthCheck = async () => {
  const res = await api.get('/health');
  return res.data;
};
