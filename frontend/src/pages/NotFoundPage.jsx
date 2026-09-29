/**
 * Page: NotFoundPage.jsx
 * Enterprise 404 Not Found Page.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/common/Button';
import { Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <MainLayout title="404 Page Not Found">
      <div className="p-12 bg-token-card border border-token-border rounded-2xl text-center space-y-4 max-w-lg mx-auto shadow-card">
        <div className="text-4xl font-bold font-mono text-token-accent">404</div>
        <h3 className="text-base font-semibold text-token-text-primary">Page Not Found</h3>
        <p className="text-xs text-token-text-secondary">
          The requested page route does not exist or has been moved to another section.
        </p>
        <div className="pt-2">
          <Link to="/">
            <Button variant="primary" icon={Home}>
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
