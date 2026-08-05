/**
 * Page: SettingsPage.jsx
 * Enterprise Platform Settings & AI Model Configuration.
 */

import React, { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Dropdown from '../components/common/Dropdown';
import { useToast } from '../context/ToastContext';
import { Save } from 'lucide-react';

export default function SettingsPage() {
  const [aiConfidence, setAiConfidence] = useState('85');
  const [autoRoute, setAutoRoute] = useState('enabled');
  const [slaUrgent, setSlaUrgent] = useState('2');
  const [emailAlerts, setEmailAlerts] = useState('enabled');
  const [saving, setSaving] = useState(false);

  const { addToast } = useToast();

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      addToast('Enterprise settings saved successfully', 'success');
    }, 600);
  };

  const breadcrumbs = [
    { label: 'Dashboard', path: '/' },
    { label: 'Settings' },
  ];

  return (
    <MainLayout
      breadcrumbs={breadcrumbs}
      title="Platform Settings & Governance"
      subtitle="Configure AI confidence thresholds, automated department dispatch, and SLA rules."
    >
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSave} className="space-y-4">
          <Card title="AI Triage & Classification Rules">
            <div className="space-y-4 text-xs">
              <Input
                label="Minimum AI Confidence Threshold (%)"
                type="number"
                value={aiConfidence}
                onChange={(e) => setAiConfidence(e.target.value)}
                helperText="Submissions scoring below this confidence level require human agent triage."
                required
              />

              <Dropdown
                label="Automated Department Routing"
                value={autoRoute}
                onChange={(e) => setAutoRoute(e.target.value)}
                options={[
                  { label: 'Enabled (Automatically assign tickets based on AI suggestion)', value: 'enabled' },
                  { label: 'Disabled (Require manual agent review before dispatch)', value: 'disabled' },
                ]}
              />
            </div>
          </Card>

          <Card title="SLA & Escalation Rules">
            <div className="space-y-4 text-xs">
              <Input
                label="Urgent Priority Response SLA (Hours)"
                type="number"
                value={slaUrgent}
                onChange={(e) => setSlaUrgent(e.target.value)}
                helperText="Maximum allowed time before triggering supervisor alert."
                required
              />

              <Dropdown
                label="Manager Email Notifications on SLA Breach"
                value={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.value)}
                options={[
                  { label: 'Enabled (Send immediate alert to Department Lead)', value: 'enabled' },
                  { label: 'Disabled (Log in audit history only)', value: 'disabled' },
                ]}
              />
            </div>
          </Card>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" loading={saving} icon={Save}>
              Save Settings
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
