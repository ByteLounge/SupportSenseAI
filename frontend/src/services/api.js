/**
 * API Service Client: api.js
 * Lead Engineer: Member 1 (Frontend Lead)
 * Description: Axios client handling REST API calls, JWT injection, and error interceptors.
 */

import axios from 'axios';

const rawBaseURL = import.meta.env.VITE_API_BASE_URL || '/api/v1';
const baseURL = (rawBaseURL.startsWith('http://') || rawBaseURL.startsWith('https://') || rawBaseURL.startsWith('/'))
  ? rawBaseURL
  : `https://${rawBaseURL}`;

const API = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor: Attach JWT Bearer Token if present in localStorage
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('supportsense_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor: Handle 401 Unauthorized globally
API.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('supportsense_token');
      localStorage.removeItem('supportsense_user');
    }
    return Promise.reject(error.response?.data || { message: 'Network / Server Error' });
  }
);

// Auth Endpoints
export const loginApi = (email, password) => API.post('/auth/login', { email, password });
export const registerApi = (userData) => API.post('/auth/register', userData);
export const getMeApi = () => API.get('/auth/me');

// Ticket Endpoints
export const getTicketsApi = (params) => API.get('/tickets', { params });
export const getTicketByIdApi = (id) => API.get(`/tickets/${id}`);
export const createTicketApi = (data) => API.post('/tickets', data);
export const updateTicketStatusApi = (id, data) => API.patch(`/tickets/${id}/status`, data);
export const postMessageApi = (id, data) => API.post(`/tickets/${id}/messages`, data);
export const toggleChecklistApi = (id, itemId, isCompleted) => 
  API.patch(`/tickets/${id}/checklist/${itemId}`, { isCompleted });

// AI Proxy Endpoints
export const verifyResponseApi = (data) => API.post('/ai/verify-response', data);
export const getInsightsApi = () => API.get('/ai/insights');

export default API;
