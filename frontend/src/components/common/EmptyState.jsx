/**
 * Enterprise Reusable Component: EmptyState.jsx
 * Clean, subtle empty placeholder view with design tokens.
 */

import React from 'react';
import { Inbox } from 'lucide-react';
import Button from './Button';

export default function EmptyState({
  title = 'No items found',
  description = 'There are no records to display at this time.',
  icon: Icon = Inbox,
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <div className={`p-10 text-center flex flex-col items-center justify-center space-y-3 bg-token-card border border-token-border rounded-xl ${className}`}>
      <div className="p-3 bg-token-secondary border border-token-border rounded-xl text-token-text-muted">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h4 className="text-sm font-semibold text-token-text-primary">{title}</h4>
        <p className="text-xs text-token-text-secondary mt-1 max-w-sm">{description}</p>
      </div>
      {actionLabel && onAction && (
        <div className="pt-2">
          <Button variant="primary" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
