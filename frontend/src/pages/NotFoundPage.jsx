/**
 * Page: NotFoundPage.jsx
 * Lead Engineer: Member 1 (Frontend Lead)
 * Description: 404 Fallback page for unmatched routes.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-4">
      <div className="p-4 rounded-3xl bg-indigo-500/10 text-indigo-500">
        <Bot className="w-12 h-12" />
      </div>
      <h2 className="font-display font-bold text-3xl">404 — Page Not Found</h2>
      <p className="text-sm text-slate-500 max-w-sm">
        The workspace route you requested does not exist or has been relocated.
      </p>
      <Link
        to="/"
        className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md transition-all flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" /> Return to Dashboard Queue
      </Link>
    </div>
  );
}
