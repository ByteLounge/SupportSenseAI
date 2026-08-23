/**
 * Page: TicketsPage.jsx
 * Role-adaptive Ticket Queue & Management Interface.
 * - Customer: Limited to personal tickets with friendly tracking.
 * - Agent: Global queue, AI triage categorization, department forwarding with comments.
 * - Admin: Master grid, full modification powers, re-routing, and deletion control.
 */

import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import Table from '../components/common/Table';
import Pagination from '../components/common/Pagination';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Dropdown from '../components/common/Dropdown';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';
import Textarea from '../components/common/Textarea';
import Badge, { StatusBadge, PriorityBadge } from '../components/common/Badge';
import AIMoodBadge from '../components/ai/AIMoodBadge';
import {
  getTicketsApi,
  forwardTicketApi,
  modifyTicketApi,
  deleteTicketApi,
} from '../services/api';
import { formatDate } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Plus,
  Search,
  ArrowRightLeft,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  Building2,
  Send,
  HelpCircle,
  Sparkles,
  Shield,
  Layers,
} from 'lucide-react';

export default function TicketsPage() {
  const { user, isCustomer, isAgent, isAdmin } = useAuth();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Agent / Admin Forward Modal State
  const [forwardModalOpen, setForwardModalOpen] = useState(false);
  const [selectedTicketForForward, setSelectedTicketForForward] = useState(null);
  const [forwardDept, setForwardDept] = useState('Technical Support');
  const [forwardComments, setForwardComments] = useState('');
  const [forwarding, setForwarding] = useState(false);

  // Admin Edit Modal State
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

  const navigate = useNavigate();
  const { addToast } = useToast();

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await getTicketsApi({
        status: statusFilter,
        priority: priorityFilter,
        department: departmentFilter,
        search: searchQuery,
      });
      setTickets(res.data || []);
    } catch (err) {
      console.error('Failed to load tickets:', err);
      addToast('Failed to load tickets', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [user, statusFilter, priorityFilter, departmentFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTickets();
  };

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
      fetchTickets();
    } catch (err) {
      addToast('Failed to forward ticket', 'error');
    } finally {
      setForwarding(false);
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingTicket) return;
    setSavingEdit(true);
    try {
      await modifyTicketApi(editingTicket.id, editForm);
      addToast(`Ticket ${editingTicket.ticket_number} updated`, 'success');
      setEditModalOpen(false);
      fetchTickets();
    } catch (err) {
      addToast('Failed to modify ticket', 'error');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteTicket = async (ticket) => {
    if (!window.confirm(`Are you sure you want to delete / archive ticket ${ticket.ticket_number}?`)) {
      return;
    }
    try {
      await deleteTicketApi(ticket.id);
      addToast(`Ticket ${ticket.ticket_number} deleted`, 'info');
      fetchTickets();
    } catch (err) {
      addToast('Failed to delete ticket', 'error');
    }
  };

  const totalPages = Math.ceil(tickets.length / pageSize) || 1;
  const paginatedTickets = tickets.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // -----------------------------------------------------------------
  // COLUMNS: CUSTOMER VIEW (Clean, No Internal Telemetry)
  // -----------------------------------------------------------------
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
      label: 'Subject / Question',
      render: (val, row) => (
        <div>
          <Link
            to={`/tickets/${row.id}`}
            className="font-semibold text-token-text-primary hover:text-emerald-600 transition-colors text-xs"
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
      key: 'assigned_department',
      label: 'Handling Team',
      width: '160px',
      render: (val) => (
        <span className="text-xs font-medium text-token-text-primary flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-token-text-muted" />
          {val || 'General Support'}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Current Status',
      width: '130px',
      render: (val) => <StatusBadge status={val} />,
    },
    {
      key: 'created_at',
      label: 'Submitted Date',
      width: '140px',
      render: (val) => <span className="text-xs text-token-text-secondary">{formatDate(val)}</span>,
    },
    {
      key: 'actions',
      label: '',
      width: '110px',
      align: 'right',
      render: (_, row) => (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate(`/tickets/${row.id}`)}
        >
          View Conversation
        </Button>
      ),
    },
  ];

  // -----------------------------------------------------------------
  // COLUMNS: AGENT VIEW (AI Triage, Routing & Queue)
  // -----------------------------------------------------------------
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
            <span className="text-token-accent font-medium">{row.assigned_department}</span>
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
      key: 'created_at',
      label: 'Date',
      width: '130px',
      render: (val) => <span className="text-xs text-token-text-secondary">{formatDate(val)}</span>,
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
              setForwardDept(row.ai_suggested_department || row.assigned_department || 'Technical Support');
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

  // -----------------------------------------------------------------
  // COLUMNS: ADMIN VIEW (Full Controls, Edit, Delete, Override)
  // -----------------------------------------------------------------
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
      key: 'category',
      label: 'Category',
      width: '110px',
      render: (val) => <span className="font-medium text-xs text-token-text-primary">{val}</span>,
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
      label: 'Admin Actions',
      width: '200px',
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
            title="Modify Ticket"
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
            variant="danger"
            size="sm"
            icon={Trash2}
            onClick={() => handleDeleteTicket(row)}
            title="Delete Ticket"
          >
            Del
          </Button>
        </div>
      ),
    },
  ];

  const breadcrumbs = [
    { label: isCustomer ? 'Customer Portal' : 'Dashboard', path: '/' },
    { label: isCustomer ? 'My Support Requests' : isAdmin ? 'Master Ticket List' : 'Ticket Queue' },
  ];

  return (
    <MainLayout
      breadcrumbs={breadcrumbs}
      title={
        isCustomer
          ? 'My Support Requests'
          : isAdmin
          ? 'Enterprise Ticket Master List & Overrides'
          : 'Support Ticket Queue & Department Routing'
      }
      subtitle={
        isCustomer
          ? 'View and track all queries and tickets submitted by your account.'
          : isAdmin
          ? 'Complete unrestricted access to inspect, modify, re-route, or remove any ticket across all departments.'
          : 'Manage incoming customer requests, review AI triage recommendations, and forward to specialized departments.'
      }
      actions={
        <Button variant="primary" icon={Plus} onClick={() => navigate('/tickets/new')}>
          {isCustomer ? 'Submit New Query' : 'New Ticket'}
        </Button>
      }
    >
      <div className="space-y-4">
        {/* Customer Self-Serve Header Notice */}
        {isCustomer && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-[6px] text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Looking for quick answers? Check our FAQ repository before submitting a query.</span>
            </span>
            <Link to="/knowledge-base" className="font-semibold underline hover:no-underline shrink-0">
              Browse FAQs &rarr;
            </Link>
          </div>
        )}

        {/* Filter & Search Bar */}
        <Card noPadding className="p-3">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="w-full md:w-80">
              <Input
                placeholder={
                  isCustomer
                    ? 'Search my tickets...'
                    : 'Search by ID, subject, customer, or department...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={Search}
              />
            </form>

            {/* Dropdown Filters */}
            <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
              {/* Department Filter for Agent & Admin */}
              {!isCustomer && (
                <Dropdown
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  options={[
                    { label: 'All Departments', value: '' },
                    { label: 'Technical Support', value: 'Technical Support' },
                    { label: 'Finance & Billing', value: 'Finance & Billing' },
                    { label: 'Identity & Access', value: 'Identity & Access' },
                    { label: 'API Platform Team', value: 'API Platform Team' },
                  ]}
                  size="sm"
                />
              )}

              {/* Status Filter */}
              <Dropdown
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { label: 'All Statuses', value: '' },
                  { label: 'Open', value: 'OPEN' },
                  { label: 'In Progress', value: 'IN_PROGRESS' },
                  { label: 'Resolved', value: 'RESOLVED' },
                  { label: 'Closed', value: 'CLOSED' },
                ]}
                size="sm"
              />

              {/* Priority Filter for Agent & Admin */}
              {!isCustomer && (
                <Dropdown
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  options={[
                    { label: 'All Priorities', value: '' },
                    { label: 'Urgent', value: 'URGENT' },
                    { label: 'High', value: 'HIGH' },
                    { label: 'Medium', value: 'MEDIUM' },
                    { label: 'Low', value: 'LOW' },
                  ]}
                  size="sm"
                />
              )}
            </div>
          </div>
        </Card>

        {/* Tickets Table */}
        <Table
          columns={isCustomer ? customerColumns : isAdmin ? adminColumns : agentColumns}
          data={paginatedTickets}
          loading={loading}
          keyField="id"
          emptyMessage={
            isCustomer
              ? 'No support queries found. Click "Submit New Query" to get help.'
              : 'No tickets matched your filter criteria.'
          }
        />

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={tickets.length}
          onPageChange={(page) => setCurrentPage(page)}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Forward Ticket Modal (Agent & Admin) */}
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
            label="Handover Comments / Notes (Internal)"
            placeholder="Add internal details for the receiving department specialist..."
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

      {/* Admin Quick Modify Ticket Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={`Modify Ticket Attributes: ${editingTicket?.ticket_number || ''}`}
        size="md"
      >
        <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
          <Input
            label="Ticket Subject / Title"
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

