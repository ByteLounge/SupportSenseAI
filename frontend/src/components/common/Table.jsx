/**
 * Enterprise Reusable Component: Table.jsx
 * Responsive Data Table component that renders as a clean table on Desktop/Tablet and modern cards on Mobile.
 */

import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import EmptyState from './EmptyState';
import Skeleton from './Skeleton';

export default function Table({
  columns = [],
  data = [],
  loading = false,
  sortColumn,
  sortDirection = 'asc',
  onSort,
  onRowClick,
  emptyMessage = 'No records found',
  emptySubtext = 'Try adjusting your filters or search terms.',
  keyField = 'id',
}) {
  const handleHeaderClick = (col) => {
    if (col.sortable && onSort) {
      onSort(col.key);
    }
  };

  if (loading) {
    return <Skeleton type="table" rows={5} />;
  }

  if (!data || data.length === 0) {
    return (
      <div className="ent-table-container">
        <EmptyState title={emptyMessage} description={emptySubtext} />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Mobile Card View (visible on small mobile screens below md breakpoint) */}
      <div className="block md:hidden space-y-2.5">
        {data.map((row, index) => (
          <div
            key={row[keyField] || index}
            onClick={() => onRowClick && onRowClick(row)}
            className={`p-4 bg-token-card border border-token-border rounded-xl space-y-2 text-xs transition-colors shadow-2xs ${
              onRowClick ? 'cursor-pointer hover:bg-token-secondary' : ''
            }`}
          >
            {columns.map((col) => (
              <div key={col.key} className="flex items-center justify-between gap-2 border-b border-token-border/40 pb-2 last:border-b-0 last:pb-0">
                <span className="font-medium text-token-text-secondary uppercase tracking-wider text-[10px]">
                  {col.label}:
                </span>
                <div className="text-right font-medium">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Desktop / Tablet Full Table View */}
      <div className="hidden md:block ent-table-container">
        <table className="ent-table">
          <thead>
            <tr>
              {columns.map((col) => {
                const isSorted = sortColumn === col.key;
                return (
                  <th
                    key={col.key}
                    style={{ width: col.width }}
                    className={`${col.sortable ? 'cursor-pointer select-none hover:bg-token-muted' : ''} ${
                      col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                    }`}
                    onClick={() => handleHeaderClick(col)}
                  >
                    <div className={`inline-flex items-center gap-1.5 ${col.align === 'right' ? 'justify-end' : ''}`}>
                      <span>{col.label}</span>
                      {col.sortable && (
                        <span className="text-token-text-muted">
                          {isSorted ? (
                            sortDirection === 'asc' ? (
                              <ArrowUp className="w-3.5 h-3.5 text-token-accent" />
                            ) : (
                              <ArrowDown className="w-3.5 h-3.5 text-token-accent" />
                            )
                          ) : (
                            <ArrowUpDown className="w-3 h-3 opacity-50 hover:opacity-100" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr
                key={row[keyField] || index}
                onClick={() => onRowClick && onRowClick(row)}
                className={onRowClick ? 'cursor-pointer transition-colors hover:bg-token-secondary/60' : ''}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}
                  >
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
