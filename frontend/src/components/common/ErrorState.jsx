/**
 * Enterprise Reusable Component: ErrorState.jsx
 * Clean error container with retry action and dark mode support.
 */

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';

export default function ErrorState({
  title = 'Failed to load data',
  message = 'An unexpected error occurred while communicating with the server.',
  onRetry,
  className = '',
}) {
  return (
    <div className={`p-8 text-center bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-xl text-rose-800 dark:text-rose-200 space-y-3 ${className}`}>
      <AlertCircle className="w-8 h-8 mx-auto text-rose-600 dark:text-rose-400" />
      <div>
        <h4 className="text-sm font-semibold">{title}</h4>
        <p className="text-xs opacity-90 mt-1 max-w-md mx-auto">{message}</p>
      </div>
      {onRetry && (
        <div className="pt-2">
          <Button variant="danger" size="sm" icon={RefreshCw} onClick={onRetry}>
            Retry Request
          </Button>
        </div>
      )}
    </div>
  );
}
