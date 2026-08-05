/**
 * Page: DepartmentsPage.jsx
 * Enterprise Department Routing & SLA Management View.
 */

import React, { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import Card from '../components/common/Card';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { Plus, Building2, Shield, Users } from 'lucide-react';

export default function DepartmentsPage() {
  const [departments] = useState([
    {
      id: 'dept-1',
      name: 'Database Infrastructure',
      lead: 'Marcus Vance',
      active_agents: 6,
      open_tickets: 4,
      sla_target: '2 Hours',
      status: 'Active',
    },
    {
      id: 'dept-2',
      name: 'Finance & Billing',
      lead: 'Elena Rostova',
      active_agents: 4,
      open_tickets: 2,
      sla_target: '4 Hours',
      status: 'Active',
    },
    {
      id: 'dept-3',
      name: 'Identity & Access',
      lead: 'Devon Miles',
      active_agents: 8,
      open_tickets: 1,
      sla_target: '1 Hour',
      status: 'Active',
    },
    {
      id: 'dept-4',
      name: 'API Platform Team',
      lead: 'Sarah Agent',
      active_agents: 12,
      open_tickets: 5,
      sla_target: '3 Hours',
      status: 'Active',
    },
  ]);

  const breadcrumbs = [
    { label: 'Dashboard', path: '/' },
    { label: 'Departments' },
  ];

  const columns = [
    {
      key: 'name',
      label: 'Department Name',
      sortable: true,
      render: (val) => (
        <span className="font-semibold text-[#111827] flex items-center gap-2">
          <Building2 className="w-4 h-4 text-[#2563EB]" />
          {val}
        </span>
      ),
    },
    {
      key: 'lead',
      label: 'Department Lead',
      sortable: true,
    },
    {
      key: 'active_agents',
      label: 'Assigned Agents',
      sortable: true,
      align: 'center',
      render: (val) => (
        <span className="font-mono text-xs bg-[#F8F9FA] px-2 py-0.5 border border-[#E5E7EB] rounded-[4px]">
          {val} Agents
        </span>
      ),
    },
    {
      key: 'open_tickets',
      label: 'Active Queue',
      sortable: true,
      align: 'center',
      render: (val) => (
        <Badge variant={val > 3 ? 'warning' : 'default'}>{val} Open</Badge>
      ),
    },
    {
      key: 'sla_target',
      label: 'SLA Target',
      sortable: true,
      render: (val) => <span className="font-mono text-xs text-[#374151]">{val}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      width: '100px',
      render: (val) => <Badge variant="success">{val}</Badge>,
    },
  ];

  return (
    <MainLayout
      breadcrumbs={breadcrumbs}
      title="Department Routing & SLA Management"
      subtitle="Configure support departments, agent rosters, and SLA escalation policies."
      actions={
        <Button variant="primary" icon={Plus}>
          Add Department
        </Button>
      }
    >
      <div className="space-y-4">
        <Table columns={columns} data={departments} keyField="id" />
      </div>
    </MainLayout>
  );
}
