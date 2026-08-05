/**
 * Enterprise Reusable Component: ErrorState.jsx
 * Clean error container with retry action.
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
    <div className={`p-8 text-center bg-[#FEF2F2] border border-[#FCA5A5] rounded-[6px] text-[#991B1B] space-y-3 ${className}`}>
      <AlertCircle className="w-8 h-8 mx-auto text-[#DC2626]" />
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
