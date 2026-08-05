/**
 * Enterprise Reusable Component: Button.jsx
 * Accessible, touch-friendly button (minimum 44px height for interactive targets) using design tokens.
 */

import React from 'react';

export default function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'danger' | 'ghost' | 'warning'
  size = 'md',        // 'sm' | 'md' | 'lg'
  type = 'button',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  icon: Icon,
  ...props
}) {
  // Base classes with 44px minimum height for touch accessibility and focus ring
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-[6px] border text-sm transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-token-accent focus-visible:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer min-h-[44px] sm:min-h-[38px] select-none';

  // Size variations
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2',
  };

  // Variant color definitions mapped to tokens
  const variantClasses = {
    primary: 'bg-token-accent text-white border-token-accent hover:bg-token-accent-hover active:bg-token-accent-hover',
    secondary: 'bg-token-card text-token-text-primary border-token-border hover:bg-token-muted active:bg-token-secondary',
    danger: 'bg-token-error text-white border-token-error hover:opacity-90 active:opacity-100',
    warning: 'bg-token-warning text-white border-token-warning hover:opacity-90 active:opacity-100',
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
        <svg className="animate-spin -ml-0.5 mr-1.5 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
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
