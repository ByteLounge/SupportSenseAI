/**
 * Page: DashboardPage.jsx
 * Clean, modern, uncluttered role-adaptive dashboard.
 * Focuses on clarity, essential metrics, and 1-click workflows.
 */

import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import Card from '../components/common/Card';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Dropdown from '../components/common/Dropdown';
import Textarea from '../components/common/Textarea';
import Modal from '../components/common/Modal';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import AIMoodBadge from '../components/ai/AIMoodBadge';
import { getTicketsApi, getFaqsApi, forwardTicketApi, modifyTicketApi } from '../services/api';
import { formatDate } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Bot,
  Check,
  ArrowRightLeft,
  Edit,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Send,
  Ticket,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export default function DashboardPage() {
  const { user, isCustomer, isAgent, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [tickets, setTickets] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('');

  // Customer FAQ search & accordion
  const [faqSearch, setFaqSearch] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

  // Quick Forward Modal
  const [forwardModalOpen, setForwardModalOpen] = useState(false);
  const [selectedTicketForForward, setSelectedTicketForForward] = useState(null);
  const [forwardDept, setForwardDept] = useState('Technical Support');
  const [forwardComments, setForwardComments] = useState('');
  const [forwarding, setForwarding] = useState(false);

  // Admin Edit Modal
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
  }, [user, selectedDeptFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDashboardData();
  };

  // Agent 1-click Approve AI Routing
  const handleApproveRouting = async (ticket) => {
    try {
      await forwardTicketApi(ticket.id, {
        targetDepartment: ticket.ai_suggested_department || 'Technical Support',
        comments: 'Approved automated AI department routing.',
      });
      addToast(`Routed to ${ticket.ai_suggested_department || 'Technical Support'}`, 'success');
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
      addToast('Failed to update ticket', 'error');
    } finally {
      setSavingEdit(false);
    }
  };

  // Metrics
  const totalCount = tickets.length;
  const openCount = tickets.filter((t) => t.status === 'OPEN').length;
  const inProgressCount = tickets.filter((t) => t.status === 'IN_PROGRESS' || t.status === 'PENDING').length;
  const resolvedCount = tickets.filter((t) => t.status === 'RESOLVED' || t.status === 'CLOSED').length;
  const unapprovedAiTickets = tickets.filter((t) => !t.ai_routing_approved && t.status !== 'RESOLVED');

  const filteredFaqs = faqs.filter(
    (f) =>
      !faqSearch ||
      f.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
      f.answer.toLowerCase().includes(faqSearch.toLowerCase())
  );

  // Columns definition based on role
  const getColumns = () => {
    if (isCustomer) {
      return [
        {
          key: 'ticket_number',
          label: 'ID',
          width: '90px',
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
                className="font-medium text-token-text-primary hover:text-indigo-600 transition-colors"
              >
                {val}
              </Link>
              <div className="text-[11px] text-token-text-secondary mt-0.5">
                Category: {row.category}
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
          label: 'Submitted',
          width: '120px',
          render: (val) => <span className="text-xs text-token-text-secondary">{formatDate(val)}</span>,
        },
        {
          key: 'actions',
          label: '',
          width: '80px',
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
    }

    return [
      {
        key: 'ticket_number',
        label: 'ID',
        width: '90px',
        render: (val, row) => (
          <span className="font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            {val || row.id}
          </span>
        ),
      },
      {
        key: 'title',
        label: 'Inquiry',
        render: (val, row) => (
          <div>
            <Link
              to={`/tickets/${row.id}`}
              className="font-medium text-token-text-primary hover:text-indigo-600 transition-colors"
            >
              {val}
            </Link>
            <div className="text-[11px] text-token-text-secondary mt-0.5 flex items-center gap-2">
              <span>{row.customer_name}</span>
              <span>•</span>
              <span className="font-medium text-token-text-muted">{row.assigned_department}</span>
            </div>
          </div>
        ),
      },
      {
        key: 'customer_mood',
        label: 'Sentiment',
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
            {isAdmin ? (
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
              >
                Edit
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                icon={ArrowRightLeft}
                onClick={() => {
                  setSelectedTicketForForward(row);
                  setForwardDept(row.ai_suggested_department || row.assigned_department || 'Technical Support');
                  setForwardComments('');
                  setForwardModalOpen(true);
                }}
              >
                Route
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(`/tickets/${row.id}`)}
            >
              Open
            </Button>
          </div>
        ),
      },
    ];
  };

  const departments = [
    { label: 'All', value: '' },
    { label: 'Technical Support', value: 'Technical Support' },
    { label: 'Finance & Billing', value: 'Finance & Billing' },
    { label: 'Identity & Access', value: 'Identity & Access' },
    { label: 'API Platform', value: 'API Platform Team' },
  ];

  return (
    <MainLayout
      title={`Hello, ${user?.name ? user.name.split(' ')[0] : 'there'}`}
      subtitle={
        isCustomer
          ? 'Track your queries and find quick answers'
          : isAdmin
          ? 'System overview and ticket operations'
          : 'Triage incoming requests and resolve customer issues'
      }
      actions={
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => navigate('/tickets/new')}
        >
          {isCustomer ? 'Submit Query' : 'New Ticket'}
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Metric Cards */}
        <div className={`grid grid-cols-2 ${isCustomer ? 'sm:grid-cols-3' : 'sm:grid-cols-4'} gap-3 sm:gap-4`}>
          <div className="p-4 bg-token-card border border-token-border rounded-xl shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-token-text-secondary">
                {isCustomer ? 'Active' : 'Open'}
              </span>
              <Ticket className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-2xl font-bold text-token-text-primary mt-2">{openCount}</div>
          </div>

          <div className="p-4 bg-token-card border border-token-border rounded-xl shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-token-text-secondary">In Progress</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-token-text-primary mt-2">{inProgressCount}</div>
          </div>

          {!isCustomer && (
            <div className="p-4 bg-token-card border border-token-border rounded-xl shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-token-text-secondary">AI Review</span>
                <Bot className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-2xl font-bold text-token-text-primary mt-2">{unapprovedAiTickets.length}</div>
            </div>
          )}

          <div className="p-4 bg-token-card border border-token-border rounded-xl shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-token-text-secondary">Resolved</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold text-token-text-primary mt-2">{resolvedCount}</div>
          </div>
        </div>

        {/* AI Triage Banner (for Agents when tickets need routing review) */}
        {!isCustomer && unapprovedAiTickets.length > 0 && (
          <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                  AI Routing Recommendations ({unapprovedAiTickets.length} Awaiting Approval)
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {unapprovedAiTickets.slice(0, 3).map((t) => (
                <div
                  key={t.id}
                  className="p-3 bg-token-card border border-token-border rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        {t.ticket_number}
                      </span>
                      <span className="font-medium text-token-text-primary text-xs truncate max-w-sm">
                        {t.title}
                      </span>
                    </div>
                    <div className="text-[11px] text-token-text-secondary">
                      Suggested: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{t.ai_suggested_department}</span>
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
                      Route
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Customer Quick FAQ Accordion */}
        {isCustomer && (
          <Card
            title="Frequently Asked Questions"
            subtitle="Instant answers without opening a ticket"
          >
            <div className="space-y-3">
              <Input
                placeholder="Search FAQs..."
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
                      className="border border-token-border rounded-lg overflow-hidden bg-token-secondary/30 transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedFaq(isOpen ? null : faq.id)}
                        className="w-full p-3 text-left text-xs font-semibold text-token-text-primary flex items-center justify-between hover:bg-token-muted"
                      >
                        <span className="flex items-center gap-2">
                          <HelpCircle className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                          <span>{faq.question}</span>
                        </span>
                        {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-token-text-muted" /> : <ChevronDown className="w-3.5 h-3.5 text-token-text-muted" />}
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
        )}

        {/* Tickets Section */}
        <div className="space-y-3">
          {/* Department Pills & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {!isCustomer ? (
              <div className="flex items-center gap-1.5 flex-wrap">
                {departments.map((dept) => (
                  <button
                    key={dept.value}
                    onClick={() => setSelectedDeptFilter(dept.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedDeptFilter === dept.value
                        ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                        : 'bg-token-card border border-token-border text-token-text-secondary hover:bg-token-muted hover:text-token-text-primary'
                    }`}
                  >
                    {dept.label}
                  </button>
                ))}
              </div>
            ) : (
              <h3 className="text-sm font-semibold text-token-text-primary">
                My Recent Queries
              </h3>
            )}

            <form onSubmit={handleSearchSubmit} className="w-full sm:w-60">
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={Search}
              />
            </form>
          </div>

          <Table
            columns={getColumns()}
            data={tickets}
            loading={loading}
            keyField="id"
            emptyMessage="No tickets found"
          />
        </div>
      </div>

      {/* Quick Route Modal */}
      <Modal
        isOpen={forwardModalOpen}
        onClose={() => setForwardModalOpen(false)}
        title="Route Ticket"
        size="md"
      >
        <form onSubmit={handleForwardSubmit} className="space-y-4 text-xs">
          <div className="p-3 bg-token-secondary rounded-lg border border-token-border">
            <div className="font-semibold text-token-text-primary">{selectedTicketForForward?.title}</div>
            <div className="text-token-text-secondary text-[11px] mt-0.5">
              Customer: {selectedTicketForForward?.customer_name}
            </div>
          </div>

          <Dropdown
            label="Target Department"
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
            label="Handover Note"
            placeholder="Optional context for the assigned team..."
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

      {/* Admin Quick Edit Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Ticket"
        size="md"
      >
        <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
          <Input
            label="Subject"
            value={editForm.title}
            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Dropdown
              label="Department"
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
              label="Priority"
              value={editForm.priority}
              onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
              options={[
                { label: 'LOW', value: 'LOW' },
                { label: 'MEDIUM', value: 'MEDIUM' },
                { label: 'HIGH', value: 'HIGH' },
                { label: 'URGENT', value: 'URGENT' },
              ]}
            />
          </div>

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
