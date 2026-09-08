/**
 * Page: TicketDetailPage.jsx
 * MoonRow styled Ticket Detail & Triage Workspace.
 * 2-column modular architecture, clean conversation bubbles, and vermilion accents.
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Textarea from '../components/common/Textarea';
import Dropdown from '../components/common/Dropdown';
import Modal from '../components/common/Modal';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import AIMoodBadge from '../components/ai/AIMoodBadge';
import Skeleton from '../components/common/Skeleton';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  getTicketByIdApi,
  postMessageApi,
  updateTicketStatusApi,
  forwardTicketApi,
  modifyTicketApi,
  deleteTicketApi,
  toggleChecklistApi,
  polishToneApi,
  summarizeTimelineApi,
} from '../services/api';
import { formatDate } from '../utils/formatters';
import {
  Send,
  Lock,
  ArrowLeft,
  Bot,
  Check,
  Building2,
  ArrowRightLeft,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles,
  HelpCircle,
  CheckSquare,
  Square,
  User,
  Mail,
} from 'lucide-react';

export default function TicketDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isCustomer, isAgent, isAdmin } = useAuth();
  const { addToast } = useToast();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Forward Modal State
  const [forwardModalOpen, setForwardModalOpen] = useState(false);
  const [forwardDept, setForwardDept] = useState('Technical Support');
  const [forwardComments, setForwardComments] = useState('');
  const [forwarding, setForwarding] = useState(false);

  // Admin Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    category: '',
    priority: '',
    status: '',
    assigned_department: '',
  });
  const [savingEdit, setSavingEdit] = useState(false);

  // AI Tone Polishing State
  const [isPolishingTone, setIsPolishingTone] = useState(false);
  const [activePolishedTone, setActivePolishedTone] = useState(null);

  // AI Reopened/Timeline Summary State
  const [timelineSummary, setTimelineSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [showSummaryBanner, setShowSummaryBanner] = useState(false);

  const handlePolishTone = async (tone) => {
    if (!replyText.trim()) {
      addToast('Type or paste a draft response first to polish tone', 'info');
      return;
    }
    setIsPolishingTone(true);
    try {
      const res = await polishToneApi({ draft: replyText, tone });
      const data = res.data || res;
      if (data && data.polished_text) {
        setReplyText(data.polished_text);
        setActivePolishedTone(tone);
        addToast(`Refined tone to ${tone.toUpperCase()}: ${data.rationale || 'Enhanced clarity'}`, 'success');
      }
    } catch (err) {
      console.error('Failed to polish tone:', err);
      addToast('Tone polishing unavailable right now', 'error');
    } finally {
      setIsPolishingTone(false);
    }
  };

  const handleToggleSummary = async () => {
    if (showSummaryBanner) {
      setShowSummaryBanner(false);
      return;
    }

    if (timelineSummary) {
      setShowSummaryBanner(true);
      return;
    }

    setLoadingSummary(true);
    try {
      const res = await summarizeTimelineApi(messages);
      const data = res.data || res;
      setTimelineSummary(data.timeline_summary || '• No summary available.');
      setShowSummaryBanner(true);
    } catch (err) {
      console.error('Failed to summarize thread:', err);
      addToast('Could not generate TL;DR summary', 'error');
    } finally {
      setLoadingSummary(false);
    }
  };

  const fetchTicket = async () => {
    try {
      const res = await getTicketByIdApi(id);
      const data = res.data || res;
      setTicket(data);
      if (data) {
        setForwardDept(data.ai_suggested_department || data.assigned_department || 'Technical Support');
        setEditForm({
          title: data.title,
          category: data.category,
          priority: data.priority,
          status: data.status,
          assigned_department: data.assigned_department,
        });
      }
    } catch (err) {
      console.error('Error loading ticket:', err);
      addToast('Failed to load ticket details', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [id, user]);

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!replyText.trim()) return;

    setSubmitting(true);
    try {
      await postMessageApi(id, {
        messageBody: replyText,
        isInternalNote: isCustomer ? false : isInternalNote,
      });
      setReplyText('');
      addToast(isInternalNote ? 'Internal note saved' : 'Response sent', 'success');
      fetchTicket();
    } catch (err) {
      addToast('Failed to deliver message', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await updateTicketStatusApi(id, { status: newStatus });
      addToast(`Status changed to ${newStatus}`, 'success');
      fetchTicket();
    } catch (err) {
      addToast('Failed to update status', 'error');
    }
  };

  const handleToggleChecklist = async (itemId, currentVal) => {
    try {
      await toggleChecklistApi(id, itemId, !currentVal);
      fetchTicket();
    } catch (err) {
      addToast('Failed to update checklist', 'error');
    }
  };

  const handleForwardSubmit = async (e) => {
    e.preventDefault();
    setForwarding(true);
    try {
      await forwardTicketApi(id, {
        targetDepartment: forwardDept,
        comments: forwardComments,
      });
      addToast(`Forwarded to ${forwardDept}`, 'success');
      setForwardModalOpen(false);
      fetchTicket();
    } catch (err) {
      addToast('Failed to forward ticket', 'error');
    } finally {
      setForwarding(false);
    }
  };

  const handleApproveAiRouting = async () => {
    try {
      await forwardTicketApi(id, {
        targetDepartment: ticket.ai_suggested_department || 'Technical Support',
        comments: 'Approved Gemini AI recommended department routing.',
      });
      addToast(`Routed to ${ticket.ai_suggested_department || 'Technical Support'}`, 'success');
      fetchTicket();
    } catch (err) {
      addToast('Failed to approve routing', 'error');
    }
  };

  const handleSaveAdminEdit = async (e) => {
    e.preventDefault();
    setSavingEdit(true);
    try {
      await modifyTicketApi(id, editForm);
      addToast('Ticket updated', 'success');
      setEditModalOpen(false);
      fetchTicket();
    } catch (err) {
      addToast('Failed to update ticket', 'error');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteTicket = async () => {
    if (!window.confirm('Are you sure you want to delete this ticket?')) return;
    try {
      await deleteTicketApi(id);
      addToast('Ticket deleted', 'info');
      navigate('/tickets');
    } catch (err) {
      addToast('Failed to delete ticket', 'error');
    }
  };

  if (loading) {
    return (
      <MainLayout title="Loading Ticket...">
        <Skeleton type="card" />
      </MainLayout>
    );
  }

  if (!ticket) {
    return (
      <MainLayout title="Ticket Details">
        <div className="p-8 bg-token-card border border-token-border rounded-2xl text-center text-token-text-secondary">
          Ticket not found or you do not have permission to view it.
        </div>
      </MainLayout>
    );
  }

  const messages = ticket.messages || [];
  const checklists = ticket.checklists || [];
  const forwardHistory = ticket.forward_history || [];
  const completedChecklists = checklists.filter(c => c.is_completed).length;

  return (
    <MainLayout
      title={`${ticket.ticket_number || ticket.id}: ${ticket.title}`}
      subtitle={`Submitted on ${formatDate(ticket.created_at)}`}
      actions={
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="secondary"
            size="sm"
            icon={ArrowLeft}
            onClick={() => navigate('/tickets')}
          >
            Back
          </Button>

          {!isCustomer && (
            <Button
              variant="secondary"
              size="sm"
              icon={ArrowRightLeft}
              onClick={() => setForwardModalOpen(true)}
            >
              Route
            </Button>
          )}

          {isAdmin && (
            <>
              <Button
                variant="secondary"
                size="sm"
                icon={Edit}
                onClick={() => setEditModalOpen(true)}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                size="sm"
                icon={Trash2}
                onClick={handleDeleteTicket}
              >
                Delete
              </Button>
            </>
          )}
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column (65%): Inquiry Details, Thread, Composer */}
        <div className="lg:col-span-2 space-y-4">
          {/* Customer Progress Bar (for Customers) */}
          {isCustomer && (
            <div className="p-5 bg-token-card border border-token-border rounded-2xl shadow-card space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-token-text-primary tracking-tight">
                <span>Resolution Progress</span>
                <StatusBadge status={ticket.status} />
              </div>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                {[
                  { step: 1, label: 'Submitted' },
                  { step: 2, label: 'Triage' },
                  { step: 3, label: 'Assigned' },
                  { step: 4, label: 'Resolved' },
                ].map((s) => {
                  const isDone =
                    ticket.status === 'RESOLVED' ||
                    (s.step === 1) ||
                    (s.step === 2 && ticket.status !== 'OPEN') ||
                    (s.step === 3 && ticket.assigned_department);
                  return (
                    <div
                      key={s.step}
                      className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-colors ${
                        isDone
                          ? 'bg-[#FD451B]/10 text-[#FD451B] border border-[#FD451B]/20'
                          : 'bg-token-muted text-token-text-muted'
                      }`}
                    >
                      {s.label}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Inquiry Description Card */}
          <Card
            title="Inquiry Details"
            actions={
              <div className="flex items-center gap-2">
                <StatusBadge status={ticket.status} />
                <PriorityBadge priority={ticket.priority} />
              </div>
            }
          >
            <div className="text-xs sm:text-sm text-token-text-primary leading-relaxed whitespace-pre-line p-4 bg-token-muted/60 border border-token-border rounded-xl font-medium">
              {ticket.description}
            </div>
          </Card>

          {/* Conversation Thread */}
          <Card
            title={`Conversation (${messages.length})`}
            actions={
              messages.length > 0 && (
                <Button
                  variant="ghost"
                  size="xs"
                  icon={Sparkles}
                  loading={loadingSummary}
                  onClick={handleToggleSummary}
                >
                  {showSummaryBanner ? 'Hide TL;DR' : '✨ Executive TL;DR'}
                </Button>
              )
            }
          >
            {showSummaryBanner && timelineSummary && (
              <div className="mb-4 p-3.5 bg-gradient-to-r from-moonrow-primary/10 via-amber-500/10 to-token-card border border-moonrow-primary/30 rounded-2xl text-xs space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between font-bold text-token-text-primary text-xs">
                  <span className="flex items-center gap-1.5 text-moonrow-primary">
                    <Sparkles className="w-3.5 h-3.5" />
                    Chronological Executive Summary (TL;DR)
                  </span>
                  <button
                    onClick={() => setShowSummaryBanner(false)}
                    className="text-token-text-muted hover:text-token-text-primary text-[11px]"
                  >
                    ✕
                  </button>
                </div>
                <div className="text-token-text-secondary whitespace-pre-line leading-relaxed font-mono text-[11px] bg-token-card/80 p-2.5 rounded-xl border border-token-border/50">
                  {timelineSummary}
                </div>
              </div>
            )}

            <div className="space-y-3.5">
              {messages.length === 0 ? (
                <div className="text-xs text-token-text-secondary italic text-center py-6">
                  No messages yet. Send a response below to update the customer.
                </div>
              ) : (
                messages.map((msg) => {
                  const isInternal = msg.is_internal_note;
                  const isUser = msg.sender_role === 'CUSTOMER';
                  return (
                    <div
                      key={msg.id}
                      className={`p-4 rounded-2xl border text-xs space-y-2 transition-all ${
                        isInternal
                          ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40 text-amber-950 dark:text-amber-200'
                          : isUser
                          ? 'bg-token-card border-token-border text-token-text-primary shadow-2xs'
                          : 'bg-[#FD451B]/5 border-[#FD451B]/20 text-token-text-primary'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] pb-1.5 border-b border-current/10">
                        <div className="flex items-center gap-2 font-bold">
                          {isInternal && <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
                          <span>{msg.sender_name}</span>
                          <span className="font-medium opacity-60">
                            ({isInternal ? 'Internal Note' : msg.sender_role === 'CUSTOMER' ? 'Customer' : 'Support Specialist'})
                          </span>
                        </div>
                        <span className="opacity-60 font-medium">{formatDate(msg.created_at)}</span>
                      </div>
                      <p className="leading-relaxed whitespace-pre-line text-xs font-normal">
                        {msg.message_body}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </Card>

          {/* Response Composer */}
          <Card title="Reply">
            <form onSubmit={handleSendMessage} className="space-y-3.5">
              {!isCustomer && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-300 font-semibold cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isInternalNote}
                      onChange={(e) => setIsInternalNote(e.target.checked)}
                      className="rounded border-token-border text-[#FD451B] focus:ring-[#FD451B]"
                    />
                    <span>Internal Note (Hidden from customer)</span>
                  </label>

                  {ticket.ai_suggested_reply && (
                    <button
                      type="button"
                      onClick={() => setReplyText(ticket.ai_suggested_reply)}
                      className="text-xs text-[#FD451B] font-bold hover:underline flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Use AI Draft</span>
                    </button>
                  )}
                </div>
              )}

              {/* AI 1-Click Tone Refiner Bar for Agents */}
              {!isCustomer && (
                <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-xl bg-token-secondary/60 border border-token-border text-[11px]">
                  <span className="text-token-text-muted flex items-center gap-1 font-medium">
                    <Sparkles className="w-3 h-3 text-moonrow-primary" />
                    <span>AI 1-Click Tone Polisher:</span>
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {[
                      { key: 'empathetic', label: 'Empathetic', icon: '❤️' },
                      { key: 'concise', label: 'Concise TL;DR', icon: '⚡' },
                      { key: 'formal', label: 'Formal Enterprise', icon: '👔' },
                      { key: 'technical', label: 'Deep Technical', icon: '🛠️' },
                    ].map((t) => (
                      <button
                        key={t.key}
                        type="button"
                        onClick={() => handlePolishTone(t.key)}
                        disabled={isPolishingTone || !replyText.trim()}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all flex items-center gap-1 ${
                          activePolishedTone === t.key
                            ? 'bg-moonrow-primary text-white border-moonrow-primary shadow-xs'
                            : 'bg-token-card text-token-text-secondary hover:text-moonrow-primary hover:border-moonrow-primary/50 border-token-border'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <span>{t.icon}</span>
                        <span>{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <Textarea
                rows={3}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={
                  isInternalNote
                    ? 'Write an internal handover or technical note for your team...'
                    : 'Write a public response to the customer...'
                }
              />

              <div className="flex justify-end pt-1">
                <Button
                  type="submit"
                  variant={isInternalNote ? 'warning' : 'primary'}
                  loading={submitting}
                  disabled={!replyText.trim()}
                  icon={Send}
                >
                  {isInternalNote ? 'Save Note' : 'Send Reply'}
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Right Column (35%): Properties & AI Copilot */}
        <div className="space-y-4">
          {/* Ticket Properties */}
          <Card title="Properties">
            <div className="space-y-3 text-xs">
              {!isCustomer && (
                <div>
                  <span className="text-[11px] font-bold text-token-text-secondary block mb-1">Status</span>
                  <Dropdown
                    value={ticket.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    options={[
                      { label: 'Open', value: 'OPEN' },
                      { label: 'In Progress', value: 'IN_PROGRESS' },
                      { label: 'Resolved', value: 'RESOLVED' },
                      { label: 'Closed', value: 'CLOSED' },
                    ]}
                    size="sm"
                  />
                </div>
              )}

              <div className="p-4 bg-token-muted/60 border border-token-border rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-token-text-secondary font-medium">Department</span>
                  <span className="font-bold text-token-text-primary">{ticket.assigned_department}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-token-text-secondary font-medium">Category</span>
                  <span className="font-semibold text-token-text-primary">{ticket.category}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-token-text-secondary font-medium">Requester</span>
                  <span className="font-semibold text-token-text-primary">{ticket.customer_name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-token-text-secondary font-medium">Sentiment</span>
                  <AIMoodBadge
                    mood={ticket.customer_mood || 'NEUTRAL'}
                    confidence={ticket.mood_confidence || 0.88}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* AI Copilot & Routing (Agent & Admin) */}
          {!isCustomer && (
            <Card
              title="AI Assistant"
              actions={
                <div className="flex items-center gap-1.5 text-xs text-[#FD451B] font-bold">
                  <Bot className="w-4 h-4 text-[#FD451B]" />
                  <span>Gemini</span>
                </div>
              }
            >
              <div className="space-y-4 text-xs">
                {/* AI Department Recommendation */}
                <div className="p-4 bg-[#FD451B]/5 border border-[#FD451B]/20 rounded-xl space-y-2.5">
                  <div>
                    <span className="text-[11px] font-bold text-token-text-secondary uppercase tracking-wider block">
                      Recommended Department
                    </span>
                    <span className="font-extrabold text-[#FD451B] text-sm mt-0.5 block">
                      {ticket.ai_suggested_department || 'Technical Support'}
                    </span>
                  </div>

                  {!ticket.ai_routing_approved ? (
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full"
                      icon={Check}
                      onClick={handleApproveAiRouting}
                    >
                      Approve Routing
                    </Button>
                  ) : (
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Routing Verified</span>
                    </div>
                  )}
                </div>

                {/* Resolution Checklist */}
                {checklists.length > 0 && (
                  <div className="space-y-2.5 pt-1">
                    <div className="flex items-center justify-between font-bold text-token-text-primary">
                      <span>Resolution Steps</span>
                      <span className="text-xs text-[#FD451B] font-extrabold">{completedChecklists}/{checklists.length}</span>
                    </div>

                    <div className="space-y-1.5">
                      {checklists.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleToggleChecklist(item.id, item.is_completed)}
                          className={`w-full p-2.5 rounded-xl border text-left flex items-start gap-2.5 text-xs transition-colors ${
                            item.is_completed
                              ? 'bg-emerald-50/60 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-300 border-emerald-200 line-through font-medium'
                              : 'bg-token-muted border-token-border text-token-text-primary hover:bg-token-card'
                          }`}
                        >
                          {item.is_completed ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          ) : (
                            <Square className="w-4 h-4 text-token-text-muted shrink-0 mt-0.5" />
                          )}
                          <span>{item.item_text}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Handover History */}
                {forwardHistory.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-token-border">
                    <span className="text-[11px] font-bold text-token-text-secondary uppercase tracking-wider block">
                      Handover History
                    </span>
                    {forwardHistory.map((item, idx) => (
                      <div key={idx} className="p-2.5 bg-token-muted rounded-xl text-[11px] space-y-1">
                        <div className="font-bold text-token-text-primary">
                          To: {item.forwarded_to}
                        </div>
                        {item.comments && (
                          <div className="text-token-text-secondary italic">"{item.comments}"</div>
                        )}
                        <div className="text-token-text-muted text-[10px]">{formatDate(item.date)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Quick Help for Customers */}
          {isCustomer && (
            <Card title="Need Help?">
              <p className="text-xs text-token-text-secondary leading-relaxed mb-3">
                Check our Knowledge Base articles for fast self-service resolutions.
              </p>
              <Button
                variant="secondary"
                size="sm"
                className="w-full"
                icon={HelpCircle}
                onClick={() => navigate('/knowledge-base')}
              >
                Browse FAQs
              </Button>
            </Card>
          )}
        </div>
      </div>

      {/* Forward Modal */}
      <Modal
        isOpen={forwardModalOpen}
        onClose={() => setForwardModalOpen(false)}
        title="Route Ticket"
        size="md"
      >
        <form onSubmit={handleForwardSubmit} className="space-y-4 text-xs">
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
            placeholder="Optional notes for the receiving specialist..."
            rows={3}
            value={forwardComments}
            onChange={(e) => setForwardComments(e.target.value)}
          />
          <div className="flex justify-end gap-2 pt-2 border-t border-token-border">
            <Button variant="secondary" onClick={() => setForwardModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={forwarding} icon={Send}>
              Confirm Route
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
        <form onSubmit={handleSaveAdminEdit} className="space-y-4 text-xs">
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
