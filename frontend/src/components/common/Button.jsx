/**
 * Enterprise Reusable Component: Button.jsx
 * MoonRow styled interactive button with rounded-xl corners and smooth transitions.
 */

import React from 'react';

export default function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'danger' | 'ghost' | 'warning' | 'success' | 'dark'
  size = 'md',        // 'sm' | 'md' | 'lg'
  type = 'button',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  icon: Icon,
  ...props
}) {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-xl border transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FD451B]/30 focus-visible:ring-offset-1 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer select-none';

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-1.5 min-h-[34px]',
    md: 'px-4 py-2 text-xs sm:text-sm gap-2 min-h-[40px]',
    lg: 'px-5 py-2.5 text-sm sm:text-base gap-2 min-h-[46px]',
  };

  const variantClasses = {
    primary: 'bg-[#FD451B] hover:bg-[#E22610] active:bg-[#B11006] text-white border-transparent shadow-xs',
    secondary: 'bg-token-card text-token-text-primary border-token-border hover:bg-token-muted hover:border-token-border/80 active:bg-token-secondary shadow-2xs',
    dark: 'bg-[#040811] hover:bg-[#1A2338] text-white border-transparent shadow-xs',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white border-transparent shadow-xs',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white border-transparent shadow-xs',
    warning: 'bg-amber-600 hover:bg-amber-700 text-white border-transparent shadow-xs',
    ghost: 'bg-transparent text-token-text-primary border-transparent hover:bg-token-muted active:bg-token-secondary',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseClasses} ${sizeClasses[size] || sizeClasses.md} ${variantClasses[variant] || variantClasses.primary} ${className}`}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin -ml-0.5 mr-1.5 h-3.5 w-3.5 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      <span>{children}</span>
    </button>
  );
}
