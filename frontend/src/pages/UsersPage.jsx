/**
 * Page: UsersPage.jsx
 * User Directory & Role-Based Access Control (RBAC).
 * Clean, fast, and simple user management for administrators.
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
import {
  Plus,
  UserCheck,
  Shield,
  Users,
  Building2,
  Search,
} from 'lucide-react';

export default function UsersPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
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
    addToast(`User ${newUser.name} created as ${newUser.role}`, 'success');
    setProvisionModalOpen(false);
    setNewUser({ name: '', email: '', role: 'AGENT', department: 'Technical Support' });
  };

  const breadcrumbs = [
    { label: 'Admin Overview', path: '/' },
    { label: 'Team & Users' },
  ];

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      !search ||
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.department?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = !roleFilter || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const customerCount = users.filter((u) => u.role === 'CUSTOMER').length;
  const agentCount = users.filter((u) => u.role === 'AGENT').length;
  const adminCount = users.filter((u) => u.role === 'ADMIN').length;

  const columns = [
    {
      key: 'name',
      label: 'User',
      render: (val, row) => (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold text-xs shrink-0">
            {val ? val.split(' ').map((n) => n[0]).join('').slice(0, 2) : 'U'}
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
      label: 'Role',
      width: '150px',
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
      label: 'Department / Organization',
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
      width: '90px',
      render: (val) => <Badge variant="success" size="sm">{val || 'Active'}</Badge>,
    },
    {
      key: 'last_login',
      label: 'Last Active',
      width: '120px',
      render: (val) => <span className="text-xs text-token-text-secondary">{val || 'Today'}</span>,
    },
  ];

  return (
    <MainLayout
      breadcrumbs={breadcrumbs}
      title="User Directory & Access Control"
      subtitle="Manage team members, roles, and departmental permissions."
      actions={
        <Button variant="primary" icon={Plus} onClick={() => setProvisionModalOpen(true)}>
          Add User
        </Button>
      }
    >
      <div className="space-y-5">
        {/* 3 Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card noPadding className="p-4 flex items-center justify-between border-l-4 border-l-emerald-500">
            <div>
              <div className="text-xs font-medium text-token-text-secondary">Customers</div>
              <div className="text-2xl font-bold text-token-text-primary mt-1">{customerCount} Accounts</div>
              <div className="text-[11px] text-token-text-muted mt-0.5">Submit & track queries</div>
            </div>
            <div className="p-2.5 bg-emerald-500/10 rounded-[6px] text-emerald-600">
              <UserCheck className="w-5 h-5" />
            </div>
          </Card>

          <Card noPadding className="p-4 flex items-center justify-between border-l-4 border-l-blue-500">
            <div>
              <div className="text-xs font-medium text-token-text-secondary">Support Agents</div>
              <div className="text-2xl font-bold text-blue-600 mt-1">{agentCount} Staff</div>
              <div className="text-[11px] text-token-text-muted mt-0.5">Handle queue & AI triage</div>
            </div>
            <div className="p-2.5 bg-blue-500/10 rounded-[6px] text-blue-600">
              <Users className="w-5 h-5" />
            </div>
          </Card>

          <Card noPadding className="p-4 flex items-center justify-between border-l-4 border-l-purple-500">
            <div>
              <div className="text-xs font-medium text-token-text-secondary">Administrators</div>
              <div className="text-2xl font-bold text-purple-600 mt-1">{adminCount} Admins</div>
              <div className="text-[11px] text-token-text-muted mt-0.5">Full governance & policies</div>
            </div>
            <div className="p-2.5 bg-purple-500/10 rounded-[6px] text-purple-600">
              <Shield className="w-5 h-5" />
            </div>
          </Card>
        </div>

        {/* Filter Bar & User Table */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { label: 'All Users', val: '', count: users.length },
                { label: 'Agents', val: 'AGENT', count: agentCount },
                { label: 'Admins', val: 'ADMIN', count: adminCount },
                { label: 'Customers', val: 'CUSTOMER', count: customerCount },
              ].map((tab) => (
                <button
                  key={tab.val}
                  onClick={() => setRoleFilter(tab.val)}
                  className={`px-3 py-1.5 rounded-[6px] text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    roleFilter === tab.val
                      ? 'bg-purple-600 text-white font-semibold shadow-xs'
                      : 'bg-token-card border border-token-border text-token-text-secondary hover:bg-token-muted'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    roleFilter === tab.val ? 'bg-white/20 text-white' : 'bg-token-secondary text-token-text-muted'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            <div className="w-full sm:w-64">
              <Input
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                icon={Search}
              />
            </div>
          </div>

          <Table columns={columns} data={filteredUsers} loading={loading} keyField="id" />
        </div>
      </div>

      {/* Provision User Modal */}
      <Modal
        isOpen={provisionModalOpen}
        onClose={() => setProvisionModalOpen(false)}
        title="Add New User"
        size="md"
      >
        <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
          <Input
            label="Full Name"
            placeholder="e.g. Jane Doe"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            required
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="jane@company.com"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Dropdown
              label="Role"
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              options={[
                { label: 'AGENT', value: 'AGENT' },
                { label: 'ADMIN', value: 'ADMIN' },
                { label: 'CUSTOMER', value: 'CUSTOMER' },
              ]}
            />
            <Dropdown
              label="Department"
              value={newUser.department}
              onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
              options={[
                { label: 'Technical Support', value: 'Technical Support' },
                { label: 'Finance & Billing', value: 'Finance & Billing' },
                { label: 'Identity & Access', value: 'Identity & Access' },
                { label: 'API Platform Team', value: 'API Platform Team' },
              ]}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-token-border">
            <Button variant="secondary" onClick={() => setProvisionModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Create User
            </Button>
          </div>
        </form>
      </Modal>
    </MainLayout>
  );
}
