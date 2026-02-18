import axios from 'axios';
import { register } from 'next/dist/next-devtools/userspace/pages/pages-dev-overlay-setup';

const apiService = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiService.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    // console.log(error);
    return Promise.reject(error);
  },
);

// Response interceptor
apiService.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // console.log(error);
    if (error.response?.status === 401) {
      const currentPath =
        window.location.pathname !== 'undefined'
          ? window.location.pathname
          : '';

      // Redirect to login if unauthorized and not already on login page
      if (currentPath !== '/auth/login' && typeof window !== undefined) {
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  },
);

// AUTH API
export const authAPI = {
  login: (data) => apiService.post('/v1/auth/login', data),
  register: (data) => apiService.post('/v1/auth/register', data),
};

// Property API
export const propertyAPI = {
  createProperty: (data) =>
    apiService.post('/v1/properties', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getProperties: (params) => apiService.get('/v1/properties', { params }),
};
