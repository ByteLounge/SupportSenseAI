/**
 * Page: TicketDetailPage.jsx
 * Role-adaptive Ticket Detail View:
 * - Customer: Friendly status progress stepper, clean public thread, simple reply composer, related help.
 * - Agent: Full ticket triage, AI categorization approval, department forwarding with comments, department-specific AI suggested reply, checklists, internal notes.
 * - Admin: Master override mode (modify all attributes), force re-routing, delete ticket, and full internal audit log.
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
import Badge, { StatusBadge, PriorityBadge } from '../components/common/Badge';
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
import { formatDate, formatConfidence } from '../utils/formatters';
import {
  Send,
  Lock,
  ArrowLeft,
  Bot,
  Check,
  User,
  Mail,
  Building2,
  ArrowRightLeft,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles,
  Shield,
  HelpCircle,
  CheckSquare,
  Square,
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
      addToast(isInternalNote ? 'Internal note saved' : 'Response sent successfully', 'success');
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
      addToast(`Ticket status updated to ${newStatus}`, 'success');
      fetchTicket();
    } catch (err) {
      console.error('Failed to change status:', err);
      addToast('Failed to update ticket status', 'error');
    }
  };

  const handleToggleChecklist = async (itemId, currentVal) => {
    try {
      await toggleChecklistApi(id, itemId, !currentVal);
      fetchTicket();
    } catch (err) {
      addToast('Failed to update checklist item', 'error');
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
      addToast(`Ticket forwarded to ${forwardDept}`, 'success');
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
        comments: 'Agent approved Gemini AI recommended department routing.',
      });
      addToast(`Approved AI routing to ${ticket.ai_suggested_department || 'Technical Support'}`, 'success');
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
      addToast('Ticket attributes modified successfully by Administrator', 'success');
      setEditModalOpen(false);
      fetchTicket();
    } catch (err) {
      addToast('Failed to modify ticket', 'error');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteTicket = async () => {
    if (!window.confirm('Are you sure you want to permanently delete / archive this ticket?')) return;
    try {
      await deleteTicketApi(id);
      addToast('Ticket deleted successfully', 'info');
      navigate('/tickets');
    } catch (err) {
      addToast('Failed to delete ticket', 'error');
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
          Ticket not found or you do not have permission to view it.
        </div>
      </MainLayout>
    );
  }

  const breadcrumbs = [
    { label: isCustomer ? 'My Queries' : 'Tickets', path: '/tickets' },
    { label: ticket.ticket_number || ticket.id },
  ];

  const messages = ticket.messages || [];
  const checklists = ticket.checklists || [];
  const forwardHistory = ticket.forward_history || [];
  const suggestedReply = ticket.ai_suggested_reply || 'We are investigating the reported issue and our specialists will update you shortly.';

  // -------------------------------------------------------------
  // CUSTOMER VIEW: Clean, supportive stepper & conversation
  // -------------------------------------------------------------
  if (isCustomer) {
    const getStepStatus = () => {
      if (ticket.status === 'RESOLVED' || ticket.status === 'CLOSED') return 4;
      if (ticket.assigned_department && ticket.assigned_department !== 'Unassigned') return 3;
      if (ticket.status === 'IN_PROGRESS') return 2;
      return 1;
    };
    const currentStep = getStepStatus();

    return (
      <MainLayout
        breadcrumbs={breadcrumbs}
        title={`Query ${ticket.ticket_number || ticket.id}: ${ticket.title}`}
        actions={
          <Button variant="secondary" size="sm" icon={ArrowLeft} onClick={() => navigate('/tickets')}>
            Back to My Queries
          </Button>
        }
      >
        <div className="space-y-6">
          {/* Friendly Customer Progress Stepper */}
          <div className="p-5 bg-token-card border border-token-border rounded-[8px] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-token-text-primary uppercase tracking-wider">
                Support Resolution Progress
              </span>
              <StatusBadge status={ticket.status} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {[
                { step: 1, label: 'Ticket Submitted', desc: 'Received by system' },
                { step: 2, label: 'Under Review', desc: 'AI & agent triage' },
                { step: 3, label: 'Assigned to Specialist', desc: ticket.assigned_department || 'Support Team' },
                { step: 4, label: 'Resolved', desc: 'Solution verified' },
              ].map((s) => {
                const isPassed = currentStep >= s.step;
                const isCurrent = currentStep === s.step;
                return (
                  <div
                    key={s.step}
                    className={`p-3 rounded-[6px] border ${
                      isCurrent
                        ? 'border-emerald-500 bg-emerald-500/10 font-semibold'
                        : isPassed
                        ? 'border-emerald-500/40 bg-emerald-500/5'
                        : 'border-token-border bg-token-secondary/40 text-token-text-muted'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      {isPassed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Clock className="w-4 h-4 text-token-text-muted" />
                      )}
                      <span className={isPassed ? 'text-emerald-700 dark:text-emerald-300 font-semibold' : ''}>
                        {s.label}
                      </span>
                    </div>
                    <div className="text-[11px] text-token-text-secondary mt-1">{s.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2-Column: Thread + Customer Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 space-y-4">
              {/* Inquiry Description Card */}
              <Card title="Inquiry Description">
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between text-token-text-secondary pb-2 border-b border-token-border">
                    <span>Category: <strong className="text-token-text-primary">{ticket.category}</strong></span>
                    <span>Submitted on {formatDate(ticket.created_at)}</span>
                  </div>
                  <p className="text-token-text-primary leading-relaxed whitespace-pre-line bg-token-secondary p-3.5 border border-token-border rounded-[6px]">
                    {ticket.description}
                  </p>
                </div>
              </Card>

              {/* Message Thread */}
              <Card title={`Conversation Thread (${messages.length})`}>
                <div className="space-y-3">
                  {messages.length === 0 ? (
                    <p className="text-xs text-token-text-secondary italic">Our support team will respond to your query shortly.</p>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-3.5 rounded-[6px] border text-xs space-y-2 ${
                          msg.sender_role === 'CUSTOMER'
                            ? 'bg-token-card border-token-border'
                            : 'bg-emerald-500/5 border-emerald-500/20'
                        }`}
                      >
                        <div className="flex items-center justify-between pb-1.5 border-b border-current opacity-40 text-[11px]">
                          <div className="flex items-center gap-2 font-semibold">
                            <span>{msg.sender_name}</span>
                            <span className="font-normal opacity-80">({msg.sender_role === 'CUSTOMER' ? 'You' : 'Support Specialist'})</span>
                          </div>
                          <span>{formatDate(msg.created_at)}</span>
                        </div>
                        <p className="leading-relaxed whitespace-pre-line">{msg.message_body}</p>
                      </div>
                    ))
                  )}
                </div>
              </Card>

              {/* Customer Response Composer */}
              <Card title="Reply to Support Team">
                <form onSubmit={handleSendMessage} className="space-y-3">
                  <Textarea
                    rows={4}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your message, provide additional error logs, or follow up with our specialists..."
                  />
                  <div className="flex justify-end pt-1">
                    <Button
                      type="submit"
                      variant="primary"
                      loading={submitting}
                      disabled={!replyText.trim()}
                      icon={Send}
                    >
                      Send Message
                    </Button>
                  </div>
                </form>
              </Card>
            </div>

            {/* Customer Right Sidebar */}
            <div className="space-y-4">
              <Card title="Support Ticket Details">
                <div className="space-y-3 text-xs">
                  <div className="p-2.5 bg-token-secondary border border-token-border rounded-[4px] space-y-1">
                    <span className="text-[11px] text-token-text-secondary block">Assigned Support Department</span>
                    <span className="font-semibold text-token-text-primary flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                      {ticket.assigned_department || 'General Support'}
                    </span>
                  </div>

                  <div className="p-2.5 bg-token-secondary border border-token-border rounded-[4px] space-y-1">
                    <span className="text-[11px] text-token-text-secondary block">Estimated Resolution Time</span>
                    <span className="font-semibold text-token-text-primary flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-token-text-muted" />
                      {ticket.predicted_resolution_time || '1-2 business days'}
                    </span>
                  </div>
                </div>
              </Card>

              <Card title="Need Immediate Help?">
                <div className="space-y-2 text-xs text-token-text-secondary">
                  <p>Check our Knowledge Base articles and FAQs for answers to common questions.</p>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full mt-2"
                    icon={HelpCircle}
                    onClick={() => navigate('/knowledge-base')}
                  >
                    Open Knowledge Base
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // -------------------------------------------------------------
  // AGENT & ADMIN VIEW: Full Triage, Department Routing, AI Reply, Checklists
  // -------------------------------------------------------------
  return (
    <MainLayout
      breadcrumbs={breadcrumbs}
      title={`${ticket.ticket_number || ticket.id}: ${ticket.title}`}
      actions={
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="secondary" size="sm" icon={ArrowLeft} onClick={() => navigate('/tickets')}>
            Back
          </Button>

          {/* Quick Forward Button */}
          <Button
            variant="secondary"
            size="sm"
            icon={ArrowRightLeft}
            onClick={() => setForwardModalOpen(true)}
          >
            Forward to Dept
          </Button>

          {/* Admin Full Override Button */}
          {isAdmin && (
            <Button
              variant="secondary"
              size="sm"
              icon={Edit}
              onClick={() => setEditModalOpen(true)}
            >
              Modify Ticket
            </Button>
          )}

          {/* Status Changer */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-medium text-token-text-secondary">Status:</span>
            <Dropdown
              value={ticket.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              options={[
                { label: 'OPEN', value: 'OPEN' },
                { label: 'IN_PROGRESS', value: 'IN_PROGRESS' },
                { label: 'RESOLVED', value: 'RESOLVED' },
                { label: 'CLOSED', value: 'CLOSED' },
              ]}
              size="sm"
            />
          </div>

          {/* Admin Delete Action */}
          {isAdmin && (
            <Button variant="danger" size="sm" icon={Trash2} onClick={handleDeleteTicket}>
              Delete
            </Button>
          )}
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2-Columns: Ticket Info, Conversation, Handover History, Composer */}
        <div className="lg:col-span-2 space-y-4">
          {/* Ticket Information Card */}
          <Card title="Ticket Master Information">
            <div className="space-y-4 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-token-border">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={ticket.status} />
                  <PriorityBadge priority={ticket.priority} />
                  <AIMoodBadge
                    mood={ticket.customer_mood || 'NEUTRAL'}
                    confidence={ticket.mood_confidence || 0.88}
                  />
                  <Badge variant="primary">Dept: {ticket.assigned_department}</Badge>
                </div>
                <div className="text-token-text-secondary">
                  Created {formatDate(ticket.created_at)}
                </div>
              </div>

              {/* Customer Roster Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-2.5 bg-token-secondary border border-token-border rounded-[4px] flex items-center gap-2">
                  <User className="w-4 h-4 text-token-text-muted" />
                  <div>
                    <div className="text-[10px] text-token-text-secondary">Customer Name & Organization</div>
                    <div className="font-semibold text-token-text-primary">
                      {ticket.customer_name} ({ticket.customer_org || 'Client'})
                    </div>
                  </div>
                </div>
                <div className="p-2.5 bg-token-secondary border border-token-border rounded-[4px] flex items-center gap-2">
                  <Mail className="w-4 h-4 text-token-text-muted" />
                  <div>
                    <div className="text-[10px] text-token-text-secondary">Contact Email</div>
                    <div className="font-semibold text-token-text-primary">{ticket.customer_email}</div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <span className="font-medium text-token-text-secondary uppercase tracking-wider text-[10px]">
                  Description
                </span>
                <p className="text-token-text-primary leading-relaxed whitespace-pre-line bg-token-secondary p-3 border border-token-border rounded-[4px]">
                  {ticket.description}
                </p>
              </div>
            </div>
          </Card>

          {/* Inter-Department Forwarding History */}
          {forwardHistory.length > 0 && (
            <Card title="Inter-Department Handover History">
              <div className="space-y-2 text-xs">
                {forwardHistory.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-[6px] bg-blue-500/5 border border-blue-500/20 space-y-1">
                    <div className="flex items-center justify-between font-semibold text-blue-700 dark:text-blue-300">
                      <span className="flex items-center gap-1.5">
                        <ArrowRightLeft className="w-3.5 h-3.5 text-blue-600" />
                        Forwarded to {item.forwarded_to} by {item.forwarded_by}
                      </span>
                      <span className="text-[11px] font-normal text-token-text-secondary">{formatDate(item.date)}</span>
                    </div>
                    {item.comments && (
                      <div className="text-token-text-primary italic bg-token-card p-2 rounded border border-token-border/60">
                        "{item.comments}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Conversation Messages */}
          <Card title={`Conversation & Internal Notes (${messages.length})`}>
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
          <Card title="Write Response / Internal Note">
            <form onSubmit={handleSendMessage} className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-token-text-secondary">Type message:</span>
                <label className="flex items-center gap-1.5 text-xs text-token-warning font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isInternalNote}
                    onChange={(e) => setIsInternalNote(e.target.checked)}
                    className="rounded border-token-border text-token-warning focus:ring-token-warning"
                  />
                  Internal Note (Hidden from Customer)
                </label>
              </div>

              <Textarea
                rows={4}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={
                  isInternalNote
                    ? 'Write an internal note for agents or department specialists...'
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
                  {isInternalNote ? 'Save Internal Note' : 'Send Public Response'}
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Right Column: AI Triage Decision, Department Forwarding Approval, Checklists */}
        <div className="space-y-4">
          {/* AI Decision & Suggested Routing Panel */}
          <Card
            title="AI Triage & Decision Panel"
            actions={
              <div className="flex items-center gap-1 text-xs text-token-text-secondary">
                <Bot className="w-3.5 h-3.5 text-token-accent" />
                <span>Confidence: <strong>{formatConfidence(ticket.mood_confidence || 0.94)}</strong></span>
              </div>
            }
          >
            <div className="space-y-3.5 text-xs">
              <div className="p-2.5 bg-token-secondary border border-token-border rounded-[4px] space-y-1">
                <span className="text-[11px] text-token-text-secondary block">AI Suggested Category</span>
                <span className="font-semibold text-token-text-primary">{ticket.ai_suggested_category || ticket.category}</span>
              </div>

              <div className="p-2.5 bg-token-secondary border border-token-border rounded-[4px] space-y-1">
                <span className="text-[11px] text-token-text-secondary block">AI Recommended Department</span>
                <span className="font-semibold text-blue-600 block">{ticket.ai_suggested_department || 'Technical Support'}</span>
                {!ticket.ai_routing_approved ? (
                  <div className="pt-2">
                    <Button
                      variant="success"
                      size="sm"
                      className="w-full"
                      icon={Check}
                      onClick={handleApproveAiRouting}
                    >
                      Approve & Route to {ticket.ai_suggested_department || 'Department'}
                    </Button>
                  </div>
                ) : (
                  <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
                    <CheckCircle2 className="w-3 h-3" /> Routing Verified by Support
                  </span>
                )}
              </div>

              {/* Department Suggested Reply */}
              <div className="space-y-1.5 pt-1">
                <span className="text-token-text-secondary font-medium">AI Suggested Reply ({ticket.assigned_department})</span>
                <div className="p-3 bg-token-secondary border border-token-border rounded-[4px] text-token-text-primary leading-relaxed font-sans text-xs">
                  {suggestedReply}
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full mt-1"
                  icon={Check}
                  onClick={() => {
                    setReplyText(suggestedReply);
                    addToast('AI suggested response inserted into composer', 'info');
                  }}
                >
                  Use Suggested Reply
                </Button>
              </div>
            </div>
          </Card>

          {/* AI Task Checklist */}
          {checklists.length > 0 && (
            <Card title="Agent Resolution Checklist">
              <div className="space-y-2 text-xs">
                {checklists.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleToggleChecklist(item.id, item.is_completed)}
                    className={`w-full p-2.5 rounded-[4px] border text-left flex items-start gap-2 transition-colors ${
                      item.is_completed
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-200 line-through'
                        : 'bg-token-secondary border-token-border text-token-text-primary hover:bg-token-muted'
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
            </Card>
          )}
        </div>
      </div>

      {/* Forward Modal */}
      <Modal
        isOpen={forwardModalOpen}
        onClose={() => setForwardModalOpen(false)}
        title={`Forward Ticket ${ticket.ticket_number} to Department`}
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
            label="Handover Comments / Notes (Internal)"
            placeholder="Add specific instructions for the receiving department specialist..."
            rows={3}
            value={forwardComments}
            onChange={(e) => setForwardComments(e.target.value)}
          />
          <div className="flex justify-end gap-2 pt-2 border-t border-token-border">
            <Button variant="secondary" onClick={() => setForwardModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={forwarding} icon={Send}>
              Forward & Notify Department
            </Button>
          </div>
        </form>
      </Modal>

      {/* Admin Quick Modify Ticket Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={`Admin Master Override: ${ticket.ticket_number}`}
        size="md"
      >
        <form onSubmit={handleSaveAdminEdit} className="space-y-4 text-xs">
          <Input
            label="Ticket Subject"
            value={editForm.title}
            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Dropdown
              label="Assigned Department"
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
              label="Category"
              value={editForm.category}
              onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
              options={[
                { label: 'Technical', value: 'Technical' },
                { label: 'Billing', value: 'Billing' },
                { label: 'Security', value: 'Security' },
                { label: 'Feature Request', value: 'Feature Request' },
                { label: 'Bug', value: 'Bug' },
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
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
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-token-border">
            <Button variant="secondary" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={savingEdit}>
              Save Admin Changes
            </Button>
          </div>
        </form>
      </Modal>
    </MainLayout>
  );
}

