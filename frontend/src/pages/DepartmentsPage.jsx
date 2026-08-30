/**
 * Page: DepartmentsPage.jsx
 * Department Routing & Automated AI Response Policies.
 * Simplified with visual capacity charts and streamlined routing settings.
 */

import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Textarea from '../components/common/Textarea';
import Dropdown from '../components/common/Dropdown';
import Modal from '../components/common/Modal';
import { useToast } from '../context/ToastContext';
import {
  Building2,
  Bot,
  Zap,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Sparkles,
  Users,
  BarChart3,
  ArrowRight,
} from 'lucide-react';
import {
  getDepartmentRulesApi,
  evaluateDepartmentAutoReplyApi,
} from '../services/api';

export default function DepartmentsPage() {
  const { addToast } = useToast();
  const [departments, setDepartments] = useState([
    {
      id: 'dept-1',
      name: 'Technical Support',
      lead: 'Marcus Vance',
      active_agents: 6,
      open_tickets: 4,
      categories: ['Technical', 'Bug', 'Hardware', 'Performance'],
      auto_reply_enabled: true,
      min_confidence: '80%',
      target_sla: '8 Hours',
    },
    {
      id: 'dept-2',
      name: 'Finance & Billing',
      lead: 'Elena Rostova',
      active_agents: 4,
      open_tickets: 2,
      categories: ['Billing', 'Refund', 'Invoice', 'Subscription'],
      auto_reply_enabled: true,
      min_confidence: '85%',
      target_sla: '4 Hours',
    },
    {
      id: 'dept-3',
      name: 'Identity & Access',
      lead: 'Devon Miles',
      active_agents: 8,
      open_tickets: 1,
      categories: ['Account', 'Login', 'SSO', 'Password'],
      auto_reply_enabled: true,
      min_confidence: '90%',
      target_sla: '2 Hours',
    },
    {
      id: 'dept-4',
      name: 'API Platform Team',
      lead: 'Sarah Agent',
      active_agents: 12,
      open_tickets: 5,
      categories: ['API Platform', 'Rate Limit', 'Webhook', 'SDK'],
      auto_reply_enabled: true,
      min_confidence: '85%',
      target_sla: '6 Hours',
    },
  ]);

  const [testModalOpen, setTestModalOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState('Finance & Billing');
  const [testTitle, setTestTitle] = useState('Duplicate subscription charge on invoice');
  const [testDesc, setTestDesc] = useState('I was billed twice ($1,200) for our enterprise annual plan. Please review and refund.');
  const [testCategory, setTestCategory] = useState('Billing');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const handleTestAutoReply = async (e) => {
    e.preventDefault();
    setTesting(true);
    setTestResult(null);

    try {
      const res = await evaluateDepartmentAutoReplyApi({
        title: testTitle,
        description: testDesc,
        category: testCategory,
        departmentName: selectedDept,
      });

      if (res && res.data) {
        setTestResult(res.data);
        addToast('Auto-reply policy evaluated successfully', 'success');
      } else {
        addToast('Failed to evaluate auto-reply', 'error');
      }
    } catch (err) {
      addToast(err.message || 'Evaluation failed', 'error');
    } finally {
      setTesting(false);
    }
  };

  const breadcrumbs = [
    { label: 'Admin Overview', path: '/' },
    { label: 'Departments' },
  ];

  return (
    <MainLayout
      breadcrumbs={breadcrumbs}
      title="Departments & Routing Policies"
      subtitle="Manage cross-department triage rules, agent capacities, and automated routing thresholds."
      actions={
        <Button
          variant="primary"
          icon={Sparkles}
          onClick={() => {
            setTestResult(null);
            setTestModalOpen(true);
          }}
        >
          Test Auto-Reply AI
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Department Workload & Capacity Visual Chart */}
        <Card
          title={
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-token-accent" />
              <span>Department Workload & Staffing Capacity</span>
            </div>
          }
          subtitle="Real-time ratio of active tickets to available support engineers."
        >
          <div className="space-y-4 pt-2">
            {departments.map((dept) => {
              const maxScale = 15;
              const agentPct = (dept.active_agents / maxScale) * 100;
              const ticketPct = (dept.open_tickets / maxScale) * 100;

              return (
                <div key={dept.id} className="p-3 bg-token-secondary/40 rounded-[6px] border border-token-border/60 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                    <div className="font-semibold text-token-text-primary flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-token-accent" />
                      <span>{dept.name}</span>
                      <span className="text-[11px] text-token-text-muted font-normal">Lead: {dept.lead}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px]">
                      <span>Agents: <strong className="text-token-text-primary">{dept.active_agents}</strong></span>
                      <span>•</span>
                      <span>Active Tickets: <strong className="text-token-accent">{dept.open_tickets}</strong></span>
                      <span>•</span>
                      <span className="text-emerald-600 font-medium">{dept.target_sla} SLA</span>
                    </div>
                  </div>

                  {/* Dual Bar (Agents vs Tickets) */}
                  <div className="space-y-1">
                    <div className="w-full h-2 rounded-full bg-token-card overflow-hidden flex">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${agentPct}%` }}
                        title={`${dept.active_agents} Agents`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* 4 Clean Department Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {departments.map((dept) => (
            <Card key={dept.id} className="border-token-border hover:border-token-accent/40 transition-colors">
              <div className="flex items-start justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-[6px] bg-blue-500/10 text-token-accent">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-token-text-primary text-xs">{dept.name}</h4>
                    <p className="text-[11px] text-token-text-secondary">Lead: {dept.lead} • {dept.active_agents} Agents</p>
                  </div>
                </div>
                <Badge variant={dept.auto_reply_enabled ? 'success' : 'default'} size="sm">
                  <Zap className="w-3 h-3 mr-1" />
                  {dept.auto_reply_enabled ? 'Active' : 'Manual'}
                </Badge>
              </div>

              {/* Handled Categories */}
              <div className="space-y-2 pt-2 border-t border-token-border/60 text-xs">
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="text-token-text-secondary text-[11px]">Categories:</span>
                  {dept.categories.map((c) => (
                    <span key={c} className="px-1.5 py-0.2 rounded bg-token-secondary text-token-text-primary text-[10px] font-mono border border-token-border/60">
                      {c}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-[11px] text-token-text-secondary pt-1">
                  <span>Target SLA: <strong className="text-token-text-primary">{dept.target_sla}</strong></span>
                  <span>Min AI Confidence: <strong className="text-emerald-600">{dept.min_confidence}</strong></span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Test Auto-Reply Modal */}
      <Modal
        isOpen={testModalOpen}
        onClose={() => setTestModalOpen(false)}
        title="Simulate Department Auto-Reply"
        size="md"
      >
        <form onSubmit={handleTestAutoReply} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <Dropdown
              label="Target Department"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              options={[
                { label: 'Finance & Billing', value: 'Finance & Billing' },
                { label: 'Technical Support', value: 'Technical Support' },
                { label: 'Identity & Access', value: 'Identity & Access' },
                { label: 'API Platform Team', value: 'API Platform Team' },
              ]}
            />
            <Dropdown
              label="Category"
              value={testCategory}
              onChange={(e) => setTestCategory(e.target.value)}
              options={[
                { label: 'Billing', value: 'Billing' },
                { label: 'Technical', value: 'Technical' },
                { label: 'Account', value: 'Account' },
                { label: 'Bug', value: 'Bug' },
                { label: 'API Platform', value: 'API Platform' },
              ]}
            />
          </div>

          <Input
            label="Inquiry Subject"
            value={testTitle}
            onChange={(e) => setTestTitle(e.target.value)}
            required
          />

          <Textarea
            label="Customer Message"
            value={testDesc}
            onChange={(e) => setTestDesc(e.target.value)}
            rows={3}
            required
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-token-border">
            <Button variant="secondary" onClick={() => setTestModalOpen(false)}>
              Close
            </Button>
            <Button type="submit" variant="primary" loading={testing} icon={Zap}>
              Evaluate Auto-Reply
            </Button>
          </div>

          {/* Test Result Display */}
          {testResult && (
            <div className="mt-3 p-3.5 rounded-[6px] bg-token-secondary border border-token-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-token-text-primary text-xs flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-token-accent" />
                  Routing Outcome
                </span>
                <Badge variant={testResult.should_auto_reply ? 'success' : 'warning'} size="sm">
                  {testResult.should_auto_reply ? 'Eligible for Auto-Reply' : 'Human Review Required'} ({(testResult.confidence_score * 100).toFixed(0)}%)
                </Badge>
              </div>

              <div className="p-2.5 rounded bg-token-card border border-token-border/60 text-token-text-primary text-[11px] leading-relaxed">
                {testResult.automated_reply_body}
              </div>
            </div>
          )}
        </form>
      </Modal>
    </MainLayout>
  );
}
