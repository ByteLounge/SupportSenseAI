/**
 * Enterprise Reusable Component: Badge.jsx
 * Standard rectangular badge (4px radius) for ticket status, priority, and category labels.
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
    default: 'bg-[#F3F4F6] text-[#374151] border-[#E5E7EB]',
    primary: 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]',
    success: 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]',
    warning: 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]',
    danger: 'bg-[#FEF2F2] text-[#B91C1C] border-[#FCA5A5]',
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
