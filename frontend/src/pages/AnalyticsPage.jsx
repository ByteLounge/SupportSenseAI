/**
 * Page: AnalyticsPage.jsx
 * Visual Performance Metrics, SLA Compliance, and Operational Analytics.
 * Simplified with intuitive SVG charts and key benchmarks for administrators.
 */

import React, { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  Smile,
  Bot,
  BarChart3,
  PieChart,
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d');

  // Weekly Ticket Volume Data (Mon - Sun)
  const weeklyData = [
    { day: 'Mon', created: 18, resolved: 16 },
    { day: 'Tue', created: 24, resolved: 22 },
    { day: 'Wed', created: 28, resolved: 27 },
    { day: 'Thu', created: 22, resolved: 23 },
    { day: 'Fri', created: 30, resolved: 28 },
    { day: 'Sat', created: 12, resolved: 14 },
    { day: 'Sun', created: 8, resolved: 9 },
  ];

  const maxDailyVolume = 32;

  // Department Volume Distribution
  const departmentBreakdown = [
    { name: 'Technical Support', count: 48, percent: 34, color: '#3B82F6' },
    { name: 'Finance & Billing', count: 36, percent: 26, color: '#F59E0B' },
    { name: 'Identity & Access', count: 28, percent: 20, color: '#8B5CF6' },
    { name: 'API Platform Team', count: 28, percent: 20, color: '#10B981' },
  ];

  // Customer Sentiment Distribution
  const sentimentData = [
    { label: 'Satisfied / Happy', count: '64%', value: 64, color: 'bg-emerald-500', icon: '😊' },
    { label: 'Neutral / Inquiring', count: '22%', value: 22, color: 'bg-blue-500', icon: '😐' },
    { label: 'Frustrated / Blocked', count: '10%', value: 10, color: 'bg-amber-500', icon: '😟' },
    { label: 'Urgent Escalation', count: '4%', value: 4, color: 'bg-red-500', icon: '🚨' },
  ];

  // SLA Performance Benchmarks
  const slaMetrics = [
    {
      metric: 'First Response Time (FRT)',
      current: '14 mins',
      target: '< 30 mins',
      rate: 98.4,
      status: 'Excellent',
      color: 'text-emerald-600 bg-emerald-500',
    },
    {
      metric: 'Mean Time to Resolution (MTTR)',
      current: '1.8 hours',
      target: '< 4.0 hours',
      rate: 96.2,
      status: 'Compliant',
      color: 'text-blue-600 bg-blue-500',
    },
    {
      metric: 'First Contact Resolution (FCR)',
      current: '78.5%',
      target: '> 70.0%',
      rate: 89.0,
      status: 'On Target',
      color: 'text-purple-600 bg-purple-500',
    },
    {
      metric: 'AI Auto-Triage Accuracy',
      current: '94.2%',
      target: '> 90.0%',
      rate: 94.2,
      status: 'Precision High',
      color: 'text-amber-600 bg-amber-500',
    },
  ];

  const breadcrumbs = [
    { label: 'Admin Overview', path: '/' },
    { label: 'Analytics' },
  ];

  return (
    <MainLayout
      breadcrumbs={breadcrumbs}
      title="Performance Analytics & SLA Monitoring"
      subtitle="Visual insights into ticket volumes, team resolution speed, and customer satisfaction."
      actions={
        <div className="flex items-center gap-1.5 bg-token-card border border-token-border p-1 rounded-[6px]">
          {[
            { id: '24h', label: '24h' },
            { id: '7d', label: 'Last 7 Days' },
            { id: '30d', label: '30 Days' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTimeRange(tab.id)}
              className={`px-2.5 py-1 rounded-[4px] text-xs font-medium transition-colors ${
                timeRange === tab.id
                  ? 'bg-token-accent text-white font-semibold shadow-xs'
                  : 'text-token-text-secondary hover:text-token-text-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      }
    >
      <div className="space-y-6">
        {/* 4 Essential Highlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card noPadding className="p-4 flex items-center justify-between border-l-4 border-l-emerald-500">
            <div>
              <div className="text-xs font-medium text-token-text-secondary">First Response SLA</div>
              <div className="text-2xl font-bold text-token-text-primary mt-1">98.4%</div>
              <div className="text-[11px] text-emerald-600 font-medium mt-0.5 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" /> +2.1% this week
              </div>
            </div>
            <div className="p-2.5 bg-emerald-500/10 rounded-[6px] text-emerald-600">
              <Zap className="w-5 h-5" />
            </div>
          </Card>

          <Card noPadding className="p-4 flex items-center justify-between border-l-4 border-l-blue-500">
            <div>
              <div className="text-xs font-medium text-token-text-secondary">Avg Resolution Time</div>
              <div className="text-2xl font-bold text-blue-600 mt-1">1.8 Hours</div>
              <div className="text-[11px] text-token-text-muted mt-0.5">Target: &lt; 4.0h</div>
            </div>
            <div className="p-2.5 bg-blue-500/10 rounded-[6px] text-blue-600">
              <Clock className="w-5 h-5" />
            </div>
          </Card>

          <Card noPadding className="p-4 flex items-center justify-between border-l-4 border-l-purple-500">
            <div>
              <div className="text-xs font-medium text-token-text-secondary">Customer CSAT</div>
              <div className="text-2xl font-bold text-purple-600 mt-1">4.85 / 5.0</div>
              <div className="text-[11px] text-purple-600 font-medium mt-0.5">97% Positive Feedback</div>
            </div>
            <div className="p-2.5 bg-purple-500/10 rounded-[6px] text-purple-600">
              <Smile className="w-5 h-5" />
            </div>
          </Card>

          <Card noPadding className="p-4 flex items-center justify-between border-l-4 border-l-amber-500">
            <div>
              <div className="text-xs font-medium text-token-text-secondary">AI Triage Precision</div>
              <div className="text-2xl font-bold text-amber-600 mt-1">94.2%</div>
              <div className="text-[11px] text-amber-600 font-medium mt-0.5">Gemini Decision Accuracy</div>
            </div>
            <div className="p-2.5 bg-amber-500/10 rounded-[6px] text-amber-600">
              <Bot className="w-5 h-5" />
            </div>
          </Card>
        </div>

        {/* 2-Column Visual Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Chart 1: Weekly Volume Bar Chart (Span 2) */}
          <Card
            className="lg:col-span-2"
            title={
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-token-accent" />
                <span>Ticket Inflow vs Resolved (Last 7 Days)</span>
              </div>
            }
            subtitle="Comparison between new incoming queries and completed tickets per day."
            actions={
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-token-text-secondary">
                  <span className="w-2.5 h-2.5 rounded-xs bg-blue-500 inline-block" /> Incoming
                </span>
                <span className="flex items-center gap-1.5 text-token-text-secondary">
                  <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500 inline-block" /> Resolved
                </span>
              </div>
            }
          >
            {/* Custom Interactive SVG / CSS Bar Chart */}
            <div className="pt-4 pb-2 space-y-4">
              <div className="h-52 flex items-end justify-between gap-2 sm:gap-4 px-2">
                {weeklyData.map((d) => {
                  const createdHeight = (d.created / maxDailyVolume) * 100;
                  const resolvedHeight = (d.resolved / maxDailyVolume) * 100;

                  return (
                    <div key={d.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <div className="w-full flex items-end justify-center gap-1 sm:gap-1.5 h-full">
                        {/* Created Bar */}
                        <div
                          style={{ height: `${createdHeight}%` }}
                          className="w-full max-w-[16px] bg-blue-500 rounded-t-xs transition-all duration-300 hover:bg-blue-600 relative group/bar"
                          title={`${d.day}: ${d.created} Created`}
                        >
                          <span className="opacity-0 group-hover/bar:opacity-100 transition-opacity absolute -top-6 left-1/2 -translate-x-1/2 bg-token-text-primary text-token-card text-[10px] font-bold px-1 py-0.5 rounded pointer-events-none z-10">
                            {d.created}
                          </span>
                        </div>

                        {/* Resolved Bar */}
                        <div
                          style={{ height: `${resolvedHeight}%` }}
                          className="w-full max-w-[16px] bg-emerald-500 rounded-t-xs transition-all duration-300 hover:bg-emerald-600 relative group/bar"
                          title={`${d.day}: ${d.resolved} Resolved`}
                        >
                          <span className="opacity-0 group-hover/bar:opacity-100 transition-opacity absolute -top-6 left-1/2 -translate-x-1/2 bg-token-text-primary text-token-card text-[10px] font-bold px-1 py-0.5 rounded pointer-events-none z-10">
                            {d.resolved}
                          </span>
                        </div>
                      </div>

                      {/* Day Label */}
                      <span className="text-xs font-semibold text-token-text-secondary">{d.day}</span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-token-border/60 flex items-center justify-between text-xs text-token-text-secondary">
                <span>Total Received: <strong className="text-token-text-primary">142 Tickets</strong></span>
                <span>Total Resolved: <strong className="text-emerald-600">139 Tickets (97.8%)</strong></span>
              </div>
            </div>
          </Card>

          {/* Chart 2: Department Distribution Ring/Donut Chart */}
          <Card
            title={
              <div className="flex items-center gap-2">
                <PieChart className="w-4 h-4 text-purple-600" />
                <span>Department Load</span>
              </div>
            }
            subtitle="Distribution of volume across teams."
          >
            <div className="space-y-4 pt-1">
              {/* Visual Ring Chart */}
              <div className="flex items-center justify-center py-2">
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    {/* SVG Ring Slices */}
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#E5E7EB" strokeWidth="4" className="dark:stroke-neutral-800" />
                    {/* Tech: 34% */}
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#3B82F6" strokeWidth="4" strokeDasharray="34 100" strokeDashoffset="0" />
                    {/* Finance: 26% */}
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#F59E0B" strokeWidth="4" strokeDasharray="26 100" strokeDashoffset="-34" />
                    {/* Security: 20% */}
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#8B5CF6" strokeWidth="4" strokeDasharray="20 100" strokeDashoffset="-60" />
                    {/* API: 20% */}
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#10B981" strokeWidth="4" strokeDasharray="20 100" strokeDashoffset="-80" />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-lg font-bold text-token-text-primary">140</span>
                    <span className="text-[10px] text-token-text-muted">Total Queries</span>
                  </div>
                </div>
              </div>

              {/* Department Legend */}
              <div className="space-y-2 pt-1 border-t border-token-border/60 text-xs">
                {departmentBreakdown.map((dept) => (
                  <div key={dept.name} className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-token-text-secondary">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: dept.color }} />
                      <span className="truncate">{dept.name}</span>
                    </span>
                    <span className="font-semibold text-token-text-primary">{dept.percent}%</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* 2-Column: Customer Sentiment & SLA Target Progress Meters */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Customer Sentiment Breakdown */}
          <Card
            title={
              <div className="flex items-center gap-2">
                <Smile className="w-4 h-4 text-emerald-600" />
                <span>AI Sentiment & Mood Distribution</span>
              </div>
            }
            subtitle="Analyzed emotional tone detected from customer message threads."
          >
            <div className="space-y-3 pt-2">
              {sentimentData.map((s) => (
                <div key={s.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-token-text-primary flex items-center gap-1.5">
                      <span>{s.icon}</span>
                      <span>{s.label}</span>
                    </span>
                    <span className="font-bold text-token-text-primary">{s.count}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-token-secondary overflow-hidden">
                    <div
                      className={`h-full rounded-full ${s.color} transition-all duration-500`}
                      style={{ width: `${s.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* SLA Performance Meters */}
          <Card
            title={
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-token-accent" />
                <span>SLA Compliance Targets</span>
              </div>
            }
            subtitle="Operational compliance rates against established enterprise SLAs."
          >
            <div className="space-y-3.5 pt-1">
              {slaMetrics.map((sla) => (
                <div key={sla.metric} className="p-3 bg-token-secondary/50 rounded-[6px] border border-token-border/60 flex items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <div className="font-semibold text-token-text-primary">{sla.metric}</div>
                    <div className="text-token-text-secondary text-[11px]">
                      Current: <strong className="text-token-text-primary">{sla.current}</strong> • Target: {sla.target}
                    </div>
                  </div>
                  <Badge variant="success" size="sm">
                    {sla.status} ({sla.rate}%)
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
