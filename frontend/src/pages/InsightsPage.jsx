/**
 * Page: InsightsPage.jsx
 * Weekly AI Learning Insights reporting recurring customer issues & FAQ recommendations.
 */

import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Skeleton from '../components/common/Skeleton';
import { getInsightsApi } from '../services/api';
import { formatConfidence } from '../utils/formatters';
import { Lightbulb, AlertTriangle, HelpCircle, BookOpen, Sparkles, Plus } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function InsightsPage() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    async function loadInsights() {
      try {
        const res = await getInsightsApi();
        setInsights(res.data || res);
      } catch (err) {
        console.error('Failed to load weekly insights:', err);
      } finally {
        setLoading(false);
      }
    }
    loadInsights();
  }, []);

  const breadcrumbs = [
    { label: 'Admin Command Center', path: '/' },
    { label: 'Learning Insights' },
  ];

  if (loading) {
    return (
      <MainLayout breadcrumbs={breadcrumbs} title="Weekly AI Learning Insights">
        <Skeleton type="card" />
      </MainLayout>
    );
  }

  if (!insights) {
    return (
      <MainLayout breadcrumbs={breadcrumbs} title="Weekly AI Learning Insights">
        <div className="p-8 text-center text-token-text-secondary">Insights data unavailable.</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      breadcrumbs={breadcrumbs}
      title="Weekly AI Learning Insights & Intelligence"
      subtitle={`Aggregated AI synthesis identifying recurring support trends & documentation gaps for ${insights.week_identifier || 'Current Period'}.`}
      actions={
        <Badge variant="primary">
          <Sparkles className="w-3.5 h-3.5 mr-1" />
          AI Confidence: {formatConfidence(insights.confidence_score || 0.94)}
        </Badge>
      }
    >
      <div className="space-y-6">
        {/* Recommended Knowledge Base FAQ Additions */}
        <Card
          title="Recommended Knowledge Base FAQ Additions"
          subtitle="AI-detected recurring customer questions with suggested canonical solutions."
        >
          <div className="space-y-4">
            {(insights.recommended_faqs || []).map((faq, idx) => (
              <div key={idx} className="p-4 rounded-[6px] bg-token-secondary border border-token-border space-y-2 text-xs">
                <div className="font-semibold text-token-text-primary flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-token-accent" />
                    <span>Q: {faq.question}</span>
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => addToast('Draft published to Knowledge Base', 'success')}
                  >
                    Publish to KB
                  </Button>
                </div>
                <p className="text-token-text-secondary leading-relaxed bg-token-card p-3 rounded-[4px] border border-token-border">
                  <strong className="text-token-text-primary">Suggested Answer:</strong> {faq.suggested_answer}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* 2-Grid: Top Issues & Process Mistakes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Card title="Top Repeated Customer Issues">
            <div className="space-y-2.5 text-xs">
              {(insights.top_issues || []).map((item, idx) => (
                <div key={idx} className="p-3 rounded-[6px] bg-token-secondary border border-token-border flex items-center justify-between">
                  <span className="font-medium text-token-text-primary">{item.issue}</span>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-token-card border border-token-border font-bold text-amber-600">
                    {item.count} occurrences
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Common Support Bottlenecks">
            <div className="space-y-2.5 text-xs">
              {(insights.common_mistakes || []).map((item, idx) => (
                <div key={idx} className="p-3 rounded-[6px] bg-amber-500/10 border border-amber-500/30 text-xs space-y-1">
                  <div className="font-semibold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    {item.mistake}
                  </div>
                  <div className="text-token-text-secondary">Impact: {item.impact}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}

