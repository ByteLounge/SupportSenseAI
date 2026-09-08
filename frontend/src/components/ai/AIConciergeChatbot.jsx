/**
 * Component: AIConciergeChatbot.jsx
 * Interactive SupportSense AI Concierge:
 * Allows users (customers or agents) to state any support problem in simple, informal words.
 * The AI converses naturally, performs instant diagnostics, synthesizes an enterprise-grade
 * formal ticket specification, and dispatches it with 1-click.
 */

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Send,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Building2,
  Tag,
  Clock,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  FileText,
  User,
  Bot,
  ExternalLink,
  Edit3
} from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { chatConciergeApi, createTicketApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import logoImg from '../../assets/logo.png';

export default function AIConciergeChatbot({ embedded = false, onClose, onTicketCreated }) {
  const { user, isCustomer } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: `Hello ${user?.name ? user.name.split(' ')[0] : 'there'}! 👋 I'm your **SupportSense AI Concierge**.\n\nTell me what's going on in simple, everyday words — no technical jargon needed. I'll diagnose the issue, draft a formal enterprise ticket for our specialized team, and help you dispatch it right away.`,
      ticket_draft: null,
      quick_actions: [
        'I was charged twice on my credit card',
        'API Webhook is returning 401 Unauthorized',
        'Cannot log in due to Okta MFA push error',
        'Database connection pool is timing out'
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTicketDraft, setActiveTicketDraft] = useState(null);
  const [createdTicketResult, setCreatedTicketResult] = useState(null);
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);
  const [showFullMarkdown, setShowFullMarkdown] = useState(false);
  const [isEditingDraft, setIsEditingDraft] = useState(false);
  const [editableDraft, setEditableDraft] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, activeTicketDraft, createdTicketResult]);

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);
    setCreatedTicketResult(null);

    // Format previous turns for API
    const historyPayload = messages.map((m) => ({
      role: m.role,
      content: m.content
    }));

    try {
      const response = await chatConciergeApi({
        message: query,
        history: historyPayload,
        customerName: user?.name || 'Customer User',
        customerEmail: user?.email || 'customer@acme.corp'
      });

      const aiData = response.data || response;
      const assistantReply = aiData.reply || "I've analyzed your inquiry and drafted a formal support ticket.";
      const draft = aiData.ticket_draft;

      const aiMsg = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: assistantReply,
        ticket_draft: draft,
        quick_actions: aiData.suggested_quick_actions || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
      if (draft && draft.is_ready_for_ticket) {
        setActiveTicketDraft(draft);
        setEditableDraft({ ...draft });
      }
    } catch (err) {
      console.error('Failed to chat with AI Concierge:', err);
      addToast('AI Concierge temporary hiccup. Please try again.', 'error');
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleConfirmAndDispatch = async () => {
    const draft = editableDraft || activeTicketDraft;
    if (!draft) return;

    setIsSubmittingTicket(true);
    try {
      const payload = {
        title: draft.title,
        description: draft.formal_description || draft.executive_summary,
        category: draft.category || 'Technical',
        priority: draft.priority || 'MEDIUM',
        assigned_department: draft.target_department || 'Technical Support',
        customer_name: user?.name || 'Customer User',
        customer_email: user?.email || 'customer@acme.corp',
        ai_metadata: {
          customer_mood: draft.customer_mood || 'NEUTRAL',
          patience_score: draft.patience_score || 'CONCERNED',
          predicted_resolution_time: draft.predicted_resolution_time || '1-2 business days'
        }
      };

      const res = await createTicketApi(payload);
      const ticket = res.data || res;
      setCreatedTicketResult(ticket);
      addToast(`Ticket ${ticket.ticket_number || 'created'} dispatched successfully!`, 'success');

      if (onTicketCreated) {
        onTicketCreated(ticket);
      }
    } catch (err) {
      console.error('Failed to dispatch ticket:', err);
      addToast('Failed to dispatch ticket. Please try again.', 'error');
    } finally {
      setIsSubmittingTicket(false);
    }
  };

  const handleReset = () => {
    setActiveTicketDraft(null);
    setEditableDraft(null);
    setCreatedTicketResult(null);
    setShowFullMarkdown(false);
    setIsEditingDraft(false);
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: `Ready for a new inquiry! What else can I help formulate for you?`,
        ticket_draft: null,
        quick_actions: [
          'Duplicate charge on credit card',
          'API Webhook is returning 401 Unauthorized',
          'Cannot log in due to Okta MFA push error'
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const getPriorityBadgeVariant = (priority) => {
    switch (priority) {
      case 'URGENT':
        return 'danger';
      case 'HIGH':
        return 'warning';
      case 'MEDIUM':
        return 'info';
      default:
        return 'neutral';
    }
  };

  return (
    <div className={`flex flex-col bg-token-card text-token-text-primary ${embedded ? 'h-[750px] rounded-2xl border border-token-border shadow-sm' : 'h-full'}`}>
      {/* Concierge Header */}
      <div className="p-3.5 sm:p-4 border-b border-token-border flex items-center justify-between bg-gradient-to-r from-moonrow-canvas via-token-card to-moonrow-primary/5 rounded-t-2xl">
        <div className="flex items-center gap-2.5">
          <div className="relative w-9 h-9 rounded-xl bg-white border border-token-border shadow-xs shrink-0 flex items-center justify-center p-1">
            <img
              src={logoImg}
              alt="SupportSense AI Logo"
              className="w-full h-full object-contain rounded-lg"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-token-card animate-pulse"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-token-text-primary tracking-tight">SupportSense AI Concierge</h3>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                Active Assistant
              </span>
            </div>
            <p className="text-[11px] text-token-text-secondary">
              Natural language support intake & instant ticket synthesizer
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="xs"
            icon={RefreshCw}
            onClick={handleReset}
            title="Reset conversation"
          >
            Reset
          </Button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-token-secondary text-token-text-muted transition-colors text-xs px-2"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 max-w-[90%] sm:max-w-[85%] ${
              msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-7 h-7 rounded-xl shrink-0 flex items-center justify-center text-xs overflow-hidden ${
                msg.role === 'user'
                  ? 'bg-token-border text-token-text-primary'
                  : 'bg-white border border-token-border p-0.5 shadow-xs'
              }`}
            >
              {msg.role === 'user' ? (
                <User className="w-3.5 h-3.5" />
              ) : (
                <img
                  src={logoImg}
                  alt="SupportSense Bot"
                  className="w-full h-full object-contain rounded-lg"
                />
              )}
            </div>

            {/* Bubble Content */}
            <div className="space-y-2">
              <div
                className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-moonrow-primary text-white rounded-tr-none shadow-sm'
                    : 'bg-token-secondary/80 text-token-text-primary rounded-tl-none border border-token-border shadow-xs'
                }`}
              >
                <div className="whitespace-pre-line font-normal">{msg.content}</div>
                <div
                  className={`text-[10px] mt-1.5 flex items-center gap-1 ${
                    msg.role === 'user' ? 'text-white/75 justify-end' : 'text-token-text-muted justify-start'
                  }`}
                >
                  <Clock className="w-2.5 h-2.5" />
                  {msg.timestamp}
                </div>
              </div>

              {/* Quick Action Suggestion Chips for AI messages */}
              {msg.quick_actions && msg.quick_actions.length > 0 && !activeTicketDraft && !createdTicketResult && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {msg.quick_actions.map((qa, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(qa)}
                      disabled={isLoading}
                      className="text-[11px] px-2.5 py-1 rounded-full bg-token-card hover:bg-moonrow-primary/10 hover:border-moonrow-primary/40 border border-token-border text-token-text-secondary hover:text-moonrow-primary transition-all text-left shadow-xs flex items-center gap-1"
                    >
                      <Sparkles className="w-2.5 h-2.5 shrink-0 text-moonrow-primary" />
                      <span>{qa}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-2.5 mr-auto max-w-[80%] items-center">
            <div className="w-7 h-7 rounded-xl bg-white border border-token-border p-0.5 flex items-center justify-center shrink-0 shadow-xs overflow-hidden">
              <img
                src={logoImg}
                alt="AI Thinking"
                className="w-full h-full object-contain animate-pulse rounded-lg"
              />
            </div>
            <div className="p-3 bg-token-secondary/80 border border-token-border rounded-2xl rounded-tl-none text-xs text-token-text-secondary flex items-center gap-2">
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-moonrow-primary animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-moonrow-primary animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-moonrow-primary animate-bounce"></span>
              </span>
              <span>Synthesizing formal enterprise ticket & checking diagnostics...</span>
            </div>
          </div>
        )}

        {/* Live Formal Ticket Specification Card */}
        {activeTicketDraft && !createdTicketResult && (
          <div className="my-3 p-4 bg-moonrow-canvas dark:bg-token-secondary/40 border border-moonrow-primary/30 rounded-2xl shadow-md space-y-3.5 transition-all">
            <div className="flex items-start justify-between gap-2 border-b border-token-border pb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-moonrow-primary text-white">
                    ✨ Synthesized Formal Ticket Draft
                  </span>
                  <Badge variant={getPriorityBadgeVariant(editableDraft?.priority || activeTicketDraft.priority)} size="sm">
                    {editableDraft?.priority || activeTicketDraft.priority}
                  </Badge>
                  <span className="text-[11px] font-medium text-token-text-muted flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-moonrow-primary" />
                    {editableDraft?.target_department || activeTicketDraft.target_department}
                  </span>
                </div>

                {isEditingDraft ? (
                  <input
                    type="text"
                    value={editableDraft.title}
                    onChange={(e) => setEditableDraft({ ...editableDraft, title: e.target.value })}
                    className="w-full text-xs font-semibold px-2 py-1 bg-token-card border border-token-border rounded-lg"
                  />
                ) : (
                  <h4 className="text-xs sm:text-sm font-semibold text-token-text-primary">
                    {editableDraft?.title || activeTicketDraft.title}
                  </h4>
                )}
              </div>

              <Button
                variant="ghost"
                size="xs"
                icon={Edit3}
                onClick={() => setIsEditingDraft(!isEditingDraft)}
              >
                {isEditingDraft ? 'Save' : 'Edit'}
              </Button>
            </div>

            {/* Quick Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div className="p-2 rounded-xl bg-token-card border border-token-border">
                <div className="text-token-text-muted flex items-center gap-1">
                  <Tag className="w-3 h-3 text-moonrow-primary" />
                  Category
                </div>
                {isEditingDraft ? (
                  <select
                    value={editableDraft.category}
                    onChange={(e) => setEditableDraft({ ...editableDraft, category: e.target.value })}
                    className="w-full bg-token-secondary border border-token-border rounded text-[11px] p-0.5 mt-1"
                  >
                    <option value="Billing">Billing</option>
                    <option value="Technical">Technical</option>
                    <option value="Account">Account</option>
                    <option value="Bug">Bug</option>
                    <option value="Feature Request">Feature Request</option>
                  </select>
                ) : (
                  <div className="font-semibold text-token-text-primary mt-0.5">
                    {editableDraft?.category || activeTicketDraft.category}
                  </div>
                )}
              </div>

              <div className="p-2 rounded-xl bg-token-card border border-token-border">
                <div className="text-token-text-muted flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-moonrow-primary" />
                  Routing
                </div>
                {isEditingDraft ? (
                  <select
                    value={editableDraft.target_department}
                    onChange={(e) => setEditableDraft({ ...editableDraft, target_department: e.target.value })}
                    className="w-full bg-token-secondary border border-token-border rounded text-[11px] p-0.5 mt-1"
                  >
                    <option value="Finance & Billing">Finance & Billing</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Identity & Access">Identity & Access</option>
                    <option value="API Platform Team">API Platform Team</option>
                  </select>
                ) : (
                  <div className="font-semibold text-token-text-primary mt-0.5 truncate">
                    {editableDraft?.target_department || activeTicketDraft.target_department}
                  </div>
                )}
              </div>

              <div className="p-2 rounded-xl bg-token-card border border-token-border">
                <div className="text-token-text-muted flex items-center gap-1">
                  <Clock className="w-3 h-3 text-moonrow-primary" />
                  SLA Estimate
                </div>
                <div className="font-semibold text-token-text-primary mt-0.5">
                  {activeTicketDraft.predicted_resolution_time || '1-2 business days'}
                </div>
              </div>

              <div className="p-2 rounded-xl bg-token-card border border-token-border">
                <div className="text-token-text-muted flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3 text-amber-500" />
                  Customer Mood
                </div>
                <div className="font-semibold text-token-text-primary mt-0.5">
                  {activeTicketDraft.customer_mood} ({activeTicketDraft.patience_score})
                </div>
              </div>
            </div>

            {/* Executive Summary */}
            <div className="p-2.5 rounded-xl bg-token-card border border-token-border text-xs">
              <span className="font-medium text-token-text-muted">Executive Summary: </span>
              <span className="text-token-text-primary">
                {activeTicketDraft.executive_summary}
              </span>
            </div>

            {/* Actionable Verification Checklist */}
            {activeTicketDraft.checklist && activeTicketDraft.checklist.length > 0 && (
              <div className="space-y-1.5 text-xs">
                <div className="font-medium text-token-text-secondary flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>AI Pre-configured Engineering Checklist ({activeTicketDraft.checklist.length} verification steps):</span>
                </div>
                <div className="space-y-1 pl-1">
                  {activeTicketDraft.checklist.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[11px] text-token-text-primary">
                      <span className="w-1.5 h-1.5 rounded-full bg-moonrow-primary shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Collapsible Formal Markdown Specification */}
            <div className="pt-2 border-t border-token-border">
              <button
                type="button"
                onClick={() => setShowFullMarkdown(!showFullMarkdown)}
                className="text-[11px] font-medium text-moonrow-primary hover:underline flex items-center gap-1"
              >
                <FileText className="w-3 h-3" />
                <span>{showFullMarkdown ? 'Hide full markdown specification' : 'View full formal markdown specification'}</span>
                {showFullMarkdown ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>

              {showFullMarkdown && (
                <div className="mt-2 p-3 bg-token-card border border-token-border rounded-xl text-[11px] font-mono whitespace-pre-line text-token-text-secondary overflow-x-auto max-h-48">
                  {activeTicketDraft.formal_description}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-token-border">
              <Button
                variant="primary"
                size="sm"
                icon={ArrowRight}
                loading={isSubmittingTicket}
                onClick={handleConfirmAndDispatch}
              >
                Confirm & Dispatch Formal Ticket
              </Button>
            </div>
          </div>
        )}

        {/* Success Confirmation Card upon creation */}
        {createdTicketResult && (
          <div className="my-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-semibold">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Formal Ticket Created & Dispatched to {createdTicketResult.assigned_department}!</span>
            </div>

            <div className="p-3 bg-token-card border border-token-border rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-token-text-primary text-xs">
                  {createdTicketResult.ticket_number || createdTicketResult.id}
                </span>
                <Badge variant="success" size="xs">
                  {createdTicketResult.status || 'OPEN'}
                </Badge>
              </div>
              <p className="text-token-text-primary font-medium">{createdTicketResult.title}</p>
              <div className="text-[11px] text-token-text-secondary flex items-center gap-3 pt-1">
                <span>Category: <strong>{createdTicketResult.category}</strong></span>
                <span>Priority: <strong>{createdTicketResult.priority}</strong></span>
              </div>
            </div>

            <div className="flex items-center gap-2 justify-end pt-1">
              <Button
                variant="secondary"
                size="xs"
                icon={RefreshCw}
                onClick={handleReset}
              >
                Submit Another Request
              </Button>
              <Button
                variant="primary"
                size="xs"
                icon={ExternalLink}
                onClick={() => navigate(`/tickets/${createdTicketResult.id}`)}
              >
                Open Ticket Workspace &rarr;
              </Button>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Form */}
      <div className="p-3 sm:p-4 border-t border-token-border bg-token-card rounded-b-2xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Type your issue in simple words (e.g. 'I was charged twice on my card yesterday')..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isLoading}
            className="flex-1 text-xs px-3.5 py-2.5 rounded-xl bg-token-secondary border border-token-border focus:outline-none focus:ring-1 focus:ring-moonrow-primary focus:border-moonrow-primary text-token-text-primary transition-all placeholder:text-token-text-muted"
          />
          <Button
            type="submit"
            variant="primary"
            size="sm"
            icon={Send}
            disabled={!inputMessage.trim() || isLoading}
            loading={isLoading}
          >
            Send
          </Button>
        </form>
        <div className="mt-1.5 flex items-center justify-between text-[10px] text-token-text-muted px-1">
          <span>💡 AI automatically categorizes, prioritizes, and routes your ticket</span>
          <span>Press Enter ↵ to send</span>
        </div>
      </div>
    </div>
  );
}
