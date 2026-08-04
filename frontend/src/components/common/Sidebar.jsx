/**
 * Component: Sidebar.jsx
 * Lead Engineer: Member 1 (Frontend Lead)
 * Description: Left navigation bar providing links to Dashboard, Tickets, Knowledge Insights.
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Ticket, PlusCircle, Lightbulb, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
  const { user } = useAuth();

  const navItems = [
    { label: 'Dashboard Queue', path: '/', icon: LayoutDashboard },
    { label: 'New Ticket', path: '/tickets/new', icon: PlusCircle },
  ];

  if (user && (user.role === 'AGENT' || user.role === 'ADMIN')) {
    navItems.push({ label: 'Learning Insights', path: '/insights', icon: Lightbulb });
  }

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 p-4 flex flex-col justify-between shrink-0 hidden md:flex">
      <div className="space-y-1">
        <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          );
        })}
      </div>

      <div className="p-3 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl text-xs space-y-1">
        <div className="font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
          ✨ AI Agent Assist
        </div>
        <p className="text-slate-500 dark:text-slate-400 leading-tight">
          Every ticket includes automatic mood analysis & task checklists.
        </p>
      </div>
    </aside>
  );
}
