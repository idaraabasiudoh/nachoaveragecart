import axios from 'axios';
import config from '../config';

const API_URL = `${config.API_URL}/api`;

const api = axios.create({
  baseURL: API_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const auth = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

// Product endpoints
export const products = {
  search: (query) => api.get('/products/search', { params: { query } }),
  processImage: (formData) => api.post('/products/process-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getMealSuggestions: (items) => api.post('/products/meal-suggestions', { items }),
};

// Shopping list endpoints
export const shoppingLists = {
  create: (data) => api.post('/shopping-lists', data),
  getAll: () => api.get('/shopping-lists'),
  getOne: (id) => api.get(`/shopping-lists/${id}`),
  addItem: (listId, item) => api.post(`/shopping-lists/${listId}/items`, item),
  removeItem: (listId, itemId) => api.delete(`/shopping-lists/${listId}/items/${itemId}`),
  updateMeals: (listId, meals) => api.put(`/shopping-lists/${listId}/meals`, { meals }),
};

export default api;
