/**
 * Enterprise Reusable Component: Badge.jsx
 * Clean MoonRow styled pill badges with soft tint and dot indicator.
 */

import React from 'react';
import { getStatusBadgeStyle, getPriorityBadgeStyle } from '../../utils/formatters';

export function StatusBadge({ status }) {
  const style = getStatusBadgeStyle(status);
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-semibold ${style.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      <span>{style.label}</span>
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const styleClass = getPriorityBadgeStyle(priority);
  const p = (priority || 'MEDIUM').toUpperCase();

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[11px] font-semibold tracking-wide ${styleClass}`}>
      {p}
    </span>
  );
}

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) {
  const variants = {
    default: 'bg-token-muted text-token-text-secondary border-token-border',
    primary: 'bg-[#FD451B]/10 text-[#FD451B] border-[#FD451B]/20 font-semibold',
    success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-medium',
    warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 font-medium',
    danger: 'bg-[#FD451B]/10 text-[#FD451B] border-[#FD451B]/30 font-semibold',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10.5px]',
    md: 'px-2.5 py-0.5 text-xs',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border transition-colors ${variants[variant] || variants.default} ${sizes[size] || sizes.md} ${className}`}
    >
      {children}
    </span>
  );
}
