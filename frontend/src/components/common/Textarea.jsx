/**
 * Enterprise Reusable Component: Textarea.jsx
 * Accessible textarea component using design tokens and rounded-lg border.
 */

import React from 'react';

export default function Textarea({
  label,
  id,
  name,
  value,
  onChange,
  placeholder,
  rows = 4,
  required = false,
  error,
  helperText,
  disabled = false,
  className = '',
  ...props
}) {
  const textareaId = id || name;

  return (
    <div className={`space-y-1.5 text-left ${className}`}>
      {label && (
        <label htmlFor={textareaId} className="block text-xs font-medium text-token-text-primary">
          {label}
          {required && <span className="text-rose-500 ml-1" aria-hidden="true">*</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        name={name}
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`w-full p-3 text-xs sm:text-sm text-token-text-primary bg-token-card border ${
          error ? 'border-rose-500 focus:ring-rose-500/20' : 'border-token-border focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
        } rounded-lg outline-none transition-colors duration-150 disabled:bg-token-muted disabled:cursor-not-allowed`}
        {...props}
      />
      {error ? (
        <p className="text-xs text-rose-500 mt-1">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-token-text-secondary mt-1">{helperText}</p>
      ) : null}
    </div>
  );
}
