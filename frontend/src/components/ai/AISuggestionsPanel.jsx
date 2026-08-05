/**
 * Component: AISuggestionsPanel.jsx
 * Enterprise AI recommendation panel.
 * Presents category, department, suggested response, and confidence score cleanly.
 * NO decorative gradients or marketing buzzwords.
 */

import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { formatConfidence } from '../../utils/formatters';
import { Check, Edit3, Cpu } from 'lucide-react';

export default function AISuggestionsPanel({
  ticket,
  onApplyReply,
  onEditReply,
  className = '',
}) {
  if (!ticket) return null;

  const ai = ticket.ai_metadata || {};
  const suggestedCategory = ticket.category || ai.suggested_category || 'Technical Support';
  const suggestedDepartment = ticket.assigned_department || ai.suggested_department || 'Tier 2 Engineering';
  const confidence = ai.confidence_score || ai.mood_confidence || 0.94;
  const suggestedReply = ai.suggested_reply || ticket.suggested_reply || 'We are investigating the reported issue and will provide an update within 2 hours.';

  return (
    <Card
      title="AI Recommendation"
      actions={
        <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
          <Cpu className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>Confidence: <strong className="text-[#111827]">{formatConfidence(confidence)}</strong></span>
        </div>
      }
      className={className}
    >
      <div className="space-y-4 text-xs">
        {/* Suggested Category & Department */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[4px] space-y-1">
            <span className="text-[#6B7280] font-medium block">AI Suggested Category</span>
            <span className="font-semibold text-[#111827]">{suggestedCategory}</span>
          </div>

          <div className="p-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[4px] space-y-1">
            <span className="text-[#6B7280] font-medium block">AI Suggested Department</span>
            <span className="font-semibold text-[#111827]">{suggestedDepartment}</span>
          </div>
        </div>

        {/* Suggested Reply Box */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[#6B7280] font-medium">AI Suggested Reply</span>
            <Badge variant="primary" size="sm">Auto-Generated</Badge>
          </div>
          <div className="p-3 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[4px] text-[#111827] leading-relaxed whitespace-pre-line font-mono text-xs">
            {suggestedReply}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-2 pt-1">
          {onEditReply && (
            <Button
              variant="secondary"
              size="sm"
              icon={Edit3}
              onClick={() => onEditReply(suggestedReply)}
            >
              Edit
            </Button>
          )}
          {onApplyReply && (
            <Button
              variant="primary"
              size="sm"
              icon={Check}
              onClick={() => onApplyReply(suggestedReply)}
            >
              Accept Suggestion
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
