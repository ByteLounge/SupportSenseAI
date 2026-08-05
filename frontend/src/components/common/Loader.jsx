/**
 * Enterprise Reusable Component: Loader.jsx
 * Minimal spinner loading indicator.
 */

import React from 'react';

export default function Loader({ size = 'md', label = 'Loading...' }) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-2 text-[#6B7280]">
      <div
        className={`${sizes[size] || sizes.md} border-[#E5E7EB] border-t-[#2563EB] rounded-full animate-spin`}
      />
      {label && <span className="text-xs font-medium text-[#6B7280]">{label}</span>}
    </div>
  );
}
