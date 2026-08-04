/**
 * React Context: AuthContext.jsx
 * Lead Engineer: Member 1 (Frontend Lead)
 * Description: Context provider holding authenticated user state and login/logout methods.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginApi, registerApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('supportsense_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('supportsense_token') || null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await loginApi(email, password);
      const { user: userPayload, token: jwtToken } = res.data;
      setUser(userPayload);
      setToken(jwtToken);
      localStorage.setItem('supportsense_user', JSON.stringify(userPayload));
      localStorage.setItem('supportsense_token', jwtToken);
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      return { success: false, message: err.message || 'Login failed' };
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await registerApi(userData);
      const { user: userPayload, token: jwtToken } = res.data;
      setUser(userPayload);
      setToken(jwtToken);
      localStorage.setItem('supportsense_user', JSON.stringify(userPayload));
      localStorage.setItem('supportsense_token', jwtToken);
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      return { success: false, message: err.message || 'Registration failed' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('supportsense_user');
    localStorage.removeItem('supportsense_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
