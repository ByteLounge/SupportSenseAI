/**
 * Enterprise Reusable Component: Skeleton.jsx
 * Clean block skeleton loaders for loading states using design tokens.
 */

import React from 'react';

export default function Skeleton({ type = 'card', rows = 4 }) {
  if (type === 'table') {
    return (
      <div className="ent-table-container animate-pulse bg-token-card">
        <div className="h-10 bg-token-secondary border-b border-token-border" />
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-3.5 border-b border-token-border">
            <div className="h-4 w-16 bg-token-muted rounded-md" />
            <div className="h-4 w-1/3 bg-token-muted rounded-md" />
            <div className="h-4 w-24 bg-token-muted rounded-md" />
            <div className="h-4 w-20 bg-token-muted rounded-md" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'stats') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-token-card p-4 border border-token-border rounded-xl space-y-2">
            <div className="h-3 w-20 bg-token-muted rounded-md" />
            <div className="h-7 w-12 bg-token-muted rounded-md" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-token-card p-5 border border-token-border rounded-xl animate-pulse space-y-4">
      <div className="h-5 w-1/3 bg-token-muted rounded-md" />
      <div className="h-4 w-2/3 bg-token-muted rounded-md" />
      <div className="h-24 bg-token-muted rounded-md" />
    </div>
  );
}
