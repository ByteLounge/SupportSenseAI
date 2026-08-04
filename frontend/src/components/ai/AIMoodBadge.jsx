/**
 * Component: AIMoodBadge.jsx
 * Lead Engineer: Member 1 (Frontend Lead)
 * Description: Renders AI Mood Indicator (🙂/😐/😠) with color-coded badges and confidence scores.
 */

import React from 'react';

export default function AIMoodBadge({ mood, confidence }) {
  if (!mood) return null;

  const moodConfig = {
    HAPPY: {
      emoji: '🙂',
      label: 'Happy',
      style: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
    },
    NEUTRAL: {
      emoji: '😐',
      label: 'Neutral',
      style: 'bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800'
    },
    FRUSTRATED: {
      emoji: '😠',
      label: 'Frustrated',
      style: 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
    }
  };

  const config = moodConfig[mood.toUpperCase()] || moodConfig.NEUTRAL;
  const confidencePct = confidence ? Math.round(confidence * 100) : 85;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${config.style}`}
      aria-label={`Customer Mood: ${config.label}, Confidence ${confidencePct} percent`}
    >
      <span>{config.emoji}</span>
      <span>{config.label}</span>
      <span className="opacity-65 text-[10px]">({confidencePct}%)</span>
    </div>
  );
}
