/**
 * Layout Component: MainLayout.jsx
 * Enterprise desktop-first layout shell with left sidebar, top navbar, and content viewport.
 */

import React from 'react';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import Breadcrumbs from '../components/common/Breadcrumbs';

export default function MainLayout({
  children,
  breadcrumbs = [],
  title,
  subtitle,
  actions,
}) {
  return (
    <div className="min-h-screen flex bg-[#F8F9FA] text-[#111827]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Navbar */}
        <Navbar />

        {/* Viewport Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-4">
            {/* Breadcrumbs */}
            {breadcrumbs && breadcrumbs.length > 0 && (
              <Breadcrumbs items={breadcrumbs} />
            )}

            {/* Page Header (Title & Action Buttons) */}
            {(title || actions) && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[#E5E7EB]">
                <div>
                  {title && <h1 className="text-xl font-semibold text-[#111827]">{title}</h1>}
                  {subtitle && <p className="text-xs text-[#6B7280] mt-0.5">{subtitle}</p>}
                </div>
                {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
              </div>
            )}

            {/* Main Page Content */}
            <div className="pt-1">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
