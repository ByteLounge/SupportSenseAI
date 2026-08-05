/**
 * Enterprise Reusable Component: Input.jsx
 * Accessible input component with touch targets, design tokens, and error display.
 */

import React from 'react';

export default function Input({
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  helperText,
  disabled = false,
  className = '',
  icon: Icon,
  ...props
}) {
  const inputId = id || name;

  return (
    <div className={`space-y-1 text-left ${className}`}>
      {label && (
        <label htmlFor={inputId} className="block text-xs font-medium text-token-text-primary">
          {label}
          {required && <span className="text-token-error ml-1" aria-hidden="true">*</span>}
        </label>
      )}
      <div className="relative rounded-[6px]">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-token-text-muted">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`w-full px-3 py-2 text-sm text-token-text-primary bg-token-card border ${
            error ? 'border-token-error focus:ring-token-error' : 'border-token-border focus:border-token-accent focus:ring-token-accent'
          } rounded-[6px] outline-none focus:ring-1 transition-colors duration-150 disabled:bg-token-muted disabled:cursor-not-allowed min-h-[44px] sm:min-h-[38px] ${
            Icon ? 'pl-9' : ''
          }`}
          {...props}
        />
      </div>
      {error ? (
        <p className="text-xs text-token-error mt-1">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-token-text-secondary mt-1">{helperText}</p>
      ) : null}
    </div>
  );
}
