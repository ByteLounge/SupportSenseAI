/**
 * Component: AIConciergeWidget.jsx
 * Floating AI Concierge launcher button and floating modal widget.
 * Enables instant natural-language ticket creation from anywhere across SupportSense.
 */

import React, { useState } from 'react';
import { Sparkles, X, MessageSquareQuote } from 'lucide-react';
import AIConciergeChatbot from './AIConciergeChatbot';
import logoImg from '../../assets/logo.png';

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
          className={`group flex items-center gap-2.5 px-3.5 py-2 rounded-full font-semibold text-xs shadow-xl transition-all transform hover:scale-105 active:scale-95 border ${
            isOpen
              ? 'bg-token-card text-token-text-primary border-token-border shadow-lg'
              : 'bg-[#040811] text-white border-white/10 hover:border-moonrow-primary/50 shadow-2xl'
          }`}
          aria-label="Open SupportSense AI Chatbot"
        >
          {isOpen ? (
            <>
              <div className="w-7 h-7 rounded-full bg-token-secondary flex items-center justify-center">
                <X className="w-4 h-4 text-token-text-primary" />
              </div>
              <span className="pr-1 text-token-text-primary">Close AI Assistant</span>
            </>
          ) : (
            <>
              <div className="relative w-7 h-7 rounded-full bg-white p-0.5 flex items-center justify-center shadow-md ring-2 ring-moonrow-primary/50 group-hover:ring-moonrow-primary transition-all">
                <img
                  src={logoImg}
                  alt="SupportSense Chatbot"
                  className="w-full h-full object-contain rounded-full"
                />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-[#040811] animate-pulse"></span>
              </div>
              <div className="flex flex-col items-start pr-1 text-left">
                <span className="text-[11px] font-bold leading-tight flex items-center gap-1 text-white">
                  SupportSense AI
                  <Sparkles className="w-2.5 h-2.5 text-moonrow-primary fill-moonrow-primary" />
                </span>
                <span className="text-[9px] text-white/70 font-normal leading-tight">
                  Chat & Auto-ticket
                </span>
              </div>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
