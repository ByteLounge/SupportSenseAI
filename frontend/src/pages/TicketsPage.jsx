/**
 * Page: TicketsPage.jsx
 * Simple, clean ticket list and queue management page.
 */

import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import Table from '../components/common/Table';
import Pagination from '../components/common/Pagination';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Dropdown from '../components/common/Dropdown';
import Card from '../components/common/Card';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import { getTicketsApi } from '../services/api';
import { formatDate } from '../utils/formatters';
import { useToast } from '../context/ToastContext';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';

export default function TicketsPage() {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const navigate = useNavigate();
  const { addToast } = useToast();

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await getTicketsApi({
        status: statusFilter,
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
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTickets();
  };

  const totalPages = Math.ceil(tickets.length / pageSize) || 1;
  const paginatedTickets = tickets.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const columns = [
    {
      key: 'ticket_number',
      label: 'ID',
      width: '100px',
      render: (val, row) => (
        <span className="font-mono text-xs font-semibold text-token-accent">
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
            className="font-medium text-token-text-primary hover:text-token-accent transition-colors"
          >
            {val}
          </Link>
          <div className="text-xs text-token-text-secondary mt-0.5">
            Customer: {row.customer_name} ({row.customer_email})
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
      key: 'priority',
      label: 'Priority',
      width: '100px',
      render: (val) => <PriorityBadge priority={val} />,
    },
    {
      key: 'created_at',
      label: 'Date',
      width: '140px',
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

  const breadcrumbs = [
    { label: 'Dashboard', path: '/' },
    { label: 'Tickets' },
  ];

  return (
    <MainLayout
      breadcrumbs={breadcrumbs}
      title="All Tickets"
      subtitle="View and manage active support tickets."
      actions={
        <Button variant="primary" icon={Plus} onClick={() => navigate('/tickets/new')}>
          New Ticket
        </Button>
      }
    >
      <div className="space-y-4">
        {/* Search & Filter */}
        <Card noPadding className="p-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <form onSubmit={handleSearchSubmit} className="w-full sm:w-80">
              <Input
                placeholder="Search ticket subject, ID, or customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={Search}
              />
            </form>

            <div className="w-full sm:w-auto">
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
            </div>
          </div>
        </Card>

        {/* Tickets Table */}
        <Table
          columns={columns}
          data={paginatedTickets}
          loading={loading}
          keyField="id"
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
    </MainLayout>
  );
}
