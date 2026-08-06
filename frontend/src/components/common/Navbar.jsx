/**
 * Component: Navbar.jsx
 * Simple, accessible top navigation header.
 */

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import { Search, Menu, X, User } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export default function Navbar({ onToggleMobileSidebar, onSearchSubmit }) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
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
      {/* Left: Mobile Hamburger & Search */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-md">
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 text-token-text-secondary hover:text-token-text-primary hover:bg-token-muted rounded-[6px] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 lg:hidden">
          <div className="w-6 h-6 bg-token-accent text-white rounded-[4px] flex items-center justify-center font-bold text-2xs">
            SS
          </div>
          <span className="font-semibold text-xs text-token-text-primary hidden sm:inline">SupportSense</span>
        </div>

        {/* Desktop / Tablet Search Input */}
        <form onSubmit={handleSearch} className="hidden md:flex relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-token-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tickets by ID, title, or email..."
            className="w-full pl-9 pr-3 py-1.5 text-xs text-token-text-primary bg-token-secondary border border-token-border rounded-[6px] outline-none focus:bg-token-card focus:border-token-accent focus:ring-1 focus:ring-token-accent transition-colors min-h-[38px]"
          />
        </form>
      </div>

      {/* Right Controls: Theme Toggle & Profile Button */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Search Toggle */}
        <button
          type="button"
          onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
          className="md:hidden p-2 text-token-text-secondary hover:text-token-text-primary hover:bg-token-muted rounded-[6px] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Toggle Search"
        >
          {mobileSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
        </button>

        {/* Theme Selector (Light, Dark, System) */}
        <ThemeToggle />

        {/* Profile Link Button */}
        {user && (
          <Link
            to="/profile"
            className="flex items-center gap-2 p-1.5 rounded-[6px] hover:bg-token-muted text-token-text-primary transition-colors border border-transparent hover:border-token-border min-h-[44px]"
            title="User Profile"
          >
            <div className="w-7 h-7 bg-token-accent text-white font-semibold rounded-full flex items-center justify-center text-xs">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <span className="hidden sm:inline text-xs font-semibold">{user.name}</span>
          </Link>
        )}
      </div>

      {/* Mobile Expandable Search */}
      {mobileSearchOpen && (
        <div className="absolute top-14 left-0 right-0 p-3 bg-token-card border-b border-token-border md:hidden z-40">
          <form onSubmit={handleSearch} className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-3 text-token-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tickets..."
              autoFocus
              className="w-full pl-9 pr-3 py-2 text-xs text-token-text-primary bg-token-secondary border border-token-border rounded-[6px] outline-none focus:border-token-accent min-h-[44px]"
            />
          </form>
        </div>
      )}
    </header>
  );
}
