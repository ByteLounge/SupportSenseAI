/**
 * Page: LoginPage.jsx
 * Lead Engineer: Member 1 (Frontend Lead)
 * Description: User authentication sign-in page with pre-filled demo accounts.
 */

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Bot, ArrowRight, Lock, Mail } from 'lucide-react';

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
      setError(res.message);
    }
  };

  const setQuickUser = (userEmail) => {
    setEmail(userEmail);
    setPassword('Password123!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900 text-white relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md glass-panel bg-slate-900/90 border-slate-800 p-8 space-y-6 shadow-2xl relative z-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-indigo-500/30">
            <Bot className="w-7 h-7" />
          </div>
          <h2 className="font-display font-bold text-2xl">SupportSense AI</h2>
          <p className="text-sm text-slate-400">Enterprise AI-Assisted Support Platform</p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="agent@supportsense.ai"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Authenticating...' : 'Sign In to Workspace'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {/* Demo Persona Quick Select */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <div className="text-[11px] text-center text-slate-500 uppercase font-semibold">Quick Demo Login</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => setQuickUser('agent.sarah@supportsense.ai')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-left transition-colors"
            >
              👩‍💻 Sarah (Agent)
            </button>
            <button
              onClick={() => setQuickUser('alex.rivera@customer.com')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-left transition-colors"
            >
              👤 Alex (Customer)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
