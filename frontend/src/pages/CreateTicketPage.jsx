/**
 * Page: CreateTicketPage.jsx
 * Clean, standard enterprise ticket submission form.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Textarea from '../components/common/Textarea';
import Dropdown from '../components/common/Dropdown';
import { createTicketApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import { ArrowLeft, Send } from 'lucide-react';

export default function CreateTicketPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Technical');
  const [priority, setPriority] = useState('MEDIUM');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const { addToast } = useToast();

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Ticket subject/title is required';
    if (!description.trim()) newErrors.description = 'Detailed description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await createTicketApi({ title, description, category, priority });
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
    { label: 'Dashboard', path: '/' },
    { label: 'Tickets', path: '/tickets' },
    { label: 'New Ticket' },
  ];

  return (
    <MainLayout
      breadcrumbs={breadcrumbs}
      title="Submit Support Ticket"
      subtitle="Fill in customer inquiry details. Automated AI triage will assign category & priority."
      actions={
        <Button variant="secondary" size="sm" icon={ArrowLeft} onClick={() => navigate('/tickets')}>
          Cancel & Return
        </Button>
      }
    >
      <div className="max-w-2xl mx-auto pt-2">
        <Card title="New Support Request Form">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Ticket Subject / Title"
              placeholder="e.g., PostgreSQL connection pool exhaustion during peak hours"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              error={errors.title}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Dropdown
                label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                options={[
                  { label: 'Technical Support', value: 'Technical' },
                  { label: 'Finance & Billing', value: 'Billing' },
                  { label: 'Identity & Account', value: 'Account' },
                  { label: 'Feature Request', value: 'Feature Request' },
                  { label: 'Security & Compliance', value: 'Security' },
                ]}
                required
              />

              <Dropdown
                label="Customer Priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                options={[
                  { label: 'Low', value: 'LOW' },
                  { label: 'Medium', value: 'MEDIUM' },
                  { label: 'High', value: 'HIGH' },
                  { label: 'Urgent', value: 'URGENT' },
                ]}
                required
              />
            </div>

            <Textarea
              label="Detailed Description"
              placeholder="Provide complete steps to reproduce, error codes, affected endpoints, or account IDs..."
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              error={errors.description}
            />

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E5E7EB]">
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
                Submit Ticket
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </MainLayout>
  );
}
