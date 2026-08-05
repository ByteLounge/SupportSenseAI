/**
 * Enterprise Reusable Component: Navbar.jsx
 * Top header containing global search bar, notification center, and user profile drawer.
 */

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Search, Bell, LogOut, Shield, User, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ onSearchSubmit }) {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit(searchQuery);
    } else {
      navigate(`/tickets?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="h-14 bg-white border-b border-[#E5E7EB] px-4 flex items-center justify-between sticky top-0 z-30 shrink-0">
      {/* Left: Global Search Input */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <form onSubmit={handleSearch} className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#6B7280]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tickets, customers, departments (Press Enter)..."
            className="w-full pl-9 pr-3 py-1.5 text-xs text-[#111827] bg-[#F8F9FA] border border-[#E5E7EB] rounded-[6px] outline-none focus:bg-white focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors"
          />
        </form>
      </div>

      {/* Right: Notifications & User Profile */}
      <div className="flex items-center gap-3">
        {/* Notifications Icon Button */}
        <button
          type="button"
          className="p-1.5 text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] rounded-[6px] relative transition-colors"
          title="System Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#2563EB] rounded-full" />
        </button>

        {/* User Account Menu */}
        {user && (
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2.5 p-1 rounded-[6px] hover:bg-[#F3F4F6] transition-colors border border-transparent hover:border-[#E5E7EB]"
            >
              <div className="w-7 h-7 bg-[#2563EB] text-white font-semibold rounded-full flex items-center justify-center text-xs">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold text-[#111827] leading-tight">{user.name}</div>
                <div className="text-[11px] text-[#6B7280] leading-tight">{user.role || 'Agent'}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#6B7280]" />
            </button>

            {/* Dropdown Menu */}
            {userDropdownOpen && (
              <div
                className="absolute right-0 mt-1 w-56 bg-white border border-[#E5E7EB] rounded-[6px] shadow-sm py-1 z-40 text-xs"
                onMouseLeave={() => setUserDropdownOpen(false)}
              >
                <div className="px-3 py-2 border-b border-[#E5E7EB] bg-[#F8F9FA]">
                  <p className="font-semibold text-[#111827]">{user.name}</p>
                  <p className="text-[#6B7280] truncate">{user.email}</p>
                </div>

                <div className="py-1">
                  <div className="px-3 py-1.5 text-[#6B7280] flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>Role: <strong className="text-[#111827]">{user.role}</strong></span>
                  </div>
                </div>

                <div className="border-t border-[#E5E7EB] pt-1">
                  <button
                    onClick={logout}
                    className="w-full text-left px-3 py-2 text-[#DC2626] hover:bg-[#FEF2F2] flex items-center gap-2 font-medium transition-colors"
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
    </header>
  );
}
