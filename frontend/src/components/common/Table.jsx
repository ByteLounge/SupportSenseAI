/**
 * Enterprise Reusable Component: Table.jsx
 * GitHub / Jira style enterprise data table with sortable columns and clean hover effects.
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
    <div className="ent-table-container">
      <table className="ent-table">
        <thead>
          <tr>
            {columns.map((col) => {
              const isSorted = sortColumn === col.key;
              return (
                <th
                  key={col.key}
                  style={{ width: col.width }}
                  className={`${col.sortable ? 'cursor-pointer select-none hover:bg-[#F3F4F6]' : ''} ${
                    col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                  }`}
                  onClick={() => handleHeaderClick(col)}
                >
                  <div className={`inline-flex items-center gap-1.5 ${col.align === 'right' ? 'justify-end' : ''}`}>
                    <span>{col.label}</span>
                    {col.sortable && (
                      <span className="text-[#9CA3AF]">
                        {isSorted ? (
                          sortDirection === 'asc' ? (
                            <ArrowUp className="w-3.5 h-3.5 text-[#2563EB]" />
                          ) : (
                            <ArrowDown className="w-3.5 h-3.5 text-[#2563EB]" />
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
              className={onRowClick ? 'cursor-pointer transition-colors hover:bg-[#F8F9FA]' : ''}
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
  );
}
