/**
 * Page: DepartmentsPage.jsx
 * Simple, clean view listing support departments.
 */

import React from 'react';
import MainLayout from '../layouts/MainLayout';
import Card from '../components/common/Card';
import Table from '../components/common/Table';
import Badge from '../components/common/Badge';
import { Building2 } from 'lucide-react';

export default function DepartmentsPage() {
  const departments = [
    {
      id: 'dept-1',
      name: 'Technical Support',
      lead: 'Marcus Vance',
      active_agents: 6,
      open_tickets: 4,
    },
    {
      id: 'dept-2',
      name: 'Finance & Billing',
      lead: 'Elena Rostova',
      active_agents: 4,
      open_tickets: 2,
    },
    {
      id: 'dept-3',
      name: 'Identity & Access',
      lead: 'Devon Miles',
      active_agents: 8,
      open_tickets: 1,
    },
    {
      id: 'dept-4',
      name: 'API Platform Team',
      lead: 'Sarah Agent',
      active_agents: 12,
      open_tickets: 5,
    },
  ];

  const breadcrumbs = [
    { label: 'Dashboard', path: '/' },
    { label: 'Departments' },
  ];

  const columns = [
    {
      key: 'name',
      label: 'Department Name',
      render: (val) => (
        <span className="font-semibold text-token-text-primary flex items-center gap-2">
          <Building2 className="w-4 h-4 text-token-accent" />
          {val}
        </span>
      ),
    },
    {
      key: 'lead',
      label: 'Department Lead',
    },
    {
      key: 'active_agents',
      label: 'Assigned Agents',
      render: (val) => <span className="font-mono text-xs text-token-text-secondary">{val} Agents</span>,
    },
    {
      key: 'open_tickets',
      label: 'Active Queue',
      render: (val) => <Badge variant={val > 3 ? 'warning' : 'default'}>{val} Open</Badge>,
    },
  ];

  return (
    <MainLayout
      breadcrumbs={breadcrumbs}
      title="Departments"
      subtitle="Overview of support teams and assigned agent counts."
    >
      <div className="space-y-4">
        <Table columns={columns} data={departments} keyField="id" />
      </div>
    </MainLayout>
  );
}
