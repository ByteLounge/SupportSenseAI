/**
 * Component: PriorityBadge.jsx
 * Enterprise design priority badge (URGENT, HIGH, MEDIUM, LOW).
 */

import React from 'react';

export default function PriorityBadge({ priority }) {
  const p = (priority || 'MEDIUM').toUpperCase();

  const styles = {
    URGENT: 'bg-red-50 text-red-700 border-red-200',
    HIGH: 'bg-amber-50 text-amber-700 border-amber-200',
    MEDIUM: 'bg-blue-50 text-blue-700 border-blue-200',
    LOW: 'bg-gray-100 text-gray-700 border-gray-200'
  };

  const currentStyle = styles[p] || styles.MEDIUM;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-[4px] text-xs font-medium border ${currentStyle}`}>
      {p}
    </span>
  );
}
