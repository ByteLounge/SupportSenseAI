/**
 * Page: ProfilePage.jsx
 * Simple User Profile Screen.
 */

import React from 'react';
import MainLayout from '../layouts/MainLayout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import ThemeToggle from '../components/common/ThemeToggle';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Building2, LogOut } from 'lucide-react';

export default function ProfilePage() {
  const { user, logout } = useAuth();

  const breadcrumbs = [
    { label: 'Dashboard', path: '/' },
    { label: 'Profile' },
  ];

  if (!user) return null;

  return (
    <MainLayout
      breadcrumbs={breadcrumbs}
      title="User Profile"
      subtitle="View your account credentials, role permissions, and theme preferences."
    >
      <div className="max-w-2xl mx-auto space-y-4">
        <Card title="Account Details">
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-3 pb-3 border-b border-token-border">
              <div className="w-12 h-12 bg-token-accent text-white font-bold text-lg rounded-full flex items-center justify-center">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <h2 className="text-sm font-semibold text-token-text-primary">{user.name}</h2>
                <p className="text-token-text-secondary">{user.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-token-secondary border border-token-border rounded-[6px] space-y-1">
                <div className="text-token-text-secondary font-medium flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-token-accent" />
                  Access Role
                </div>
                <div>
                  <Badge variant="primary">{user.role || 'AGENT'}</Badge>
                </div>
              </div>

              <div className="p-3 bg-token-secondary border border-token-border rounded-[6px] space-y-1">
                <div className="text-token-text-secondary font-medium flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-token-text-muted" />
                  Assigned Organization
                </div>
                <div className="font-semibold text-token-text-primary">
                  {user.role === 'CUSTOMER' ? 'Acme Corp' : 'API Platform & Support'}
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Preferences & Actions">
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 bg-token-secondary border border-token-border rounded-[6px]">
              <div>
                <div className="font-semibold text-token-text-primary">Appearance & Theme</div>
                <div className="text-token-text-secondary">Switch between Light, Dark, or System preference.</div>
              </div>
              <ThemeToggle />
            </div>

            <div className="pt-2 flex justify-end">
              <Button variant="danger" icon={LogOut} onClick={logout}>
                Sign Out of Workspace
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
