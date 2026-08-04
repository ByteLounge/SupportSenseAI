/**
 * Page: InsightsPage.jsx
 * Lead Engineer: Member 1 & Member 3
 * Description: Weekly AI Learning Insights reporting recurring customer issues & FAQ additions.
 */

import React, { useState, useEffect } from 'react';
import { getInsightsApi } from '../services/api';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { Lightbulb, AlertTriangle, HelpCircle, BookOpen, Sparkles } from 'lucide-react';

export default function InsightsPage() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInsights() {
      try {
        const res = await getInsightsApi();
        setInsights(res.data);
      } catch (err) {
        console.error('Failed to load weekly insights:', err);
      } finally {
        setLoading(false);
      }
    }
    loadInsights();
  }, []);

  if (loading) return <LoadingSkeleton type="card" />;
  if (!insights) return <div className="p-8 text-center text-slate-500">Insights data unavailable.</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 flex items-center justify-between border-l-4 border-l-purple-500">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <Lightbulb className="w-8 h-8" />
          </div>
          <div>
            <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white">
              Weekly AI Learning Insights
            </h2>
            <p className="text-xs text-slate-500">
              Aggregated AI analysis identifying recurring support trends & documentation gaps for {insights.week_identifier}.
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-semibold border border-purple-200">
          <Sparkles className="w-4 h-4 text-purple-500" />
          AI Confidence: {Math.round((insights.confidence_score || 0.94) * 100)}%
        </div>
      </div>

      {/* Grid Layout for Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top 5 Repeated Customer Issues */}
        <div className="glass-panel p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h3 className="font-display font-semibold text-base">Top Repeated Customer Issues</h3>
          </div>
          <div className="space-y-3">
            {insights.top_issues && insights.top_issues.map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs">
                <span className="font-medium text-slate-800 dark:text-slate-200">{item.issue}</span>
                <span className="font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 font-bold">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Common Agent Handling Mistakes */}
        <div className="glass-panel p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <BookOpen className="w-5 h-5 text-rose-500" />
            <h3 className="font-display font-semibold text-base">Common Agent Process Mistakes</h3>
          </div>
          <div className="space-y-3">
            {insights.common_mistakes && insights.common_mistakes.map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs space-y-1">
                <div className="font-semibold text-rose-700 dark:text-rose-300">{item.mistake}</div>
                <div className="text-slate-500 dark:text-slate-400">Impact: {item.impact}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended FAQ Additions */}
      <div className="glass-panel p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <HelpCircle className="w-5 h-5 text-indigo-500" />
          <h3 className="font-display font-semibold text-base">Recommended Knowledge Base FAQ Additions</h3>
        </div>
        <div className="space-y-4">
          {insights.recommended_faqs && insights.recommended_faqs.map((faq, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 space-y-2">
              <div className="font-semibold text-sm text-indigo-900 dark:text-indigo-200 flex items-center gap-2">
                ❓ Q: {faq.question}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-lg border border-indigo-100 dark:border-indigo-900">
                💡 <strong>Suggested KB Answer:</strong> {faq.suggested_answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
