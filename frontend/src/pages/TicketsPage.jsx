/**
 * Page: TicketsPage.jsx
 * Clean, modern ticket directory and queue management.
 * Unified layout, streamlined filters, and crisp status tracking.
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
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
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
  Send,
  Building2,
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

  // Forward Modal State
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
      addToast(`Forwarded to ${forwardDept}`, 'success');
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
      addToast('Ticket updated', 'success');
      setEditModalOpen(false);
      fetchTickets();
    } catch (err) {
      addToast('Failed to modify ticket', 'error');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteTicket = async (ticket) => {
    if (!window.confirm(`Delete ticket ${ticket.ticket_number}?`)) return;
    try {
      await deleteTicketApi(ticket.id);
      addToast('Ticket deleted', 'info');
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
          key: 'assigned_department',
          label: 'Team',
          width: '160px',
          render: (val) => (
            <span className="text-xs text-token-text-secondary flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-token-text-muted" />
              {val || 'General Support'}
            </span>
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
              <span className="text-token-text-muted">{row.assigned_department}</span>
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
        key: 'created_at',
        label: 'Date',
        width: '110px',
        render: (val) => <span className="text-xs text-token-text-secondary">{formatDate(val)}</span>,
      },
      {
        key: 'actions',
        label: '',
        width: '150px',
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
            >
              Route
            </Button>
            {isAdmin && (
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

  return (
    <MainLayout
      title={isCustomer ? 'My Support Requests' : 'Tickets'}
      subtitle={
        isCustomer
          ? 'Manage and follow up on your submitted inquiries'
          : 'Complete ticket queue with triage, routing, and filters'
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
      <div className="space-y-4">
        {/* Filter Bar */}
        <div className="p-3 bg-token-card border border-token-border rounded-xl shadow-xs">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="w-full md:w-72">
              <Input
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={Search}
              />
            </form>

            {/* Filter Dropdowns */}
            <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
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
        </div>

        {/* Tickets Table */}
        <Table
          columns={getColumns()}
          data={paginatedTickets}
          loading={loading}
          keyField="id"
          emptyMessage="No tickets found matching your criteria"
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

      {/* Forward Modal */}
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
          />

          <Textarea
            label="Handover Notes (Internal)"
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
              Route
            </Button>
          </div>
        </form>
      </Modal>

      {/* Admin Edit Modal */}
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
              Save
            </Button>
          </div>
        </form>
      </Modal>
    </MainLayout>
  );
}
