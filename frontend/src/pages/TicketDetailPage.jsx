/**
 * Page: TicketDetailPage.jsx
 * Single, clean view for ticket details, customer thread, AI recommendations, and response composer.
 * All AI features are housed directly within this page.
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Textarea from '../components/common/Textarea';
import Dropdown from '../components/common/Dropdown';
import AIMoodBadge from '../components/ai/AIMoodBadge';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import Skeleton from '../components/common/Skeleton';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  getTicketByIdApi,
  postMessageApi,
  updateTicketStatusApi,
} from '../services/api';
import { formatDate, formatConfidence } from '../utils/formatters';
import { Send, Lock, ArrowLeft, Bot, Check, User, Mail } from 'lucide-react';

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
      addToast(`Ticket status changed to ${newStatus}`, 'success');
      fetchTicket();
    } catch (err) {
      console.error('Failed to change status:', err);
      addToast('Failed to update ticket status', 'error');
    }
  };

  if (loading) {
    return (
      <MainLayout title="Ticket Details">
        <Skeleton type="card" />
      </MainLayout>
    );
  }

  if (!ticket) {
    return (
      <MainLayout title="Ticket Details">
        <div className="p-8 bg-token-card border border-token-border rounded-[6px] text-center text-token-text-secondary">
          Ticket not found.
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
  const ai = ticket.ai_metadata || {};
  const suggestedCategory = ticket.category || ai.suggested_category || 'Technical Support';
  const suggestedDepartment = ticket.assigned_department || ai.suggested_department || 'Tier 2 Engineering';
  const confidence = ai.confidence_score || ai.mood_confidence || 0.94;
  const suggestedReply = ai.suggested_reply || ticket.suggested_reply || 'We are investigating the reported issue and will provide an update within 2 hours.';
  const isAgentOrAdmin = user && (user.role === 'AGENT' || user.role === 'ADMIN');

  return (
    <MainLayout
      breadcrumbs={breadcrumbs}
      title={`${ticket.ticket_number || ticket.id}: ${ticket.title}`}
      actions={
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" icon={ArrowLeft} onClick={() => navigate('/tickets')}>
            Back
          </Button>
          {isAgentOrAdmin && (
            <div className="flex items-center gap-2 text-xs">
              <span className="font-medium text-token-text-secondary">Status:</span>
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column: Ticket Description & Message Thread */}
        <div className="lg:col-span-2 space-y-4">
          <Card title="Ticket Information">
            <div className="space-y-4 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-token-border">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={ticket.status} />
                  <PriorityBadge priority={ticket.priority} />
                  <AIMoodBadge
                    mood={ticket.customer_mood || ai.customer_mood || 'NEUTRAL'}
                    confidence={ticket.mood_confidence || ai.mood_confidence || 0.85}
                  />
                  <span className="font-semibold text-token-text-primary text-xs ml-1">{ticket.category}</span>
                </div>
                <div className="text-token-text-secondary">
                  Created {formatDate(ticket.created_at)}
                </div>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-2.5 bg-token-secondary border border-token-border rounded-[4px] flex items-center gap-2">
                  <User className="w-4 h-4 text-token-text-muted" />
                  <div>
                    <div className="text-[10px] text-token-text-secondary">Customer</div>
                    <div className="font-semibold text-token-text-primary">{ticket.customer_name}</div>
                  </div>
                </div>
                <div className="p-2.5 bg-token-secondary border border-token-border rounded-[4px] flex items-center gap-2">
                  <Mail className="w-4 h-4 text-token-text-muted" />
                  <div>
                    <div className="text-[10px] text-token-text-secondary">Email</div>
                    <div className="font-semibold text-token-text-primary">{ticket.customer_email}</div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <span className="font-medium text-token-text-secondary uppercase tracking-wider text-[10px]">
                  Description
                </span>
                <p className="text-token-text-primary leading-relaxed whitespace-pre-line bg-token-secondary p-3 border border-token-border rounded-[4px] font-sans">
                  {ticket.description}
                </p>
              </div>
            </div>
          </Card>

          {/* Conversation Messages */}
          <Card title={`Replies & Messages (${messages.length})`}>
            <div className="space-y-3">
              {messages.length === 0 ? (
                <p className="text-xs text-token-text-secondary italic">No messages in this thread yet.</p>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3.5 border rounded-[6px] text-xs space-y-1.5 ${
                      msg.is_internal_note
                        ? 'bg-amber-500/10 border-amber-500/30 text-token-warning'
                        : msg.sender_role === 'CUSTOMER'
                        ? 'bg-token-card border-token-border text-token-text-primary'
                        : 'bg-blue-500/10 border-blue-500/30 text-token-accent'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] pb-1 border-b border-current opacity-40">
                      <div className="flex items-center gap-1.5 font-semibold">
                        {msg.is_internal_note && <Lock className="w-3 h-3 text-token-warning" />}
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
          <Card title="Write Response">
            <form onSubmit={handleSendMessage} className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-token-text-secondary">Type your message:</span>
                {isAgentOrAdmin && (
                  <label className="flex items-center gap-1.5 text-xs text-token-warning font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isInternalNote}
                      onChange={(e) => setIsInternalNote(e.target.checked)}
                      className="rounded border-token-border text-token-warning focus:ring-token-warning"
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
                    ? 'Write an internal note for agents...'
                    : 'Write a public response to the customer...'
                }
              />

              <div className="flex justify-end pt-1">
                <Button
                  type="submit"
                  variant={isInternalNote ? 'warning' : 'primary'}
                  size="md"
                  loading={submitting}
                  disabled={!replyText.trim()}
                  icon={Send}
                >
                  {isInternalNote ? 'Save Internal Note' : 'Send Response'}
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Right Column: Embedded AI Assistance Panel */}
        <div className="space-y-4">
          <Card
            title="AI Support Assist"
            actions={
              <div className="flex items-center gap-1 text-xs text-token-text-secondary">
                <Bot className="w-3.5 h-3.5 text-token-accent" />
                <span>Confidence: <strong className="text-token-text-primary">{formatConfidence(confidence)}</strong></span>
              </div>
            }
          >
            <div className="space-y-4 text-xs">
              {/* Customer Mood & Category & Department */}
              <div className="space-y-2">
                <div className="p-2.5 bg-token-secondary border border-token-border rounded-[4px] flex items-center justify-between">
                  <span className="text-token-text-secondary text-[11px]">Customer Mood</span>
                  <AIMoodBadge
                    mood={ticket.customer_mood || ai.customer_mood || 'NEUTRAL'}
                    confidence={ticket.mood_confidence || ai.mood_confidence || 0.85}
                  />
                </div>

                <div className="p-2.5 bg-token-secondary border border-token-border rounded-[4px] space-y-0.5">
                  <span className="text-token-text-secondary text-[11px] block">Suggested Category</span>
                  <span className="font-semibold text-token-text-primary">{suggestedCategory}</span>
                </div>

                <div className="p-2.5 bg-token-secondary border border-token-border rounded-[4px] space-y-0.5">
                  <span className="text-token-text-secondary text-[11px] block">Suggested Department</span>
                  <span className="font-semibold text-token-text-primary">{suggestedDepartment}</span>
                </div>
              </div>

              {/* Suggested Reply Box */}
              <div className="space-y-1.5">
                <span className="text-token-text-secondary font-medium">Suggested Reply</span>
                <div className="p-3 bg-token-secondary border border-token-border rounded-[4px] text-token-text-primary leading-relaxed whitespace-pre-line font-mono text-xs">
                  {suggestedReply}
                </div>
              </div>

              {/* Action Button: Single click to use suggested reply */}
              <Button
                variant="secondary"
                size="sm"
                className="w-full"
                icon={Check}
                onClick={() => {
                  setReplyText(suggestedReply);
                  addToast('AI suggested response copied to composer', 'info');
                }}
              >
                Use AI Suggested Reply
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
