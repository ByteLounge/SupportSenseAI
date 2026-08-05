/**
 * Layout Component: MainLayout.jsx
 * Responsive Enterprise Shell handling Desktop Sidebar Collapse, Mobile Slide-out Drawer, Top Navbar, and Ultrawide Viewports.
 */

import React, { useState, useEffect } from 'react';
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
  // Remember desktop sidebar collapse state in localStorage
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(() => {
    return localStorage.getItem('supportsense_sidebar_collapsed') === 'true';
  });

  // Mobile sidebar drawer state
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleToggleDesktopCollapse = () => {
    setIsDesktopCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('supportsense_sidebar_collapsed', String(next));
      return next;
    });
  };

  return (
    <div className="min-h-screen flex bg-token-secondary text-token-text-primary">
      {/* Responsive Sidebar */}
      <Sidebar
        isCollapsed={isDesktopCollapsed}
        onToggleCollapse={handleToggleDesktopCollapse}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Viewport Shell */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <Navbar
          onToggleMobileSidebar={() => setIsMobileOpen(!isMobileOpen)}
        />

        {/* Content Viewport Area */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
          <div className="max-w-[1800px] mx-auto space-y-4">
            {/* Breadcrumbs (Hidden on tiny screens if unnecessary) */}
            {breadcrumbs && breadcrumbs.length > 0 && (
              <div className="hidden sm:block">
                <Breadcrumbs items={breadcrumbs} />
              </div>
            )}

            {/* Page Header Title & Responsive Action Buttons */}
            {(title || actions) && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-token-border">
                <div>
                  {title && <h1 className="text-lg sm:text-xl font-semibold text-token-text-primary">{title}</h1>}
                  {subtitle && <p className="text-xs text-token-text-secondary mt-0.5">{subtitle}</p>}
                </div>
                {actions && <div className="flex items-center gap-2 shrink-0 flex-wrap">{actions}</div>}
              </div>
            )}

            {/* Page Content */}
            <div className="pt-1">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
