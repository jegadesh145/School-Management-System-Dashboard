import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

export const studentAPI = {
  getAll: (params) => api.get('/students', { params }),
  getById: (id) => api.get(`/students/${id}`),
  create: (data) => api.post('/students', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
};

export const teacherAPI = {
  getAll: (params) => api.get('/teachers', { params }),
  create: (data) => api.post('/teachers', data),
  update: (id, data) => api.put(`/teachers/${id}`, data),
  delete: (id) => api.delete(`/teachers/${id}`),
};

export const libraryAPI = {
  getAll: (params) => api.get('/library', { params }),
  create: (data) => api.post('/library', data),
  update: (id, data) => api.put(`/library/${id}`, data),
  delete: (id) => api.delete(`/library/${id}`),
};

export const noticeAPI = {
  getAll: () => api.get('/notices'),
  create: (data) => api.post('/notices', data),
  update: (id, data) => api.put(`/notices/${id}`, data),
  delete: (id) => api.delete(`/notices/${id}`),
};

export const attendanceAPI = {
  get: (params) => api.get('/attendance', { params }),
  saveBulk: (records) => api.post('/attendance/bulk', { records }),
  getSummary: (date) => api.get('/attendance/summary', { params: { date } }),
};

export default api;
