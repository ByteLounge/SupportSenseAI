/**
 * Page: DashboardPage.jsx
 * Role-adaptive Enterprise Dashboard with tailored UI/UX for Customer, Agent, and Admin personas.
 */

import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import Card from '../components/common/Card';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Dropdown from '../components/common/Dropdown';
import Badge, { StatusBadge, PriorityBadge } from '../components/common/Badge';
import AIMoodBadge from '../components/ai/AIMoodBadge';
import Modal from '../components/common/Modal';
import Textarea from '../components/common/Textarea';
import { getTicketsApi, getFaqsApi, forwardTicketApi, modifyTicketApi } from '../services/api';
import { formatDate } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Link, useNavigate } from 'react-router-dom';
import {
  Ticket,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Search,
  ArrowRight,
  Bot,
  Building2,
  Sparkles,
  Shield,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Send,
  Zap,
  Layers,
  ArrowRightLeft,
  Users,
  BarChart3,
  Edit,
  Check,
} from 'lucide-react';

export default function DashboardPage() {
  const { user, isCustomer, isAgent, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [tickets, setTickets] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('');

  // Customer FAQ Search & Accordion
  const [faqSearch, setFaqSearch] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

  // Agent Quick Forward Modal
  const [forwardModalOpen, setForwardModalOpen] = useState(false);
  const [selectedTicketForForward, setSelectedTicketForForward] = useState(null);
  const [forwardDept, setForwardDept] = useState('Finance & Billing');
  const [forwardComments, setForwardComments] = useState('');
  const [forwarding, setForwarding] = useState(false);

  // Admin Quick Edit Modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    category: '',
    priority: '',
    status: '',
    assigned_department: '',
  });
  const [savingEdit, setSavingEdit] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await getTicketsApi({
        status: statusFilter,
        department: selectedDeptFilter,
        search: searchQuery,
      });
      setTickets(res.data || []);

      if (isCustomer) {
        const faqRes = await getFaqsApi();
        setFaqs(faqRes.data || []);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      addToast('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user, statusFilter, selectedDeptFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDashboardData();
  };

  // Agent 1-click Approve AI Routing
  const handleApproveRouting = async (ticket) => {
    try {
      await forwardTicketApi(ticket.id, {
        targetDepartment: ticket.ai_suggested_department || 'Technical Support',
        comments: 'Agent verified and approved Gemini AI automated department routing.',
      });
      addToast(`Approved AI routing to ${ticket.ai_suggested_department || 'Technical Support'}`, 'success');
      fetchDashboardData();
    } catch (err) {
      addToast('Failed to approve routing', 'error');
    }
  };

  // Agent Quick Forward Submit
  const handleForwardSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTicketForForward) return;
    setForwarding(true);
    try {
      await forwardTicketApi(selectedTicketForForward.id, {
        targetDepartment: forwardDept,
        comments: forwardComments,
      });
      addToast(`Ticket ${selectedTicketForForward.ticket_number} forwarded to ${forwardDept}`, 'success');
      setForwardModalOpen(false);
      fetchDashboardData();
    } catch (err) {
      addToast('Failed to forward ticket', 'error');
    } finally {
      setForwarding(false);
    }
  };

  // Admin Quick Edit Save
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingTicket) return;
    setSavingEdit(true);
    try {
      await modifyTicketApi(editingTicket.id, editForm);
      addToast(`Ticket ${editingTicket.ticket_number} attributes modified successfully`, 'success');
      setEditModalOpen(false);
      fetchDashboardData();
    } catch (err) {
      addToast('Failed to modify ticket', 'error');
    } finally {
      setSavingEdit(false);
    }
  };

  // KPI Calculations
  const totalCount = tickets.length;
  const openCount = tickets.filter((t) => t.status === 'OPEN').length;
  const inProgressCount = tickets.filter((t) => t.status === 'IN_PROGRESS' || t.status === 'PENDING').length;
  const resolvedCount = tickets.filter((t) => t.status === 'RESOLVED' || t.status === 'CLOSED').length;
  const unapprovedAiCount = tickets.filter((t) => !t.ai_routing_approved && t.status !== 'RESOLVED').length;
  const forwardedCount = tickets.filter((t) => t.forward_history && t.forward_history.length > 0).length;

  // Filtered FAQs for Customer
  const filteredFaqs = faqs.filter(
    (f) =>
      !faqSearch ||
      f.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
      f.answer.toLowerCase().includes(faqSearch.toLowerCase()) ||
      f.category.toLowerCase().includes(faqSearch.toLowerCase())
  );

  // -------------------------------------------------------------
  // 1. CUSTOMER DASHBOARD VIEW
  // -------------------------------------------------------------
  if (isCustomer) {
    const customerColumns = [
      {
        key: 'ticket_number',
        label: 'Query ID',
        width: '110px',
        render: (val, row) => (
          <span className="font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            {val || row.id}
          </span>
        ),
      },
      {
        key: 'title',
        label: 'Inquiry Subject',
        render: (val, row) => (
          <div>
            <Link
              to={`/tickets/${row.id}`}
              className="font-medium text-token-text-primary hover:text-emerald-600 transition-colors"
            >
              {val}
            </Link>
            <div className="text-[11px] text-token-text-secondary mt-0.5">
              Category: <span className="font-medium text-token-text-primary">{row.category}</span>
            </div>
          </div>
        ),
      },
      {
        key: 'status',
        label: 'Status',
        width: '130px',
        render: (val) => <StatusBadge status={val} />,
      },
      {
        key: 'created_at',
        label: 'Date Submitted',
        width: '140px',
        render: (val) => <span className="text-xs text-token-text-secondary">{formatDate(val)}</span>,
      },
      {
        key: 'actions',
        label: '',
        width: '100px',
        align: 'right',
        render: (_, row) => (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate(`/tickets/${row.id}`)}
          >
            Track Status
          </Button>
        ),
      },
    ];

    return (
      <MainLayout
        title={`Welcome, ${user?.name || 'Customer'}`}
        subtitle="Manage your support requests, track ticket status, and browse self-service FAQs."
        actions={
          <Button variant="primary" icon={Plus} onClick={() => navigate('/tickets/new')}>
            Submit Support Query
          </Button>
        }
      >
        <div className="space-y-6">
          {/* Customer Welcome & Quick Action Banner */}
          <div className="p-5 rounded-xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="success">Customer Portal</Badge>
                <span className="text-xs text-token-text-secondary">{user?.department || 'Acme Corp'}</span>
              </div>
              <h2 className="text-base font-semibold text-token-text-primary mt-1">
                How can our support engineering team help you today?
              </h2>
              <p className="text-xs text-token-text-secondary mt-0.5">
                Submit a new inquiry for fast automated triage or search our instant solutions below.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                icon={Plus}
                onClick={() => navigate('/tickets/new')}
              >
                Raise New Ticket
              </Button>
              <Button
                variant="secondary"
                icon={HelpCircle}
                onClick={() => navigate('/knowledge-base')}
              >
                Help Center
              </Button>
            </div>
          </div>

          {/* 3 Customer Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card noPadding className="p-4 flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-token-text-secondary">My Active Queries</div>
                <div className="text-2xl font-bold text-token-text-primary mt-1">{openCount}</div>
              </div>
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-[6px] text-emerald-600">
                <Ticket className="w-5 h-5" />
              </div>
            </Card>

            <Card noPadding className="p-4 flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-token-text-secondary">Under Investigation</div>
                <div className="text-2xl font-bold text-token-warning mt-1">{inProgressCount}</div>
              </div>
              <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-[6px] text-token-warning">
                <Clock className="w-5 h-5" />
              </div>
            </Card>

            <Card noPadding className="p-4 flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-token-text-secondary">Resolved Issues</div>
                <div className="text-2xl font-bold text-token-success mt-1">{resolvedCount}</div>
              </div>
              <div className="p-2.5 bg-green-500/10 border border-green-500/30 rounded-[6px] text-token-success">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </Card>
          </div>

          {/* Customer Self-Serve FAQ Accordion */}
          <Card
            title="Instant Self-Service Solutions"
            subtitle="Search common questions to resolve your issue immediately without waiting."
            actions={
              <Link to="/knowledge-base" className="text-xs text-emerald-600 font-medium hover:underline flex items-center gap-1">
                View All FAQs <ArrowRight className="w-3 h-3" />
              </Link>
            }
          >
            <div className="space-y-3">
              <Input
                placeholder="Search FAQs by keywords (e.g., refund, SAML, rate limit, invoice)..."
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                icon={Search}
              />

              <div className="space-y-2 pt-1">
                {filteredFaqs.slice(0, 4).map((faq) => {
                  const isOpen = expandedFaq === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className="border border-token-border rounded-[6px] overflow-hidden bg-token-secondary/40 transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedFaq(isOpen ? null : faq.id)}
                        className="w-full p-3 text-left text-xs font-semibold text-token-text-primary flex items-center justify-between hover:bg-token-muted"
                      >
                        <span className="flex items-center gap-2">
                          <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{faq.question}</span>
                        </span>
                        {isOpen ? <ChevronUp className="w-4 h-4 text-token-text-muted" /> : <ChevronDown className="w-4 h-4 text-token-text-muted" />}
                      </button>
                      {isOpen && (
                        <div className="p-3 pt-0 text-xs text-token-text-secondary leading-relaxed border-t border-token-border/40 bg-token-card">
                          <p className="mt-2">{faq.answer}</p>
                          <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] text-token-text-muted">Category: {faq.category}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* My Recent Support Tickets */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-token-text-primary flex items-center gap-2">
                <Ticket className="w-4 h-4 text-emerald-600" />
                My Support Inquiries ({tickets.length})
              </h3>
              <Link to="/tickets" className="text-xs text-emerald-600 hover:underline font-medium flex items-center gap-1">
                View All My Tickets <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <Table
              columns={customerColumns}
              data={tickets.slice(0, 5)}
              loading={loading}
              keyField="id"
              emptyMessage="You have not submitted any support tickets yet."
            />
          </div>
        </div>
      </MainLayout>
    );
  }

  // -------------------------------------------------------------
  // 2. AGENT DASHBOARD VIEW (AI Triage & Department Routing)
  // -------------------------------------------------------------
  if (isAgent) {
    const unapprovedTickets = tickets.filter((t) => !t.ai_routing_approved && t.status !== 'RESOLVED');

    const agentColumns = [
      {
        key: 'ticket_number',
        label: 'ID',
        width: '95px',
        render: (val, row) => (
          <span className="font-mono text-xs font-semibold text-token-accent">
            {val || row.id}
          </span>
        ),
      },
      {
        key: 'title',
        label: 'Customer Inquiry',
        render: (val, row) => (
          <div>
            <Link
              to={`/tickets/${row.id}`}
              className="font-medium text-token-text-primary hover:text-token-accent transition-colors"
            >
              {val}
            </Link>
            <div className="text-xs text-token-text-secondary mt-0.5 flex items-center gap-2">
              <span>Customer: <strong>{row.customer_name}</strong></span>
              <span>•</span>
              <span className="text-token-accent font-medium">{row.assigned_department || 'Unassigned'}</span>
            </div>
          </div>
        ),
      },
      {
        key: 'customer_mood',
        label: 'AI Mood',
        width: '130px',
        render: (_, row) => (
          <AIMoodBadge
            mood={row.customer_mood || 'NEUTRAL'}
            confidence={row.mood_confidence || 0.88}
          />
        ),
      },
      {
        key: 'priority',
        label: 'Priority',
        width: '90px',
        render: (val) => <PriorityBadge priority={val} />,
      },
      {
        key: 'status',
        label: 'Status',
        width: '110px',
        render: (val) => <StatusBadge status={val} />,
      },
      {
        key: 'actions',
        label: '',
        width: '140px',
        align: 'right',
        render: (_, row) => (
          <div className="flex items-center justify-end gap-1.5">
            <Button
              variant="secondary"
              size="sm"
              icon={ArrowRightLeft}
              onClick={() => {
                setSelectedTicketForForward(row);
                setForwardDept(row.ai_suggested_department || 'Technical Support');
                setForwardComments('');
                setForwardModalOpen(true);
              }}
              title="Forward to Department"
            >
              Route
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(`/tickets/${row.id}`)}
            >
              Triage
            </Button>
          </div>
        ),
      },
    ];

    return (
      <MainLayout
        title="Agent Triage & Department Routing Cockpit"
        subtitle="Review automated AI categorization, approve department routing, and resolve customer tickets."
        actions={
          <Button variant="primary" icon={Plus} onClick={() => navigate('/tickets/new')}>
            New Ticket
          </Button>
        }
      >
        <div className="space-y-6">
          {/* Agent 4 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card noPadding className="p-4 flex items-center justify-between border-l-4 border-l-blue-600">
              <div>
                <div className="text-xs font-medium text-token-text-secondary">Queue Tickets</div>
                <div className="text-xl font-bold text-token-text-primary mt-1">{totalCount}</div>
              </div>
              <div className="p-2 bg-blue-500/10 border border-blue-500/30 rounded-[6px] text-token-accent">
                <Ticket className="w-5 h-5" />
              </div>
            </Card>

            <Card noPadding className="p-4 flex items-center justify-between border-l-4 border-l-amber-500">
              <div>
                <div className="text-xs font-medium text-token-text-secondary">Needs AI Approval</div>
                <div className="text-xl font-bold text-amber-600 mt-1">{unapprovedAiCount}</div>
              </div>
              <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-[6px] text-amber-600">
                <Bot className="w-5 h-5" />
              </div>
            </Card>

            <Card noPadding className="p-4 flex items-center justify-between border-l-4 border-l-purple-500">
              <div>
                <div className="text-xs font-medium text-token-text-secondary">In Progress</div>
                <div className="text-xl font-bold text-purple-600 mt-1">{inProgressCount}</div>
              </div>
              <div className="p-2 bg-purple-500/10 border border-purple-500/30 rounded-[6px] text-purple-600">
                <Clock className="w-5 h-5" />
              </div>
            </Card>

            <Card noPadding className="p-4 flex items-center justify-between border-l-4 border-l-emerald-500">
              <div>
                <div className="text-xs font-medium text-token-text-secondary">Resolved SLA</div>
                <div className="text-xl font-bold text-emerald-600 mt-1">{resolvedCount} (98.4%)</div>
              </div>
              <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-[6px] text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </Card>
          </div>

          {/* AI Triage & Routing Approval Banner */}
          {unapprovedTickets.length > 0 && (
            <Card
              className="border-amber-500/40 bg-amber-500/5"
              title={
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                  <Bot className="w-5 h-5 text-amber-600 animate-pulse" />
                  <span>AI Automated Triage Queue ({unapprovedTickets.length} Awaiting Approval)</span>
                </div>
              }
              subtitle="Gemini has automatically categorized these tickets. Approve recommended routing with 1 click or forward to custom department."
            >
              <div className="space-y-3">
                {unapprovedTickets.map((t) => (
                  <div
                    key={t.id}
                    className="p-3.5 bg-token-card border border-token-border rounded-[6px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-token-accent">{t.ticket_number}</span>
                        <span className="font-semibold text-token-text-primary text-xs">{t.title}</span>
                        <PriorityBadge priority={t.priority} />
                      </div>
                      <div className="text-xs text-token-text-secondary flex items-center gap-2 flex-wrap">
                        <span>Customer: <strong>{t.customer_name}</strong></span>
                        <span>•</span>
                        <span>AI Suggested Category: <strong className="text-token-text-primary">{t.ai_suggested_category || t.category}</strong></span>
                        <span>•</span>
                        <span>AI Target Department: <strong className="text-blue-600 font-semibold">{t.ai_suggested_department || 'Technical Support'}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="success"
                        size="sm"
                        icon={Check}
                        onClick={() => handleApproveRouting(t)}
                      >
                        Approve AI Route
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={ArrowRightLeft}
                        onClick={() => {
                          setSelectedTicketForForward(t);
                          setForwardDept(t.ai_suggested_department || 'Technical Support');
                          setForwardComments('');
                          setForwardModalOpen(true);
                        }}
                      >
                        Forward with Note
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Department Filter Tabs & Search */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              {/* Department Tabs */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { label: 'All Queue', val: '' },
                  { label: 'Technical Support', val: 'Technical Support' },
                  { label: 'Finance & Billing', val: 'Finance & Billing' },
                  { label: 'Identity & Access', val: 'Identity & Access' },
                  { label: 'API Platform', val: 'API Platform Team' },
                ].map((tab) => (
                  <button
                    key={tab.val}
                    onClick={() => setSelectedDeptFilter(tab.val)}
                    className={`px-3 py-1.5 rounded-[6px] text-xs font-medium transition-colors ${
                      selectedDeptFilter === tab.val
                        ? 'bg-blue-600 text-white font-semibold shadow-xs'
                        : 'bg-token-card border border-token-border text-token-text-secondary hover:bg-token-muted'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSearchSubmit} className="w-full sm:w-64">
                <Input
                  placeholder="Search queue..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={Search}
                />
              </form>
            </div>

            {/* Queue Table */}
            <Table
              columns={agentColumns}
              data={tickets}
              loading={loading}
              keyField="id"
              emptyMessage="No tickets found matching the selected filter."
            />
          </div>
        </div>

        {/* Forward Ticket Modal */}
        <Modal
          isOpen={forwardModalOpen}
          onClose={() => setForwardModalOpen(false)}
          title={`Forward Ticket ${selectedTicketForForward?.ticket_number || ''} to Department`}
          size="md"
        >
          <form onSubmit={handleForwardSubmit} className="space-y-4 text-xs">
            <div className="p-3 bg-token-secondary rounded-[6px] border border-token-border space-y-1">
              <div className="font-semibold text-token-text-primary">{selectedTicketForForward?.title}</div>
              <div className="text-token-text-secondary">Customer: {selectedTicketForForward?.customer_name} ({selectedTicketForForward?.customer_email})</div>
            </div>

            <Dropdown
              label="Select Target Department"
              value={forwardDept}
              onChange={(e) => setForwardDept(e.target.value)}
              options={[
                { label: 'Technical Support', value: 'Technical Support' },
                { label: 'Finance & Billing', value: 'Finance & Billing' },
                { label: 'Identity & Access', value: 'Identity & Access' },
                { label: 'API Platform Team', value: 'API Platform Team' },
              ]}
              required
            />

            <Textarea
              label="Handover Comments / Notes (Internal)"
              placeholder="Add details for the department specialist (e.g., 'Verified customer transaction ID, customer requesting refund under SLA')..."
              rows={3}
              value={forwardComments}
              onChange={(e) => setForwardComments(e.target.value)}
            />

            <div className="flex justify-end gap-2 pt-2 border-t border-token-border">
              <Button variant="secondary" onClick={() => setForwardModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={forwarding} icon={Send}>
                Forward & Notify Department
              </Button>
            </div>
          </form>
        </Modal>
      </MainLayout>
    );
  }

  // -------------------------------------------------------------
  // 3. ADMIN DASHBOARD VIEW (Full Accessibility & Governance)
  // -------------------------------------------------------------
  const adminColumns = [
    {
      key: 'ticket_number',
      label: 'ID',
      width: '95px',
      render: (val, row) => (
        <span className="font-mono text-xs font-semibold text-purple-600 dark:text-purple-400">
          {val || row.id}
        </span>
      ),
    },
    {
      key: 'title',
      label: 'Subject / Title',
      render: (val, row) => (
        <div>
          <Link
            to={`/tickets/${row.id}`}
            className="font-medium text-token-text-primary hover:text-purple-600 transition-colors"
          >
            {val}
          </Link>
          <div className="text-xs text-token-text-secondary mt-0.5 flex items-center gap-2">
            <span>Customer: <strong>{row.customer_name}</strong></span>
            <span>•</span>
            <span className="text-purple-600 font-medium">Dept: {row.assigned_department}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'priority',
      label: 'Priority',
      width: '90px',
      render: (val) => <PriorityBadge priority={val} />,
    },
    {
      key: 'status',
      label: 'Status',
      width: '110px',
      render: (val) => <StatusBadge status={val} />,
    },
    {
      key: 'created_at',
      label: 'Created',
      width: '130px',
      render: (val) => <span className="text-xs text-token-text-secondary">{formatDate(val)}</span>,
    },
    {
      key: 'actions',
      label: 'Admin Control',
      width: '170px',
      align: 'right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            variant="secondary"
            size="sm"
            icon={Edit}
            onClick={() => {
              setEditingTicket(row);
              setEditForm({
                title: row.title,
                category: row.category,
                priority: row.priority,
                status: row.status,
                assigned_department: row.assigned_department,
              });
              setEditModalOpen(true);
            }}
            title="Modify Ticket Attributes"
          >
            Edit
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={ArrowRightLeft}
            onClick={() => {
              setSelectedTicketForForward(row);
              setForwardDept(row.assigned_department || 'Technical Support');
              setForwardComments('');
              setForwardModalOpen(true);
            }}
            title="Re-route Department"
          >
            Route
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(`/tickets/${row.id}`)}
          >
            View
          </Button>
        </div>
      ),
    },
  ];

  return (
    <MainLayout
      title="Enterprise Support Command Center"
      subtitle="Full operational oversight: manage cross-department ticket streams, enforce SLA policies, and modify ticket properties."
      actions={
        <div className="flex items-center gap-2">
          <Button variant="secondary" icon={Users} onClick={() => navigate('/users')}>
            Manage Users
          </Button>
          <Button variant="primary" icon={Plus} onClick={() => navigate('/tickets/new')}>
            Create Ticket
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Admin System KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card noPadding className="p-4 flex items-center justify-between border-l-4 border-l-purple-600">
            <div>
              <div className="text-xs font-medium text-token-text-secondary">Master Tickets Count</div>
              <div className="text-xl font-bold text-token-text-primary mt-1">{totalCount}</div>
              <div className="text-[10px] text-token-text-muted mt-0.5">All customer & agent tickets</div>
            </div>
            <div className="p-2 bg-purple-500/10 border border-purple-500/30 rounded-[6px] text-purple-600">
              <Shield className="w-5 h-5" />
            </div>
          </Card>

          <Card noPadding className="p-4 flex items-center justify-between border-l-4 border-l-blue-600">
            <div>
              <div className="text-xs font-medium text-token-text-secondary">Inter-Dept Handovers</div>
              <div className="text-xl font-bold text-blue-600 mt-1">{forwardedCount}</div>
              <div className="text-[10px] text-token-text-muted mt-0.5">Cross-department transfers</div>
            </div>
            <div className="p-2 bg-blue-500/10 border border-blue-500/30 rounded-[6px] text-blue-600">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
          </Card>

          <Card noPadding className="p-4 flex items-center justify-between border-l-4 border-l-emerald-600">
            <div>
              <div className="text-xs font-medium text-token-text-secondary">SLA Compliance Rate</div>
              <div className="text-xl font-bold text-emerald-600 mt-1">98.4%</div>
              <div className="text-[10px] text-emerald-500 mt-0.5">Target &gt; 95.0% (Compliant)</div>
            </div>
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-[6px] text-emerald-600">
              <BarChart3 className="w-5 h-5" />
            </div>
          </Card>

          <Card noPadding className="p-4 flex items-center justify-between border-l-4 border-l-amber-600">
            <div>
              <div className="text-xs font-medium text-token-text-secondary">AI Triage Accuracy</div>
              <div className="text-xl font-bold text-amber-600 mt-1">94.2%</div>
              <div className="text-[10px] text-amber-500 mt-0.5">Gemini Decision Precision</div>
            </div>
            <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-[6px] text-amber-600">
              <Bot className="w-5 h-5" />
            </div>
          </Card>
        </div>

        {/* Real-time Department Load & Capacity Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'Technical Support', agents: 6, open: 4, sla: '8 Hours SLA', color: 'border-blue-500/40 text-blue-600' },
            { name: 'Finance & Billing', agents: 4, open: 2, sla: '4 Hours SLA', color: 'border-amber-500/40 text-amber-600' },
            { name: 'Identity & Access', agents: 8, open: 1, sla: '2 Hours SLA', color: 'border-purple-500/40 text-purple-600' },
            { name: 'API Platform Team', agents: 12, open: 5, sla: '6 Hours SLA', color: 'border-emerald-500/40 text-emerald-600' },
          ].map((dept) => (
            <div key={dept.name} className="p-3.5 bg-token-card border border-token-border rounded-[6px] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-token-text-primary flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-token-accent" />
                  {dept.name}
                </span>
                <span className="text-[10px] font-semibold text-token-accent bg-token-secondary px-1.5 py-0.5 rounded border border-token-border">
                  {dept.agents} Agents
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-token-text-secondary">
                <span>Active Tickets: <strong className="text-token-text-primary">{dept.open}</strong></span>
                <span className="text-[11px] text-emerald-600 font-medium">{dept.sla}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Unified Global Ticket Feed with Filters */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto">
              <span className="text-xs font-semibold text-token-text-secondary mr-1">Department Filter:</span>
              {[
                { label: 'All Departments', val: '' },
                { label: 'Technical', val: 'Technical Support' },
                { label: 'Billing', val: 'Finance & Billing' },
                { label: 'Security', val: 'Identity & Access' },
                { label: 'API Platform', val: 'API Platform Team' },
              ].map((tab) => (
                <button
                  key={tab.val}
                  onClick={() => setSelectedDeptFilter(tab.val)}
                  className={`px-2.5 py-1 rounded-[4px] text-xs font-medium transition-colors ${
                    selectedDeptFilter === tab.val
                      ? 'bg-purple-600 text-white font-semibold shadow-xs'
                      : 'bg-token-card border border-token-border text-token-text-secondary hover:bg-token-muted'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSearchSubmit} className="w-full sm:w-72">
              <Input
                placeholder="Search by ID, title, customer, or agent..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={Search}
              />
            </form>
          </div>

          <Table
            columns={adminColumns}
            data={tickets}
            loading={loading}
            keyField="id"
            emptyMessage="No tickets found."
          />
        </div>
      </div>

      {/* Admin Quick Modify Ticket Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={`Administrative Override: Edit Ticket ${editingTicket?.ticket_number || ''}`}
        size="md"
      >
        <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
          <Input
            label="Ticket Title / Subject"
            value={editForm.title}
            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Dropdown
              label="Assigned Department"
              value={editForm.assigned_department}
              onChange={(e) => setEditForm({ ...editForm, assigned_department: e.target.value })}
              options={[
                { label: 'Technical Support', value: 'Technical Support' },
                { label: 'Finance & Billing', value: 'Finance & Billing' },
                { label: 'Identity & Access', value: 'Identity & Access' },
                { label: 'API Platform Team', value: 'API Platform Team' },
              ]}
            />
            <Dropdown
              label="Category"
              value={editForm.category}
              onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
              options={[
                { label: 'Technical', value: 'Technical' },
                { label: 'Billing', value: 'Billing' },
                { label: 'Security', value: 'Security' },
                { label: 'Feature Request', value: 'Feature Request' },
                { label: 'Bug', value: 'Bug' },
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Dropdown
              label="Priority Level"
              value={editForm.priority}
              onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
              options={[
                { label: 'LOW', value: 'LOW' },
                { label: 'MEDIUM', value: 'MEDIUM' },
                { label: 'HIGH', value: 'HIGH' },
                { label: 'URGENT', value: 'URGENT' },
              ]}
            />
            <Dropdown
              label="Ticket Status"
              value={editForm.status}
              onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
              options={[
                { label: 'OPEN', value: 'OPEN' },
                { label: 'IN_PROGRESS', value: 'IN_PROGRESS' },
                { label: 'RESOLVED', value: 'RESOLVED' },
                { label: 'CLOSED', value: 'CLOSED' },
              ]}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-token-border">
            <Button variant="secondary" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={savingEdit}>
              Save Overrides
            </Button>
          </div>
        </form>
      </Modal>

      {/* Re-route Modal */}
      <Modal
        isOpen={forwardModalOpen}
        onClose={() => setForwardModalOpen(false)}
        title={`Re-route Ticket ${selectedTicketForForward?.ticket_number || ''}`}
        size="md"
      >
        <form onSubmit={handleForwardSubmit} className="space-y-4 text-xs">
          <Dropdown
            label="Select Destination Department"
            value={forwardDept}
            onChange={(e) => setForwardDept(e.target.value)}
            options={[
              { label: 'Technical Support', value: 'Technical Support' },
              { label: 'Finance & Billing', value: 'Finance & Billing' },
              { label: 'Identity & Access', value: 'Identity & Access' },
              { label: 'API Platform Team', value: 'API Platform Team' },
            ]}
          />
          <Textarea
            label="Transfer Reason / Audit Note"
            placeholder="Document rationale for departmental re-routing..."
            rows={3}
            value={forwardComments}
            onChange={(e) => setForwardComments(e.target.value)}
          />
          <div className="flex justify-end gap-2 pt-2 border-t border-token-border">
            <Button variant="secondary" onClick={() => setForwardModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={forwarding}>
              Confirm Re-routing
            </Button>
          </div>
        </form>
      </Modal>
    </MainLayout>
  );
}
