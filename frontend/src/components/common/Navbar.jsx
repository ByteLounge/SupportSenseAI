/**
 * Component: Navbar.jsx
 * Accessible top navigation header with Live Persona Switcher and Role Badging.
 */

import React, { useState, useRef, useEffect } from 'react';
import { useAuth, DEMO_PERSONAS } from '../../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import { Search, Menu, X, ChevronDown, User, Shield, Briefcase, Sparkles, Building2 } from 'lucide-react';
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

  const getRoleBadgeInfo = () => {
    if (isCustomer) {
      return {
        label: 'Customer Portal',
        color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
        dot: 'bg-emerald-500',
        icon: User,
        desc: 'Limited Access • My Queries & FAQs',
      };
    }
    if (isAgent) {
      return {
        label: 'Agent Workspace',
        color: 'bg-blue-500/10 text-blue-600 border-blue-500/30',
        dot: 'bg-blue-500',
        icon: Briefcase,
        desc: 'Elevated Access • All Tickets, AI Triage & Routing',
      };
    }
    return {
      label: 'Admin Control Center',
      color: 'bg-purple-500/10 text-purple-600 border-purple-500/30',
      dot: 'bg-purple-500',
      icon: Shield,
      desc: 'Full Access • All Tickets, User Management & Overrides',
    };
  };

  const roleInfo = getRoleBadgeInfo();

  return (
    <header className="h-14 bg-token-card border-b border-token-border px-3 sm:px-4 flex items-center justify-between sticky top-0 z-30 shrink-0">
      {/* Left: Mobile Hamburger & Search */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-lg">
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
            placeholder={
              isCustomer
                ? 'Search my tickets & FAQs...'
                : isAdmin
                ? 'Search all tickets, customers, agents, or departments...'
                : 'Search ticket queue, AI category, or ID...'
            }
            className="w-full pl-9 pr-3 py-1.5 text-xs text-token-text-primary bg-token-secondary border border-token-border rounded-[6px] outline-none focus:bg-token-card focus:border-token-accent focus:ring-1 focus:ring-token-accent transition-colors min-h-[38px]"
          />
        </form>
      </div>

      {/* Right Controls: Role Badge, Persona Switcher Dropdown, Theme Toggle & Profile Button */}
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

        {/* Persona Switcher Dropdown */}
        <div className="relative" ref={personaRef}>
          <button
            type="button"
            onClick={() => setPersonaMenuOpen(!personaMenuOpen)}
            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-[6px] border text-xs font-medium transition-all hover:shadow-xs min-h-[38px] ${roleInfo.color}`}
            title="Switch User Persona & UI View"
          >
            <span className={`w-2 h-2 rounded-full ${roleInfo.dot} animate-pulse`} />
            <span className="hidden sm:inline font-semibold">{roleInfo.label}</span>
            <span className="text-[11px] opacity-80 hidden md:inline">({user?.name?.split(' ')[0] || 'User'})</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-70" />
          </button>

          {personaMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-token-card border border-token-border rounded-[8px] shadow-lg py-2 z-50 animate-fadeIn text-xs">
              <div className="px-3 py-1.5 border-b border-token-border mb-1">
                <div className="font-semibold text-token-text-primary text-[11px] uppercase tracking-wider">
                  Select User Category & UI
                </div>
                <div className="text-[11px] text-token-text-secondary">
                  Switch persona to test distinct UI accessibility levels
                </div>
              </div>

              {/* Persona 1: Customer */}
              <button
                type="button"
                onClick={() => {
                  switchPersona('customer');
                  setPersonaMenuOpen(false);
                  navigate('/tickets');
                }}
                className={`w-full text-left px-3 py-2 flex items-start gap-2.5 hover:bg-token-muted transition-colors ${
                  isCustomer ? 'bg-emerald-500/10 font-semibold' : ''
                }`}
              >
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  AR
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-token-text-primary font-medium">Alex Rivera</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-semibold">
                      Customer
                    </span>
                  </div>
                  <div className="text-[11px] text-token-text-secondary truncate">Acme Corp • Minimal Access</div>
                </div>
              </button>

              {/* Persona 2: Support Agent (AI Triage) */}
              <button
                type="button"
                onClick={() => {
                  switchPersona('agent');
                  setPersonaMenuOpen(false);
                  navigate('/');
                }}
                className={`w-full text-left px-3 py-2 flex items-start gap-2.5 hover:bg-token-muted transition-colors ${
                  isAgent && user?.department?.includes('Triage') ? 'bg-blue-500/10 font-semibold' : ''
                }`}
              >
                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  SA
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-token-text-primary font-medium">Sarah Agent</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 font-semibold">
                      Agent
                    </span>
                  </div>
                  <div className="text-[11px] text-token-text-secondary truncate">Triage & Forwarding Cockpit</div>
                </div>
              </button>

              {/* Persona 3: Finance Dept Agent */}
              <button
                type="button"
                onClick={() => {
                  switchPersona('finance_agent');
                  setPersonaMenuOpen(false);
                  navigate('/departments');
                }}
                className={`w-full text-left px-3 py-2 flex items-start gap-2.5 hover:bg-token-muted transition-colors ${
                  isAgent && user?.department?.includes('Finance') ? 'bg-blue-500/10 font-semibold' : ''
                }`}
              >
                <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  ER
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-token-text-primary font-medium">Elena Rostova</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-semibold">
                      Finance Dept
                    </span>
                  </div>
                  <div className="text-[11px] text-token-text-secondary truncate">Finance & Billing Specialist</div>
                </div>
              </button>

              {/* Persona 4: Admin */}
              <button
                type="button"
                onClick={() => {
                  switchPersona('admin');
                  setPersonaMenuOpen(false);
                  navigate('/');
                }}
                className={`w-full text-left px-3 py-2 flex items-start gap-2.5 hover:bg-token-muted transition-colors ${
                  isAdmin ? 'bg-purple-500/10 font-semibold' : ''
                }`}
              >
                <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  AD
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-token-text-primary font-medium">Admin User</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 font-semibold">
                      Admin
                    </span>
                  </div>
                  <div className="text-[11px] text-token-text-secondary truncate">Full Access • Overrides & RBAC</div>
                </div>
              </button>
            </div>
          )}
        </div>

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
            <span className="hidden lg:inline text-xs font-semibold">{user.name}</span>
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
              placeholder={isCustomer ? 'Search my queries & FAQs...' : 'Search tickets...'}
              autoFocus
              className="w-full pl-9 pr-3 py-2 text-xs text-token-text-primary bg-token-secondary border border-token-border rounded-[6px] outline-none focus:border-token-accent min-h-[44px]"
            />
          </form>
        </div>
      )}
    </header>
  );
}

