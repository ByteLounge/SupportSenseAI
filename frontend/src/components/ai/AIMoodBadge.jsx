/**
 * Component: AIMoodBadge.jsx
 * Clean, subtle customer sentiment indicator without visual clutter.
 */

import React from 'react';

export default function AIMoodBadge({ mood, confidence }) {
  if (!mood) return null;

  const moodConfig = {
    HAPPY: {
      dot: 'bg-emerald-500',
      label: 'Positive',
      style: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20'
    },
    NEUTRAL: {
      dot: 'bg-slate-400',
      label: 'Neutral',
      style: 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20'
    },
    FRUSTRATED: {
      dot: 'bg-rose-500',
      label: 'Frustrated',
      style: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20'
    }
  };

  const config = moodConfig[mood.toUpperCase()] || moodConfig.NEUTRAL;
  const confidencePct = confidence ? Math.round(confidence * 100) : 85;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-medium ${config.style}`}
      title={`Customer Sentiment: ${config.label} (${confidencePct}% confidence)`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span>{config.label}</span>
    </span>
  );
}
