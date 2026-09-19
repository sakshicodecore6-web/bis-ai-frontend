// src/api/client.js
import axios from 'axios';

const api = axios.create({
  // Use local backend for testing the new features
  baseURL: 'http://localhost:8000', 
  
  // Keep the Render URL commented out so you can switch back when you deploy
  // baseURL: 'https://bis-ai-backend.onrender.com', 
});

// Attach the JWT token to every request automatically, if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;