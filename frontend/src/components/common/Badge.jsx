/**
 * Enterprise Reusable Component: Badge.jsx
 * Standard rectangular badge using design tokens for light and dark modes.
 */

import React from 'react';
import { getStatusBadgeStyle, getPriorityBadgeStyle } from '../../utils/formatters';

export function StatusBadge({ status }) {
  const style = getStatusBadgeStyle(status);
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] border text-xs font-medium ${style.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      <span>{style.label}</span>
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const styleClass = getPriorityBadgeStyle(priority);
  const p = (priority || 'MEDIUM').toUpperCase();

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-[4px] border text-xs ${styleClass}`}>
      {p}
    </span>
  );
}

export default function Badge({
  children,
  variant = 'default', // 'default' | 'primary' | 'success' | 'warning' | 'danger'
  size = 'md',
  className = '',
}) {
  const variants = {
    default: 'bg-token-muted text-token-text-primary border-token-border',
    primary: 'bg-blue-500/10 text-token-accent border-blue-500/30',
    success: 'bg-green-500/10 text-token-success border-green-500/30',
    warning: 'bg-amber-500/10 text-token-warning border-amber-500/30',
    danger: 'bg-red-500/10 text-token-error border-red-500/30',
  };

  const sizes = {
    sm: 'px-1.5 py-0.5 text-[11px]',
    md: 'px-2 py-0.5 text-xs',
  };

  return (
    <span
      className={`inline-flex items-center rounded-[4px] border font-medium ${variants[variant] || variants.default} ${sizes[size] || sizes.md} ${className}`}
    >
      {children}
    </span>
  );
}
