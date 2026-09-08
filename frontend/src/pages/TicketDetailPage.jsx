/**
 * Page: TicketDetailPage.jsx
 * Clean, modern ticket workspace with 2-column layout.
 * Streamlined conversation thread, actionable AI assistant, and unified properties.
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
        <div className="p-8 bg-token-card border border-token-border rounded-xl text-center text-token-text-secondary">
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
            <div className="p-4 bg-token-card border border-token-border rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-token-text-primary">
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
                      className={`py-1.5 px-2 rounded-lg text-[11px] font-medium transition-colors ${
                        isDone
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 font-semibold'
                          : 'bg-token-secondary text-token-text-muted'
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
            <div className="text-xs sm:text-sm text-token-text-primary leading-relaxed whitespace-pre-line p-3.5 bg-token-secondary/60 border border-token-border rounded-lg">
              {ticket.description}
            </div>
          </Card>

          {/* Conversation Thread */}
          <Card title={`Conversation (${messages.length})`}>
            <div className="space-y-3">
              {messages.length === 0 ? (
                <div className="text-xs text-token-text-secondary italic text-center py-4">
                  No messages yet. Reply below to continue the conversation.
                </div>
              ) : (
                messages.map((msg) => {
                  const isInternal = msg.is_internal_note;
                  const isUser = msg.sender_role === 'CUSTOMER';
                  return (
                    <div
                      key={msg.id}
                      className={`p-3.5 rounded-xl border text-xs space-y-1.5 transition-all ${
                        isInternal
                          ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-200'
                          : isUser
                          ? 'bg-token-card border-token-border text-token-text-primary'
                          : 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-200/60 dark:border-indigo-800/40 text-token-text-primary'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] pb-1 border-b border-current/10">
                        <div className="flex items-center gap-1.5 font-semibold">
                          {isInternal && <Lock className="w-3 h-3 text-amber-600 shrink-0" />}
                          <span>{msg.sender_name}</span>
                          <span className="font-normal opacity-70">
                            ({isInternal ? 'Internal Note' : msg.sender_role === 'CUSTOMER' ? 'Customer' : 'Support Specialist'})
                          </span>
                        </div>
                        <span className="opacity-60">{formatDate(msg.created_at)}</span>
                      </div>
                      <p className="leading-relaxed whitespace-pre-line font-sans text-xs">
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
            <form onSubmit={handleSendMessage} className="space-y-3">
              {!isCustomer && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-300 font-medium cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isInternalNote}
                      onChange={(e) => setIsInternalNote(e.target.checked)}
                      className="rounded border-token-border text-amber-600 focus:ring-amber-500"
                    />
                    <span>Internal Note (Hidden from customer)</span>
                  </label>

                  {ticket.ai_suggested_reply && (
                    <button
                      type="button"
                      onClick={() => setReplyText(ticket.ai_suggested_reply)}
                      className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Use AI Draft</span>
                    </button>
                  )}
                </div>
              )}

              <Textarea
                rows={3}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={
                  isInternalNote
                    ? 'Write an internal note for your team...'
                    : 'Write a response...'
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
                  {isInternalNote ? 'Save Note' : 'Send'}
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
                  <span className="text-[11px] text-token-text-secondary block mb-1">Status</span>
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

              <div className="p-3 bg-token-secondary/60 border border-token-border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-token-text-secondary">Department</span>
                  <span className="font-semibold text-token-text-primary">{ticket.assigned_department}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-token-text-secondary">Category</span>
                  <span className="font-medium text-token-text-primary">{ticket.category}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-token-text-secondary">Requester</span>
                  <span className="font-medium text-token-text-primary">{ticket.customer_name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-token-text-secondary">Sentiment</span>
                  <AIMoodBadge
                    mood={ticket.customer_mood || 'NEUTRAL'}
                    confidence={ticket.mood_confidence || 0.88}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* AI Copilot & Routing (for Agent & Admin) */}
          {!isCustomer && (
            <Card
              title="AI Assistant"
              actions={
                <div className="flex items-center gap-1 text-xs text-token-text-muted">
                  <Bot className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Gemini</span>
                </div>
              }
            >
              <div className="space-y-3.5 text-xs">
                {/* AI Department Recommendation */}
                <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-800/40 rounded-lg space-y-2">
                  <div>
                    <span className="text-[11px] text-token-text-secondary block">Suggested Department</span>
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                      {ticket.ai_suggested_department || 'Technical Support'}
                    </span>
                  </div>

                  {!ticket.ai_routing_approved ? (
                    <Button
                      variant="success"
                      size="sm"
                      className="w-full"
                      icon={Check}
                      onClick={handleApproveAiRouting}
                    >
                      Approve Routing
                    </Button>
                  ) : (
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Routing Verified</span>
                    </div>
                  )}
                </div>

                {/* Resolution Checklist */}
                {checklists.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between font-medium text-token-text-secondary">
                      <span>Resolution Steps</span>
                      <span className="text-[11px]">{completedChecklists}/{checklists.length}</span>
                    </div>

                    <div className="space-y-1.5">
                      {checklists.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleToggleChecklist(item.id, item.is_completed)}
                          className={`w-full p-2 rounded-lg border text-left flex items-start gap-2 text-xs transition-colors ${
                            item.is_completed
                              ? 'bg-emerald-50/60 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-300 border-emerald-200 line-through'
                              : 'bg-token-secondary/40 border-token-border text-token-text-primary hover:bg-token-muted'
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
                    <span className="text-[11px] font-semibold text-token-text-secondary uppercase tracking-wider block">
                      Handover History
                    </span>
                    {forwardHistory.map((item, idx) => (
                      <div key={idx} className="p-2 bg-token-secondary/50 rounded-lg text-[11px] space-y-0.5">
                        <div className="font-semibold text-token-text-primary">
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
                Check our knowledge base for answers to common questions and guides.
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
              Route
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
