/**
 * Enterprise Reusable Component: Skeleton.jsx
 * Clean block skeleton loaders for loading states.
 */

import React from 'react';

export default function Skeleton({ type = 'card', rows = 4 }) {
  if (type === 'table') {
    return (
      <div className="ent-table-container animate-pulse">
        <div className="h-10 bg-[#F8F9FA] border-b border-[#E5E7EB]" />
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-3 border-b border-[#E5E7EB]">
            <div className="h-4 w-16 bg-[#E5E7EB] rounded-[4px]" />
            <div className="h-4 w-1/3 bg-[#E5E7EB] rounded-[4px]" />
            <div className="h-4 w-24 bg-[#E5E7EB] rounded-[4px]" />
            <div className="h-4 w-20 bg-[#E5E7EB] rounded-[4px]" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'stats') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-4 border border-[#E5E7EB] rounded-[6px] space-y-2">
            <div className="h-3 w-20 bg-[#E5E7EB] rounded-[4px]" />
            <div className="h-7 w-12 bg-[#E5E7EB] rounded-[4px]" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white p-5 border border-[#E5E7EB] rounded-[6px] animate-pulse space-y-4">
      <div className="h-5 w-1/3 bg-[#E5E7EB] rounded-[4px]" />
      <div className="h-4 w-2/3 bg-[#E5E7EB] rounded-[4px]" />
      <div className="h-24 bg-[#E5E7EB] rounded-[4px]" />
    </div>
  );
}
