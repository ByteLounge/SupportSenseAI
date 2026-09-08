/**
 * Component: TimelineSummaryBanner.jsx
 * Lead Engineer: Member 1 (Frontend Lead) & Member 3 (AI Engineer)
 * Description: Prominent banner rendered at the top of the agent Ticket Detail
 *              view whenever a reopened ticket has an AI-generated timeline
 *              summary (ai_metadata.timeline_summary). Condenses the prior
 *              multi-agent thread history into a 5-6 bullet executive
 *              briefing so the newly assigned/returning agent can ramp up
 *              instantly. (SCRUM-116)
 */

import React, { useState } from 'react';
import { History, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

/**
 * Splits the raw timeline_summary text into individual bullet lines,
 * tolerating "•", "-", "*" prefixes or plain newline-separated sentences
 * (the AI service's fallback path does not always prefix with a bullet).
 * Also normalizes literal "\n" escape sequences (two characters: backslash
 * + "n") into real newlines first, since Gemini sometimes returns the
 * summary as a single string with escaped newlines rather than actual
 * line breaks.
 */
function parseBullets(summaryText) {
  if (!summaryText) return [];
  if (Array.isArray(summaryText)) return summaryText.map(String).filter(Boolean);
  if (typeof summaryText !== 'string') return [];
  return summaryText
    .replace(/\\n/g, '\n') // turn literal "\n" text into real newlines
    .split(/\n|(?=•)/) // split on real newlines, and also before any "•" that starts mid-line
    .map((line) => line.replace(/^[\s•\-*]+/, '').trim())
    .filter(Boolean);
}

export default function TimelineSummaryBanner({ ticket }) {
  const [expanded, setExpanded] = useState(true);
  const ai = ticket?.ai_metadata || {};
  const summaryText = ai.timeline_summary;

  if (!summaryText) return null;

  const bullets = parseBullets(summaryText);

  return (
    <div className="rounded-[8px] border border-indigo-500/30 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-transparent overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-md bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 shrink-0">
            <History className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-sm font-semibold text-token-text-primary">
              Reopened Ticket Timeline Summary
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            </div>
            <div className="text-[11px] text-token-text-secondary">
              AI-generated briefing of prior activity{ai.analyzed_at ? ` • Updated ${formatDate(ai.analyzed_at)}` : ''}
            </div>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-token-text-secondary shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-token-text-secondary shrink-0" />
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-4">
          <div className="p-3.5 rounded-[6px] bg-token-card/70 border border-indigo-500/20">
            {bullets.length > 0 ? (
              <ul className="space-y-1.5 text-xs text-token-text-primary leading-relaxed">
                {bullets.map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-token-text-primary whitespace-pre-line leading-relaxed">{summaryText}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}