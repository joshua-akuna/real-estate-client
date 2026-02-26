import axios from 'axios';

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
      if (
        currentPath === '/' ||
        currentPath === '/properties' ||
        currentPath.startsWith('/properties/')
      ) {
      } else if (currentPath !== '/auth/login' && typeof window !== undefined) {
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  },
);

// AUTH API requests
export const authAPI = {
  login: (data) => apiService.post('/v1/auth/login', data),
  register: (data) => apiService.post('/v1/auth/register', data),
  profile: () => apiService.get('/v1/auth/profile'),
  logout: () => apiService.post('/v1/auth/logout'),
};

// Property API requests
export const propertyAPI = {
  createProperty: (data) =>
    apiService.post('/v1/properties', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getProperties: (params) => apiService.get('/v1/properties', { params }),
  getProperty: (id) => apiService.get(`/v1/properties/${id}`),
};

// Favorite API requests
export const favoriteAPI = {
  toggleFavorite: (propertyId) =>
    apiService.post('/v1/favorites/toggle', { property_id: propertyId }),
  getFavorites: () => apiService.get('/favorites'),
  checkFavorite: (propertyId) =>
    apiService.get(`/v1/favorites/check/${propertyId}`),
};

// Message API requests
export const messageAPI = {
  sendMessage: (data) => apiService.post('/v1/messages', data),
};
