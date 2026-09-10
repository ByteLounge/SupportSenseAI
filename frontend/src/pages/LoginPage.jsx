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
import logoImg from '../assets/logo.png';

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
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <img
            src={logoImg}
            alt="SupportSense Logo"
            className="w-14 h-14 rounded-2xl mx-auto object-cover shadow-xs"
          />
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-token-text-primary tracking-tight">
              SupportSense
            </h2>
            <p className="text-xs text-token-text-secondary mt-0.5">
              Enterprise AI Support & Triage Platform
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

        {/* Multi-User & Department Testing Switcher */}
        <div className="pt-4 border-t border-token-border space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-token-text-muted uppercase tracking-wider">
              Quick Persona Sign-in
            </span>
            <span className="text-[10px] text-token-text-muted">
              Select persona to test roles
            </span>
          </div>

          {/* Department Agents */}
          <div className="space-y-1">
            <div className="text-[10px] font-semibold text-token-text-secondary uppercase">Support Agents by Department</div>
            <div className="grid grid-cols-3 gap-1.5 text-left">
              <button
                type="button"
                onClick={() => {
                  setEmail('agent.sarah@supportsense.ai');
                  setPassword('Password123!');
                  handleQuickPersona('agent');
                }}
                className="p-2 rounded-xl border border-token-border bg-token-muted/40 hover:bg-[#FD451B]/10 hover:border-[#FD451B]/30 transition-all text-left"
              >
                <div className="text-[11px] font-bold text-token-text-primary leading-tight">Sarah Agent</div>
                <div className="text-[9px] text-[#FD451B] font-medium truncate">Tier 1 & Triage</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmail('elena.r@supportsense.ai');
                  setPassword('Password123!');
                  handleQuickPersona('finance_agent');
                }}
                className="p-2 rounded-xl border border-token-border bg-token-muted/40 hover:bg-emerald-50 hover:border-emerald-300 dark:hover:bg-emerald-950/20 transition-all text-left"
              >
                <div className="text-[11px] font-bold text-token-text-primary leading-tight">Elena Rostova</div>
                <div className="text-[9px] text-emerald-600 font-medium truncate">Finance & Billing</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmail('marcus.vance@supportsense.ai');
                  setPassword('Password123!');
                  handleQuickPersona('tech_agent');
                }}
                className="p-2 rounded-xl border border-token-border bg-token-muted/40 hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-950/20 transition-all text-left"
              >
                <div className="text-[11px] font-bold text-token-text-primary leading-tight">Marcus Vance</div>
                <div className="text-[9px] text-blue-600 font-medium truncate">Tech Support</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmail('liam.scott@supportsense.ai');
                  setPassword('Password123!');
                  handleQuickPersona('identity_agent');
                }}
                className="p-2 rounded-xl border border-token-border bg-token-muted/40 hover:bg-indigo-50 hover:border-indigo-300 dark:hover:bg-indigo-950/20 transition-all text-left"
              >
                <div className="text-[11px] font-bold text-token-text-primary leading-tight">Liam Scott</div>
                <div className="text-[9px] text-indigo-600 font-medium truncate">Identity & Access</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmail('priya.sharma@supportsense.ai');
                  setPassword('Password123!');
                  handleQuickPersona('api_agent');
                }}
                className="p-2 rounded-xl border border-token-border bg-token-muted/40 hover:bg-amber-50 hover:border-amber-300 dark:hover:bg-amber-950/20 transition-all text-left"
              >
                <div className="text-[11px] font-bold text-token-text-primary leading-tight">Priya Sharma</div>
                <div className="text-[9px] text-amber-600 font-medium truncate">API Platform</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmail('admin@supportsense.ai');
                  setPassword('Password123!');
                  handleQuickPersona('admin');
                }}
                className="p-2 rounded-xl border border-token-border bg-token-muted/40 hover:bg-purple-50 hover:border-purple-300 dark:hover:bg-purple-950/20 transition-all text-left"
              >
                <div className="text-[11px] font-bold text-token-text-primary leading-tight">Admin User</div>
                <div className="text-[9px] text-purple-600 font-medium truncate">Governance</div>
              </button>
            </div>
          </div>

          {/* Customers */}
          <div className="space-y-1">
            <div className="text-[10px] font-semibold text-token-text-secondary uppercase">Enterprise Customers</div>
            <div className="grid grid-cols-3 gap-1.5 text-left">
              <button
                type="button"
                onClick={() => {
                  setEmail('alex.rivera@customer.com');
                  setPassword('Password123!');
                  handleQuickPersona('customer');
                }}
                className="p-2 rounded-xl border border-token-border bg-token-muted/40 hover:bg-teal-50 hover:border-teal-300 dark:hover:bg-teal-950/20 transition-all text-left"
              >
                <div className="text-[11px] font-bold text-token-text-primary leading-tight">Alex Rivera</div>
                <div className="text-[9px] text-teal-600 font-medium truncate">Acme Corp</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmail('samantha.reed@globex.com');
                  setPassword('Password123!');
                  handleQuickPersona('customer_samantha');
                }}
                className="p-2 rounded-xl border border-token-border bg-token-muted/40 hover:bg-teal-50 hover:border-teal-300 dark:hover:bg-teal-950/20 transition-all text-left"
              >
                <div className="text-[11px] font-bold text-token-text-primary leading-tight">Samantha Reed</div>
                <div className="text-[9px] text-teal-600 font-medium truncate">Globex Systems</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmail('david.kim@nexus.io');
                  setPassword('Password123!');
                  handleQuickPersona('customer_david');
                }}
                className="p-2 rounded-xl border border-token-border bg-token-muted/40 hover:bg-teal-50 hover:border-teal-300 dark:hover:bg-teal-950/20 transition-all text-left"
              >
                <div className="text-[11px] font-bold text-token-text-primary leading-tight">David Kim</div>
                <div className="text-[9px] text-teal-600 font-medium truncate">Nexus Tech</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
