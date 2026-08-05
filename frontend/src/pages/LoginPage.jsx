/**
 * Page: LoginPage.jsx
 * Enterprise User Sign-In Page.
 * Clean, flat login layout with quick demo login buttons.
 * Background: #F8F9FA, Borders: #E5E7EB, Inputs: 6px radius.
 */

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import { Mail, Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('agent.sarah@supportsense.ai');
  const [password, setPassword] = useState('Password123!');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
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

  const setQuickUser = (userEmail) => {
    setEmail(userEmail);
    setPassword('Password123!');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4 text-[#111827]">
      <div className="w-full max-w-md bg-white border border-[#E5E7EB] rounded-[6px] shadow-subtle p-6 space-y-5">
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="w-10 h-10 bg-[#2563EB] text-white rounded-[6px] font-bold flex items-center justify-center text-sm mx-auto">
            SS
          </div>
          <h2 className="text-lg font-semibold text-[#111827]">SupportSense AI</h2>
          <p className="text-xs text-[#6B7280]">Enterprise Support & AI Triage Workspace</p>
        </div>

        {error && <Alert type="error">{error}</Alert>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="agent@supportsense.ai"
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

        {/* Demo Persona Quick Select */}
        <div className="pt-3 border-t border-[#E5E7EB] space-y-2">
          <div className="text-[11px] text-center text-[#6B7280] font-semibold uppercase tracking-wider">
            Quick Demo Persona Sign In
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setQuickUser('agent.sarah@supportsense.ai')}
              className="p-2 bg-[#F8F9FA] hover:bg-[#F3F4F6] border border-[#E5E7EB] rounded-[6px] text-[#111827] text-left font-medium transition-colors"
            >
              👩‍💻 Sarah (Agent)
            </button>
            <button
              type="button"
              onClick={() => setQuickUser('alex.rivera@customer.com')}
              className="p-2 bg-[#F8F9FA] hover:bg-[#F3F4F6] border border-[#E5E7EB] rounded-[6px] text-[#111827] text-left font-medium transition-colors"
            >
              👤 Alex (Customer)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
