/**
 * Component: AIConciergeWidget.jsx
 * Floating AI Concierge launcher button and floating modal widget.
 * Enables instant natural-language ticket creation from anywhere across SupportSense.
 */

import React, { useState } from 'react';
import { Sparkles, X, MessageSquareQuote } from 'lucide-react';
import AIConciergeChatbot from './AIConciergeChatbot';

export default function AIConciergeWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {/* Floating Modal Panel */}
      {isOpen && (
        <div className="mb-3 w-[440px] max-w-[94vw] h-[650px] max-h-[84vh] bg-token-card border border-moonrow-primary/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          <AIConciergeChatbot
            embedded={false}
            onClose={() => setIsOpen(false)}
            onTicketCreated={() => {
              // Keep open to show success state, user can navigate or close
            }}
          />
        </div>
      )}

      {/* Floating Launcher Pill Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-medium text-xs shadow-lg transition-all transform hover:scale-105 active:scale-95 ${
            isOpen
              ? 'bg-token-card text-token-text-primary border border-token-border shadow-md'
              : 'bg-gradient-to-r from-moonrow-primary to-[#ff6339] text-white shadow-moonrow-primary/25 hover:shadow-moonrow-primary/40'
          }`}
        >
          {isOpen ? (
            <>
              <X className="w-4 h-4" />
              <span>Close AI Assistant</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>Ask AI Concierge</span>
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping"></span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
