/**
 * Enterprise Reusable Component: EmptyState.jsx
 * Clean, subtle empty placeholder view.
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
    <div className={`p-10 text-center flex flex-col items-center justify-center space-y-3 bg-white border border-[#E5E7EB] rounded-[6px] ${className}`}>
      <div className="p-3 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[6px] text-[#6B7280]">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h4 className="text-sm font-semibold text-[#111827]">{title}</h4>
        <p className="text-xs text-[#6B7280] mt-1 max-w-sm">{description}</p>
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
