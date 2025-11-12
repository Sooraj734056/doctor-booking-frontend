import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { io } from 'socket.io-client';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy load components for better performance
const Login = lazy(() => import('./components/Login'));
const Register = lazy(() => import('./components/Register'));
const Home = lazy(() => import('./components/Home'));
const DoctorList = lazy(() => import('./components/DoctorList'));
const DoctorDetails = lazy(() => import('./components/DoctorDetails'));
const BookAppointment = lazy(() => import('./components/BookAppointment'));
const MyAppointments = lazy(() => import('./components/MyAppointments'));
const Conversations = lazy(() => import('./components/Conversations'));
const Messages = lazy(() => import('./components/Messages'));
const Profile = lazy(() => import('./components/Profile'));

// ✅ Socket connection — fixed to Render live backend
const socket = io('https://doctor-booking-backend-z54j.onrender.com', {
  transports: ['websocket'],
});

function App() {
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        socket.emit('join', payload.id);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }

    // ✅ Listen for incoming messages
    socket.on('receive_message', (data) => {
      console.log('New message received:', data);
      alert(`New message from ${data.from}: ${data.message}`);
    });

    return () => {
      socket.off('receive_message');
    };
  }, []);

  return (
    <Router>
      <Header />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/doctors"
            element={
              <ProtectedRoute>
                <DoctorList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/:id"
            element={
              <ProtectedRoute>
                <DoctorDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/book/:doctorId"
            element={
              <ProtectedRoute>
                <BookAppointment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-appointments"
            element={
              <ProtectedRoute>
                <MyAppointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <Conversations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages/:userId"
            element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
