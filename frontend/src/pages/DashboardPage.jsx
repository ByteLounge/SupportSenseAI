/**
 * Page: DashboardPage.jsx
 * Streamlined, clean, and role-adaptive Enterprise Dashboard.
 * Designed for clarity, intuitive navigation, and zero visual clutter.
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
  ArrowRightLeft,
  Users,
  Edit,
  Check,
  Filter,
  BarChart2,
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

  // Quick Forward Modal
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
        comments: 'Agent approved Gemini AI automated department routing.',
      });
      addToast(`Approved AI routing to ${ticket.ai_suggested_department || 'Technical Support'}`, 'success');
      fetchDashboardData();
    } catch (err) {
      addToast('Failed to approve routing', 'error');
    }
  };

  // Quick Forward Submit
  const handleForwardSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTicketForForward) return;
    setForwarding(true);
    try {
      await forwardTicketApi(selectedTicketForForward.id, {
        targetDepartment: forwardDept,
        comments: forwardComments,
      });
      addToast(`Ticket forwarded to ${forwardDept}`, 'success');
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
      addToast('Ticket updated successfully', 'success');
      setEditModalOpen(false);
      fetchDashboardData();
    } catch (err) {
      addToast('Failed to modify ticket', 'error');
    } finally {
      setSavingEdit(false);
    }
  };

  // Key Metrics
  const totalCount = tickets.length;
  const openCount = tickets.filter((t) => t.status === 'OPEN').length;
  const inProgressCount = tickets.filter((t) => t.status === 'IN_PROGRESS' || t.status === 'PENDING').length;
  const resolvedCount = tickets.filter((t) => t.status === 'RESOLVED' || t.status === 'CLOSED').length;
  const unapprovedAiCount = tickets.filter((t) => !t.ai_routing_approved && t.status !== 'RESOLVED').length;

  // Department ticket counts
  const techCount = tickets.filter((t) => t.assigned_department === 'Technical Support').length;
  const billingCount = tickets.filter((t) => t.assigned_department === 'Finance & Billing').length;
  const securityCount = tickets.filter((t) => t.assigned_department === 'Identity & Access').length;
  const apiCount = tickets.filter((t) => t.assigned_department === 'API Platform Team').length;

  // Filtered FAQs for Customer
  const filteredFaqs = faqs.filter(
    (f) =>
      !faqSearch ||
      f.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
      f.answer.toLowerCase().includes(faqSearch.toLowerCase()) ||
      f.category.toLowerCase().includes(faqSearch.toLowerCase())
  );

  // =========================================================================
  // 1. CUSTOMER DASHBOARD (Simple, friendly, clear)
  // =========================================================================
  if (isCustomer) {
    const customerColumns = [
      {
        key: 'ticket_number',
        label: 'ID',
        width: '100px',
        render: (val, row) => (
          <span className="font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            {val || row.id}
          </span>
        ),
      },
      {
        key: 'title',
        label: 'Subject',
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
        width: '120px',
        render: (val) => <StatusBadge status={val} />,
      },
      {
        key: 'created_at',
        label: 'Date',
        width: '130px',
        render: (val) => <span className="text-xs text-token-text-secondary">{formatDate(val)}</span>,
      },
      {
        key: 'actions',
        label: '',
        width: '90px',
        align: 'right',
        render: (_, row) => (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate(`/tickets/${row.id}`)}
          >
            View
          </Button>
        ),
      },
    ];

    return (
      <MainLayout
        title={`Welcome, ${user?.name || 'Customer'}`}
        subtitle="Track your support requests, submit new queries, or get instant help."
        actions={
          <Button variant="primary" icon={Plus} onClick={() => navigate('/tickets/new')}>
            New Ticket
          </Button>
        }
      >
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card noPadding className="p-4 flex items-center justify-between border-l-4 border-l-emerald-500">
              <div>
                <div className="text-xs font-medium text-token-text-secondary">Active Requests</div>
                <div className="text-2xl font-bold text-token-text-primary mt-1">{openCount}</div>
              </div>
              <div className="p-2.5 bg-emerald-500/10 rounded-[6px] text-emerald-600">
                <Ticket className="w-5 h-5" />
              </div>
            </Card>

            <Card noPadding className="p-4 flex items-center justify-between border-l-4 border-l-amber-500">
              <div>
                <div className="text-xs font-medium text-token-text-secondary">In Progress</div>
                <div className="text-2xl font-bold text-amber-600 mt-1">{inProgressCount}</div>
              </div>
              <div className="p-2.5 bg-amber-500/10 rounded-[6px] text-amber-600">
                <Clock className="w-5 h-5" />
              </div>
            </Card>

            <Card noPadding className="p-4 flex items-center justify-between border-l-4 border-l-blue-500">
              <div>
                <div className="text-xs font-medium text-token-text-secondary">Resolved</div>
                <div className="text-2xl font-bold text-blue-600 mt-1">{resolvedCount}</div>
              </div>
              <div className="p-2.5 bg-blue-500/10 rounded-[6px] text-blue-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </Card>
          </div>

          {/* Quick Search FAQs */}
          <Card
            title="Need Quick Answers?"
            subtitle="Search common questions to resolve issues instantly without waiting."
            actions={
              <Link to="/knowledge-base" className="text-xs text-emerald-600 font-medium hover:underline flex items-center gap-1">
                Help Center <ArrowRight className="w-3 h-3" />
              </Link>
            }
          >
            <div className="space-y-3">
              <Input
                placeholder="Search FAQs by keywords (e.g., refund, password, API, invoice)..."
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                icon={Search}
              />

              <div className="space-y-2 pt-1">
                {filteredFaqs.slice(0, 3).map((faq) => {
                  const isOpen = expandedFaq === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className="border border-token-border rounded-[6px] overflow-hidden bg-token-secondary/30 transition-colors"
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
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Recent Tickets Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-token-text-primary flex items-center gap-2">
                <Ticket className="w-4 h-4 text-emerald-600" />
                My Support Tickets ({tickets.length})
              </h3>
              <Link to="/tickets" className="text-xs text-emerald-600 hover:underline font-medium flex items-center gap-1">
                All Tickets <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <Table
              columns={customerColumns}
              data={tickets.slice(0, 5)}
              loading={loading}
              keyField="id"
              emptyMessage="No tickets submitted yet."
            />
          </div>
        </div>
      </MainLayout>
    );
  }

  // =========================================================================
  // 2. AGENT DASHBOARD (Focused on Triage, Routing & Response)
  // =========================================================================
  if (isAgent) {
    const unapprovedTickets = tickets.filter((t) => !t.ai_routing_approved && t.status !== 'RESOLVED');

    const agentColumns = [
      {
        key: 'ticket_number',
        label: 'ID',
        width: '90px',
        render: (val, row) => (
          <span className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">
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
              className="font-medium text-token-text-primary hover:text-blue-600 transition-colors"
            >
              {val}
            </Link>
            <div className="text-[11px] text-token-text-secondary mt-0.5 flex items-center gap-2">
              <span>Customer: <strong className="text-token-text-primary">{row.customer_name}</strong></span>
              <span>•</span>
              <span className="text-blue-600 dark:text-blue-400 font-medium">{row.assigned_department || 'Unassigned'}</span>
            </div>
          </div>
        ),
      },
      {
        key: 'customer_mood',
        label: 'Mood',
        width: '120px',
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
        width: '130px',
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
        title="Agent Workspace"
        subtitle="Review active queue, approve AI suggestions, and assist customers."
        actions={
          <Button variant="primary" icon={Plus} onClick={() => navigate('/tickets/new')}>
            New Ticket
          </Button>
        }
      >
        <div className="space-y-6">
          {/* 4 Clean Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card noPadding className="p-4 flex items-center justify-between border-l-4 border-l-blue-600">
              <div>
                <div className="text-xs font-medium text-token-text-secondary">Assigned Queue</div>
                <div className="text-xl font-bold text-token-text-primary mt-1">{totalCount}</div>
              </div>
              <div className="p-2 bg-blue-500/10 rounded-[6px] text-blue-600">
                <Ticket className="w-5 h-5" />
              </div>
            </Card>

            <Card noPadding className="p-4 flex items-center justify-between border-l-4 border-l-amber-500">
              <div>
                <div className="text-xs font-medium text-token-text-secondary">Needs AI Review</div>
                <div className="text-xl font-bold text-amber-600 mt-1">{unapprovedAiCount}</div>
              </div>
              <div className="p-2 bg-amber-500/10 rounded-[6px] text-amber-600">
                <Bot className="w-5 h-5" />
              </div>
            </Card>

            <Card noPadding className="p-4 flex items-center justify-between border-l-4 border-l-purple-500">
              <div>
                <div className="text-xs font-medium text-token-text-secondary">In Progress</div>
                <div className="text-xl font-bold text-purple-600 mt-1">{inProgressCount}</div>
              </div>
              <div className="p-2 bg-purple-500/10 rounded-[6px] text-purple-600">
                <Clock className="w-5 h-5" />
              </div>
            </Card>

            <Card noPadding className="p-4 flex items-center justify-between border-l-4 border-l-emerald-500">
              <div>
                <div className="text-xs font-medium text-token-text-secondary">Resolved (SLA)</div>
                <div className="text-xl font-bold text-emerald-600 mt-1">{resolvedCount} (98.4%)</div>
              </div>
              <div className="p-2 bg-emerald-500/10 rounded-[6px] text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </Card>
          </div>

          {/* AI Suggestions Card (Uncluttered, clean) */}
          {unapprovedTickets.length > 0 && (
            <Card
              className="border-amber-500/30 bg-amber-500/5"
              title={
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
                  <Bot className="w-4 h-4 text-amber-600" />
                  <span>AI Routing Suggestions ({unapprovedTickets.length} Awaiting Review)</span>
                </div>
              }
              subtitle="Gemini AI categorized these requests. Click Approve or Route with notes."
            >
              <div className="space-y-2.5">
                {unapprovedTickets.map((t) => (
                  <div
                    key={t.id}
                    className="p-3 bg-token-card border border-token-border rounded-[6px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">{t.ticket_number}</span>
                        <span className="font-semibold text-token-text-primary text-xs">{t.title}</span>
                        <PriorityBadge priority={t.priority} />
                      </div>
                      <div className="text-[11px] text-token-text-secondary flex items-center gap-2">
                        <span>Target: <strong className="text-blue-600 dark:text-blue-400">{t.ai_suggested_department || 'Technical Support'}</strong></span>
                        <span>•</span>
                        <span>Category: <strong>{t.ai_suggested_category || t.category}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="success"
                        size="sm"
                        icon={Check}
                        onClick={() => handleApproveRouting(t)}
                      >
                        Approve
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
                        Re-route
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Department Tabs & Search */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              {/* Department Tabs with Badges */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { label: 'All Queue', val: '', count: totalCount },
                  { label: 'Technical', val: 'Technical Support', count: techCount },
                  { label: 'Billing', val: 'Finance & Billing', count: billingCount },
                  { label: 'Security', val: 'Identity & Access', count: securityCount },
                  { label: 'API Team', val: 'API Platform Team', count: apiCount },
                ].map((tab) => (
                  <button
                    key={tab.val}
                    onClick={() => setSelectedDeptFilter(tab.val)}
                    className={`px-3 py-1.5 rounded-[6px] text-xs font-medium transition-colors flex items-center gap-1.5 ${
                      selectedDeptFilter === tab.val
                        ? 'bg-blue-600 text-white font-semibold shadow-xs'
                        : 'bg-token-card border border-token-border text-token-text-secondary hover:bg-token-muted'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      selectedDeptFilter === tab.val ? 'bg-white/20 text-white' : 'bg-token-secondary text-token-text-muted'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              <form onSubmit={handleSearchSubmit} className="w-full sm:w-60">
                <Input
                  placeholder="Search queue..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={Search}
                />
              </form>
            </div>

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
          title={`Route Ticket ${selectedTicketForForward?.ticket_number || ''}`}
          size="md"
        >
          <form onSubmit={handleForwardSubmit} className="space-y-4 text-xs">
            <div className="p-3 bg-token-secondary rounded-[6px] border border-token-border space-y-1">
              <div className="font-semibold text-token-text-primary">{selectedTicketForForward?.title}</div>
              <div className="text-token-text-secondary">Customer: {selectedTicketForForward?.customer_name}</div>
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
              label="Handover Notes"
              placeholder="Add details for the assigned specialist..."
              rows={3}
              value={forwardComments}
              onChange={(e) => setForwardComments(e.target.value)}
            />

            <div className="flex justify-end gap-2 pt-2 border-t border-token-border">
              <Button variant="secondary" onClick={() => setForwardModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={forwarding} icon={Send}>
                Confirm Route
              </Button>
            </div>
          </form>
        </Modal>
      </MainLayout>
    );
  }

  // =========================================================================
  // 3. ADMIN DASHBOARD (Clean, Uncluttered, Intuitive for New Users)
  // =========================================================================
  const adminColumns = [
    {
      key: 'ticket_number',
      label: 'ID',
      width: '90px',
      render: (val, row) => (
        <span className="font-mono text-xs font-semibold text-purple-600 dark:text-purple-400">
          {val || row.id}
        </span>
      ),
    },
    {
      key: 'title',
      label: 'Subject / Customer',
      render: (val, row) => (
        <div>
          <Link
            to={`/tickets/${row.id}`}
            className="font-medium text-token-text-primary hover:text-purple-600 transition-colors"
          >
            {val}
          </Link>
          <div className="text-[11px] text-token-text-secondary mt-0.5 flex items-center gap-2">
            <span>{row.customer_name}</span>
            <span>•</span>
            <span className="text-purple-600 dark:text-purple-400 font-medium">{row.assigned_department}</span>
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
      width: '110px',
      render: (val) => <span className="text-xs text-token-text-secondary">{formatDate(val)}</span>,
    },
    {
      key: 'actions',
      label: 'Action',
      width: '130px',
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
            title="Edit Ticket"
          >
            Edit
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
      title="Admin Overview"
      subtitle="Monitor support performance, team workload, and ticket operations at a glance."
      actions={
        <div className="flex items-center gap-2">
          <Button variant="secondary" icon={Users} onClick={() => navigate('/users')}>
            Team Users
          </Button>
          <Button variant="primary" icon={Plus} onClick={() => navigate('/tickets/new')}>
            New Ticket
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* 4 Clean Essential Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card noPadding className="p-4 flex items-center justify-between border-l-4 border-l-purple-600">
            <div>
              <div className="text-xs font-medium text-token-text-secondary">Total Inquiries</div>
              <div className="text-2xl font-bold text-token-text-primary mt-1">{totalCount}</div>
              <div className="text-[11px] text-token-text-muted mt-0.5">All tickets logged</div>
            </div>
            <div className="p-2.5 bg-purple-500/10 rounded-[6px] text-purple-600">
              <Ticket className="w-5 h-5" />
            </div>
          </Card>

          <Card noPadding className="p-4 flex items-center justify-between border-l-4 border-l-amber-500">
            <div>
              <div className="text-xs font-medium text-token-text-secondary">Active / Open</div>
              <div className="text-2xl font-bold text-amber-600 mt-1">{openCount + inProgressCount}</div>
              <div className="text-[11px] text-token-text-muted mt-0.5">Requiring assistance</div>
            </div>
            <div className="p-2.5 bg-amber-500/10 rounded-[6px] text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
          </Card>

          <Card noPadding className="p-4 flex items-center justify-between border-l-4 border-l-emerald-500">
            <div>
              <div className="text-xs font-medium text-token-text-secondary">SLA Resolution Rate</div>
              <div className="text-2xl font-bold text-emerald-600 mt-1">98.4%</div>
              <div className="text-[11px] text-emerald-600 font-medium mt-0.5">{resolvedCount} resolved on-time</div>
            </div>
            <div className="p-2.5 bg-emerald-500/10 rounded-[6px] text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </Card>

          <Card noPadding className="p-4 flex items-center justify-between border-l-4 border-l-blue-500">
            <div>
              <div className="text-xs font-medium text-token-text-secondary">Active Team</div>
              <div className="text-2xl font-bold text-blue-600 mt-1">30 Agents</div>
              <div className="text-[11px] text-token-text-muted mt-0.5">Across 4 departments</div>
            </div>
            <div className="p-2.5 bg-blue-500/10 rounded-[6px] text-blue-600">
              <Users className="w-5 h-5" />
            </div>
          </Card>
        </div>

        {/* Department Workload Tabs & Filter Row */}
        <div className="space-y-3">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            {/* Clean Department Tabs with live counts */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { label: 'All Departments', val: '', count: totalCount },
                { label: 'Technical', val: 'Technical Support', count: techCount },
                { label: 'Billing', val: 'Finance & Billing', count: billingCount },
                { label: 'Security', val: 'Identity & Access', count: securityCount },
                { label: 'API Platform', val: 'API Platform Team', count: apiCount },
              ].map((tab) => (
                <button
                  key={tab.val}
                  onClick={() => setSelectedDeptFilter(tab.val)}
                  className={`px-3 py-1.5 rounded-[6px] text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    selectedDeptFilter === tab.val
                      ? 'bg-purple-600 text-white font-semibold shadow-xs'
                      : 'bg-token-card border border-token-border text-token-text-secondary hover:bg-token-muted'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    selectedDeptFilter === tab.val ? 'bg-white/20 text-white' : 'bg-token-secondary text-token-text-muted'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="w-full md:w-64">
              <Input
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={Search}
              />
            </form>
          </div>

          {/* Clean Ticket Table */}
          <Table
            columns={adminColumns}
            data={tickets}
            loading={loading}
            keyField="id"
            emptyMessage="No tickets found matching the selected filter."
          />
        </div>
      </div>

      {/* Admin Quick Modify Ticket Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={`Edit Ticket ${editingTicket?.ticket_number || ''}`}
        size="md"
      >
        <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
          <Input
            label="Ticket Subject"
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
              label="Status"
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
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </MainLayout>
  );
}
