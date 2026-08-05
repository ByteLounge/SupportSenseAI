/**
 * Enterprise Reusable Component: Card.jsx
 * Responsive Card container using CSS design tokens.
 */

import React from 'react';

export default function Card({
  title,
  subtitle,
  actions,
  children,
  className = '',
  bodyClassName = 'p-3.5 sm:p-4',
  noPadding = false,
}) {
  return (
    <div className={`bg-token-card border border-token-border rounded-[6px] shadow-subtle text-token-text-primary ${className}`}>
      {(title || subtitle || actions) && (
        <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 sm:px-4 py-3 border-b border-token-border bg-token-card">
          <div>
            {title && <h3 className="text-sm font-semibold text-token-text-primary">{title}</h3>}
            {subtitle && <p className="text-xs text-token-text-secondary mt-0.5">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
        </div>
      )}
      <div className={noPadding ? '' : bodyClassName}>{children}</div>
    </div>
  );
}
