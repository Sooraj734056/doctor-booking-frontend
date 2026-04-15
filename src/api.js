import axios from "axios";

// 🔗 Base URL from environment variable (Render or Local)
const API_URL =
  process.env.REACT_APP_API_URL ||
  "https://doctor-booking-backend-z54j.onrender.com";

const API = axios.create({
  baseURL: `${API_URL}/api`,
});

// 🔒 Automatically add JWT token if available
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// ✅ Handle 401 Unauthorized globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("🔐 Session expired or unauthorized. Redirecting to login...");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Redirect to login if not already there
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login?expired=true";
      }
    }
    return Promise.reject(error);
  }
);

// 🧑‍💻 Auth Routes
export const loginUser = (credentials) => API.post("/auth/login", credentials);
export const registerUser = (userData) => API.post("/auth/register", userData);
export const verifyOtp = (payload) => API.post("/auth/verify-otp", payload);
// 👨‍⚕️ Doctor Routes
export const fetchDoctors = () => API.get("/doctors");
export const fetchDoctorById = (id) => API.get(`/doctors/${id}`);

// 📅 Appointment Routes
export const bookAppointment = (appointmentData) =>
  API.post("/appointments", appointmentData);
export const fetchMyAppointments = () => API.get("/appointments/my");
export const cancelAppointment = (id) => API.put(`/appointments/${id}/cancel`);

// 💬 Messaging Routes
export const sendMessage = (messageData) =>
  API.post("/messages/send", messageData);
export const fetchConversations = () => API.get("/messages/conversations");
export const fetchConversation = (userId) =>
  API.get(`/messages/conversation/${userId}`);
export const markMessagesAsRead = (userId) =>
  API.put(`/messages/read/${userId}`);

// 🤖 AI Health Assistant
export const getAiHealthGuidance = (payload) =>
  API.post("/ai/health-assistant", payload);

// ⭐ Favorites/doctor admin helper data
export const fetchAdminStats = () => API.get("/admin/stats");

export default API;
