/**
 * Enterprise Reusable Component: Navbar.jsx
 * Responsive Top Navigation Header with Hamburger Toggle, Expandable Mobile Search, Notification Center, Theme Switcher, and Profile Menu.
 */

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import { Search, Bell, LogOut, Shield, Menu, X, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ onToggleMobileSidebar, onSearchSubmit }) {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    if (onSearchSubmit) {
      onSearchSubmit(searchQuery);
    } else {
      navigate(`/tickets?search=${encodeURIComponent(searchQuery)}`);
    }
    setMobileSearchOpen(false);
  };

  return (
    <header className="h-14 bg-token-card border-b border-token-border px-3 sm:px-4 flex items-center justify-between sticky top-0 z-30 shrink-0">
      {/* Left: Mobile Hamburger & Logo / Search */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-md">
        {/* Mobile Hamburger Menu Button */}
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 text-token-text-secondary hover:text-token-text-primary hover:bg-token-muted rounded-[6px] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Open Navigation Drawer"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile Brand Identity (visible only when search is closed on small screens) */}
        <div className="flex items-center gap-2 lg:hidden">
          <div className="w-6 h-6 bg-token-accent text-white rounded-[4px] flex items-center justify-center font-bold text-2xs">
            SS
          </div>
          <span className="font-semibold text-xs text-token-text-primary hidden sm:inline">SupportSense</span>
        </div>

        {/* Desktop / Tablet Inline Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:flex relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-token-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tickets, customers, departments..."
            className="w-full pl-9 pr-3 py-1.5 text-xs text-token-text-primary bg-token-secondary border border-token-border rounded-[6px] outline-none focus:bg-token-card focus:border-token-accent focus:ring-1 focus:ring-token-accent transition-colors min-h-[38px]"
          />
        </form>
      </div>

      {/* Right Controls: Mobile Search Trigger, Notifications, Theme Toggle, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Search Toggle Button */}
        <button
          type="button"
          onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
          className="md:hidden p-2 text-token-text-secondary hover:text-token-text-primary hover:bg-token-muted rounded-[6px] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Toggle Search Bar"
        >
          {mobileSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
        </button>

        {/* System Notifications Icon */}
        <button
          type="button"
          className="p-2 text-token-text-secondary hover:text-token-text-primary hover:bg-token-muted rounded-[6px] relative transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          title="System Notifications"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-token-accent rounded-full" />
        </button>

        {/* Production-Ready Theme Toggle (☀ Light / 🌙 Dark / 💻 System) */}
        <ThemeToggle />

        {/* User Profile Menu */}
        {user && (
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 p-1 rounded-[6px] hover:bg-token-muted transition-colors border border-transparent hover:border-token-border min-h-[44px]"
              aria-label="User Account Menu"
              aria-expanded={userDropdownOpen}
            >
              <div className="w-7 h-7 bg-token-accent text-white font-semibold rounded-full flex items-center justify-center text-xs">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="hidden xl:block text-left">
                <div className="text-xs font-semibold text-token-text-primary leading-tight">{user.name}</div>
                <div className="text-[11px] text-token-text-secondary leading-tight">{user.role || 'Agent'}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-token-text-muted hidden sm:block" />
            </button>

            {/* User Dropdown */}
            {userDropdownOpen && (
              <div
                className="absolute right-0 mt-1 w-56 bg-token-card border border-token-border rounded-[6px] shadow-sm py-1 z-50 text-xs"
                onMouseLeave={() => setUserDropdownOpen(false)}
              >
                <div className="px-3 py-2 border-b border-token-border bg-token-secondary">
                  <p className="font-semibold text-token-text-primary">{user.name}</p>
                  <p className="text-token-text-secondary truncate">{user.email}</p>
                </div>

                <div className="py-1">
                  <div className="px-3 py-1.5 text-token-text-secondary flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-token-accent" />
                    <span>Role: <strong className="text-token-text-primary">{user.role}</strong></span>
                  </div>
                </div>

                <div className="border-t border-token-border pt-1">
                  <button
                    onClick={logout}
                    className="w-full text-left px-3 py-2 text-token-error hover:bg-token-muted flex items-center gap-2 font-medium transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Expandable Search Bar Overlay */}
      {mobileSearchOpen && (
        <div className="absolute top-14 left-0 right-0 p-3 bg-token-card border-b border-token-border md:hidden z-40">
          <form onSubmit={handleSearch} className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-3 text-token-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tickets, customers..."
              autoFocus
              className="w-full pl-9 pr-3 py-2 text-xs text-token-text-primary bg-token-secondary border border-token-border rounded-[6px] outline-none focus:border-token-accent min-h-[44px]"
            />
          </form>
        </div>
      )}
    </header>
  );
}
