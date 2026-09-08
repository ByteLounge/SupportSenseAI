/**
 * Enterprise Reusable Component: Button.jsx
 * Accessible, sleek modern button using design tokens.
 */

import React from 'react';

export default function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'danger' | 'ghost' | 'warning' | 'success'
  size = 'md',        // 'sm' | 'md' | 'lg'
  type = 'button',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  icon: Icon,
  ...props
}) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg border transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/20 focus-visible:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none';

  const sizeClasses = {
    sm: 'px-2.5 py-1.5 text-xs gap-1.5 min-h-[32px]',
    md: 'px-3.5 py-2 text-xs sm:text-sm gap-2 min-h-[38px]',
    lg: 'px-4 py-2.5 text-sm sm:text-base gap-2 min-h-[44px]',
  };

  const variantClasses = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white border-transparent shadow-xs active:bg-indigo-800',
    secondary: 'bg-token-card text-token-text-primary border-token-border hover:bg-token-muted hover:border-token-border/80 active:bg-token-secondary shadow-2xs',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white border-transparent shadow-xs active:bg-emerald-800',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white border-transparent shadow-xs active:bg-rose-800',
    warning: 'bg-amber-600 hover:bg-amber-700 text-white border-transparent shadow-xs active:bg-amber-800',
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
        <Icon className="w-3.5 h-3.5 shrink-0" />
      ) : null}
      <span>{children}</span>
    </button>
  );
}
