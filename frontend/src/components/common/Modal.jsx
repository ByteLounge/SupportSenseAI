/**
 * Enterprise Reusable Component: Modal.jsx
 * Responsive modal dialog that renders as a centered dialog on desktop/tablet and a bottom sheet on mobile devices.
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
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Dialog Container */}
      <div className={`relative w-full ${sizeClasses[size] || sizeClasses.md} bg-token-card border border-token-border rounded-t-2xl sm:rounded-2xl shadow-xl flex flex-col max-h-[85vh] sm:max-h-[90vh] z-10 animate-slide-up sm:animate-fade-in`}>
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-token-border bg-token-card rounded-t-2xl">
          <div>
            <h3 id="modal-title" className="text-sm sm:text-base font-semibold text-token-text-primary">
              {title}
            </h3>
            {subtitle && <p className="text-xs text-token-text-secondary mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-token-text-secondary hover:text-token-text-primary hover:bg-token-muted rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 text-sm text-token-text-primary">
          {children}
        </div>

        {/* Modal Footer */}
        {(primaryAction || secondaryAction) && (
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 px-5 py-3.5 border-t border-token-border bg-token-secondary/40 rounded-b-2xl">
            {secondaryAction && (
              <Button
                variant={secondaryAction.variant || 'secondary'}
                onClick={secondaryAction.onClick || onClose}
                disabled={secondaryAction.disabled}
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
