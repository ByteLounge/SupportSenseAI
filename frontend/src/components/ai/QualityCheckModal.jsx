/**
 * Component: QualityCheckModal.jsx
 * Lead Engineer: Member 1 (Frontend Lead)
 * Description: Pre-send AI Response Quality Verification modal displaying tone radar scores & suggestions.
 */

import React from 'react';
import { X, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export default function QualityCheckModal({ isOpen, onClose, qualityData, onApplySuggestion }) {
  if (!isOpen || !qualityData) return null;

  const { scores, overall_grade, suggestions, confidence_score } = qualityData;

  const getScoreColor = (score) => {
    if (score >= 85) return 'bg-emerald-500';
    if (score >= 70) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl glass-panel bg-white dark:bg-slate-900 p-6 space-y-6 shadow-2xl relative border border-slate-200 dark:border-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
              AI Response Quality & Tone Check
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Overall Grade Banner */}
        <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/50 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-semibold">Overall Grade</div>
            <div className="text-2xl font-bold font-display text-indigo-900 dark:text-indigo-100">{overall_grade}</div>
          </div>
          <div className="text-xs text-indigo-600 dark:text-indigo-300 font-medium">
            AI Confidence: {Math.round(confidence_score * 100)}%
          </div>
        </div>

        {/* 4 Score Progress Bars */}
        <div className="space-y-3">
          {Object.entries(scores).map(([metric, score]) => (
            <div key={metric} className="space-y-1">
              <div className="flex justify-between text-xs font-semibold capitalize text-slate-700 dark:text-slate-300">
                <span>{metric}</span>
                <span>{score}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getScoreColor(score)}`}
                  style={{ width: `${score}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Actionable Suggestions */}
        {suggestions && suggestions.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
              AI Recommendation
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-sm text-slate-700 dark:text-slate-300">
              {suggestions[0]}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            Keep Original Draft
          </button>
          <button
            onClick={() => {
              if (onApplySuggestion) onApplySuggestion(suggestions[0]);
              onClose();
            }}
            className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            Apply Recommendation & Send
          </button>
        </div>
      </div>
    </div>
  );
}
