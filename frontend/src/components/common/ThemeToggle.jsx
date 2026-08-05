/**
 * Component: ThemeToggle.jsx
 * Production-ready theme toggle dropdown supporting Light (☀), Dark (🌙), and System (💻) preference modes.
 */

import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Monitor, ChevronDown } from 'lucide-react';

export default function ThemeToggle() {
  const { themeMode, setThemeMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const options = [
    { mode: 'light', label: 'Light', icon: Sun },
    { mode: 'dark', label: 'Dark', icon: Moon },
    { mode: 'system', label: 'System', icon: Monitor },
  ];

  const currentOption = options.find((opt) => opt.mode === themeMode) || options[2];
  const CurrentIcon = currentOption.icon;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-token-text-secondary hover:text-token-text-primary hover:bg-token-muted rounded-[6px] border border-token-border transition-colors min-h-[38px]"
        title="Switch theme mode"
        aria-label="Theme mode selector"
        aria-expanded={isOpen}
      >
        <CurrentIcon className="w-4 h-4 text-token-accent shrink-0" />
        <span className="hidden sm:inline capitalize">{currentOption.label}</span>
        <ChevronDown className="w-3 h-3 text-token-text-muted shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-36 bg-token-card border border-token-border rounded-[6px] shadow-sm py-1 z-50 text-xs">
          {options.map((opt) => {
            const Icon = opt.icon;
            const isSelected = themeMode === opt.mode;
            return (
              <button
                key={opt.mode}
                type="button"
                onClick={() => {
                  setThemeMode(opt.mode);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-left font-medium transition-colors ${
                  isSelected
                    ? 'bg-token-accent text-white font-semibold'
                    : 'text-token-text-primary hover:bg-token-secondary'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
