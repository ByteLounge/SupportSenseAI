/**
 * Page: AnalyticsPage.jsx
 * Enterprise Performance Metrics & SLA Analytics (Clean table and metric breakdown format).
 */

import React from 'react';
import MainLayout from '../layouts/MainLayout';
import Card from '../components/common/Card';
import Table from '../components/common/Table';
import Badge from '../components/common/Badge';

export default function AnalyticsPage() {
  const metrics = [
    { metric: 'Mean Time to Resolution (MTTR)', value: '1.8 Hours', target: '2.0 Hours', status: 'Compliant' },
    { metric: 'First Response SLA Compliance', value: '98.4%', target: '95.0%', status: 'Compliant' },
    { metric: 'Customer Satisfaction (CSAT)', value: '4.85 / 5.0', target: '4.50', status: 'Compliant' },
    { metric: 'AI Triage Accuracy Rate', value: '94.2%', target: '90.0%', status: 'Compliant' },
    { metric: 'Ticket Reopen Rate', value: '2.1%', target: '< 5.0%', status: 'Compliant' },
  ];

  const columns = [
    {
      key: 'metric',
      label: 'Performance Metric',
      render: (val) => <span className="font-semibold text-[#111827]">{val}</span>,
    },
    {
      key: 'value',
      label: 'Current Value (Q3 2026)',
      render: (val) => <span className="font-mono text-xs font-bold text-[#2563EB]">{val}</span>,
    },
    {
      key: 'target',
      label: 'Enterprise SLA Target',
      render: (val) => <span className="font-mono text-xs text-[#6B7280]">{val}</span>,
    },
    {
      key: 'status',
      label: 'SLA Status',
      render: (val) => <Badge variant="success">{val}</Badge>,
    },
  ];

  const breadcrumbs = [
    { label: 'Dashboard', path: '/' },
    { label: 'Analytics' },
  ];

  return (
    <MainLayout
      breadcrumbs={breadcrumbs}
      title="SLA Analytics & Performance Reporting"
      subtitle="Audited operational metrics, MTTR benchmarks, and AI classification precision."
    >
      <div className="space-y-4">
        <Table columns={columns} data={metrics} keyField="metric" />
      </div>
    </MainLayout>
  );
}
