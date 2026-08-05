/**
 * Enterprise Reusable Component: Dropdown.jsx
 * Select dropdown component using design tokens and touch height limits.
 */

import React from 'react';

export default function Dropdown({
  label,
  id,
  name,
  value,
  onChange,
  options = [],
  required = false,
  error,
  disabled = false,
  className = '',
  size = 'md',
  placeholder,
  ...props
}) {
  const selectId = id || name;

  const sizeClasses = {
    sm: 'py-1.5 px-2.5 text-xs min-h-[38px]',
    md: 'py-2 px-3 text-sm min-h-[44px]',
  };

  return (
    <div className={`space-y-1 text-left ${className}`}>
      {label && (
        <label htmlFor={selectId} className="block text-xs font-medium text-token-text-primary">
          {label}
          {required && <span className="text-token-error ml-1" aria-hidden="true">*</span>}
        </label>
      )}
      <select
        id={selectId}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`w-full bg-token-card border ${
          error ? 'border-token-error focus:ring-token-error' : 'border-token-border focus:border-token-accent focus:ring-token-accent'
        } text-token-text-primary rounded-[6px] outline-none focus:ring-1 transition-colors duration-150 ${sizeClasses[size] || sizeClasses.md} disabled:bg-token-muted disabled:cursor-not-allowed`}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => {
          const val = typeof opt === 'object' ? opt.value : opt;
          const lbl = typeof opt === 'object' ? opt.label : opt;
          return (
            <option key={val} value={val}>
              {lbl}
            </option>
          );
        })}
      </select>
      {error && <p className="text-xs text-token-error mt-1">{error}</p>}
    </div>
  );
}
