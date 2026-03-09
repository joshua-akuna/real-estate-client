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
    if (!error.response || error.response?.status === 401) {
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
    // console.log(error.response);
    return Promise.reject(error);
  },
);

// AUTH API requests
export const authAPI = {
  login: (data) => apiService.post('/auth/login', data),
  register: (data) => apiService.post('/auth/register', data),
  profile: () => apiService.get('/auth/profile'),
  logout: () => apiService.post('/auth/logout'),
};

// Property API requests
export const propertyAPI = {
  createProperty: (data) =>
    apiService.post('/properties', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getProperties: (params) => apiService.get('/properties', { params }),
  getProperty: (id) => apiService.get(`/properties/${id}`),
  getUserProperties: () => apiService.get('/properties/my-properties'),
  deleteProperty: (id) => apiService.delete(`/properties/${id}`),
  updateProperty: (id, data) => apiService.put(`/properties/${id}`, data),
  getPropertyForEdit: (id) => apiService.get(`/properties/${id}/edit`),
  updatePropertyImages: (id, data) =>
    apiService.put(`/properties/${id}/images`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

// Favorite API requests
export const favoriteAPI = {
  toggleFavorite: (propertyId) =>
    apiService.post('/favorites/toggle', { property_id: propertyId }),
  getFavorites: () => apiService.get('/favorites'),
  checkFavorite: (propertyId) =>
    apiService.get(`/favorites/check/${propertyId}`),
};

// Message API requests
export const messageAPI = {
  sendMessage: (data) => apiService.post('/messages', data),
  getInbox: () => apiService.get('/messages/inbox'),
  getSentMessages: () => apiService.get('/messages/sent'),
  getMessageThread: (userId) => apiService.get(`/messages/thread/${userId}`),
  markAsRead: (messageId) => apiService.patch(`/messages/${messageId}/read`),
  getUnreadCount: () => apiService.get(`/messages/unread-count`),
};
