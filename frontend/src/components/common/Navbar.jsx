/**
 * Component: Navbar.jsx
 * Clean, modern top navigation header with sleek Persona Switcher and Theme Toggle.
 */

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import { Search, Menu, X, ChevronDown, Check } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export default function Navbar({ onToggleMobileSidebar, onSearchSubmit }) {
  const { user, switchPersona, isCustomer, isAgent, isAdmin } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [personaMenuOpen, setPersonaMenuOpen] = useState(false);
  const personaRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e) {
      if (personaRef.current && !personaRef.current.contains(e.target)) {
        setPersonaMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const getRoleInfo = () => {
    if (isCustomer) {
      return {
        label: 'Customer',
        pillClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50',
        dot: 'bg-emerald-500',
      };
    }
    if (isAgent) {
      return {
        label: 'Support Agent',
        pillClass: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/50',
        dot: 'bg-indigo-500',
      };
    }
    return {
      label: 'Admin',
      pillClass: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/50',
      dot: 'bg-purple-500',
    };
  };

  const roleInfo = getRoleInfo();

  const personas = [
    {
      key: 'customer',
      name: 'Alex Rivera',
      role: 'Customer',
      route: '/tickets',
      active: isCustomer,
      avatarBg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
    },
    {
      key: 'agent',
      name: 'Sarah Agent',
      role: 'Triage Agent',
      route: '/',
      active: isAgent && (!user?.department || !user?.department.includes('Finance')),
      avatarBg: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
    },
    {
      key: 'finance_agent',
      name: 'Elena Rostova',
      role: 'Finance Specialist',
      route: '/departments',
      active: isAgent && user?.department?.includes('Finance'),
      avatarBg: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
    },
    {
      key: 'admin',
      name: 'Admin User',
      role: 'Admin',
      route: '/',
      active: isAdmin,
      avatarBg: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
    },
  ];

  return (
    <header className="h-14 bg-token-card border-b border-token-border px-3 sm:px-5 flex items-center justify-between sticky top-0 z-30 shrink-0">
      {/* Left: Mobile Menu & Search Input */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-md">
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 text-token-text-secondary hover:text-token-text-primary hover:bg-token-muted rounded-lg transition-colors"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Minimal Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:flex relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-token-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tickets, customers, or departments..."
            className="w-full pl-9 pr-8 py-1.5 text-xs text-token-text-primary bg-token-secondary border border-token-border rounded-lg outline-none focus:bg-token-card focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all min-h-[34px]"
          />
          <span className="absolute right-2.5 top-2 text-[10px] text-token-text-muted font-mono pointer-events-none hidden lg:inline">
            ⌘K
          </span>
        </form>
      </div>

      {/* Right Controls: Persona Switcher, Theme, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Search Button */}
        <button
          type="button"
          onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
          className="md:hidden p-2 text-token-text-secondary hover:text-token-text-primary hover:bg-token-muted rounded-lg transition-colors"
          aria-label="Toggle Search"
        >
          {mobileSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
        </button>

        {/* Persona Switcher Dropdown */}
        <div className="relative" ref={personaRef}>
          <button
            type="button"
            onClick={() => setPersonaMenuOpen(!personaMenuOpen)}
            className={`flex items-center gap-2 px-2.5 py-1 rounded-full border text-xs font-medium transition-all hover:shadow-2xs ${roleInfo.pillClass}`}
            title="Switch User Persona"
          >
            <span className={`w-2 h-2 rounded-full ${roleInfo.dot}`} />
            <span className="font-semibold">{roleInfo.label}</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-60" />
          </button>

          {personaMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-token-card border border-token-border rounded-xl shadow-lg py-1.5 z-50 animate-fadeIn text-xs">
              <div className="px-3 py-1.5 border-b border-token-border text-[11px] font-semibold text-token-text-secondary uppercase tracking-wider">
                Switch Role / Persona
              </div>

              <div className="p-1 space-y-0.5">
                {personas.map((p) => (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => {
                      switchPersona(p.key);
                      setPersonaMenuOpen(false);
                      navigate(p.route);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between transition-colors ${
                      p.active ? 'bg-indigo-50 dark:bg-indigo-950/40 font-semibold' : 'hover:bg-token-muted'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${p.avatarBg}`}>
                        {p.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-token-text-primary font-medium">{p.name}</div>
                        <div className="text-[11px] text-token-text-secondary">{p.role}</div>
                      </div>
                    </div>
                    {p.active && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Profile Avatar */}
        {user && (
          <Link
            to="/profile"
            className="p-1 rounded-full hover:ring-2 hover:ring-indigo-500/30 transition-all"
            title={user.name || 'User Profile'}
          >
            <div className="w-8 h-8 bg-indigo-600 text-white font-semibold rounded-full flex items-center justify-center text-xs shadow-xs">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          </Link>
        )}
      </div>

      {/* Mobile Expandable Search Bar */}
      {mobileSearchOpen && (
        <div className="absolute top-14 left-0 right-0 p-3 bg-token-card border-b border-token-border md:hidden z-40">
          <form onSubmit={handleSearch} className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-token-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tickets..."
              autoFocus
              className="w-full pl-9 pr-3 py-1.5 text-xs text-token-text-primary bg-token-secondary border border-token-border rounded-lg outline-none focus:border-indigo-500"
            />
          </form>
        </div>
      )}
    </header>
  );
}
