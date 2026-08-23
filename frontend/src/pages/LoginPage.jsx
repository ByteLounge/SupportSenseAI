/**
 * Page: LoginPage.jsx
 * Enterprise User Sign-In Page.
 * Multi-role quick login selectors for Customer, Agent, and Admin personas.
 */

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import { Mail, Lock, ArrowRight, User, Briefcase, Shield, Sparkles } from 'lucide-react';

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
    <div className="min-h-screen bg-token-primary flex items-center justify-center p-4 text-token-text-primary">
      <div className="w-full max-w-md bg-token-card border border-token-border rounded-[8px] shadow-subtle p-6 space-y-5">
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="w-10 h-10 bg-token-accent text-white rounded-[6px] font-bold flex items-center justify-center text-sm mx-auto shadow-xs">
            SS
          </div>
          <h2 className="text-lg font-bold text-token-text-primary">SupportSense AI</h2>
          <p className="text-xs text-token-text-secondary">Enterprise Multi-Tier AI Support & Triage Platform</p>
        </div>

        {error && <Alert type="error">{error}</Alert>}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="user@supportsense.ai"
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

        {/* Multi-Persona Quick Sign-In Selection */}
        <div className="pt-3 border-t border-token-border space-y-2.5">
          <div className="text-[11px] text-center text-token-text-muted font-semibold uppercase tracking-wider">
            Quick Persona 1-Click Launch
          </div>

          <div className="space-y-2 text-xs">
            {/* Persona 1: Customer */}
            <button
              type="button"
              onClick={() => handleQuickPersona('customer')}
              className="w-full p-2.5 bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/30 rounded-[6px] text-left flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                  AR
                </div>
                <div>
                  <div className="font-semibold text-token-text-primary">Alex Rivera (Customer)</div>
                  <div className="text-[10px] text-token-text-secondary">Acme Corp • Minimal Access (Own Tickets & FAQs)</div>
                </div>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                Customer
              </span>
            </button>

            {/* Persona 2: Support Agent */}
            <button
              type="button"
              onClick={() => handleQuickPersona('agent')}
              className="w-full p-2.5 bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/30 rounded-[6px] text-left flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                  SA
                </div>
                <div>
                  <div className="font-semibold text-token-text-primary">Sarah Agent (Support Agent)</div>
                  <div className="text-[10px] text-token-text-secondary">AI Triage Cockpit • Department Routing & Notes</div>
                </div>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">
                Agent
              </span>
            </button>

            {/* Persona 3: Admin */}
            <button
              type="button"
              onClick={() => handleQuickPersona('admin')}
              className="w-full p-2.5 bg-purple-500/5 hover:bg-purple-500/10 border border-purple-500/30 rounded-[6px] text-left flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                  AD
                </div>
                <div>
                  <div className="font-semibold text-token-text-primary">Admin User (Administrator)</div>
                  <div className="text-[10px] text-token-text-secondary">Full System Control • Master Overrides & RBAC</div>
                </div>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 font-semibold">
                Admin
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

