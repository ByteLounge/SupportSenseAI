/**
 * Page: CreateTicketPage.jsx
 * Role-aware Ticket Creation Form:
 * - Customer: Simple, guided query submission with instant FAQ tips.
 * - Agent / Admin: Full ticket intake with target department, customer attribution, and priority levels.
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Textarea from '../components/common/Textarea';
import Dropdown from '../components/common/Dropdown';
import { createTicketApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ArrowLeft, Send, HelpCircle, Sparkles, Building2, User } from 'lucide-react';

export default function CreateTicketPage() {
  const { user, isCustomer, isAgent, isAdmin } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Technical');
  const [priority, setPriority] = useState('MEDIUM');
  const [targetDept, setTargetDept] = useState('Technical Support');
  const [customerEmail, setCustomerEmail] = useState(isCustomer ? user?.email || 'alex.rivera@acme.corp' : '');
  const [customerName, setCustomerName] = useState(isCustomer ? user?.name || 'Alex Rivera' : '');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const { addToast } = useToast();

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Inquiry subject/title is required';
    if (!description.trim()) newErrors.description = 'Detailed description is required';
    if (!isCustomer && !customerEmail.trim()) newErrors.customerEmail = 'Customer email is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      };
      const res = await createTicketApi(payload);
      addToast('Ticket created successfully and dispatched for AI triage', 'success');
      navigate(`/tickets/${res.data.id || res.id}`);
    } catch (err) {
      console.error('Failed to create ticket:', err);
      addToast('Failed to submit support ticket', 'error');
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
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Customer Self-Serve FAQ Banner */}
        {isCustomer && (
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-[6px] text-xs flex items-center justify-between text-emerald-800 dark:text-emerald-300">
            <span className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Tip: Before submitting, check if your answer is in our Knowledge Base!</span>
            </span>
            <Link to="/knowledge-base" className="font-semibold underline hover:no-underline shrink-0">
              Browse FAQs &rarr;
            </Link>
          </div>
        )}

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
      </div>
    </MainLayout>
  );
}

