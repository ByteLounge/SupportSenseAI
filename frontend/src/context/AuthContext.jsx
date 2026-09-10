/**
 * React Context: AuthContext.jsx
 * Multi-Role Auth Provider supporting Customer, Agent, and Admin personas.
 */

import React, { createContext, useContext, useState } from 'react';
import { loginApi, registerApi } from '../services/api';

export const DEMO_PERSONAS = {
  customer: {
    id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    name: 'Alex Rivera',
    email: 'alex.rivera@customer.com',
    role: 'CUSTOMER',
    department: 'Customer (Acme Corp)',
    organization: 'Acme Corp',
    title: 'Enterprise Client',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  },
  customer_samantha: {
    id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
    name: 'Samantha Reed',
    email: 'samantha.reed@globex.com',
    role: 'CUSTOMER',
    department: 'Customer (Globex Systems)',
    organization: 'Globex Systems',
    title: 'FinTech Lead',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Samantha',
  },
  customer_david: {
    id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55',
    name: 'David Kim',
    email: 'david.kim@nexus.io',
    role: 'CUSTOMER',
    department: 'Customer (Nexus Technologies)',
    organization: 'Nexus Technologies',
    title: 'Cloud Architect',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
  },
  agent: {
    id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    name: 'Sarah Agent',
    email: 'agent.sarah@supportsense.ai',
    role: 'AGENT',
    department: 'Tier 1 Support & AI Triage',
    organization: 'SupportSense AI',
    title: 'Lead Triage Specialist',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  },
  finance_agent: {
    id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66',
    name: 'Elena Rostova',
    email: 'elena.r@supportsense.ai',
    role: 'AGENT',
    department: 'Finance & Billing',
    organization: 'SupportSense AI',
    title: 'Billing Department Specialist',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
  },
  tech_agent: {
    id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a77',
    name: 'Marcus Vance',
    email: 'marcus.vance@supportsense.ai',
    role: 'AGENT',
    department: 'Technical Support',
    organization: 'SupportSense AI',
    title: 'Database Infrastructure DBA',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
  },
  identity_agent: {
    id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a88',
    name: 'Liam Scott',
    email: 'liam.scott@supportsense.ai',
    role: 'AGENT',
    department: 'Identity & Access',
    organization: 'SupportSense AI',
    title: 'IAM Security Specialist',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Liam',
  },
  api_agent: {
    id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a99',
    name: 'Priya Sharma',
    email: 'priya.sharma@supportsense.ai',
    role: 'AGENT',
    department: 'API Platform Team',
    organization: 'SupportSense AI',
    title: 'Developer Platform Engineer',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
  },
  admin: {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    name: 'Admin User',
    email: 'admin@supportsense.ai',
    role: 'ADMIN',
    department: 'Operations & Governance',
    organization: 'SupportSense AI',
    title: 'System Administrator',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
  },
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('supportsense_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEMO_PERSONAS.agent;
      }
    }
    return DEMO_PERSONAS.agent; // default persona
  });

  const [token, setToken] = useState(() => localStorage.getItem('supportsense_token') || 'mock-jwt-token-supportsense');
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

  const switchPersona = (personaKey) => {
    const targetPersona = DEMO_PERSONAS[personaKey] || DEMO_PERSONAS.agent;
    setUser(targetPersona);
    localStorage.setItem('supportsense_user', JSON.stringify(targetPersona));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('supportsense_user');
    localStorage.removeItem('supportsense_token');
  };

  const isCustomer = user?.role === 'CUSTOMER';
  const isAgent = user?.role === 'AGENT';
  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        switchPersona,
        isCustomer,
        isAgent,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

