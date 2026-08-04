/**
 * Page: TicketDetailPage.jsx
 * Lead Engineer: Member 1 (Frontend Lead)
 * Description: Detailed ticket conversation thread with AI Decision Assist & Response Quality Modal.
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTicketByIdApi, postMessageApi, updateTicketStatusApi, verifyResponseApi } from '../services/api';
import AIAssistDrawer from '../components/ai/AIAssistDrawer';
import QualityCheckModal from '../components/ai/QualityCheckModal';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { useAuth } from '../context/AuthContext';
import { Send, Sparkles, Shield, ArrowLeft, Lock } from 'lucide-react';

export default function TicketDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // AI Quality Checker Modal state
  const [isQualityModalOpen, setIsQualityModalOpen] = useState(false);
  const [qualityData, setQualityData] = useState(null);
  const [checkingQuality, setCheckingQuality] = useState(false);

  const fetchTicket = async () => {
    try {
      const res = await getTicketByIdApi(id);
      setTicket(res.data);
    } catch (err) {
      console.error('Error fetching ticket detail:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!replyText.trim()) return;

    setSubmitting(true);
    try {
      await postMessageApi(id, {
        messageBody: replyText,
        isInternalNote
      });
      setReplyText('');
      fetchTicket();
    } catch (err) {
      console.error('Failed to post message:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await updateTicketStatusApi(id, { status: newStatus });
      fetchTicket();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleQualityCheck = async () => {
    if (!replyText.trim()) return;
    setCheckingQuality(true);
    try {
      const res = await verifyResponseApi({
        ticketContext: ticket.description,
        draftReply: replyText
      });
      setQualityData(res.data);
      setIsQualityModalOpen(true);
    } catch (err) {
      console.error('Failed to check response quality:', err);
    } finally {
      setCheckingQuality(false);
    }
  };

  if (loading) return <LoadingSkeleton type="card" />;
  if (!ticket) return <div className="p-8 text-center text-slate-500">Ticket not found.</div>;

  const isAgentOrAdmin = user && (user.role === 'AGENT' || user.role === 'ADMIN');

  return (
    <div className="space-y-6">
      {/* Top Back Navigation & Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Workspace
        </button>

        {isAgentOrAdmin && (
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-400">Status:</span>
            <select
              value={ticket.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:outline-none"
            >
              <option value="OPEN">OPEN</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="RESOLVED">RESOLVED</option>
            </select>
          </div>
        )}
      </div>

      {/* Main Content Layout (Conversation + AI Drawer) */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Threaded Message Column */}
        <div className="flex-1 space-y-6">
          {/* Ticket Metadata Card */}
          <div className="glass-panel p-6 space-y-3">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded">
                {ticket.ticket_number}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {ticket.category}
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-50 dark:bg-rose-950/50 text-rose-600 border border-rose-200">
                {ticket.priority} PRIORITY
              </span>
            </div>
            <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white">
              {ticket.title}
            </h2>
            <div className="text-xs text-slate-500">
              Submitted by <strong className="text-slate-700 dark:text-slate-300">{ticket.customer_name}</strong> on {new Date(ticket.created_at).toLocaleString()}
            </div>
          </div>

          {/* Thread Messages */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
              Conversation History ({ticket.messages?.length || 0})
            </h3>

            {ticket.messages && ticket.messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-5 rounded-2xl space-y-2 border transition-all ${
                  msg.is_internal_note
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200 ml-4'
                    : msg.sender_role === 'CUSTOMER'
                    ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                    : 'bg-indigo-500/10 border-indigo-500/30 dark:bg-indigo-950/40 text-slate-900 dark:text-white'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-semibold">
                    {msg.is_internal_note && <Lock className="w-3.5 h-3.5 text-amber-500" />}
                    <span>{msg.sender_name}</span>
                    <span className="opacity-60 font-normal">({msg.sender_role})</span>
                  </div>
                  <span className="text-[11px] opacity-60">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-line">{msg.message_body}</p>
              </div>
            ))}
          </div>

          {/* Reply Composer */}
          <form onSubmit={handleSendMessage} className="glass-panel p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Post Response</h4>
              {isAgentOrAdmin && (
                <label className="flex items-center gap-2 text-xs font-medium text-amber-600 dark:text-amber-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isInternalNote}
                    onChange={(e) => setIsInternalNote(e.target.checked)}
                    className="rounded border-amber-400 text-amber-600 focus:ring-amber-500"
                  />
                  Internal Note Only
                </label>
              )}
            </div>

            <textarea
              rows={4}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={isInternalNote ? "Write an internal team note..." : "Write your public reply to customer..."}
              className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <div className="flex items-center justify-between">
              {isAgentOrAdmin ? (
                <button
                  type="button"
                  onClick={handleQualityCheck}
                  disabled={checkingQuality || !replyText.trim()}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  {checkingQuality ? 'Analyzing Tone...' : '✨ Verify Response Quality'}
                </button>
              ) : <div />}

              <button
                type="submit"
                disabled={submitting || !replyText.trim()}
                className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition-all flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                {submitting ? 'Sending...' : 'Send Response'}
              </button>
            </div>
          </form>
        </div>

        {/* Right Side AI Assist Drawer */}
        {isAgentOrAdmin && (
          <AIAssistDrawer ticket={ticket} onChecklistUpdate={fetchTicket} />
        )}
      </div>

      {/* Response Quality Check Modal */}
      <QualityCheckModal
        isOpen={isQualityModalOpen}
        onClose={() => setIsQualityModalOpen(false)}
        qualityData={qualityData}
        onApplySuggestion={(recText) => {
          setReplyText(prev => `${prev}\n\n[Note: ${recText}]`);
        }}
      />
    </div>
  );
}
