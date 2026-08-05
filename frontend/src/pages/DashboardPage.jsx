/**
 * Page: DashboardPage.jsx
 * Lead Engineer: Member 1 (Frontend Lead)
 * Description: Main support workspace displaying ticket queue, AI mood badges, & triage filters.
 */

import React, { useState, useEffect } from 'react';
import { getTicketsApi } from '../services/api';
import AIMoodBadge from '../components/ai/AIMoodBadge';
import PriorityBadge from '../components/common/PriorityBadge';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { Link } from 'react-router-dom';
import { Search, Filter, AlertCircle, Clock, CheckCircle2, Ticket as TicketIcon } from 'lucide-react';

export default function DashboardPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await getTicketsApi({ status: statusFilter, priority: priorityFilter, search });
      setTickets(res.data || []);
    } catch (err) {
      console.error('Failed to load tickets:', err);
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

  // Metrics calculation
  const totalCount = tickets.length;
  const openCount = tickets.filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length;
  const frustratedCount = tickets.filter(t => t.customer_mood === 'FRUSTRATED').length;

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 glass-panel flex items-center justify-between border-l-4 border-l-indigo-500">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Active Queue</div>
            <div className="text-3xl font-bold font-display text-slate-900 dark:text-white mt-1">{totalCount}</div>
          </div>
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <TicketIcon className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 glass-panel flex items-center justify-between border-l-4 border-l-amber-500">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Needs Attention</div>
            <div className="text-3xl font-bold font-display text-amber-600 dark:text-amber-400 mt-1">{openCount}</div>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 glass-panel flex items-center justify-between border-l-4 border-l-rose-500">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Frustrated Customers</div>
            <div className="text-3xl font-bold font-display text-rose-600 dark:text-rose-400 mt-1">{frustratedCount}</div>
          </div>
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search tickets by subject, ID, customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </form>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold uppercase">
            <Filter className="w-3.5 h-3.5" /> Filters:
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none"
          >
            <option value="">All Priorities</option>
            <option value="URGENT">Urgent</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* Ticket List Queue */}
      {loading ? (
        <LoadingSkeleton type="list" />
      ) : tickets.length === 0 ? (
        <div className="p-12 glass-panel text-center space-y-3">
          <TicketIcon className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="font-display font-semibold text-lg">No tickets found</h3>
          <p className="text-sm text-slate-500">Try adjusting your search terms or filters.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <Link
              key={ticket.id}
              to={`/tickets/${ticket.id}`}
              className="p-5 glass-panel flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-indigo-500/50 hover:shadow-md transition-all group"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded">
                    {ticket.ticket_number}
                  </span>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {ticket.category}
                  </span>
                  <PriorityBadge priority={ticket.priority} />
                  <AIMoodBadge mood={ticket.customer_mood} confidence={ticket.mood_confidence} />
                </div>
                <h4 className="font-display font-semibold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {ticket.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                  Customer: <strong className="text-slate-700 dark:text-slate-300">{ticket.customer_name}</strong> ({ticket.customer_email})
                </p>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                {ticket.predicted_resolution_time && (
                  <div className="text-right hidden sm:block">
                    <div className="text-[10px] uppercase font-semibold text-slate-400">Est. Resolution</div>
                    <div className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      {ticket.predicted_resolution_time}
                    </div>
                  </div>
                )}

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    ticket.status === 'RESOLVED'
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 border border-emerald-200'
                      : ticket.status === 'IN_PROGRESS'
                      ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 border border-amber-200'
                      : 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 border border-rose-200'
                  }`}
                >
                  {ticket.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
