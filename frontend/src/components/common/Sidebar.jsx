/**
 * Enterprise Reusable Component: Sidebar.jsx
 * Responsive Left Navigation Sidebar with local storage collapse memory and mobile drawer support.
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
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({
  isCollapsed = false,
  onToggleCollapse,
  isMobileOpen = false,
  onCloseMobile,
}) {
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

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full bg-token-sidebar border-r border-token-border text-token-text-primary">
      <div>
        {/* Brand Header */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-token-border bg-token-card">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-7 h-7 bg-token-accent text-white rounded-[4px] flex items-center justify-center font-bold text-xs shrink-0">
              SS
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <div className="font-semibold text-xs text-token-text-primary leading-none">SupportSense AI</div>
                <div className="text-[10px] text-token-text-secondary leading-tight mt-0.5">Enterprise Operations</div>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex items-center justify-center w-6 h-6 text-token-text-secondary hover:text-token-text-primary hover:bg-token-muted rounded-[4px] transition-colors"
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          )}

          {/* Mobile Close Button */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1 text-token-text-secondary hover:text-token-text-primary hover:bg-token-muted rounded-[4px]"
              aria-label="Close Navigation Drawer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation List */}
        <nav className="p-2 space-y-0.5" aria-label="Main Navigation">
          {!isCollapsed && (
            <div className="px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-token-text-muted">
              Workspace
            </div>
          )}
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                onClick={() => onCloseMobile && onCloseMobile()}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-2.5 py-2 rounded-[6px] text-xs font-medium transition-colors duration-150 min-h-[40px] ${
                    isActive
                      ? 'bg-token-accent text-white font-semibold'
                      : 'text-token-text-primary hover:bg-token-muted'
                  } ${isCollapsed ? 'justify-center px-0' : ''}`
                }
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Status Banner */}
      {!isCollapsed && (
        <div className="p-3 m-2 bg-token-card border border-token-border rounded-[6px] text-[11px] text-token-text-secondary">
          <div className="font-semibold text-token-text-primary flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-token-success" />
            Enterprise Tier
          </div>
          <div className="mt-0.5 text-[10px] text-token-text-muted">AI Triage Active</div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block shrink-0 transition-all duration-200 ${
          isCollapsed ? 'w-16' : 'w-56'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Slide-Out Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          {/* Drawer Slide Panel */}
          <div className="relative w-64 max-w-[80vw] h-full bg-token-sidebar shadow-lg z-10 animate-slide-in">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
