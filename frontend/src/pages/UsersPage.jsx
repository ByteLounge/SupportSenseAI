/**
 * Page: UsersPage.jsx
 * Enterprise User Roster & Agent Permission Management.
 */

import React, { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import Card from '../components/common/Card';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { Plus, UserCheck, Shield } from 'lucide-react';

export default function UsersPage() {
  const [users] = useState([
    {
      id: 'u-1',
      name: 'Sarah Agent',
      email: 'agent.sarah@supportsense.ai',
      role: 'AGENT',
      department: 'API Platform Team',
      status: 'Active',
      last_login: '2026-08-05 14:10',
    },
    {
      id: 'u-2',
      name: 'Alex Rivera',
      email: 'alex.rivera@acme.corp',
      role: 'CUSTOMER',
      department: 'Acme Corp',
      status: 'Active',
      last_login: '2026-08-05 08:30',
    },
    {
      id: 'u-3',
      name: 'Marcus Vance',
      email: 'marcus.vance@supportsense.ai',
      role: 'ADMIN',
      department: 'Database Infrastructure',
      status: 'Active',
      last_login: '2026-08-05 13:45',
    },
    {
      id: 'u-4',
      name: 'Elena Rostova',
      email: 'elena.r@supportsense.ai',
      role: 'AGENT',
      department: 'Finance & Billing',
      status: 'Active',
      last_login: '2026-08-04 17:20',
    },
  ]);

  const breadcrumbs = [
    { label: 'Dashboard', path: '/' },
    { label: 'Users' },
  ];

  const columns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (val, row) => (
        <div>
          <div className="font-semibold text-[#111827]">{val}</div>
          <div className="text-xs text-[#6B7280]">{row.email}</div>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Access Role',
      sortable: true,
      render: (val) => (
        <Badge variant={val === 'ADMIN' ? 'danger' : val === 'AGENT' ? 'primary' : 'default'}>
          {val}
        </Badge>
      ),
    },
    {
      key: 'department',
      label: 'Organization / Dept',
      sortable: true,
    },
    {
      key: 'last_login',
      label: 'Last Login',
      sortable: true,
      render: (val) => <span className="font-mono text-xs text-[#6B7280]">{val}</span>,
    },
    {
      key: 'status',
      label: 'Account Status',
      width: '100px',
      render: (val) => <Badge variant="success">{val}</Badge>,
    },
  ];

  return (
    <MainLayout
      breadcrumbs={breadcrumbs}
      title="User & Agent Access Control"
      subtitle="Manage internal support staff, customer tenant accounts, and RBAC roles."
      actions={
        <Button variant="primary" icon={Plus}>
          Provision User
        </Button>
      }
    >
      <div className="space-y-4">
        <Table columns={columns} data={users} keyField="id" />
      </div>
    </MainLayout>
  );
}
