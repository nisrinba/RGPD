import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour les erreurs
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const getDashboardData = async () => {
  return api.get('/dashboard/stats/');
};

export const uploadFile = async (file: File, operator: string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('operator', operator);
  
  return api.post('/upload/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};