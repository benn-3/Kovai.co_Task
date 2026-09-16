/**
 * Axios API service layer.
 * All backend communication goes through this module.
 * The request interceptor attaches JWT; the response interceptor handles 401.
 */
import axios from 'axios';

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/+$/, '');

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor: attach JWT ──────────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor: handle 401 globally ────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired / invalid — clear session, redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ── Auth API calls ────────────────────────────────────────────────────────────

export const googleSignIn = (credential) =>
  api.post('/api/auth/google', { credential });

export const registerUser = (data) =>
  api.post('/api/auth/register', data);

export const loginUser = (data) =>
  api.post('/api/auth/login', data);

// ── Task API calls ────────────────────────────────────────────────────────────

export const getTasks = (statusFilter) => {
  const params = statusFilter ? { status: statusFilter } : {};
  return api.get('/api/tasks', { params });
};

export const createTask = (data) =>
  api.post('/api/tasks', data);

export const updateTask = (taskId, data) =>
  api.patch(`/api/tasks/${taskId}`, data);

export const updateTaskStatus = (taskId, status) =>
  api.patch(`/api/tasks/${taskId}/status`, { status });

export const deleteTask = (taskId) =>
  api.delete(`/api/tasks/${taskId}`);

export default api;
