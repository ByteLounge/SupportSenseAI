/**
 * Page: LoginPage.jsx
 * Clean, modern user sign-in page with 1-click persona selectors.
 */

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import { Mail, Lock, ArrowRight, User, Shield, Headphones } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('agent.sarah@supportsense.ai');
  const [password, setPassword] = useState('Password123!');
  const [error, setError] = useState('');
  const { login, loading, switchPersona } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message || 'Invalid credentials');
    }
  };

  const handleQuickPersona = (personaKey) => {
    switchPersona(personaKey);
    navigate(personaKey === 'customer' ? '/tickets' : '/');
  };

  return (
    <div className="min-h-screen bg-token-secondary flex items-center justify-center p-4 text-token-text-primary">
      <div className="w-full max-w-md bg-token-card border border-token-border rounded-xl shadow-xs p-6 sm:p-8 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-1.5">
          <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center text-sm mx-auto shadow-xs">
            SS
          </div>
          <h2 className="text-xl font-bold text-token-text-primary tracking-tight">SupportSense</h2>
          <p className="text-xs text-token-text-secondary">Sign in to your support workspace</p>
        </div>

        {error && <Alert type="error">{error}</Alert>}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@company.com"
            icon={Mail}
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            icon={Lock}
          />

          <Button
            type="submit"
            variant="primary"
            loading={loading}
            className="w-full"
            icon={ArrowRight}
          >
            Sign In
          </Button>
        </form>

        {/* 1-Click Persona Selection */}
        <div className="pt-4 border-t border-token-border space-y-3">
          <div className="text-center text-[11px] font-medium text-token-text-muted uppercase tracking-wider">
            Or quick demo sign in
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickPersona('customer')}
              className="p-2.5 rounded-lg border border-token-border bg-token-secondary/60 hover:bg-emerald-50 hover:border-emerald-300 dark:hover:bg-emerald-950/30 transition-all text-center group"
            >
              <User className="w-4 h-4 mx-auto text-emerald-600 mb-1" />
              <div className="text-xs font-semibold text-token-text-primary">Customer</div>
              <div className="text-[10px] text-token-text-muted">Alex Rivera</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickPersona('agent')}
              className="p-2.5 rounded-lg border border-token-border bg-token-secondary/60 hover:bg-indigo-50 hover:border-indigo-300 dark:hover:bg-indigo-950/30 transition-all text-center group"
            >
              <Headphones className="w-4 h-4 mx-auto text-indigo-600 mb-1" />
              <div className="text-xs font-semibold text-token-text-primary">Agent</div>
              <div className="text-[10px] text-token-text-muted">Sarah Agent</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickPersona('admin')}
              className="p-2.5 rounded-lg border border-token-border bg-token-secondary/60 hover:bg-purple-50 hover:border-purple-300 dark:hover:bg-purple-950/30 transition-all text-center group"
            >
              <Shield className="w-4 h-4 mx-auto text-purple-600 mb-1" />
              <div className="text-xs font-semibold text-token-text-primary">Admin</div>
              <div className="text-[10px] text-token-text-muted">Admin User</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
