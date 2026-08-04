/**
 * Component: Navbar.jsx
 * Lead Engineer: Member 1 (Frontend Lead)
 * Description: Top application header with brand logo, search bar, theme switcher, and user profile.
 */

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, LogOut, Bot, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between">
      {/* Brand Identity */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-display font-bold text-lg leading-none text-slate-900 dark:text-white">
            SupportSense <span className="text-indigo-600 dark:text-indigo-400">AI</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Enterprise Triage Platform</p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Role Badge */}
        {user && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50">
            <ShieldCheck className="w-3.5 h-3.5" />
            {user.role}
          </div>
        )}

        {/* Dark/Light Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* User Avatar & Logout */}
        {user && (
          <div className="flex items-center gap-3 border-l border-slate-200 dark:border-slate-800 pl-4">
            <img
              src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
              alt={user.name}
              className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700"
            />
            <div className="hidden md:block text-left">
              <div className="text-sm font-semibold text-slate-900 dark:text-white leading-none">{user.name}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{user.email}</div>
            </div>
            <button
              onClick={logout}
              className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
