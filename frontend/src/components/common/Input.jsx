/**
 * Enterprise Reusable Component: Input.jsx
 * Clean input with label above, red asterisk for required fields, and error message below.
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
        <label htmlFor={inputId} className="block text-xs font-medium text-[#374151]">
          {label}
          {required && <span className="text-[#DC2626] ml-1" aria-hidden="true">*</span>}
        </label>
      )}
      <div className="relative rounded-[6px]">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9CA3AF]">
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
          className={`w-full px-3 py-2 text-sm text-[#111827] bg-white border ${
            error ? 'border-[#DC2626] focus:ring-[#DC2626]' : 'border-[#D1D5DB] focus:border-[#2563EB] focus:ring-[#2563EB]'
          } rounded-[6px] outline-none focus:ring-1 transition-colors duration-150 disabled:bg-[#F3F4F6] disabled:cursor-not-allowed ${
            Icon ? 'pl-9' : ''
          }`}
          {...props}
        />
      </div>
      {error ? (
        <p className="text-xs text-[#DC2626] mt-1">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-[#6B7280] mt-1">{helperText}</p>
      ) : null}
    </div>
  );
}
