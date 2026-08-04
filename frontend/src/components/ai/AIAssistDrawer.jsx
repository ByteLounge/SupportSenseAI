/**
 * Component: AIAssistDrawer.jsx
 * Lead Engineer: Member 1 & Member 3
 * Description: AI Decision Support Panel rendering Mood, Patience Rating, Resolution Estimate, & Checklists.
 */

import React from 'react';
import AIMoodBadge from './AIMoodBadge';
import { Bot, Clock, CheckSquare, History, AlertTriangle } from 'lucide-react';
import { toggleChecklistApi } from '../../services/api';

export default function AIAssistDrawer({ ticket, onChecklistUpdate }) {
  if (!ticket) return null;

  const ai = ticket.ai_metadata || {};
  const checklists = ticket.checklists || [];

  const getPatienceStyle = (patience) => {
    switch (patience) {
      case 'CRITICAL': return 'bg-rose-500 text-white';
      case 'FRUSTRATED': return 'bg-orange-500 text-white';
      case 'CONCERNED': return 'bg-amber-500 text-white';
      default: return 'bg-emerald-500 text-white';
    }
  };

  const handleCheckboxToggle = async (itemId, currentVal) => {
    try {
      await toggleChecklistApi(ticket.id, itemId, !currentVal);
      if (onChecklistUpdate) onChecklistUpdate();
    } catch (err) {
      console.error('Failed to toggle checklist item:', err);
    }
  };

  return (
    <div className="w-full lg:w-80 glass-panel bg-white/70 dark:bg-slate-800/70 p-5 space-y-6 shrink-0 h-fit border border-indigo-500/20 shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700/60 pb-3">
        <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
          <Bot className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white leading-none">
            AI Decision Assist
          </h3>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Human-in-the-Loop Protocol</span>
        </div>
      </div>

      {/* Mood & Patience Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
          <div className="text-[10px] uppercase font-semibold text-slate-400">Customer Mood</div>
          <AIMoodBadge mood={ai.customer_mood || 'NEUTRAL'} confidence={ai.mood_confidence || 0.85} />
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
          <div className="text-[10px] uppercase font-semibold text-slate-400">Patience Rating</div>
          <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${getPatienceStyle(ai.patience_score)}`}>
            {ai.patience_score || 'CALM'}
          </span>
        </div>
      </div>

      {/* Resolution Predictor */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 space-y-1">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
          <Clock className="w-3.5 h-3.5" />
          Resolution Time Predictor
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
          Likely resolved in: <span className="font-bold text-indigo-600 dark:text-indigo-400">{ai.predicted_resolution_time || '1–2 business days'}</span>
        </p>
      </div>

      {/* Actionable Agent Assist Checklist */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          <CheckSquare className="w-3.5 h-3.5 text-indigo-500" />
          Agent Action Checklist
        </div>
        <div className="space-y-2">
          {checklists.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No checklist items generated.</p>
          ) : (
            checklists.map((item) => (
              <label
                key={item.id}
                className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 cursor-pointer text-xs transition-colors"
              >
                <input
                  type="checkbox"
                  checked={item.is_completed}
                  onChange={() => handleCheckboxToggle(item.id, item.is_completed)}
                  className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className={`leading-tight ${item.is_completed ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-200'}`}>
                  {item.item_text}
                </span>
              </label>
            ))
          )}
        </div>
      </div>

      {/* Timeline Summary (If ticket was reopened) */}
      {ai.timeline_summary && (
        <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700/60">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            <History className="w-3.5 h-3.5 text-indigo-500" />
            Reopened Timeline Summary
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed">
            {ai.timeline_summary}
          </div>
        </div>
      )}
    </div>
  );
}
