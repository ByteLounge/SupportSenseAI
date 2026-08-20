/**
 * API Service Client: api.js
 * Clean REST API client with Axios interceptors and fallback mock data for standalone operations.
 */

import axios from 'axios';

const rawBaseURL = import.meta.env.VITE_API_BASE_URL || '/api/v1';
const baseURL = (rawBaseURL.startsWith('http://') || rawBaseURL.startsWith('https://') || rawBaseURL.startsWith('/'))
  ? rawBaseURL
  : `https://${rawBaseURL}`;

const API = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor: Attach JWT Bearer Token if present in localStorage
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('supportsense_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Mock Initial Data for Enterprise Fallback
const MOCK_TICKETS = [
  {
    id: 'tck-1001',
    ticket_number: 'TCK-1001',
    title: 'Database connection timeout in production cluster',
    description: 'Our primary PostgreSQL cluster is throwing 504 gateway timeout errors during peak hours. Need urgent DBA investigation.',
    customer_name: 'Alex Rivera',
    customer_email: 'alex.rivera@acme.corp',
    category: 'Technical',
    assigned_department: 'Database Infrastructure',
    status: 'OPEN',
    priority: 'URGENT',
    customer_mood: 'FRUSTRATED',
    mood_confidence: 0.94,
    created_at: '2026-08-05T08:30:00Z',
    predicted_resolution_time: '2-4 hours',
    suggested_reply: 'Our database engineering team has identified the pool exhaustion and is rolling out a read-replica patch.',
    messages: [
      {
        id: 'm-1',
        sender_name: 'Alex Rivera',
        sender_role: 'CUSTOMER',
        message_body: 'Our production database is timing out every 10 minutes. Please escalate immediately!',
        created_at: '2026-08-05T08:30:00Z',
        is_internal_note: false
      }
    ],
    checklists: [
      { id: 'c1', item_text: 'Verify replica failover logs', is_completed: true },
      { id: 'c2', item_text: 'Check connection pool max capacity', is_completed: false },
      { id: 'c3', item_text: 'Send resolution update to customer', is_completed: false }
    ]
  },
  {
    id: 'tck-1002',
    ticket_number: 'TCK-1002',
    title: 'Annual Enterprise Plan invoice request',
    description: 'Please provide the itemized PDF invoice with VAT identification number for Q3 2026 renewal.',
    customer_name: 'Sarah Connor',
    customer_email: 's.connor@cyberdyne.io',
    category: 'Billing',
    assigned_department: 'Finance & Billing',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    customer_mood: 'NEUTRAL',
    mood_confidence: 0.88,
    created_at: '2026-08-05T09:15:00Z',
    predicted_resolution_time: '1 business day',
    suggested_reply: 'The itemized VAT invoice for Q3 has been attached and emailed to your billing department.',
    messages: [
      {
        id: 'm-2',
        sender_name: 'Sarah Connor',
        sender_role: 'CUSTOMER',
        message_body: 'Hi, we need the tax invoice for our quarterly accounting audit.',
        created_at: '2026-08-05T09:15:00Z',
        is_internal_note: false
      }
    ],
    checklists: [
      { id: 'c4', item_text: 'Generate PDF invoice in Billing Portal', is_completed: true },
      { id: 'c5', item_text: 'Attach Tax ID tax certificate', is_completed: true }
    ]
  },
  {
    id: 'tck-1003',
    ticket_number: 'TCK-1003',
    title: 'SSO SAML Integration failure with Okta IDP',
    description: 'SAML Assertion signature validation failing after Okta certificate rotation on customer tenant.',
    customer_name: 'David Chen',
    customer_email: 'd.chen@enterprise.net',
    category: 'Security',
    assigned_department: 'Identity & Access',
    status: 'RESOLVED',
    priority: 'HIGH',
    customer_mood: 'NEUTRAL',
    mood_confidence: 0.91,
    created_at: '2026-08-04T14:20:00Z',
    predicted_resolution_time: '1 hour',
    suggested_reply: 'We updated the X.509 signing certificate in your SSO metadata config. SAML login is now fully operational.',
    messages: [
      {
        id: 'm-3',
        sender_name: 'David Chen',
        sender_role: 'CUSTOMER',
        message_body: 'Our users cannot log in via SSO after certificate update.',
        created_at: '2026-08-04T14:20:00Z',
        is_internal_note: false
      }
    ],
    checklists: []
  },
  {
    id: 'tck-1004',
    ticket_number: 'TCK-1004',
    title: 'API Rate limit configuration for webhook endpoint',
    description: 'Requesting rate limit increase from 100 req/min to 500 req/min for webhooks integration.',
    customer_name: 'Emma Watson',
    customer_email: 'e.watson@devops.co',
    category: 'Feature Request',
    assigned_department: 'API Platform Team',
    status: 'OPEN',
    priority: 'LOW',
    customer_mood: 'HAPPY',
    mood_confidence: 0.96,
    created_at: '2026-08-05T11:45:00Z',
    predicted_resolution_time: '2 business days',
    suggested_reply: 'Your tenant quota for webhook limits has been updated to 500 req/min.',
    messages: [],
    checklists: []
  }
];

// Helper to handle API calls with smart dev/demo mock fallback
async function safeApiCall(apiFunc, mockFallback) {
  try {
    const res = await apiFunc();
    return res;
  } catch (err) {
    // Fall back to demo mock payload if backend is offline/unreachable or if VITE_ENABLE_MOCK=true
    const isNetworkError = !err.status && (!err.response || err.message === 'Network / Server Error' || err.code === 'ERR_NETWORK');
    const allowMockFallback = import.meta.env.VITE_ENABLE_MOCK === 'true' || isNetworkError;

    if (allowMockFallback && mockFallback !== undefined) {
      console.warn('[DEV DEMO] Backend server offline or unreachable. Using demo fallback payload.', err);
      return { data: mockFallback };
    }
    throw err;
  }
}

// Interceptor response handling
API.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('supportsense_token');
      localStorage.removeItem('supportsense_user');
    }
    return Promise.reject(error.response?.data || { message: 'Network / Server Error' });
  }
);

// Auth Endpoints
export const loginApi = (email, password) =>
  safeApiCall(
    () => API.post('/auth/login', { email, password }),
    {
      user: {
        id: 'u-1',
        name: email.split('@')[0].replace('.', ' '),
        email: email,
        role: email.includes('alex') ? 'CUSTOMER' : 'AGENT',
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
      },
      token: 'mock-jwt-token-supportsense'
    }
  );

export const registerApi = (userData) => API.post('/auth/register', userData);
export const getMeApi = () => API.get('/auth/me');

// Ticket Endpoints
export const getTicketsApi = (params = {}) =>
  safeApiCall(
    () => API.get('/tickets', { params }),
    MOCK_TICKETS.filter((t) => {
      if (params.status && t.status !== params.status) return false;
      if (params.priority && t.priority !== params.priority) return false;
      if (params.search) {
        const q = params.search.toLowerCase();
        return (
          t.title.toLowerCase().includes(q) ||
          t.ticket_number.toLowerCase().includes(q) ||
          t.customer_name.toLowerCase().includes(q)
        );
      }
      return true;
    })
  );

export const getTicketByIdApi = (id) =>
  safeApiCall(
    () => API.get(`/tickets/${id}`),
    MOCK_TICKETS.find((t) => t.id === id || t.ticket_number === id) || MOCK_TICKETS[0]
  );

export const createTicketApi = (data) =>
  safeApiCall(
    () => API.post('/tickets', data),
    {
      id: `tck-${Date.now()}`,
      ticket_number: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
      ...data,
      status: 'OPEN',
      customer_name: 'Alex Rivera',
      created_at: new Date().toISOString()
    }
  );

export const updateTicketStatusApi = (id, data) =>
  safeApiCall(
    () => API.patch(`/tickets/${id}/status`, data),
    { success: true, status: data.status }
  );

export const postMessageApi = (id, data) =>
  safeApiCall(
    () => API.post(`/tickets/${id}/messages`, data),
    {
      id: `m-${Date.now()}`,
      sender_name: 'Sarah Agent',
      sender_role: 'AGENT',
      message_body: data.messageBody,
      is_internal_note: data.isInternalNote || false,
      created_at: new Date().toISOString()
    }
  );

export const toggleChecklistApi = (id, itemId, isCompleted) =>
  safeApiCall(
    () => API.patch(`/tickets/${id}/checklist/${itemId}`, { isCompleted }),
    { success: true }
  );

// AI Proxy Endpoints
export const verifyResponseApi = (data) =>
  safeApiCall(
    () => API.post('/ai/verify-response', data),
    {
      overall_grade: 'A-',
      confidence_score: 0.92,
      scores: {
        clarity: 92,
        politeness: 96,
        technical_accuracy: 88,
        completeness: 90
      },
      suggestions: [
        'Consider referencing SLA documentation link to clarify expected resolution time.'
      ]
    }
  );

export const getInsightsApi = () =>
  safeApiCall(
    () => API.get('/ai/insights'),
    {
      week_identifier: 'Week 32 (Aug 2026)',
      confidence_score: 0.95,
      top_issues: [
        { issue: 'Database Connection Pool Exhaustion', count: 24 },
        { issue: 'SAML SSO Certificate Expiration', count: 18 },
        { issue: 'Webhook Signature Verification Error', count: 12 },
        { issue: 'Billing VAT Tax Invoice Request', count: 10 },
        { issue: 'OAuth Token Refresh Expired', count: 8 }
      ],
      common_mistakes: [
        { mistake: 'Closing ticket before verifying customer SLA confirmation', impact: 'High Reopen Rate' },
        { mistake: 'Missing internal escalation tag for DBA team', impact: 'Delayed Resolution' }
      ],
      recommended_faqs: [
        {
          question: 'How do I rotate my Okta SAML signing certificate without downtime?',
          suggested_answer: 'Upload the new X.509 certificate to Identity settings 24 hours prior to rotation.'
        },
        {
          question: 'What are the default API rate limits for webhook subscriptions?',
          suggested_answer: 'Standard plan includes 100 req/min. Enterprise plans scale up to 1,000 req/min.'
        }
      ]
    }
  );

export const getDepartmentRulesApi = () =>
  safeApiCall(
    () => API.get('/ai/departments'),
    {
      "Finance & Billing": {
        categories: ["Billing", "Refund", "Invoice"],
        auto_reply_enabled: true,
        min_confidence: 0.85,
        target_sla_hours: 4,
        allowed_actions: ["Lookup transaction ID", "Check active subscription status"]
      },
      "Technical Support": {
        categories: ["Technical", "Bug", "Hardware", "Performance"],
        auto_reply_enabled: true,
        min_confidence: 0.80,
        target_sla_hours: 8,
        allowed_actions: ["Check system status health", "Fetch API error logs"]
      },
      "Identity & Access": {
        categories: ["Account", "Login", "SSO", "Password"],
        auto_reply_enabled: true,
        min_confidence: 0.90,
        target_sla_hours: 2,
        allowed_actions: ["Verify registered user email", "Initiate secure reset link"]
      },
      "API Platform Team": {
        categories: ["API Platform", "Rate Limit", "Webhook", "SDK"],
        auto_reply_enabled: true,
        min_confidence: 0.85,
        target_sla_hours: 6,
        allowed_actions: ["Check API Gateway rate limits", "Inspect webhook delivery attempts"]
      }
    }
  );

export const evaluateDepartmentAutoReplyApi = (data) =>
  safeApiCall(
    () => API.post('/ai/department-auto-reply', data),
    {
      should_auto_reply: true,
      target_department: data.departmentName || 'Technical Support',
      confidence_score: 0.92,
      automated_reply_body: `Hello, thank you for reaching out. We have logged your request regarding "${data.title}" and our automated diagnostics have initiated verification.`,
      actions_triggered: ['Logged ticket intake timestamp', 'Initiated diagnostic trace'],
      requires_human_escalation: false
    }
  );

export const getBenchmarksApi = () =>
  safeApiCall(
    () => API.get('/ai/benchmarks'),
    {
      "Billing": { "avg_resolution": "1-2 business days", "common_priority": "HIGH", "sample_count": 142 },
      "Technical": { "avg_resolution": "2-3 business days", "common_priority": "MEDIUM", "sample_count": 210 },
      "Account": { "avg_resolution": "4-12 hours", "common_priority": "HIGH", "sample_count": 89 },
      "Bug": { "avg_resolution": "3-5 business days", "common_priority": "URGENT", "sample_count": 65 }
    }
  );

export default API;

