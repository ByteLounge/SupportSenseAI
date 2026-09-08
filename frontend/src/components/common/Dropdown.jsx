/**
 * Enterprise Reusable Component: Dropdown.jsx
 * Select dropdown component using design tokens and rounded-lg border.
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
    sm: 'py-1.5 px-2.5 text-xs min-h-[32px]',
    md: 'py-2 px-3 text-xs sm:text-sm min-h-[38px]',
  };

  return (
    <div className={`space-y-1.5 text-left ${className}`}>
      {label && (
        <label htmlFor={selectId} className="block text-xs font-medium text-token-text-primary">
          {label}
          {required && <span className="text-rose-500 ml-1" aria-hidden="true">*</span>}
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
          error ? 'border-rose-500 focus:ring-rose-500/20' : 'border-token-border focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
        } text-token-text-primary rounded-lg outline-none transition-colors duration-150 ${sizeClasses[size] || sizeClasses.md} disabled:bg-token-muted disabled:cursor-not-allowed`}
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
      {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
    </div>
  );
}
