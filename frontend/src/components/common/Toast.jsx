/**
 * Enterprise Reusable Component: Toast.jsx
 * Single notification toast popup rendered in ToastContext.
 */

import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  const { message, type = 'info' } = toast;

  const config = {
    success: {
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/80 dark:border-emerald-800/80 dark:text-emerald-200',
      icon: CheckCircle2,
    },
    error: {
      bg: 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/80 dark:border-rose-800/80 dark:text-rose-200',
      icon: AlertCircle,
    },
    warning: {
      bg: 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/80 dark:border-amber-800/80 dark:text-amber-200',
      icon: AlertTriangle,
    },
    info: {
      bg: 'bg-indigo-50 border-indigo-200 text-indigo-800 dark:bg-indigo-950/80 dark:border-indigo-800/80 dark:text-indigo-200',
      icon: Info,
    },
  };

  const style = config[type] || config.info;
  const Icon = style.icon;

  return (
    <div className={`pointer-events-auto flex items-center justify-between p-3 border rounded-xl shadow-lg text-xs backdrop-blur-xs ${style.bg}`}>
      <div className="flex items-center gap-2.5">
        <Icon className="w-4 h-4 shrink-0" />
        <span className="font-medium">{message}</span>
      </div>
      <button onClick={onClose} className="p-1 hover:opacity-75 ml-3" aria-label="Close notification">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
