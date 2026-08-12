/**
 * Page: DashboardPage.jsx
 * Simple, clean Dashboard overview.
 * Displays 4 KPI cards and the Recent Tickets queue table.
 */

import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import Card from '../components/common/Card';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Dropdown from '../components/common/Dropdown';
import AIMoodBadge from '../components/ai/AIMoodBadge';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
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
  ArrowRight,
} from 'lucide-react';

export default function DashboardPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

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
      console.error('Failed to fetch tickets:', err);
      addToast('Failed to load dashboard tickets', 'error');
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

  // KPI Calculations
  const totalCount = tickets.length;
  const openCount = tickets.filter((t) => t.status === 'OPEN').length;
  const inProgressCount = tickets.filter((t) => t.status === 'IN_PROGRESS' || t.status === 'PENDING').length;
  const resolvedCount = tickets.filter((t) => t.status === 'RESOLVED' || t.status === 'CLOSED').length;

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
      label: 'Subject',
      render: (val, row) => (
        <div>
          <Link
            to={`/tickets/${row.id}`}
            className="font-medium text-token-text-primary hover:text-token-accent transition-colors"
          >
            {val}
          </Link>
          <div className="text-xs text-token-text-secondary mt-0.5">
            Customer: {row.customer_name}
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
      key: 'customer_mood',
      label: 'AI Mood',
      width: '140px',
      render: (_, row) => (
        <AIMoodBadge
          mood={row.customer_mood || (row.ai_metadata && row.ai_metadata.customer_mood) || 'NEUTRAL'}
          confidence={row.mood_confidence || (row.ai_metadata && row.ai_metadata.mood_confidence) || 0.85}
        />
      ),
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
          Open
        </Button>
      ),
    },
  ];

  return (
    <MainLayout
      title="Dashboard"
      subtitle="Overview of support tickets and active queue."
      actions={
        <Button variant="primary" icon={Plus} onClick={() => navigate('/tickets/new')}>
          New Ticket
        </Button>
      }
    >
      <div className="space-y-5">
        {/* 4 Simple KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card noPadding className="p-4 flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-token-text-secondary">Total Tickets</div>
              <div className="text-xl font-semibold text-token-text-primary mt-1">{totalCount}</div>
            </div>
            <div className="p-2 bg-token-secondary border border-token-border rounded-[6px] text-token-accent">
              <Ticket className="w-5 h-5" />
            </div>
          </Card>

          <Card noPadding className="p-4 flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-token-text-secondary">Open Tickets</div>
              <div className="text-xl font-semibold text-token-accent mt-1">{openCount}</div>
            </div>
            <div className="p-2 bg-blue-500/10 border border-blue-500/30 rounded-[6px] text-token-accent">
              <Clock className="w-5 h-5" />
            </div>
          </Card>

          <Card noPadding className="p-4 flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-token-text-secondary">In Progress</div>
              <div className="text-xl font-semibold text-token-warning mt-1">{inProgressCount}</div>
            </div>
            <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-[6px] text-token-warning">
              <AlertCircle className="w-5 h-5" />
            </div>
          </Card>

          <Card noPadding className="p-4 flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-token-text-secondary">Resolved</div>
              <div className="text-xl font-semibold text-token-success mt-1">{resolvedCount}</div>
            </div>
            <div className="p-2 bg-green-500/10 border border-green-500/30 rounded-[6px] text-token-success">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </Card>
        </div>

        {/* Search & Filter Bar */}
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

        {/* Tickets Queue Table */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-token-text-primary">Recent Tickets</h3>
            <Link to="/tickets" className="text-xs text-token-accent hover:underline font-medium flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <Table
            columns={columns}
            data={tickets.slice(0, 5)}
            loading={loading}
            keyField="id"
          />
        </div>
      </div>
    </MainLayout>
  );
}
