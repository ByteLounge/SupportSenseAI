/**
 * Enterprise Reusable Component: Breadcrumbs.jsx
 * Clean breadcrumb navigation path component.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumbs({ items = [] }) {
  if (!items || items.length === 0) return null;

  return (
    <nav className="flex items-center gap-1.5 text-xs text-[#6B7280] mb-4" aria-label="Breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0" />}
            {isLast || !item.path ? (
              <span className="font-medium text-[#111827] truncate max-w-xs">{item.label}</span>
            ) : (
              <Link to={item.path} className="hover:text-[#2563EB] transition-colors truncate">
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
