/**
 * Utility functions for data formatting, dates, status badges, and priority colors.
 * Used across enterprise dashboard components.
 */

/**
 * Format ISO date string into a readable date format (e.g., "Aug 5, 2026 14:30")
 */
export function formatDate(dateString) {
  if (!dateString) return 'N/A';
  try {
    const d = new Date(dateString);
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  } catch (e) {
    return dateString;
  }
}

/**
 * Format relative time or short date
 */
export function formatShortDate(dateString) {
  if (!dateString) return 'N/A';
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch (e) {
    return dateString;
  }
}

/**
 * Return enterprise badge styling for ticket statuses
 */
export function getStatusBadgeStyle(status) {
  const normalized = (status || 'OPEN').toUpperCase();
  switch (normalized) {
    case 'RESOLVED':
    case 'CLOSED':
      return {
        bg: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
        dot: 'bg-emerald-500',
        label: 'Resolved'
      };
    case 'IN_PROGRESS':
    case 'PENDING':
      return {
        bg: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20',
        dot: 'bg-amber-500',
        label: 'In Progress'
      };
    case 'OPEN':
    default:
      return {
        bg: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20',
        dot: 'bg-blue-500',
        label: 'Open'
      };
  }
}

/**
 * Return enterprise badge styling for ticket priorities
 */
export function getPriorityBadgeStyle(priority) {
  const normalized = (priority || 'MEDIUM').toUpperCase();
  switch (normalized) {
    case 'URGENT':
    case 'CRITICAL':
      return 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20 font-semibold';
    case 'HIGH':
      return 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20 font-medium';
    case 'MEDIUM':
      return 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20 font-medium';
    case 'LOW':
    default:
      return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20 font-normal';
  }
}

/**
 * Format decimal confidence score to integer percentage
 */
export function formatConfidence(score) {
  if (score === undefined || score === null) return '85%';
  const num = typeof score === 'number' ? score : parseFloat(score);
  if (isNaN(num)) return '85%';
  return `${Math.round(num > 1 ? num : num * 100)}%`;
}
