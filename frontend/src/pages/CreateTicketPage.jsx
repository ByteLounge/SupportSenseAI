/**
 * Page: CreateTicketPage.jsx
 * Lead Engineer: Member 1 (Frontend Lead)
 * Description: Ticket submission form for customer inquiry submission.
 */

import React, { useState } from 'react';
import { createTicketApi } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, ArrowLeft, Bot } from 'lucide-react';

export default function CreateTicketPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Billing');
  const [priority, setPriority] = useState('MEDIUM');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) return;

    setSubmitting(true);
    try {
      const res = await createTicketApi({ title, description, category, priority });
      navigate(`/tickets/${res.data.id}`);
    } catch (err) {
      console.error('Failed to submit ticket:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Cancel & Return
      </button>

      <div className="glass-panel p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white">Submit New Support Ticket</h2>
            <p className="text-xs text-slate-500">AI will automatically classify priority and generate assist checklists.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Ticket Subject / Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g. Double charged on annual subscription renewal"
              className="w-full px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none"
              >
                <option value="Billing">Billing</option>
                <option value="Technical">Technical</option>
                <option value="Account">Account</option>
                <option value="Feature Request">Feature Request</option>
                <option value="Bug">Bug</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Customer Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Detailed Description</label>
            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Describe what happened, error codes, steps to reproduce, or transaction details..."
              className="w-full p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
          >
            <Bot className="w-5 h-5" />
            {submitting ? 'Submitting & Running AI Triage...' : 'Submit Ticket & Trigger AI Triage'}
          </button>
        </form>
      </div>
    </div>
  );
}
