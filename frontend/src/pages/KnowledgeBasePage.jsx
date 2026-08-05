/**
 * Page: KnowledgeBasePage.jsx
 * Enterprise Knowledge Base & AI-Discovered FAQ Suggestions.
 */

import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Skeleton from '../components/common/Skeleton';
import { getInsightsApi } from '../services/api';
import { formatConfidence } from '../utils/formatters';
import { BookOpen, Plus, AlertCircle, HelpCircle, CheckCircle2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function KnowledgeBasePage() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    async function loadData() {
      try {
        const res = await getInsightsApi();
        setInsights(res.data || res);
      } catch (err) {
        console.error('Failed to load KB insights:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const breadcrumbs = [
    { label: 'Dashboard', path: '/' },
    { label: 'Knowledge Base' },
  ];

  if (loading) {
    return (
      <MainLayout breadcrumbs={breadcrumbs} title="Knowledge Base & Documentation">
        <Skeleton type="card" />
      </MainLayout>
    );
  }

  const faqs = insights?.recommended_faqs || [];
  const topIssues = insights?.top_issues || [];

  return (
    <MainLayout
      breadcrumbs={breadcrumbs}
      title="Knowledge Base & Learning Insights"
      subtitle="AI-synthesized recurring ticket patterns and recommended FAQ additions."
      actions={
        <Button variant="primary" icon={Plus}>
          Create Article
        </Button>
      }
    >
      <div className="space-y-5">
        {/* Recommended FAQ Additions Section */}
        <Card
          title="Recommended FAQ Additions"
          subtitle="AI-detected recurring customer questions suitable for public KB publication."
          actions={<Badge variant="primary">AI Confidence: {formatConfidence(insights?.confidence_score)}</Badge>}
        >
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-3.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[4px] space-y-2 text-xs">
                <div className="font-semibold text-[#111827] flex items-center justify-between">
                  <span>Q: {faq.question}</span>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => addToast('FAQ article draft created in Knowledge Base', 'success')}
                  >
                    Publish to KB
                  </Button>
                </div>
                <div className="p-3 bg-white border border-[#E5E7EB] rounded-[4px] text-[#374151] font-mono leading-relaxed">
                  <strong>Suggested KB Article Draft:</strong> {faq.suggested_answer}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 2-Grid: Top Issues & Process Mistakes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card title="Top Repeated Customer Issues">
            <div className="space-y-2 text-xs">
              {topIssues.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[4px]">
                  <span className="font-medium text-[#111827]">{item.issue}</span>
                  <span className="font-mono text-xs bg-white px-2 py-0.5 border border-[#E5E7EB] font-bold text-[#D97706]">
                    {item.count} occurrences
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Common Agent Process Bottlenecks">
            <div className="space-y-2 text-xs">
              {(insights?.common_mistakes || []).map((item, idx) => (
                <div key={idx} className="p-2.5 bg-[#FEF2F2] border border-[#FCA5A5] rounded-[4px] space-y-1">
                  <div className="font-semibold text-[#991B1B]">{item.mistake}</div>
                  <div className="text-[11px] text-[#6B7280]">Impact: {item.impact}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
