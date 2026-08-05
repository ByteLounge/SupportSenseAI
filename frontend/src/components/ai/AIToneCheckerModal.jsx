/**
 * Component: AIToneCheckerModal.jsx
 * Pre-send AI Response Quality & Tone verification modal in clean enterprise format.
 */

import React from 'react';
import Modal from '../common/Modal';
import Badge from '../common/Badge';
import { formatConfidence } from '../../utils/formatters';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function AIToneCheckerModal({
  isOpen,
  onClose,
  qualityData,
  onApplySuggestion,
}) {
  if (!qualityData) return null;

  const { scores = {}, overall_grade = 'A', suggestions = [], confidence_score = 0.92 } = qualityData;

  const primaryAction = {
    label: 'Apply Recommendation',
    onClick: () => {
      if (onApplySuggestion && suggestions.length > 0) {
        onApplySuggestion(suggestions[0]);
      }
      onClose();
    },
    variant: 'primary',
  };

  const secondaryAction = {
    label: 'Keep Original Draft',
    onClick: onClose,
    variant: 'secondary',
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Response Quality & Tone Review"
      subtitle={`Overall Grade: ${overall_grade} | AI Confidence: ${formatConfidence(confidence_score)}`}
      primaryAction={suggestions.length > 0 ? primaryAction : null}
      secondaryAction={secondaryAction}
      size="md"
    >
      <div className="space-y-4 text-xs">
        {/* Metric Progress Indicators */}
        <div className="space-y-2.5">
          {Object.entries(scores).map(([metric, score]) => (
            <div key={metric} className="space-y-1">
              <div className="flex justify-between font-medium text-[#374151] capitalize">
                <span>{metric} Score</span>
                <span>{score}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#E5E7EB] rounded-none overflow-hidden">
                <div
                  className={`h-full ${
                    score >= 80 ? 'bg-[#16A34A]' : score >= 60 ? 'bg-[#D97706]' : 'bg-[#DC2626]'
                  }`}
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Suggestions Panel */}
        {suggestions && suggestions.length > 0 && (
          <div className="p-3 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[4px] space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-[#111827]">
              <AlertCircle className="w-4 h-4 text-[#D97706]" />
              <span>Recommended Improvement</span>
            </div>
            <p className="text-[#374151] leading-relaxed font-mono">{suggestions[0]}</p>
          </div>
        )}
      </div>
    </Modal>
  );
}
