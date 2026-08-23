/**
 * Page: UsersPage.jsx
 * Enterprise User Roster & Role-Based Access Control (RBAC) Management.
 * Exclusive to Administrators.
 */

import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import Card from '../components/common/Card';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Dropdown from '../components/common/Dropdown';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import { getUsersApi, updateUserRoleApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Plus, UserCheck, Shield, Users, Mail, Building2, Check } from 'lucide-react';

export default function UsersPage() {
  const { user, isAdmin, switchPersona } = useAuth();
  const { addToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [provisionModalOpen, setProvisionModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'AGENT',
    department: 'Technical Support',
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getUsersApi();
      setUsers(res.data || []);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRoleApi(userId, newRole);
      addToast(`User role updated to ${newRole}`, 'success');
      fetchUsers();
    } catch (err) {
      addToast('Failed to update user role', 'error');
    }
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    const created = {
      id: `u-${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      department: newUser.department,
      status: 'Active',
      last_login: 'Just now',
    };
    setUsers([...users, created]);
    addToast(`User ${newUser.name} provisioned successfully with role ${newUser.role}`, 'success');
    setProvisionModalOpen(false);
    setNewUser({ name: '', email: '', role: 'AGENT', department: 'Technical Support' });
  };

  const breadcrumbs = [
    { label: 'Admin Command Center', path: '/' },
    { label: 'User & Access Control (RBAC)' },
  ];

  const columns = [
    {
      key: 'name',
      label: 'User Name & Email',
      render: (val, row) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0">
            {val ? val.split(' ').map(n => n[0]).join('').slice(0, 2) : 'U'}
          </div>
          <div>
            <div className="font-semibold text-token-text-primary text-xs">{val}</div>
            <div className="text-[11px] text-token-text-secondary">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Current RBAC Role',
      width: '170px',
      render: (val, row) => (
        <Dropdown
          value={val}
          onChange={(e) => handleRoleChange(row.id, e.target.value)}
          options={[
            { label: 'CUSTOMER', value: 'CUSTOMER' },
            { label: 'AGENT', value: 'AGENT' },
            { label: 'ADMIN', value: 'ADMIN' },
          ]}
          size="sm"
        />
      ),
    },
    {
      key: 'department',
      label: 'Assigned Department / Org',
      render: (val) => (
        <span className="text-xs font-medium text-token-text-primary flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-token-text-muted" />
          {val || 'Acme Corp'}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: '100px',
      render: (val) => <Badge variant="success">{val || 'Active'}</Badge>,
    },
    {
      key: 'last_login',
      label: 'Last Active',
      width: '130px',
      render: (val) => <span className="font-mono text-xs text-token-text-secondary">{val}</span>,
    },
  ];

  return (
    <MainLayout
      breadcrumbs={breadcrumbs}
      title="User & Access Governance (RBAC)"
      subtitle="Configure enterprise user permissions, assign departmental access, and govern Customer, Agent, and Admin roles."
      actions={
        <Button variant="primary" icon={Plus} onClick={() => setProvisionModalOpen(true)}>
          Provision User
        </Button>
      }
    >
      <div className="space-y-5">
        {/* RBAC Overview Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-token-card border border-emerald-500/30 rounded-[8px] flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-emerald-600">Customers (Minimal Access)</div>
              <div className="text-2xl font-bold text-token-text-primary mt-1">
                {users.filter(u => u.role === 'CUSTOMER').length} Accounts
              </div>
              <div className="text-[11px] text-token-text-secondary mt-0.5">Can only view own queries & FAQs</div>
            </div>
            <div className="p-2.5 bg-emerald-500/10 rounded-full text-emerald-600">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 bg-token-card border border-blue-500/30 rounded-[8px] flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-blue-600">Agents (Elevated Access)</div>
              <div className="text-2xl font-bold text-token-text-primary mt-1">
                {users.filter(u => u.role === 'AGENT').length} Staff
              </div>
              <div className="text-[11px] text-token-text-secondary mt-0.5">All tickets, AI triage, department routing</div>
            </div>
            <div className="p-2.5 bg-blue-500/10 rounded-full text-blue-600">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 bg-token-card border border-purple-500/30 rounded-[8px] flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-purple-600">Administrators (Full Access)</div>
              <div className="text-2xl font-bold text-token-text-primary mt-1">
                {users.filter(u => u.role === 'ADMIN').length} Superusers
              </div>
              <div className="text-[11px] text-token-text-secondary mt-0.5">Master overrides, RBAC, SLA policies</div>
            </div>
            <div className="p-2.5 bg-purple-500/10 rounded-full text-purple-600">
              <Shield className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* User Roster Table */}
        <Table columns={columns} data={users} loading={loading} keyField="id" />
      </div>

      {/* Provision User Modal */}
      <Modal
        isOpen={provisionModalOpen}
        onClose={() => setProvisionModalOpen(false)}
        title="Provision New Enterprise User"
        size="md"
      >
        <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
          <Input
            label="Full Name"
            placeholder="e.g., Jordan Hayes"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            required
          />
          <Input
            label="Email Address"
            placeholder="e.g., jordan.hayes@company.com"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            type="email"
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Dropdown
              label="Assigned RBAC Role"
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              options={[
                { label: 'Customer (Minimal)', value: 'CUSTOMER' },
                { label: 'Agent (Elevated)', value: 'AGENT' },
                { label: 'Admin (Full)', value: 'ADMIN' },
              ]}
            />
            <Dropdown
              label="Assigned Department"
              value={newUser.department}
              onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
              options={[
                { label: 'Technical Support', value: 'Technical Support' },
                { label: 'Finance & Billing', value: 'Finance & Billing' },
                { label: 'Identity & Access', value: 'Identity & Access' },
                { label: 'API Platform Team', value: 'API Platform Team' },
                { label: 'Acme Corp (Client)', value: 'Acme Corp' },
              ]}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-token-border">
            <Button variant="secondary" onClick={() => setProvisionModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" icon={Plus}>
              Create User Account
            </Button>
          </div>
        </form>
      </Modal>
    </MainLayout>
  );
}

