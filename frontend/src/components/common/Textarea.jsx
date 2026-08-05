/**
 * Enterprise Reusable Component: Textarea.jsx
 * Accessible textarea component using design tokens and touch padding.
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
    <div className={`space-y-1 text-left ${className}`}>
      {label && (
        <label htmlFor={textareaId} className="block text-xs font-medium text-token-text-primary">
          {label}
          {required && <span className="text-token-error ml-1" aria-hidden="true">*</span>}
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
        className={`w-full p-3 text-sm text-token-text-primary bg-token-card border ${
          error ? 'border-token-error focus:ring-token-error' : 'border-token-border focus:border-token-accent focus:ring-token-accent'
        } rounded-[6px] outline-none focus:ring-1 transition-colors duration-150 disabled:bg-token-muted disabled:cursor-not-allowed`}
        {...props}
      />
      {error ? (
        <p className="text-xs text-token-error mt-1">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-token-text-secondary mt-1">{helperText}</p>
      ) : null}
    </div>
  );
}
