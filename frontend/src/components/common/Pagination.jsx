/**
 * Enterprise Reusable Component: Pagination.jsx
 * Responsive table footer with pagination controls and touch accessibility.
 */

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  pageSize = 10,
  totalItems = 0,
  onPageChange,
  onPageSizeChange,
}) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-3 sm:px-4 py-3 bg-token-card border border-token-border text-xs text-token-text-secondary rounded-b-[6px]">
      {/* Item Range Count */}
      <div className="text-center sm:text-left">
        Showing <span className="font-semibold text-token-text-primary">{startItem}</span> to{' '}
        <span className="font-semibold text-token-text-primary">{endItem}</span> of{' '}
        <span className="font-semibold text-token-text-primary">{totalItems}</span> results
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 w-full sm:w-auto">
        {onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span>Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="bg-token-card border border-token-border rounded-[4px] px-2 py-1 text-xs text-token-text-primary outline-none focus:border-token-accent min-h-[36px]"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        )}

        <div className="flex items-center gap-1">
          <Button
            variant="secondary"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            aria-label="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden xs:inline">Previous</span>
          </Button>
          <span className="px-2 font-medium text-token-text-primary">
            {currentPage} / {totalPages || 1}
          </span>
          <Button
            variant="secondary"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            aria-label="Next Page"
          >
            <span className="hidden xs:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
