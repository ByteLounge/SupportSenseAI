/**
 * Component: Sidebar.jsx
 * Role-adaptive enterprise navigation sidebar with customized menus and permission badges.
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
  Lightbulb,
  ChevronLeft,
  ChevronRight,
  X,
  Shield,
  Briefcase,
  Sparkles,
  Zap,
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
        { label: 'Help Center & FAQs', path: '/knowledge-base', icon: HelpCircle },
        { label: 'My Profile', path: '/profile', icon: User },
      ];
    }

    if (isAgent) {
      return [
        { label: 'Triage Dashboard', path: '/', icon: LayoutDashboard },
        { label: 'All Tickets Queue', path: '/tickets', icon: Ticket },
        { label: 'New Ticket', path: '/tickets/new', icon: PlusCircle },
        { label: 'Department Routing', path: '/departments', icon: Building2 },
        { label: 'Knowledge Base', path: '/knowledge-base', icon: HelpCircle },
        { label: 'My Profile', path: '/profile', icon: User },
      ];
    }

    // Admin Navigation Items
    return [
      { label: 'Command Center', path: '/', icon: LayoutDashboard },
      { label: 'Ticket Master List', path: '/tickets', icon: Ticket },
      { label: 'Create Ticket', path: '/tickets/new', icon: PlusCircle },
      { label: 'Department Policies', path: '/departments', icon: Building2 },
      { label: 'User & Access (RBAC)', path: '/users', icon: Users },
      { label: 'SLA Analytics', path: '/analytics', icon: BarChart3 },
      { label: 'Learning Insights', path: '/insights', icon: Lightbulb },
      { label: 'System Profile', path: '/profile', icon: User },
    ];
  };

  const navigationItems = getNavigationItems();

  const getRoleHeaderInfo = () => {
    if (isCustomer) {
      return {
        badgeText: 'Client Portal',
        subText: 'Customer Self-Serve',
        logoBg: 'bg-emerald-600',
      };
    }
    if (isAgent) {
      return {
        badgeText: 'Agent Cockpit',
        subText: 'AI Triage & Forwarding',
        logoBg: 'bg-blue-600',
      };
    }
    return {
      badgeText: 'Admin Suite',
      subText: 'Full System Control',
      logoBg: 'bg-purple-600',
    };
  };

  const roleHeader = getRoleHeaderInfo();

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full bg-token-sidebar border-r border-token-border text-token-text-primary">
      <div>
        {/* Brand Header */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-token-border bg-token-card">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className={`w-7 h-7 ${roleHeader.logoBg} text-white rounded-[6px] flex items-center justify-center font-bold text-xs shrink-0 shadow-xs`}>
              SS
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <div className="font-semibold text-xs text-token-text-primary leading-none">SupportSense AI</div>
                <div className="text-[10px] text-token-text-secondary leading-tight mt-0.5">{roleHeader.subText}</div>
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
        <nav className="p-2 space-y-1" aria-label="Main Navigation">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/' || item.path === '/tickets'}
                onClick={() => onCloseMobile && onCloseMobile()}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-[6px] text-xs font-medium transition-colors min-h-[40px] ${
                    isActive
                      ? isCustomer
                        ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                        : isAgent
                        ? 'bg-blue-600 text-white font-semibold shadow-xs'
                        : 'bg-purple-600 text-white font-semibold shadow-xs'
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

      {/* Role-Specific Footer User Badge */}
      {user && !isCollapsed && (
        <div className="p-3 m-2 bg-token-card border border-token-border rounded-[6px] text-xs space-y-1.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-token-text-primary truncate">{user.name}</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider ${
                isCustomer
                  ? 'bg-emerald-500/10 text-emerald-600'
                  : isAgent
                  ? 'bg-blue-500/10 text-blue-600'
                  : 'bg-purple-500/10 text-purple-600'
              }`}
            >
              {user.role}
            </span>
          </div>
          <div className="text-[11px] text-token-text-secondary truncate">
            {user.department || (isCustomer ? 'Acme Corp' : 'Support Specialist')}
          </div>
          <div className="pt-1 border-t border-token-border text-[10px] text-token-text-muted flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-token-accent" />
            <span>{isCustomer ? 'Customer View' : isAgent ? 'Agent AI Assist Active' : 'Admin Master Override'}</span>
          </div>
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
          <div
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative w-64 max-w-[80vw] h-full bg-token-sidebar shadow-lg z-10 animate-slide-in">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}

