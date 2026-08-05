/**
 * Enterprise Reusable Component: Toast.jsx
 * Single notification toast popup rendered in ToastContext.
 */

import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  const { message, type = 'info' } = toast;

  const config = {
    success: { bg: 'bg-[#F0FDF4] border-[#BBF7D0] text-[#166534]', icon: CheckCircle2 },
    error: { bg: 'bg-[#FEF2F2] border-[#FCA5A5] text-[#991B1B]', icon: AlertCircle },
    warning: { bg: 'bg-[#FFFBEB] border-[#FDE68A] text-[#92400E]', icon: AlertTriangle },
    info: { bg: 'bg-[#EFF6FF] border-[#BFDBFE] text-[#1E40AF]', icon: Info },
  };

  const style = config[type] || config.info;
  const Icon = style.icon;

  return (
    <div className={`pointer-events-auto flex items-center justify-between p-3 border rounded-[6px] shadow-sm text-xs ${style.bg}`}>
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
