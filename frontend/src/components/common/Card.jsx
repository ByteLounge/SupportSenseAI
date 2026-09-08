/**
 * Enterprise Reusable Component: Card.jsx
 * MoonRow styled card container with rounded-2xl corners and subtle border.
 */

import React from 'react';

export default function Card({
  title,
  subtitle,
  actions,
  children,
  className = '',
  bodyClassName = 'p-5 sm:p-6',
  noPadding = false,
}) {
  return (
    <div className={`bg-token-card border border-token-border rounded-2xl shadow-card text-token-text-primary ${className}`}>
      {(title || subtitle || actions) && (
        <div className="flex flex-wrap items-center justify-between gap-2 px-5 sm:px-6 py-4 border-b border-token-border bg-token-card rounded-t-2xl">
          <div>
            {title && <h3 className="text-sm sm:text-base font-bold text-token-text-primary tracking-tight">{title}</h3>}
            {subtitle && <p className="text-xs text-token-text-secondary mt-0.5">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
        </div>
      )}
      <div className={noPadding ? '' : bodyClassName}>{children}</div>
    </div>
  );
}
