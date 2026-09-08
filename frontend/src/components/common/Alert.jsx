/**
 * Enterprise Reusable Component: Alert.jsx
 * Clean, modern inline alert banner with dark-mode support and rounded-xl styling.
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
      bg: 'bg-indigo-50 border-indigo-200 text-indigo-800 dark:bg-indigo-950/40 dark:border-indigo-800/60 dark:text-indigo-200',
      icon: Info,
    },
    success: {
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800/60 dark:text-emerald-200',
      icon: CheckCircle2,
    },
    warning: {
      bg: 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/40 dark:border-amber-800/60 dark:text-amber-200',
      icon: AlertTriangle,
    },
    error: {
      bg: 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/40 dark:border-rose-800/60 dark:text-rose-200',
      icon: AlertCircle,
    },
  };

  const current = styles[type] || styles.info;
  const Icon = current.icon;

  return (
    <div className={`p-3.5 border rounded-xl text-xs flex items-start gap-3 ${current.bg} ${className}`} role="alert">
      <Icon className="w-4 h-4 shrink-0 mt-0.5" />
      <div className="flex-1">
        {title && <div className="font-semibold mb-0.5 text-sm">{title}</div>}
        <div className="leading-relaxed">{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-current opacity-60 hover:opacity-100 p-0.5 rounded-md focus:outline-none"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
