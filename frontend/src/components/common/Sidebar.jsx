/**
 * Enterprise Reusable Component: Sidebar.jsx
 * Left navigation sidebar matching Atlassian / GitHub Enterprise layout.
 * Background color: #F5F5F5
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Ticket,
  Building2,
  BookOpen,
  Users,
  BarChart3,
  Settings,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
  const { user } = useAuth();

  const navigationItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Tickets', path: '/tickets', icon: Ticket },
    { label: 'Departments', path: '/departments', icon: Building2 },
    { label: 'Knowledge Base', path: '/knowledge-base', icon: BookOpen },
    { label: 'Users', path: '/users', icon: Users },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-56 bg-[#F5F5F5] border-r border-[#E5E7EB] flex flex-col justify-between shrink-0 min-h-screen">
      <div>
        {/* Brand Header */}
        <div className="h-14 px-4 flex items-center gap-2.5 border-b border-[#E5E7EB] bg-white">
          <div className="w-7 h-7 bg-[#2563EB] text-white rounded-[4px] flex items-center justify-center font-bold text-xs tracking-tight">
            SS
          </div>
          <div>
            <div className="font-semibold text-xs text-[#111827] leading-none">SupportSense AI</div>
            <div className="text-[10px] text-[#6B7280] leading-tight">Enterprise Operations</div>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="p-2 space-y-0.5">
          <div className="px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#6B7280]">
            Workspace
          </div>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-2.5 py-1.5 rounded-[6px] text-xs font-medium transition-colors duration-150 ${
                    isActive
                      ? 'bg-[#2563EB] text-white font-semibold'
                      : 'text-[#374151] hover:bg-[#E5E7EB] hover:text-[#111827]'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer info banner */}
      <div className="p-3 m-2 bg-white border border-[#E5E7EB] rounded-[6px] text-[11px] text-[#6B7280]">
        <div className="font-semibold text-[#111827] flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
          Enterprise Tier
        </div>
        <div className="mt-0.5 text-[10px]">Connected to AI Triage Pipeline</div>
      </div>
    </aside>
  );
}
