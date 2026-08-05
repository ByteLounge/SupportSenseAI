/**
 * Page: TicketsPage.jsx
 * Full Enterprise Ticket Management & Queue View (GitHub Issues / Jira Style).
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
import { getTicketsApi } from '../services/api';
import { formatDate } from '../utils/formatters';
import { useToast } from '../context/ToastContext';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Search, Filter } from 'lucide-react';

export default function TicketsPage() {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortColumn, setSortColumn] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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
      console.error('Failed to load tickets:', err);
      addToast('Failed to load ticket roster', 'error');
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

  const sortedTickets = [...tickets].sort((a, b) => {
    let valA = a[sortColumn] || '';
    let valB = b[sortColumn] || '';
    if (sortDirection === 'asc') return valA > valB ? 1 : -1;
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

  const totalPages = Math.ceil(sortedTickets.length / pageSize) || 1;
  const paginatedTickets = sortedTickets.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

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
      key: 'category',
      label: 'Category',
      width: '130px',
      sortable: true,
      render: (val) => <span className="text-xs text-[#374151] font-medium">{val}</span>,
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
      label: 'Assigned Department',
      width: '170px',
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
          Manage
        </Button>
      ),
    },
  ];

  const breadcrumbs = [
    { label: 'Dashboard', path: '/' },
    { label: 'Tickets' },
  ];

  return (
    <MainLayout
      breadcrumbs={breadcrumbs}
      title="Ticket Queue Management"
      subtitle="View, triage, and filter incoming customer support tickets."
      actions={
        <Button variant="primary" icon={Plus} onClick={() => navigate('/tickets/new')}>
          Submit New Ticket
        </Button>
      }
    >
      <div className="space-y-4">
        {/* Filters Toolbar */}
        <Card noPadding className="p-3">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <form onSubmit={handleSearchSubmit} className="w-full md:w-96">
              <Input
                placeholder="Filter by subject, ticket #, customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={Search}
              />
            </form>

            <div className="flex items-center gap-3 w-full md:w-auto text-xs">
              <div className="flex items-center gap-1 text-[#6B7280] font-medium">
                <Filter className="w-3.5 h-3.5" /> Filters:
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

        {/* Tickets Table */}
        <Table
          columns={columns}
          data={paginatedTickets}
          loading={loading}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          keyField="id"
        />

        {/* Pagination */}
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
    </MainLayout>
  );
}
