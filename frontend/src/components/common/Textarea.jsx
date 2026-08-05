/**
 * Enterprise Reusable Component: Textarea.jsx
 * Clean textarea component with label, error display, and standard enterprise borders.
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
        <label htmlFor={textareaId} className="block text-xs font-medium text-[#374151]">
          {label}
          {required && <span className="text-[#DC2626] ml-1" aria-hidden="true">*</span>}
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
        className={`w-full p-3 text-sm text-[#111827] bg-white border ${
          error ? 'border-[#DC2626] focus:ring-[#DC2626]' : 'border-[#D1D5DB] focus:border-[#2563EB] focus:ring-[#2563EB]'
        } rounded-[6px] outline-none focus:ring-1 transition-colors duration-150 disabled:bg-[#F3F4F6] disabled:cursor-not-allowed`}
        {...props}
      />
      {error ? (
        <p className="text-xs text-[#DC2626] mt-1">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-[#6B7280] mt-1">{helperText}</p>
      ) : null}
    </div>
  );
}
