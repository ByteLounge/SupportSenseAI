/**
 * Page: LoginPage.jsx
 * MoonRow styled Sign-in page with 1-click demo persona quick-launch.
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
      <div className="w-full max-w-md bg-token-card border border-token-border rounded-2xl shadow-card p-6 sm:p-8 space-y-6">
        {/* MoonRow Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[#FD451B] text-white rounded-2xl font-extrabold flex items-center justify-center text-base mx-auto shadow-xs tracking-tight">
            MR
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-token-text-primary tracking-tight">
              MoonRow
            </h2>
            <p className="text-xs text-token-text-secondary mt-0.5">
              Ticket Sales & Support Analytics Platform
            </p>
          </div>
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
            Sign In to Workspace
          </Button>
        </form>

        {/* 1-Click Persona Selection */}
        <div className="pt-4 border-t border-token-border space-y-3">
          <div className="text-center text-[10px] font-bold text-token-text-muted uppercase tracking-wider">
            Quick Persona Demo Sign-in
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickPersona('customer')}
              className="p-3 rounded-xl border border-token-border bg-token-muted/50 hover:bg-emerald-50 hover:border-emerald-300 dark:hover:bg-emerald-950/30 transition-all text-center group"
            >
              <User className="w-4 h-4 mx-auto text-emerald-600 mb-1" />
              <div className="text-xs font-bold text-token-text-primary">Customer</div>
              <div className="text-[10px] text-token-text-muted">Alex Rivera</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickPersona('agent')}
              className="p-3 rounded-xl border border-token-border bg-token-muted/50 hover:bg-[#FD451B]/10 hover:border-[#FD451B]/30 dark:hover:bg-[#FD451B]/20 transition-all text-center group"
            >
              <Headphones className="w-4 h-4 mx-auto text-[#FD451B] mb-1" />
              <div className="text-xs font-bold text-token-text-primary">Agent</div>
              <div className="text-[10px] text-token-text-muted">Sarah Agent</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickPersona('admin')}
              className="p-3 rounded-xl border border-token-border bg-token-muted/50 hover:bg-purple-50 hover:border-purple-300 dark:hover:bg-purple-950/30 transition-all text-center group"
            >
              <Shield className="w-4 h-4 mx-auto text-purple-600 mb-1" />
              <div className="text-xs font-bold text-token-text-primary">Admin</div>
              <div className="text-[10px] text-token-text-muted">Admin User</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
