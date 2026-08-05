/**
 * Component: PriorityBadge.jsx
 * Lead Engineer: Member 1 (Frontend Lead)
 * Description: Renders visual priority badge (URGENT, HIGH, MEDIUM, LOW) with custom styling.
 */

import React from 'react';
import { Flame, AlertTriangle, ArrowUp, ArrowRight, ArrowDown } from 'lucide-react';

export default function PriorityBadge({ priority }) {
  const p = (priority || 'MEDIUM').toUpperCase();

  const config = {
    URGENT: {
      bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
      icon: <Flame className="w-3 h-3 text-rose-500" />,
      label: 'URGENT'
    },
    HIGH: {
      bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
      icon: <ArrowUp className="w-3 h-3 text-amber-500" />,
      label: 'HIGH'
    },
    MEDIUM: {
      bg: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30',
      icon: <ArrowRight className="w-3 h-3 text-sky-500" />,
      label: 'MEDIUM'
    },
    LOW: {
      bg: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30',
      icon: <ArrowDown className="w-3 h-3 text-slate-500" />,
      label: 'LOW'
    }
  };

  const current = config[p] || config.MEDIUM;

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${current.bg}`}>
      {current.icon}
      <span>{current.label}</span>
    </span>
  );
}
