import React, { createContext, useContext, useState, useEffect } from 'react';
import mockAPI from '../services/mockData';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const userData = await mockAPI.getProfile();
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, rememberMe = false) => {
    try {
      const response = await mockAPI.login(email, password);
      localStorage.setItem('token', response.token);
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }
      setUser(response.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await mockAPI.register(userData);
      localStorage.setItem('token', response.token);
      setUser(response.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('rememberMe');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = async (userData) => {
    try {
      setUser(prev => ({ ...prev, ...userData }));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
