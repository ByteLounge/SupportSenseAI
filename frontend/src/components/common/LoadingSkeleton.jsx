/**
 * Component: LoadingSkeleton.jsx
 * Lead Engineer: Member 1 (Frontend Lead)
 * Description: Skeleton UI loaders rendered during ticket queue and detail fetching.
 */

import React from 'react';

export default function LoadingSkeleton({ type = 'card' }) {
  if (type === 'list') {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 glass-panel animate-pulse flex justify-between items-center">
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
            </div>
            <div className="h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 glass-panel animate-pulse space-y-4">
      <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
      <div className="h-20 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
    </div>
  );
}
