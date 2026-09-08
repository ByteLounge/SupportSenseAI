/**
 * Component: Sidebar.jsx
 * MoonRow styled minimalist navigation sidebar.
 * Clean typography, rounded-xl navigation pills, and signature vermilion active state.
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Ticket,
  Building2,
  User,
  PlusCircle,
  HelpCircle,
  Users,
  BarChart3,
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
  const { user, isCustomer, isAgent, isAdmin } = useAuth();

  const getNavigationItems = () => {
    if (isCustomer) {
      return [
        { label: 'My Tickets', path: '/tickets', icon: Ticket },
        { label: 'Submit Query', path: '/tickets/new', icon: PlusCircle },
        { label: 'Help & FAQs', path: '/knowledge-base', icon: HelpCircle },
        { label: 'Profile', path: '/profile', icon: User },
      ];
    }

    if (isAgent) {
      return [
        { label: 'Dashboard', path: '/', icon: LayoutDashboard },
        { label: 'Ticket Queue', path: '/tickets', icon: Ticket },
        { label: 'New Ticket', path: '/tickets/new', icon: PlusCircle },
        { label: 'Departments', path: '/departments', icon: Building2 },
        { label: 'Knowledge Base', path: '/knowledge-base', icon: HelpCircle },
        { label: 'Profile', path: '/profile', icon: User },
      ];
    }

    // Admin Navigation Items
    return [
      { label: 'Dashboard', path: '/', icon: LayoutDashboard },
      { label: 'All Tickets', path: '/tickets', icon: Ticket },
      { label: 'New Ticket', path: '/tickets/new', icon: PlusCircle },
      { label: 'Departments', path: '/departments', icon: Building2 },
      { label: 'Team & RBAC', path: '/users', icon: Users },
      { label: 'Analytics', path: '/analytics', icon: BarChart3 },
      { label: 'Profile', path: '/profile', icon: User },
    ];
  };

  const navigationItems = getNavigationItems();

  const getRoleBadge = () => {
    if (isCustomer) return { label: 'Customer', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300' };
    if (isAgent) return { label: 'Agent', color: 'bg-[#FD451B]/10 text-[#FD451B] dark:bg-[#FD451B]/20 dark:text-[#FD451B]' };
    return { label: 'Admin', color: 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300' };
  };

  const roleBadge = getRoleBadge();

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full bg-token-sidebar border-r border-token-border text-token-text-primary">
      <div>
        {/* MoonRow Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-token-border bg-token-card">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-[#FD451B] flex items-center justify-center font-extrabold text-white text-sm shadow-xs shrink-0 tracking-tight">
              MR
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <div className="font-bold text-sm text-token-text-primary leading-tight tracking-tight flex items-center gap-1.5">
                  <span>MoonRow</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FD451B]" />
                </div>
                <div className="text-[11px] text-token-text-secondary font-medium">Ticket Analytics</div>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex items-center justify-center w-7 h-7 text-token-text-secondary hover:text-token-text-primary hover:bg-token-muted rounded-lg transition-colors"
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
              className="lg:hidden p-1.5 text-token-text-secondary hover:text-token-text-primary hover:bg-token-muted rounded-lg"
              aria-label="Close Sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation List */}
        <nav className="p-3 space-y-1" aria-label="Main Navigation">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/' || item.path === '/tickets'}
                onClick={() => onCloseMobile && onCloseMobile()}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm transition-all duration-150 ${
                    isActive
                      ? 'bg-[#FD451B]/10 text-[#FD451B] font-bold dark:bg-[#FD451B]/20 dark:text-[#FD451B]'
                      : 'font-medium text-token-text-secondary hover:text-token-text-primary hover:bg-token-muted'
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

      {/* MoonRow User Footer Card */}
      {user && (
        <div className="p-3 border-t border-token-border">
          {isCollapsed ? (
            <div className="flex justify-center">
              <div className="w-8 h-8 rounded-full bg-[#FD451B]/10 text-[#FD451B] flex items-center justify-center font-bold text-xs border border-[#FD451B]/20">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-token-muted border border-token-border">
              <div className="w-8 h-8 rounded-full bg-[#FD451B] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-token-text-primary truncate">{user.name}</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`text-[10px] px-2 py-0.2 rounded-full font-semibold uppercase tracking-wider ${roleBadge.color}`}>
                    {roleBadge.label}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block shrink-0 transition-all duration-200 ${
          isCollapsed ? 'w-16' : 'w-60'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Slide-Out Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative w-64 max-w-[80vw] h-full bg-token-sidebar shadow-xl z-10 animate-slide-in">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
