/**
 * Enterprise Reusable Component: Dropdown.jsx
 * Clean HTML select component with standard 6px radius and focus state.
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
    sm: 'py-1 px-2.5 text-xs h-7',
    md: 'py-1.5 px-3 text-sm h-9',
  };

  return (
    <div className={`space-y-1 text-left ${className}`}>
      {label && (
        <label htmlFor={selectId} className="block text-xs font-medium text-[#374151]">
          {label}
          {required && <span className="text-[#DC2626] ml-1" aria-hidden="true">*</span>}
        </label>
      )}
      <select
        id={selectId}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`w-full bg-white border ${
          error ? 'border-[#DC2626] focus:ring-[#DC2626]' : 'border-[#D1D5DB] focus:border-[#2563EB] focus:ring-[#2563EB]'
        } text-[#111827] rounded-[6px] outline-none focus:ring-1 transition-colors duration-150 ${sizeClasses[size] || sizeClasses.md} disabled:bg-[#F3F4F6] disabled:cursor-not-allowed`}
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
      {error && <p className="text-xs text-[#DC2626] mt-1">{error}</p>}
    </div>
  );
}
