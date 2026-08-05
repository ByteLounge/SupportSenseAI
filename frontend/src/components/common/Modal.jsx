/**
 * Enterprise Reusable Component: Modal.jsx
 * Clean, flat dialog window with clear header, content area, and action footer.
 */

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  primaryAction,
  secondaryAction,
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Dialog Container */}
      <div className={`relative w-full ${sizeClasses[size] || sizeClasses.md} bg-white border border-[#E5E7EB] rounded-[6px] shadow-sm flex flex-col max-h-[90vh] z-10`}>
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E5E7EB] bg-[#F8F9FA]">
          <div>
            <h3 id="modal-title" className="text-base font-semibold text-[#111827]">
              {title}
            </h3>
            {subtitle && <p className="text-xs text-[#6B7280] mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#6B7280] hover:text-[#111827] hover:bg-[#E5E7EB] rounded-[4px] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 text-sm text-[#111827]">
          {children}
        </div>

        {/* Modal Footer */}
        {(primaryAction || secondaryAction) && (
          <div className="flex items-center justify-end gap-3 px-5 py-3 border-t border-[#E5E7EB] bg-[#F8F9FA]">
            {secondaryAction && (
              <Button
                variant={secondaryAction.variant || 'secondary'}
                onClick={secondaryAction.onClick}
                disabled={secondaryAction.disabled || secondaryAction.loading}
              >
                {secondaryAction.label || 'Cancel'}
              </Button>
            )}
            {primaryAction && (
              <Button
                variant={primaryAction.variant || 'primary'}
                onClick={primaryAction.onClick}
                loading={primaryAction.loading}
                disabled={primaryAction.disabled}
              >
                {primaryAction.label || 'Confirm'}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
