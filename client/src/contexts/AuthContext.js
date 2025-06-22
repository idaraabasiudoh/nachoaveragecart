import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth as authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

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

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const register = async (data) => {
    try {
      const response = await authAPI.register(data);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      toast.success('Registration successful!');
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.error || 'Registration failed');
      return { success: false, error: error.response?.data?.error };
    }
  };

  const login = async (data) => {
    try {
      const response = await authAPI.login(data);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed');
      return { success: false, error: error.response?.data?.error };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
