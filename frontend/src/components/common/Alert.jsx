/**
 * Enterprise Reusable Component: Alert.jsx
 * Inline banner for info, success, warning, and error alerts.
 */

import React from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export default function Alert({
  type = 'info', // 'info' | 'success' | 'warning' | 'error'
  title,
  children,
  onClose,
  className = '',
}) {
  const styles = {
    info: {
      bg: 'bg-[#EFF6FF] border-[#BFDBFE] text-[#1E40AF]',
      icon: Info,
    },
    success: {
      bg: 'bg-[#F0FDF4] border-[#BBF7D0] text-[#166534]',
      icon: CheckCircle2,
    },
    warning: {
      bg: 'bg-[#FFFBEB] border-[#FDE68A] text-[#92400E]',
      icon: AlertTriangle,
    },
    error: {
      bg: 'bg-[#FEF2F2] border-[#FCA5A5] text-[#991B1B]',
      icon: AlertCircle,
    },
  };

  const current = styles[type] || styles.info;
  const Icon = current.icon;

  return (
    <div className={`p-3.5 border rounded-[6px] text-xs flex items-start gap-3 ${current.bg} ${className}`} role="alert">
      <Icon className="w-4 h-4 shrink-0 mt-0.5" />
      <div className="flex-1">
        {title && <div className="font-semibold mb-0.5 text-sm">{title}</div>}
        <div className="leading-relaxed">{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-current opacity-70 hover:opacity-100 p-0.5 rounded focus:outline-none"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
