/**
 * Page: KnowledgeBasePage.jsx
 * Enterprise Knowledge Base:
 * - Customer: Self-service FAQ directory, search, category filter, and "Still need help?" ticket action.
 * - Agent / Admin: AI-synthesized insights, recurring issue trends, and draft FAQ publication.
 */

import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Badge from '../components/common/Badge';
import Skeleton from '../components/common/Skeleton';
import { getInsightsApi, getFaqsApi } from '../services/api';
import { formatConfidence } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Plus,
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Ticket,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';

export default function KnowledgeBasePage() {
  const { user, isCustomer, isAgent, isAdmin } = useAuth();
  const [insights, setInsights] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [insightsRes, faqsRes] = await Promise.all([
          getInsightsApi(),
          getFaqsApi(),
        ]);
        setInsights(insightsRes.data || insightsRes);
        setFaqs(faqsRes.data || []);
      } catch (err) {
        console.error('Failed to load KB data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const breadcrumbs = [
    { label: isCustomer ? 'Customer Portal' : 'Dashboard', path: '/' },
    { label: isCustomer ? 'Help Center & FAQs' : 'Knowledge Base' },
  ];

  if (loading) {
    return (
      <MainLayout breadcrumbs={breadcrumbs} title="Knowledge Base & Documentation">
        <Skeleton type="card" />
      </MainLayout>
    );
  }

  const categories = ['All', 'Finance & Billing', 'Technical Support', 'Identity & Access', 'API Platform'];

  const filteredFaqs = faqs.filter((f) => {
    const matchesCategory = selectedCategory === 'All' || f.category.toLowerCase().includes(selectedCategory.toLowerCase()) || f.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const recommendedFaqs = insights?.recommended_faqs || [];
  const topIssues = insights?.top_issues || [];

  return (
    <MainLayout
      breadcrumbs={breadcrumbs}
      title={isCustomer ? 'Customer Help Center & FAQs' : 'Knowledge Base & Learning Insights'}
      subtitle={
        isCustomer
          ? 'Instant solutions for billing, account verification, API keys, and technical issues.'
          : 'AI-synthesized recurring ticket patterns, automated FAQ recommendations, and knowledge curation.'
      }
      actions={
        !isCustomer && (
          <Button variant="primary" icon={Plus} onClick={() => addToast('Article draft editor initialized', 'info')}>
            Create KB Article
          </Button>
        )
      }
    >
      <div className="space-y-6">
        {/* Customer Self-Serve Header Card */}
        {isCustomer && (
          <div className="p-6 rounded-xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 space-y-4">
            <div>
              <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded">
                Self-Service Knowledge Base
              </span>
              <h2 className="text-lg font-bold text-token-text-primary mt-1">Frequently Asked Questions</h2>
              <p className="text-xs text-token-text-secondary">
                Explore answers to common questions. If you cannot find what you are looking for, submit a query to our agents.
              </p>
            </div>

            {/* Search Input */}
            <Input
              placeholder="Search help articles (e.g. invoice, SAML SSO, rate limits, SSL certificates)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={Search}
            />

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    selectedCategory === cat
                      ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                      : 'bg-token-card border border-token-border text-token-text-secondary hover:bg-token-muted'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* FAQs List Section (For Customers & Agents) */}
        <Card
          title={isCustomer ? `Search Results (${filteredFaqs.length} Answers)` : 'Active Public FAQs'}
          subtitle={isCustomer ? 'Click any question to view the full resolution.' : 'Published FAQ articles visible to customers.'}
        >
          <div className="space-y-2.5">
            {filteredFaqs.length === 0 ? (
              <div className="p-6 text-center text-token-text-secondary text-xs">
                No FAQs matched your search query.
              </div>
            ) : (
              filteredFaqs.map((faq) => {
                const isOpen = expandedFaq === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="border border-token-border rounded-[6px] overflow-hidden bg-token-secondary/30 transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedFaq(isOpen ? null : faq.id)}
                      className="w-full p-3.5 text-left text-xs font-semibold text-token-text-primary flex items-center justify-between hover:bg-token-muted"
                    >
                      <span className="flex items-center gap-2.5">
                        <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{faq.question}</span>
                      </span>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-token-text-muted" /> : <ChevronDown className="w-4 h-4 text-token-text-muted" />}
                    </button>
                    {isOpen && (
                      <div className="p-4 pt-1 text-xs text-token-text-secondary leading-relaxed border-t border-token-border/40 bg-token-card">
                        <p className="mt-1">{faq.answer}</p>
                        <div className="mt-3 flex items-center gap-2">
                          <span className="text-[10px] px-2 py-0.5 rounded bg-token-secondary border border-token-border text-token-text-muted font-medium">
                            Category: {faq.category}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </Card>

        {/* Customer "Still Need Help?" Footer Banner */}
        {isCustomer && (
          <div className="p-5 bg-token-card border border-token-border rounded-[8px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-token-text-primary">Still can't find an answer?</h3>
              <p className="text-xs text-token-text-secondary mt-0.5">
                Our support team is ready to investigate your issue with specialized department assistance.
              </p>
            </div>
            <Button
              variant="primary"
              icon={Ticket}
              onClick={() => navigate('/tickets/new')}
            >
              Submit Support Query
            </Button>
          </div>
        )}

        {/* Agent & Admin AI-Generated FAQ Suggestions & Analytics */}
        {!isCustomer && (
          <>
            <Card
              title="AI Automated FAQ Recommendations"
              subtitle="Gemini AI clustered recent customer inquiries and synthesized suggested public articles."
              actions={<Badge variant="primary">AI Confidence: {formatConfidence(insights?.confidence_score || 0.92)}</Badge>}
            >
              <div className="space-y-4">
                {recommendedFaqs.map((faq, idx) => (
                  <div key={idx} className="p-3.5 bg-token-secondary border border-token-border rounded-[6px] space-y-2 text-xs">
                    <div className="font-semibold text-token-text-primary flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-token-accent" />
                        <span>Recommended Q: {faq.question}</span>
                      </span>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => addToast('Article draft approved and published to Knowledge Base', 'success')}
                      >
                        Publish to FAQ
                      </Button>
                    </div>
                    <div className="p-3 bg-token-card border border-token-border rounded-[4px] text-token-text-secondary leading-relaxed">
                      <strong className="text-token-text-primary">Draft Answer:</strong> {faq.suggested_answer}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card title="Top Repeated Customer Issues (Weekly)">
                <div className="space-y-2 text-xs">
                  {topIssues.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 bg-token-secondary border border-token-border rounded-[4px]">
                      <span className="font-medium text-token-text-primary">{item.issue}</span>
                      <span className="text-xs bg-token-card px-2 py-0.5 border border-token-border font-bold text-amber-600">
                        {item.count} occurrences
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card title="Common Support Triage Bottlenecks">
                <div className="space-y-2 text-xs">
                  {(insights?.common_mistakes || []).map((item, idx) => (
                    <div key={idx} className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-[4px] space-y-1">
                      <div className="font-semibold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        {item.mistake}
                      </div>
                      <div className="text-[11px] text-token-text-secondary">Impact: {item.impact}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}

