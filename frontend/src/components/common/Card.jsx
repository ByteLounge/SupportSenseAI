/**
 * Enterprise Reusable Component: Card.jsx
 * Clean, non-floating card container with 6px border-radius and subtle border.
 */

import React from 'react';

export default function Card({
  title,
  subtitle,
  actions,
  children,
  className = '',
  bodyClassName = 'p-4',
  noPadding = false,
}) {
  return (
    <div className={`bg-white border border-[#E5E7EB] rounded-[6px] shadow-subtle ${className}`}>
      {(title || subtitle || actions) && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E7EB] bg-white">
          <div>
            {title && <h3 className="text-sm font-semibold text-[#111827]">{title}</h3>}
            {subtitle && <p className="text-xs text-[#6B7280] mt-0.5">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={noPadding ? '' : bodyClassName}>{children}</div>
    </div>
  );
}
