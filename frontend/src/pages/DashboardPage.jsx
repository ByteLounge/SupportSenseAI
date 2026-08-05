/**
 * Page: DashboardPage.jsx
 * Enterprise Dashboard View.
 * Contains four compact statistic cards, Recent Tickets Table, Department Distribution, Recent Activity, and subtle AI Suggestions.
 */

import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import Card from '../components/common/Card';
import Table from '../components/common/Table';
import Pagination from '../components/common/Pagination';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Dropdown from '../components/common/Dropdown';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import AISuggestionsPanel from '../components/ai/AISuggestionsPanel';
import { getTicketsApi } from '../services/api';
import { formatDate } from '../utils/formatters';
import { useToast } from '../context/ToastContext';
import { Link, useNavigate } from 'react-router-dom';
import {
  Ticket,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Search,
  Filter,
  ArrowRight,
  Activity,
  Building2,
} from 'lucide-react';

export default function DashboardPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortColumn, setSortColumn] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const navigate = useNavigate();
  const { addToast } = useToast();

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await getTicketsApi({
        status: statusFilter,
        priority: priorityFilter,
        search: searchQuery,
      });
      setTickets(res.data || []);
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
      addToast('Failed to load tickets', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [statusFilter, priorityFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTickets();
  };

  // Statistic calculations
  const totalCount = tickets.length;
  const openCount = tickets.filter((t) => t.status === 'OPEN').length;
  const pendingCount = tickets.filter((t) => t.status === 'IN_PROGRESS' || t.status === 'PENDING').length;
  const resolvedCount = tickets.filter((t) => t.status === 'RESOLVED' || t.status === 'CLOSED').length;

  // Sorting logic
  const sortedTickets = [...tickets].sort((a, b) => {
    let valA = a[sortColumn] || '';
    let valB = b[sortColumn] || '';
    if (sortDirection === 'asc') {
      return valA > valB ? 1 : -1;
    }
    return valA < valB ? 1 : -1;
  });

  const handleSort = (key) => {
    if (sortColumn === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(key);
      setSortDirection('asc');
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(sortedTickets.length / pageSize) || 1;
  const paginatedTickets = sortedTickets.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Table Column Definitions (Resembling Jira / GitHub Issues)
  const columns = [
    {
      key: 'ticket_number',
      label: 'ID',
      width: '100px',
      sortable: true,
      render: (val, row) => (
        <span className="font-mono text-xs font-semibold text-[#2563EB]">
          {val || row.id}
        </span>
      ),
    },
    {
      key: 'title',
      label: 'Subject / Title',
      sortable: true,
      render: (val, row) => (
        <div>
          <Link
            to={`/tickets/${row.id}`}
            className="font-medium text-[#111827] hover:text-[#2563EB] transition-colors"
          >
            {val}
          </Link>
          <div className="text-xs text-[#6B7280] mt-0.5">
            Customer: {row.customer_name} ({row.customer_email})
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: '120px',
      sortable: true,
      render: (val) => <StatusBadge status={val} />,
    },
    {
      key: 'priority',
      label: 'Priority',
      width: '100px',
      sortable: true,
      render: (val) => <PriorityBadge priority={val} />,
    },
    {
      key: 'assigned_department',
      label: 'Assigned Dept',
      width: '160px',
      sortable: true,
      render: (val) => <span className="text-xs text-[#374151]">{val || 'Unassigned'}</span>,
    },
    {
      key: 'created_at',
      label: 'Created Date',
      width: '160px',
      sortable: true,
      render: (val) => <span className="text-xs text-[#6B7280]">{formatDate(val)}</span>,
    },
    {
      key: 'actions',
      label: 'Actions',
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

  // Department distribution calculation
  const deptCounts = tickets.reduce((acc, t) => {
    const dept = t.assigned_department || 'Unassigned';
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {});

  return (
    <MainLayout
      title="Support Workspace Dashboard"
      subtitle="Overview of active ticket queue, response SLA metrics, and AI recommendations."
      actions={
        <Button variant="primary" icon={Plus} onClick={() => navigate('/tickets/new')}>
          Submit New Ticket
        </Button>
      }
    >
      <div className="space-y-5">
        {/* Four Compact Statistic Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card noPadding className="p-4 flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-[#6B7280]">Total Tickets</div>
              <div className="text-xl font-semibold text-[#111827] mt-1">{totalCount}</div>
            </div>
            <div className="p-2 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[6px] text-[#2563EB]">
              <Ticket className="w-5 h-5" />
            </div>
          </Card>

          <Card noPadding className="p-4 flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-[#6B7280]">Open Tickets</div>
              <div className="text-xl font-semibold text-[#2563EB] mt-1">{openCount}</div>
            </div>
            <div className="p-2 bg-[#EFF6FF] border border-[#BFDBFE] rounded-[6px] text-[#2563EB]">
              <Clock className="w-5 h-5" />
            </div>
          </Card>

          <Card noPadding className="p-4 flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-[#6B7280]">Pending Action</div>
              <div className="text-xl font-semibold text-[#D97706] mt-1">{pendingCount}</div>
            </div>
            <div className="p-2 bg-[#FFFBEB] border border-[#FDE68A] rounded-[6px] text-[#D97706]">
              <AlertCircle className="w-5 h-5" />
            </div>
          </Card>

          <Card noPadding className="p-4 flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-[#6B7280]">Resolved Tickets</div>
              <div className="text-xl font-semibold text-[#16A34A] mt-1">{resolvedCount}</div>
            </div>
            <div className="p-2 bg-[#F0FDF4] border border-[#BBF7D0] rounded-[6px] text-[#16A34A]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </Card>
        </div>

        {/* Filters & Search Toolbar */}
        <Card noPadding className="p-3">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <form onSubmit={handleSearchSubmit} className="w-full md:w-80">
              <Input
                placeholder="Search ticket subject, ID, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={Search}
              />
            </form>

            <div className="flex items-center gap-3 w-full md:w-auto text-xs">
              <div className="flex items-center gap-1 text-[#6B7280] font-medium">
                <Filter className="w-3.5 h-3.5" /> Filter:
              </div>
              <Dropdown
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { label: 'All Statuses', value: '' },
                  { label: 'Open', value: 'OPEN' },
                  { label: 'In Progress', value: 'IN_PROGRESS' },
                  { label: 'Resolved', value: 'RESOLVED' },
                ]}
                size="sm"
              />
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
            </div>
          </div>
        </Card>

        {/* Main Content Grid: Recent Tickets Table + Sidebar Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left Column: Tickets Table (Spans 2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#111827]">Active Ticket Queue</h3>
              <Link to="/tickets" className="text-xs text-[#2563EB] hover:underline font-medium inline-flex items-center gap-1">
                View All Tickets <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <Table
              columns={columns}
              data={paginatedTickets}
              loading={loading}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={handleSort}
              keyField="id"
            />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={sortedTickets.length}
              onPageChange={(page) => setCurrentPage(page)}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Right Column: AI Suggestions Panel + Department Distribution & Recent Activity */}
          <div className="space-y-4">
            {/* Subtle AI Recommendation */}
            {tickets.length > 0 && (
              <AISuggestionsPanel
                ticket={tickets[0]}
                onApplyReply={(reply) => {
                  addToast('AI suggested reply copied to active ticket response', 'success');
                  navigate(`/tickets/${tickets[0].id}`);
                }}
                onEditReply={() => navigate(`/tickets/${tickets[0].id}`)}
              />
            )}

            {/* Department Breakdown Panel */}
            <Card title="Department Distribution">
              <div className="space-y-2 text-xs">
                {Object.keys(deptCounts).length === 0 ? (
                  <p className="text-[#6B7280]">No department data available.</p>
                ) : (
                  Object.entries(deptCounts).map(([dept, count]) => (
                    <div key={dept} className="flex items-center justify-between p-2 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[4px]">
                      <span className="font-medium text-[#111827] flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-[#6B7280]" />
                        {dept}
                      </span>
                      <span className="font-mono bg-white px-2 py-0.5 border border-[#E5E7EB] rounded-[4px] font-semibold text-[#2563EB]">
                        {count} {count === 1 ? 'ticket' : 'tickets'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* Recent Audit Activity */}
            <Card title="Recent Activity">
              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <Activity className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-[#111827]">Ticket TCK-1001 status changed</div>
                    <div className="text-[11px] text-[#6B7280]">Updated to OPEN by Sarah Agent</div>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Activity className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-[#111827]">Ticket TCK-1003 resolved</div>
                    <div className="text-[11px] text-[#6B7280]">Resolved by Identity & Access Team</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
