/**
 * Page: DepartmentsPage.jsx
 * Enterprise Department Routing & Automated AI Response Policies.
 */

import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import Card from '../components/common/Card';
import Table from '../components/common/Table';
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
  Database,
  Layers,
  ArrowRight
} from 'lucide-react';
import {
  getDepartmentRulesApi,
  evaluateDepartmentAutoReplyApi,
  getBenchmarksApi
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
      allowed_actions: ['System status health check', 'API error logs trace', 'Client version verification']
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
      allowed_actions: ['Payment gateway trace', 'Subscription status lookup', 'Invoice receipt dispatch']
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
      allowed_actions: ['User email verification', 'Automated reset token dispatch', 'MFA state check']
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
      allowed_actions: ['Rate limit capacity check', 'Webhook trace validation', 'Key scope verification']
    },
  ]);

  const [benchmarks, setBenchmarks] = useState(null);
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState('Finance & Billing');
  const [testTitle, setTestTitle] = useState('Duplicate subscription charge on invoice');
  const [testDesc, setTestDesc] = useState('I was billed twice ($1,200) for our enterprise annual plan. Please review and refund.');
  const [testCategory, setTestCategory] = useState('Billing');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    // Load live department definitions & benchmarks
    getDepartmentRulesApi().then(res => {
      if (res && res.data) {
        // Updated if backend returns custom definitions
      }
    });

    getBenchmarksApi().then(res => {
      if (res && res.data) {
        setBenchmarks(res.data);
      }
    });
  }, []);

  const handleTestAutoReply = async (e) => {
    e.preventDefault();
    setTesting(true);
    setTestResult(null);

    try {
      const res = await evaluateDepartmentAutoReplyApi({
        title: testTitle,
        description: testDesc,
        category: testCategory,
        departmentName: selectedDept
      });

      if (res && res.data) {
        setTestResult(res.data);
        addToast('Department auto-reply evaluated successfully', 'success');
      } else {
        addToast('Failed to evaluate auto-reply', 'error');
      }
    } catch (err) {
      addToast(err.message || 'Auto-reply evaluation failed', 'error');
    } finally {
      setTesting(false);
    }
  };

  const breadcrumbs = [
    { label: 'Dashboard', path: '/' },
    { label: 'Departments & Auto-Reply Rules' },
  ];

  return (
    <MainLayout
      breadcrumbs={breadcrumbs}
      title="Departments & Automated Response Policies"
      subtitle="Configure department-level automated replies, SLA rules, and Kaggle/HuggingFace benchmark integration."
    >
      <div className="space-y-6">
        {/* Top Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-token-surface p-4 rounded-xl border border-token-border shadow-sm">
          <div>
            <h3 className="font-semibold text-token-text-primary flex items-center gap-2">
              <Bot className="w-5 h-5 text-token-accent" />
              Automated Response Engine (HITL Governed)
            </h3>
            <p className="text-xs text-token-text-secondary mt-0.5">
              Gemini evaluates incoming tickets against department rules to trigger immediate confirmations and automated verification tasks.
            </p>
          </div>
          <Button
            variant="primary"
            icon={Sparkles}
            onClick={() => {
              setTestResult(null);
              setTestModalOpen(true);
            }}
          >
            Test Department Auto-Reply
          </Button>
        </div>

        {/* Department Rules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {departments.map((dept) => (
            <Card key={dept.id} className="relative overflow-hidden border-token-border hover:border-token-accent/40 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-token-accent/10 text-token-accent">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-token-text-primary">{dept.name}</h4>
                    <p className="text-xs text-token-text-secondary">Lead: {dept.lead} • {dept.active_agents} Agents</p>
                  </div>
                </div>
                <Badge variant={dept.auto_reply_enabled ? 'success' : 'default'}>
                  <Zap className="w-3 h-3 mr-1" />
                  {dept.auto_reply_enabled ? 'Auto-Reply Active' : 'Manual Triage'}
                </Badge>
              </div>

              {/* Category tags */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-token-text-secondary font-medium">Handled Categories:</span>
                  {dept.categories.map((c) => (
                    <span key={c} className="px-2 py-0.5 rounded bg-token-bg-subtle text-token-text-primary font-mono text-[11px]">
                      {c}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-token-border/60">
                  <div className="flex items-center gap-1.5 text-token-text-secondary">
                    <Clock className="w-3.5 h-3.5 text-token-accent" />
                    <span>Target SLA: <strong className="text-token-text-primary">{dept.target_sla}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-token-text-secondary">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Min Confidence: <strong className="text-token-text-primary">{dept.min_confidence}</strong></span>
                  </div>
                </div>

                {/* Automated Actions */}
                <div className="pt-2 border-t border-token-border/60">
                  <span className="text-token-text-secondary block mb-1 font-medium">Automated Trigger Actions:</span>
                  <ul className="space-y-1 pl-1">
                    {dept.allowed_actions.map((act, i) => (
                      <li key={i} className="flex items-center gap-1.5 text-token-text-secondary text-[11px]">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Dataset Benchmarks Card */}
        <Card title="Kaggle & HuggingFace Dataset Benchmarks">
          <div className="text-xs text-token-text-secondary space-y-3">
            <p>
              Gemini models in SupportSense AI reference local Kaggle historical tickets and Hugging Face streaming samples to ground duration estimates and checklist suggestions.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div className="p-3 rounded-lg bg-token-bg-subtle border border-token-border/60">
                <span className="text-[11px] text-token-text-secondary block">Billing Avg SLA</span>
                <span className="text-sm font-bold text-token-text-primary">1-2 Business Days</span>
                <span className="text-[10px] text-emerald-500 block mt-0.5">High Urgency Benchmark</span>
              </div>
              <div className="p-3 rounded-lg bg-token-bg-subtle border border-token-border/60">
                <span className="text-[11px] text-token-text-secondary block">Technical Support SLA</span>
                <span className="text-sm font-bold text-token-text-primary">2-3 Business Days</span>
                <span className="text-[10px] text-blue-500 block mt-0.5">Telemetry Trace Active</span>
              </div>
              <div className="p-3 rounded-lg bg-token-bg-subtle border border-token-border/60">
                <span className="text-[11px] text-token-text-secondary block">Identity & Access SLA</span>
                <span className="text-sm font-bold text-token-text-primary">4-12 Hours</span>
                <span className="text-[10px] text-purple-500 block mt-0.5">SSO / MFA Priority</span>
              </div>
              <div className="p-3 rounded-lg bg-token-bg-subtle border border-token-border/60">
                <span className="text-[11px] text-token-text-secondary block">Bug Investigation SLA</span>
                <span className="text-sm font-bold text-token-text-primary">3-5 Business Days</span>
                <span className="text-[10px] text-amber-500 block mt-0.5">Engineering Escalation</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Test Auto-Reply Modal */}
      <Modal
        isOpen={testModalOpen}
        onClose={() => setTestModalOpen(false)}
        title="Simulate Department Auto-Reply"
        size="lg"
      >
        <form onSubmit={handleTestAutoReply} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              label="Ticket Category"
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
            label="Ticket Subject"
            value={testTitle}
            onChange={(e) => setTestTitle(e.target.value)}
            required
          />

          <Textarea
            label="Ticket Description"
            value={testDesc}
            onChange={(e) => setTestDesc(e.target.value)}
            rows={3}
            required
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setTestModalOpen(false)}>
              Close
            </Button>
            <Button type="submit" variant="primary" loading={testing} icon={Zap}>
              Evaluate & Generate Auto-Reply
            </Button>
          </div>

          {/* Test Result Display */}
          {testResult && (
            <div className="mt-4 p-4 rounded-xl bg-token-bg-subtle border border-token-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-token-text-primary flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-token-accent" />
                  Auto-Reply Decision ({testResult.target_department})
                </span>
                <Badge variant={testResult.should_auto_reply ? 'success' : 'warning'}>
                  {testResult.should_auto_reply ? 'Eligible for Auto-Reply' : 'Human Review Required'} ({(testResult.confidence_score * 100).toFixed(0)}%)
                </Badge>
              </div>

              <div>
                <span className="text-token-text-secondary block font-medium mb-1">Generated Department Response:</span>
                <div className="p-3 rounded-lg bg-token-surface border border-token-border text-token-text-primary leading-relaxed font-sans">
                  {testResult.automated_reply_body}
                </div>
              </div>

              {testResult.actions_triggered && testResult.actions_triggered.length > 0 && (
                <div>
                  <span className="text-token-text-secondary block font-medium mb-1">Triggered Automation Tasks:</span>
                  <ul className="space-y-1">
                    {testResult.actions_triggered.map((act, i) => (
                      <li key={i} className="flex items-center gap-1.5 text-token-text-secondary">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </form>
      </Modal>
    </MainLayout>
  );
}
