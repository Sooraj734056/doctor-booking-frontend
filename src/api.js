import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// JWT token automatically add karne ke liye
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// Auth
export const loginUser = (credentials) => API.post('/auth/login', credentials);
export const registerUser = (userData) => API.post('/auth/register', userData);

// Doctors
export const fetchDoctors = () => API.get('/doctors');
export const fetchDoctorById = (id) => API.get(`/doctors/${id}`);

// Appointments
export const bookAppointment = (appointmentData) =>
  API.post('/appointments', appointmentData);
export const fetchMyAppointments = () =>
  API.get('/appointments/my');
export const cancelAppointment = (id) =>
  API.put(`/appointments/${id}/cancel`);

// Messages
export const sendMessage = (messageData) =>
  API.post('/messages/send', messageData);
export const fetchConversations = () =>
  API.get('/messages/conversations');
export const fetchConversation = (userId) =>
  API.get(`/messages/conversation/${userId}`);
export const markMessagesAsRead = (userId) =>
  API.put(`/messages/read/${userId}`);

export default API;
