/**
 * Enterprise Reusable Component: Button.jsx
 * Strict clean design with 6px border-radius, explicit variants, and no gradient effects.
 */

import React from 'react';

export default function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'danger' | 'ghost'
  size = 'md',        // 'sm' | 'md' | 'lg'
  type = 'button',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  icon: Icon,
  ...props
}) {
  // Base classes for 6px rounded, standard typography, focus ring
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-[6px] border text-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer';

  // Size variations
  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs gap-1.5 h-7',
    md: 'px-3.5 py-1.5 text-sm gap-2 h-9',
    lg: 'px-4 py-2 text-sm gap-2 h-10',
  };

  // Variant color definitions
  const variantClasses = {
    primary: 'bg-[#2563EB] text-white border-[#2563EB] hover:bg-[#1D4ED8] hover:border-[#1D4ED8] active:bg-[#1E40AF]',
    secondary: 'bg-white text-[#111827] border-[#D1D5DB] hover:bg-[#F3F4F6] hover:border-[#9CA3AF] active:bg-[#E5E7EB]',
    danger: 'bg-[#DC2626] text-white border-[#DC2626] hover:bg-[#B91C1C] hover:border-[#B91C1C] active:bg-[#991B1B]',
    ghost: 'bg-transparent text-[#374151] border-transparent hover:bg-[#F3F4F6] active:bg-[#E5E7EB]',
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
