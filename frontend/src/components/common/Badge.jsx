/**
 * Enterprise Reusable Component: Badge.jsx
 * Clean, modern minimalist pill badges with soft colors.
 */

import React from 'react';
import { getStatusBadgeStyle, getPriorityBadgeStyle } from '../../utils/formatters';

export function StatusBadge({ status }) {
  const style = getStatusBadgeStyle(status);
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-medium ${style.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      <span>{style.label}</span>
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const styleClass = getPriorityBadgeStyle(priority);
  const p = (priority || 'MEDIUM').toUpperCase();

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[11px] font-medium tracking-wide ${styleClass}`}>
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
    primary: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    danger: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10.5px]',
    md: 'px-2.5 py-0.5 text-xs',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium transition-colors ${variants[variant] || variants.default} ${sizes[size] || sizes.md} ${className}`}
    >
      {children}
    </span>
  );
}
