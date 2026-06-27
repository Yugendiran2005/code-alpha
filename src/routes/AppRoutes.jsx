import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Layouts
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';

// Pages
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import LiveDetection from '../pages/LiveDetection';
import UploadVideo from '../pages/UploadVideo';
import DetectionHistory from '../pages/DetectionHistory';
import Analytics from '../pages/Analytics';
import Profile from '../pages/Profile';
import Settings from '../pages/Settings';
import NotFound from '../pages/NotFound';

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-900">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-2 border-gray-600 border-t-blue-500 mx-auto" />
      <p className="text-gray-400 mt-4 text-sm">Loading...</p>
    </div>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return isAuthenticated ? <Navigate to="/dashboard" /> : children;
};

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      </Route>
      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/live-detection" element={<LiveDetection />} />
        <Route path="/upload-video" element={<UploadVideo />} />
        <Route path="/detection-history" element={<DetectionHistory />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
