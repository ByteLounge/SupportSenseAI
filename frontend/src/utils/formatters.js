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
        bg: 'bg-green-50 text-green-700 border-green-200',
        dot: 'bg-green-600',
        label: 'Resolved'
      };
    case 'IN_PROGRESS':
    case 'PENDING':
      return {
        bg: 'bg-amber-50 text-amber-700 border-amber-200',
        dot: 'bg-amber-600',
        label: 'In Progress'
      };
    case 'OPEN':
    default:
      return {
        bg: 'bg-blue-50 text-blue-700 border-blue-200',
        dot: 'bg-blue-600',
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
      return 'bg-red-50 text-red-700 border-red-200 font-semibold';
    case 'HIGH':
      return 'bg-amber-50 text-amber-700 border-amber-200 font-medium';
    case 'MEDIUM':
      return 'bg-blue-50 text-blue-700 border-blue-200 font-medium';
    case 'LOW':
    default:
      return 'bg-gray-100 text-gray-600 border-gray-200 font-normal';
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
