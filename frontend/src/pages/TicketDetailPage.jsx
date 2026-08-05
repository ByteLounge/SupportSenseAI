/**
 * Page: TicketDetailPage.jsx
 * Enterprise Ticket Details & Conversation View.
 * Left Column: Ticket Description, Customer Metadata, Status Switcher, Response Composer with Internal Note toggle.
 * Right Column: AI Analysis Panel, Activity Timeline, Action Checklists, Internal Notes.
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Textarea from '../components/common/Textarea';
import Dropdown from '../components/common/Dropdown';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import Skeleton from '../components/common/Skeleton';
import AIToneCheckerModal from '../components/ai/AIToneCheckerModal';
import AISuggestionsPanel from '../components/ai/AISuggestionsPanel';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  getTicketByIdApi,
  postMessageApi,
  updateTicketStatusApi,
  verifyResponseApi,
  toggleChecklistApi,
} from '../services/api';
import { formatDate, formatConfidence } from '../utils/formatters';
import { Send, Lock, ArrowLeft, CheckSquare, Clock, User, Mail, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function TicketDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Quality check modal state
  const [isQualityModalOpen, setIsQualityModalOpen] = useState(false);
  const [qualityData, setQualityData] = useState(null);
  const [checkingQuality, setCheckingQuality] = useState(false);

  const fetchTicket = async () => {
    try {
      const res = await getTicketByIdApi(id);
      setTicket(res.data || res);
    } catch (err) {
      console.error('Error loading ticket:', err);
      addToast('Failed to load ticket details', 'error');
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
        isInternalNote,
      });
      setReplyText('');
      addToast(isInternalNote ? 'Internal note added' : 'Customer response sent', 'success');
      fetchTicket();
    } catch (err) {
      console.error('Failed to post response:', err);
      addToast('Failed to deliver message', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await updateTicketStatusApi(id, { status: newStatus });
      addToast(`Status updated to ${newStatus}`, 'success');
      fetchTicket();
    } catch (err) {
      console.error('Failed to change status:', err);
      addToast('Failed to update ticket status', 'error');
    }
  };

  const handleQualityCheck = async () => {
    if (!replyText.trim()) {
      addToast('Please enter a response draft before verifying tone', 'warning');
      return;
    }
    setCheckingQuality(true);
    try {
      const res = await verifyResponseApi({
        ticketContext: ticket.description,
        draftReply: replyText,
      });
      setQualityData(res.data || res);
      setIsQualityModalOpen(true);
    } catch (err) {
      console.error('Failed response tone verification:', err);
      addToast('Failed to run tone quality analysis', 'error');
    } finally {
      setCheckingQuality(false);
    }
  };

  const handleCheckboxToggle = async (itemId, currentCompleted) => {
    try {
      await toggleChecklistApi(id, itemId, !currentCompleted);
      fetchTicket();
    } catch (err) {
      console.error('Checklist toggle error:', err);
    }
  };

  if (loading) {
    return (
      <MainLayout title="Ticket Overview">
        <Skeleton type="card" />
      </MainLayout>
    );
  }

  if (!ticket) {
    return (
      <MainLayout title="Ticket Overview">
        <div className="p-8 bg-white border border-[#E5E7EB] rounded-[6px] text-center text-[#6B7280]">
          Ticket not found or permission denied.
        </div>
      </MainLayout>
    );
  }

  const breadcrumbs = [
    { label: 'Dashboard', path: '/' },
    { label: 'Tickets', path: '/tickets' },
    { label: ticket.ticket_number || ticket.id },
  ];

  const messages = ticket.messages || [];
  const checklists = ticket.checklists || [];
  const isAgentOrAdmin = user && (user.role === 'AGENT' || user.role === 'ADMIN');

  return (
    <MainLayout
      breadcrumbs={breadcrumbs}
      title={`${ticket.ticket_number || ticket.id}: ${ticket.title}`}
      actions={
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" icon={ArrowLeft} onClick={() => navigate('/tickets')}>
            Back to Queue
          </Button>
          {isAgentOrAdmin && (
            <div className="flex items-center gap-2 text-xs">
              <span className="font-medium text-[#6B7280]">Status:</span>
              <Dropdown
                value={ticket.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                options={[
                  { label: 'OPEN', value: 'OPEN' },
                  { label: 'IN_PROGRESS', value: 'IN_PROGRESS' },
                  { label: 'RESOLVED', value: 'RESOLVED' },
                ]}
                size="sm"
              />
            </div>
          )}
        </div>
      }
    >
      {/* 2-Column Desktop Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Columns: Details, Thread, Response Composer */}
        <div className="lg:col-span-2 space-y-4">
          {/* Main Ticket Card */}
          <Card title="Ticket Details">
            <div className="space-y-4 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E5E7EB]">
                <div className="flex items-center gap-2">
                  <StatusBadge status={ticket.status} />
                  <PriorityBadge priority={ticket.priority} />
                  <span className="font-semibold text-[#111827]">{ticket.category}</span>
                </div>
                <div className="text-[#6B7280]">
                  Submitted on {formatDate(ticket.created_at)}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <span className="font-medium text-[#6B7280] uppercase tracking-wider text-[10px]">
                  Description
                </span>
                <p className="text-[#111827] leading-relaxed whitespace-pre-line bg-[#F8F9FA] p-3 border border-[#E5E7EB] rounded-[4px] font-sans">
                  {ticket.description}
                </p>
              </div>

              {/* Customer Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[4px] flex items-center gap-2">
                  <User className="w-4 h-4 text-[#6B7280]" />
                  <div>
                    <div className="text-[10px] text-[#6B7280]">Customer Name</div>
                    <div className="font-medium text-[#111827]">{ticket.customer_name}</div>
                  </div>
                </div>
                <div className="p-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[4px] flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#6B7280]" />
                  <div>
                    <div className="text-[10px] text-[#6B7280]">Email Address</div>
                    <div className="font-medium text-[#111827]">{ticket.customer_email}</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Conversation History Thread */}
          <Card title={`Conversation Thread (${messages.length})`}>
            <div className="space-y-3">
              {messages.length === 0 ? (
                <p className="text-xs text-[#6B7280] italic">No replies recorded in this thread yet.</p>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3.5 border rounded-[6px] text-xs space-y-1.5 ${
                      msg.is_internal_note
                        ? 'bg-[#FFFBEB] border-[#FDE68A] text-[#92400E]'
                        : msg.sender_role === 'CUSTOMER'
                        ? 'bg-white border-[#E5E7EB] text-[#111827]'
                        : 'bg-[#EFF6FF] border-[#BFDBFE] text-[#1E40AF]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] pb-1 border-b border-current opacity-30">
                      <div className="flex items-center gap-1.5 font-semibold">
                        {msg.is_internal_note && <Lock className="w-3 h-3 text-[#D97706]" />}
                        <span>{msg.sender_name}</span>
                        <span className="font-normal">({msg.sender_role})</span>
                      </div>
                      <span>{formatDate(msg.created_at)}</span>
                    </div>
                    <p className="leading-relaxed whitespace-pre-line font-mono text-xs">{msg.message_body}</p>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Response Composer */}
          <Card title="Post Response">
            <form onSubmit={handleSendMessage} className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#6B7280]">Compose message to customer or internal team note:</span>
                {isAgentOrAdmin && (
                  <label className="flex items-center gap-1.5 text-xs text-[#D97706] font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isInternalNote}
                      onChange={(e) => setIsInternalNote(e.target.checked)}
                      className="rounded border-[#D1D5DB] text-[#D97706] focus:ring-[#D97706]"
                    />
                    Internal Note Only
                  </label>
                )}
              </div>

              <Textarea
                rows={4}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={
                  isInternalNote
                    ? 'Write an internal note visible only to support agents...'
                    : 'Write a public response to the customer...'
                }
              />

              <div className="flex items-center justify-between pt-1">
                {isAgentOrAdmin ? (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    loading={checkingQuality}
                    disabled={!replyText.trim()}
                    onClick={handleQualityCheck}
                  >
                    Verify Response Quality
                  </Button>
                ) : (
                  <div />
                )}

                <Button
                  type="submit"
                  variant={isInternalNote ? 'warning' : 'primary'}
                  size="md"
                  loading={submitting}
                  disabled={!replyText.trim()}
                  icon={Send}
                >
                  {isInternalNote ? 'Post Internal Note' : 'Send Customer Response'}
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Right Column: AI Analysis, Activity Timeline, Action Checklist */}
        <div className="space-y-4">
          {/* AI Analysis Panel */}
          <AISuggestionsPanel
            ticket={ticket}
            onApplyReply={(suggested) => {
              setReplyText(suggested);
              addToast('AI suggested response loaded into composer', 'info');
            }}
            onEditReply={(suggested) => {
              setReplyText(suggested);
            }}
          />

          {/* Actionable Agent Checklist */}
          <Card title="Agent Action Checklist">
            <div className="space-y-2 text-xs">
              {checklists.length === 0 ? (
                <p className="text-[#6B7280] italic">No checklist items generated.</p>
              ) : (
                checklists.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-start gap-2 p-2 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[4px] hover:bg-[#F3F4F6] cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={item.is_completed}
                      onChange={() => handleCheckboxToggle(item.id, item.is_completed)}
                      className="mt-0.5 rounded border-[#D1D5DB] text-[#2563EB] focus:ring-[#2563EB]"
                    />
                    <span className={item.is_completed ? 'line-through text-[#6B7280]' : 'text-[#111827]'}>
                      {item.item_text}
                    </span>
                  </label>
                ))
              )}
            </div>
          </Card>

          {/* Activity Timeline */}
          <Card title="Activity Audit Log">
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-[#6B7280] mt-0.5 shrink-0" />
                <div>
                  <div className="font-medium text-[#111827]">Ticket Created</div>
                  <div className="text-[11px] text-[#6B7280]">{formatDate(ticket.created_at)}</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A] mt-0.5 shrink-0" />
                <div>
                  <div className="font-medium text-[#111827]">AI Triage Completed</div>
                  <div className="text-[11px] text-[#6B7280]">Categorized as {ticket.category}</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Response Quality Review Modal */}
      <AIToneCheckerModal
        isOpen={isQualityModalOpen}
        onClose={() => setIsQualityModalOpen(false)}
        qualityData={qualityData}
        onApplySuggestion={(suggestionText) => {
          setReplyText((prev) => `${prev}\n\n[Note: ${suggestionText}]`);
          addToast('AI suggestion applied to response draft', 'success');
        }}
      />
    </MainLayout>
  );
}
