/**
 * Page: CreateTicketPage.jsx
 * Role-aware Ticket Creation Form:
 * - Customer: Simple, guided query submission with instant FAQ tips.
 * - Agent / Admin: Full ticket intake with target department, customer attribution, and priority levels.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Textarea from '../components/common/Textarea';
import Dropdown from '../components/common/Dropdown';
import AIConciergeChatbot from '../components/ai/AIConciergeChatbot';
import { createTicketApi, searchFaqsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ArrowLeft, Send, HelpCircle, Sparkles, Building2, User, Mail, MessageSquare, FileEdit, CheckCircle2, AlertTriangle, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import logoImg from '../assets/logo.png';

export default function CreateTicketPage() {
  const { user, isCustomer, isAgent, isAdmin } = useAuth();
  const [creationMode, setCreationMode] = useState('ai'); // 'ai' | 'manual'
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Technical');
  const [priority, setPriority] = useState('MEDIUM');
  const [targetDept, setTargetDept] = useState('Technical Support');
  const [customerEmail, setCustomerEmail] = useState(isCustomer ? user?.email || 'alex.rivera@customer.com' : '');
  const [customerName, setCustomerName] = useState(isCustomer ? user?.name || 'Alex Rivera' : '');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Real-time FAQ deflection states (Requirement 3)
  const [matchedFaqs, setMatchedFaqs] = useState([]);
  const [expandedFaqId, setExpandedFaqId] = useState(null);
  const [faqSolved, setFaqSolved] = useState(false);

  // Duplicate resolved ticket alert state (Requirement 1)
  const [duplicateAlert, setDuplicateAlert] = useState(null);

  const navigate = useNavigate();
  const { addToast } = useToast();

  // Search FAQs in real-time as user types query
  useEffect(() => {
    const q = `${title} ${description}`.trim();
    if (q.length < 4) {
      setMatchedFaqs([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await searchFaqsApi(q);
        const data = res.data || res || [];
        setMatchedFaqs(Array.isArray(data) ? data.slice(0, 3) : []);
      } catch (err) {
        console.error('FAQ lookup error:', err);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [title, description]);

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Inquiry subject/title is required';
    if (!description.trim()) newErrors.description = 'Detailed description is required';
    if (!isCustomer && !customerEmail.trim()) newErrors.customerEmail = 'Customer email is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e, force = false) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        title,
        description,
        category,
        priority,
        assigned_department: targetDept,
        customer_name: customerName || user?.name || 'Customer User',
        customer_email: customerEmail || user?.email || 'customer@acme.corp',
        forceCreate: force
      };
      const res = await createTicketApi(payload);
      const resData = res.data || res;

      // Handle follow-up linking to existing open ticket (Requirement 2)
      if (resData.linked_to_existing) {
        addToast(
          `Your follow-up inquiry was linked to your existing active ticket #${resData.ticket?.ticket_number || resData.ticket_number}!`,
          'success'
        );
        navigate(`/tickets/${resData.ticket?.id || resData.id}`);
        return;
      }

      addToast('Ticket created successfully and dispatched for AI triage', 'success');
      navigate(`/tickets/${resData.id || res.id}`);
    } catch (err) {
      console.error('Failed to create ticket:', err);

      // Handle Duplicate Ticket Detected (Requirement 1)
      const errData = err.data || err.response?.data?.data || err;
      if (err.is_duplicate || err.code === 'DUPLICATE_RESOLVED_TICKET' || errData.resolved_ticket) {
        setDuplicateAlert({
          resolvedTicket: errData.resolved_ticket || { ticket_number: 'Previous Ticket', title },
          resolutionSummary: errData.resolution_summary || err.message || 'This issue was previously resolved.'
        });
        addToast('Duplicate ticket detected: This issue was already resolved!', 'info');
      } else {
        addToast('Failed to submit support ticket', 'error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const breadcrumbs = [
    { label: isCustomer ? 'Customer Portal' : 'Dashboard', path: '/' },
    { label: isCustomer ? 'My Support Requests' : 'Tickets', path: '/tickets' },
    { label: isCustomer ? 'New Support Query' : 'New Ticket' },
  ];

  return (
    <MainLayout
      breadcrumbs={breadcrumbs}
      title={isCustomer ? 'Submit Support Query' : 'Create Support Ticket'}
      subtitle={
        isCustomer
          ? 'Describe your question or technical problem. Gemini AI and our specialists will assist you shortly.'
          : 'Create a new ticket and dispatch it for AI automated categorization and department routing.'
      }
      actions={
        <Button variant="secondary" size="sm" icon={ArrowLeft} onClick={() => navigate('/tickets')}>
          Cancel & Return
        </Button>
      }
    >
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Creation Mode Switcher */}
        <div className="flex items-center justify-between p-1.5 bg-token-card border border-token-border rounded-2xl shadow-xs">
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setCreationMode('ai')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                creationMode === 'ai'
                  ? 'bg-moonrow-primary text-white shadow-sm'
                  : 'text-token-text-secondary hover:text-token-text-primary hover:bg-token-secondary'
              }`}
            >
              <img
                src={logoImg}
                alt="SupportSense AI"
                className="w-4 h-4 rounded-md object-contain bg-white p-0.5 shrink-0"
              />
              <span>AI Concierge (Chat in simple words)</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${creationMode === 'ai' ? 'bg-white/20 text-white' : 'bg-moonrow-primary/10 text-moonrow-primary'}`}>
                Recommended
              </span>
            </button>

            <button
              type="button"
              onClick={() => setCreationMode('manual')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                creationMode === 'manual'
                  ? 'bg-token-secondary text-token-text-primary border border-token-border shadow-xs'
                  : 'text-token-text-secondary hover:text-token-text-primary hover:bg-token-secondary'
              }`}
            >
              <FileEdit className="w-3.5 h-3.5" />
              <span>Classic Manual Form</span>
            </button>
          </div>

          <div className="hidden sm:block text-[11px] text-token-text-muted pr-3">
            {creationMode === 'ai' ? 'AI crafts formal ticket & checklist' : 'Standard field intake'}
          </div>
        </div>

        {/* Tab 1: AI Concierge View */}
        {creationMode === 'ai' ? (
          <AIConciergeChatbot
            embedded={true}
            onTicketCreated={(newTicket) => {
              addToast(`Ticket ${newTicket.ticket_number || newTicket.id} created successfully!`, 'success');
              navigate(`/tickets/${newTicket.id}`);
            }}
          />
        ) : (
          <>
            {/* Customer Self-Serve FAQ Banner */}
            {isCustomer && !faqSolved && (
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs flex items-center justify-between text-emerald-800 dark:text-emerald-300">
                <span className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Tip: Before submitting, check if your answer is in our Knowledge Base!</span>
                </span>
                <Link to="/knowledge-base" className="font-semibold underline hover:no-underline shrink-0">
                  Browse FAQs &rarr;
                </Link>
              </div>
            )}

            {/* Duplicate Resolved Ticket Alert (Requirement 1) */}
            {duplicateAlert && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-token-text-primary">
                      Issue Previously Resolved — Duplicate Ticket Intercepted
                    </div>
                    <p className="text-xs text-token-text-secondary leading-relaxed">
                      You previously submitted a ticket for this exact issue:{' '}
                      <strong className="text-token-text-primary">
                        Ticket #{duplicateAlert.resolvedTicket?.ticket_number}: {duplicateAlert.resolvedTicket?.title}
                      </strong>{' '}
                      (Status: <span className="font-semibold text-emerald-600">RESOLVED</span>).
                    </p>
                    <div className="p-3 bg-token-card border border-token-border rounded-xl text-xs space-y-1">
                      <div className="font-semibold text-token-text-muted text-[10px] uppercase">
                        Previous Resolution Notes:
                      </div>
                      <p className="text-token-text-primary leading-relaxed">
                        {duplicateAlert.resolutionSummary}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-amber-500/20">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate(`/tickets/${duplicateAlert.resolvedTicket?.id || duplicateAlert.resolvedTicket?.ticket_number}`)}
                  >
                    View Resolved Ticket
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={(e) => handleSubmit(e, true)}
                  >
                    Issue Still Persists (Submit Anyway)
                  </Button>
                </div>
              </div>
            )}

            {/* Resolved via FAQ Banner (Requirement 3) */}
            {faqSolved ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <div className="text-base font-bold text-emerald-900 dark:text-emerald-200">
                  Issue Resolved via Knowledge Base!
                </div>
                <p className="text-xs text-emerald-700 dark:text-emerald-300 max-w-md mx-auto leading-relaxed">
                  Great! Your query has been resolved using our verified FAQ answer. No duplicate ticket was registered in the queue.
                </p>
                <div className="pt-2 flex items-center justify-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setFaqSolved(false);
                      setTitle('');
                      setDescription('');
                      setMatchedFaqs([]);
                    }}
                  >
                    Submit Different Question
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => navigate('/tickets')}>
                    Return to My Tickets
                  </Button>
                </div>
              </div>
            ) : (
              <Card title={isCustomer ? 'Your Support Request Details' : 'New Ticket Intake Form'}>
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <Input
                    label={isCustomer ? 'What do you need help with? (Subject)' : 'Ticket Subject / Title'}
                    placeholder={
                      isCustomer
                        ? 'e.g., Unable to generate API token or invoice download failure'
                        : 'e.g., PostgreSQL connection pool exhaustion during peak hours'
                    }
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    error={errors.title}
                  />

                  {/* Real-time FAQ Solutions Deflection (Requirement 3) */}
                  {matchedFaqs.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-token-secondary/90 border border-token-border space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-token-text-primary flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#FD451B]" />
                          <span>Instant Knowledge Base Solutions:</span>
                        </span>
                        <span className="text-[10px] text-token-text-muted">
                          Check if these resolve your question first
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        {matchedFaqs.map((faq) => (
                          <div key={faq.id} className="p-2.5 rounded-lg bg-token-card border border-token-border text-xs space-y-1.5">
                            <button
                              type="button"
                              onClick={() => setExpandedFaqId(expandedFaqId === faq.id ? null : faq.id)}
                              className="w-full flex items-center justify-between text-left font-semibold text-token-text-primary hover:text-[#FD451B] transition-colors"
                            >
                              <span>{faq.question}</span>
                              {expandedFaqId === faq.id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </button>
                            {expandedFaqId === faq.id && (
                              <div className="pt-2 border-t border-token-border space-y-2">
                                <p className="text-token-text-secondary leading-relaxed">{faq.answer}</p>
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setFaqSolved(true)}
                                    className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-1"
                                  >
                                    <CheckCircle2 className="w-3 h-3" />
                                    <span>This Solved My Issue!</span>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

            {/* Agent / Admin Customer Attribution Inputs */}
            {!isCustomer && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Customer Full Name"
                  placeholder="e.g., Alex Rivera"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  icon={User}
                />
                <Input
                  label="Customer Email Address"
                  placeholder="e.g., alex.rivera@acme.corp"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  icon={Mail}
                  required
                  error={errors.customerEmail}
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Dropdown
                label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                options={[
                  { label: 'Technical Support', value: 'Technical' },
                  { label: 'Finance & Billing', value: 'Billing' },
                  { label: 'Identity & Access', value: 'Account' },
                  { label: 'Feature Request', value: 'Feature Request' },
                  { label: 'Security & Compliance', value: 'Security' },
                ]}
                required
              />

              {!isCustomer ? (
                <Dropdown
                  label="Target Department"
                  value={targetDept}
                  onChange={(e) => setTargetDept(e.target.value)}
                  options={[
                    { label: 'Technical Support', value: 'Technical Support' },
                    { label: 'Finance & Billing', value: 'Finance & Billing' },
                    { label: 'Identity & Access', value: 'Identity & Access' },
                    { label: 'API Platform Team', value: 'API Platform Team' },
                  ]}
                  required
                />
              ) : (
                <Dropdown
                  label="Urgency / Severity"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  options={[
                    { label: 'Low (General Inquiry)', value: 'LOW' },
                    { label: 'Medium (Standard)', value: 'MEDIUM' },
                    { label: 'High (Impacts Workflow)', value: 'HIGH' },
                    { label: 'Urgent (Production Critical)', value: 'URGENT' },
                  ]}
                  required
                />
              )}
            </div>

            <Textarea
              label={isCustomer ? 'Detailed Description of your Issue' : 'Detailed Issue Description'}
              placeholder={
                isCustomer
                  ? 'Please provide full details, error messages, or steps you took before encountering the problem...'
                  : 'Provide complete reproduction steps, stack traces, affected tenant IDs, or SLA constraints...'
              }
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              error={errors.description}
            />

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-token-border">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/tickets')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={submitting}
                icon={Send}
              >
                {isCustomer ? 'Submit Inquiry' : 'Dispatch Ticket'}
              </Button>
            </div>
            </form>
          </Card>
        )}
      </>
    )}
  </div>
</MainLayout>
  );
}
