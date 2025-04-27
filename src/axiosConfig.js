// src/axiosConfig.js
import axios from 'axios';

// Set this globally
axios.defaults.withCredentials = true;

const api = axios.create({
  baseURL: 'http://localhost:8080', // Your backend base URL
});

// Interceptor to attach token to each request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
