import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

// Complaint APIs (User)
export const submitComplaint = (data) => API.post('/complaints', data);
export const getUserComplaints = () => API.get('/complaints');
export const getComplaintById = (id) => API.get(`/complaints/${id}`);

// Admin APIs
export const getAllComplaints = (params) => API.get('/admin/complaints', { params });
export const updateComplaintStatus = (id, data) => API.put(`/admin/complaints/${id}`, data);
export const deleteComplaint = (id) => API.delete(`/admin/complaints/${id}`);
export const getDashboardStats = () => API.get('/admin/stats');

export default API;