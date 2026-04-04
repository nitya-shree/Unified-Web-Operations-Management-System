import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Navbar from './components/layout/Navbar';

// Auth Pages
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// User Pages
import UserDashboard from './components/complaints/UserDashboard';
import ComplaintForm from './components/complaints/ComplaintForm';
import MyComplaints from './components/complaints/MyComplaints';

// Admin Pages
import AdminDashboard from './components/admin/AdminDashboard';
import AdminComplaints from './components/admin/AdminComplaints';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-50">
          <Navbar />
          <main>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* User routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute><UserDashboard /></ProtectedRoute>
              } />
              <Route path="/submit-complaint" element={
                <ProtectedRoute><ComplaintForm /></ProtectedRoute>
              } />
              <Route path="/my-complaints" element={
                <ProtectedRoute><MyComplaints /></ProtectedRoute>
              } />

              {/* Admin routes */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>
              } />
              <Route path="/admin/complaints" element={
                <ProtectedRoute adminOnly><AdminComplaints /></ProtectedRoute>
              } />

              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </main>
        </div>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="light"
        />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;