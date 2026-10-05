/**
 * API Service Client: api.js
 * Clean REST API client with Axios interceptors and rich multi-role mock fallback data.
 */

import axios from 'axios';

/**
 * Normalizes the API base URL to ensure valid external resolution in browser runtimes.
 * Resolves edge-cases where Render Blueprints or internal service names (e.g., 'supportsense-backend')
 * are injected without FQDNs or without the required '/api/v1' path prefix.
 */
function getApiBaseUrl() {
  let url = (import.meta.env.VITE_API_BASE_URL || '/api/v1').trim();

  // 1. Detect unresolvable internal hostnames without TLDs (e.g. 'supportsense-backend')
  // Browsers cannot resolve internal cluster/Docker service names on the public internet.
  if (!url.startsWith('/') && !url.startsWith('http://localhost') && !url.startsWith('https://localhost')) {
    const hostPart = url.replace(/^https?:\/\//, '').split('/')[0];
    if (!hostPart.includes('.')) {
      const currentHost = typeof window !== 'undefined' ? window.location.hostname : '';
      if (currentHost.includes('onrender.com')) {
        // Automatically map internal service name to the public Render domain
        url = `https://${hostPart}.onrender.com/api/v1`;
      } else {
        // Fall back to relative path to leverage reverse proxies / static site rewrites
        url = '/api/v1';
      }
    }
  }

  // 2. Ensure valid HTTP/HTTPS protocol for non-relative URLs
  if (!url.startsWith('/') && !url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }

  // 3. Ensure the mandatory '/api/v1' prefix is present
  url = url.replace(/\/+$/, '');
  if (!url.endsWith('/api/v1')) {
    if (url.endsWith('/api')) {
      url += '/v1';
    } else if (!url.includes('/api/')) {
      url += '/api/v1';
    }
  }

  return url;
}

const baseURL = getApiBaseUrl();

const API = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor: Attach JWT Bearer Token if present in localStorage
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('supportsense_token');
  if (token && token !== 'mock-jwt-token-supportsense' && token.split('.').length === 3) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Mock Initial Data for Multi-Role Support Experience
let MOCK_TICKETS = [
  {
    id: 'tck-1001',
    ticket_number: 'TCK-1001',
    title: 'Double charged on annual subscription renewal',
    description: 'Hello support, I was charged twice on my credit card for the annual enterprise subscription upgrade yesterday. Card ending in 4921 charged $1,200 twice! Please refund the duplicate charge immediately as this is affecting my company budget.',
    customer_id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    customer_name: 'Alex Rivera',
    customer_email: 'alex.rivera@customer.com',
    customer_org: 'Acme Corp',
    category: 'Billing',
    assigned_department: 'Finance & Billing',
    assigned_agent_id: 'u-elena',
    assigned_agent_name: 'Elena Rostova',
    status: 'IN_PROGRESS',
    priority: 'URGENT',
    customer_mood: 'FRUSTRATED',
    mood_confidence: 0.94,
    patience_score: 'CRITICAL',
    predicted_resolution_time: '1-2 business days',
    created_at: '2026-08-22T08:30:00Z',
    ai_suggested_department: 'Finance & Billing',
    ai_suggested_category: 'Billing',
    ai_routing_approved: true,
    ai_suggested_reply: 'Hello Alex, thank you for reaching out. We apologize for the duplicate charge on card ending 4921. Our finance team has validated transaction ch_3N9x821a and initiated an immediate $1,200 refund. It will reflect on your bank statement in 3-5 business days.',
    forward_history: [
      {
        forwarded_by: 'Sarah Agent',
        forwarded_to: 'Finance & Billing',
        date: '2026-08-22T08:35:00Z',
        comments: 'Verified duplicate charge report in Stripe gateway logs. Routing to Elena for immediate refund approval.'
      }
    ],
    messages: [
      {
        id: 'm-101',
        sender_name: 'Alex Rivera',
        sender_role: 'CUSTOMER',
        sender_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
        message_body: 'Hello support, I was charged twice on my credit card for the annual enterprise subscription upgrade yesterday. Card ending in 4921 charged $1,200 twice! Please refund the duplicate charge immediately as this is affecting my company budget.',
        created_at: '2026-08-22T08:30:00Z',
        is_internal_note: false
      },
      {
        id: 'm-102',
        sender_name: 'Sarah Agent',
        sender_role: 'AGENT',
        sender_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        message_body: '[AI Triage Verified]: Routing to Finance & Billing with high priority. Duplicate charge ID ch_3N9x821a flagged for refund.',
        created_at: '2026-08-22T08:35:00Z',
        is_internal_note: true
      },
      {
        id: 'm-103',
        sender_name: 'Elena Rostova',
        sender_role: 'AGENT',
        sender_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
        message_body: 'Hi Alex, I have processed the $1,200 refund for transaction ch_3N9x821a. You should see the credit back to card 4921 within 3-5 business days. We apologize for any inconvenience caused.',
        created_at: '2026-08-22T09:10:00Z',
        is_internal_note: false
      }
    ],
    checklists: [
      { id: 'c1', item_text: 'Verify Stripe Payment Gateway transaction logs for duplicate IDs', is_completed: true },
      { id: 'c2', item_text: 'Issue $1,200 refund via payment admin portal', is_completed: true },
      { id: 'c3', item_text: 'Send polite apology email with bank processing timeline (3-5 days)', is_completed: true }
    ]
  },
  {
    id: 'tck-1002',
    ticket_number: 'TCK-1002',
    title: 'Database connection pool timeout in US-East cluster',
    description: 'Our primary PostgreSQL cluster is throwing 504 gateway timeout errors during peak 10,000 req/sec loads. Need urgent DBA investigation on connection pooling and read-replica replication lag.',
    customer_id: 'u-corp-2',
    customer_name: 'David Chen',
    customer_email: 'd.chen@enterprise.net',
    customer_org: 'Chen Logistics',
    category: 'Technical',
    assigned_department: 'Technical Support',
    assigned_agent_id: 'u-marcus',
    assigned_agent_name: 'Marcus Vance',
    status: 'IN_PROGRESS',
    priority: 'URGENT',
    customer_mood: 'FRUSTRATED',
    mood_confidence: 0.96,
    patience_score: 'CONCERNED',
    predicted_resolution_time: '2-4 hours',
    created_at: '2026-08-23T06:15:00Z',
    ai_suggested_department: 'Technical Support',
    ai_suggested_category: 'Technical',
    ai_routing_approved: true,
    ai_suggested_reply: 'Hello David, our Database Infrastructure engineering team has analyzed the telemetry. We identified pgBouncer max connection saturation and have scaled out 2 additional read-replicas in US-East. Connection latency has dropped to 12ms.',
    forward_history: [
      {
        forwarded_by: 'Sarah Agent',
        forwarded_to: 'Technical Support',
        date: '2026-08-23T06:20:00Z',
        comments: 'High severity cluster degradation. Forwarded directly to Marcus (DBA Lead).'
      }
    ],
    messages: [
      {
        id: 'm-201',
        sender_name: 'David Chen',
        sender_role: 'CUSTOMER',
        sender_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
        message_body: 'Our primary PostgreSQL cluster is throwing 504 gateway timeout errors during peak 10,000 req/sec loads. Need urgent DBA investigation!',
        created_at: '2026-08-23T06:15:00Z',
        is_internal_note: false
      },
      {
        id: 'm-202',
        sender_name: 'Sarah Agent',
        sender_role: 'AGENT',
        sender_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        message_body: 'Internal Note: Escalated to Marcus Vance. Alerting DB on-call team.',
        created_at: '2026-08-23T06:20:00Z',
        is_internal_note: true
      }
    ],
    checklists: [
      { id: 'c21', item_text: 'Inspect pgBouncer connection pool saturation logs', is_completed: true },
      { id: 'c22', item_text: 'Provision additional read replica in us-east-1 region', is_completed: true },
      { id: 'c23', item_text: 'Verify p99 response times return below 50ms', is_completed: false }
    ]
  },
  {
    id: 'tck-1003',
    ticket_number: 'TCK-1003',
    title: 'SSO SAML Integration failure with Okta IDP',
    description: 'SAML Assertion signature validation is failing after our team rotated the Okta X.509 certificate this morning. None of our 450 corporate employees can log into the portal.',
    customer_id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    customer_name: 'Alex Rivera',
    customer_email: 'alex.rivera@customer.com',
    customer_org: 'Acme Corp',
    category: 'Security',
    assigned_department: 'Identity & Access',
    assigned_agent_id: 'u-devon',
    assigned_agent_name: 'Devon Miles',
    status: 'RESOLVED',
    priority: 'HIGH',
    customer_mood: 'NEUTRAL',
    mood_confidence: 0.91,
    patience_score: 'CONCERNED',
    predicted_resolution_time: '1 hour',
    created_at: '2026-08-21T14:20:00Z',
    ai_suggested_department: 'Identity & Access',
    ai_suggested_category: 'Security',
    ai_routing_approved: true,
    ai_suggested_reply: 'Hello Alex, we have updated your Acme Corp tenant SSO metadata certificate with the new Okta X.509 thumbprint. SAML assertion handshakes are now verified and all team members can log in.',
    forward_history: [],
    messages: [
      {
        id: 'm-301',
        sender_name: 'Alex Rivera',
        sender_role: 'CUSTOMER',
        sender_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
        message_body: 'SAML Assertion signature validation is failing after our team rotated the Okta X.509 certificate this morning.',
        created_at: '2026-08-21T14:20:00Z',
        is_internal_note: false
      },
      {
        id: 'm-302',
        sender_name: 'Devon Miles',
        sender_role: 'AGENT',
        sender_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Devon',
        message_body: 'Hi Alex, the new signing certificate has been synced in your SSO configuration. Please have a user test login.',
        created_at: '2026-08-21T15:05:00Z',
        is_internal_note: false
      },
      {
        id: 'm-303',
        sender_name: 'Alex Rivera',
        sender_role: 'CUSTOMER',
        sender_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
        message_body: 'Confirmed! All 450 users can log in smoothly now. Thank you for the quick resolution!',
        created_at: '2026-08-21T15:20:00Z',
        is_internal_note: false
      }
    ],
    checklists: [
      { id: 'c31', item_text: 'Verify Okta X.509 certificate thumbprint in tenant config', is_completed: true },
      { id: 'c32', item_text: 'Test SP-initiated SAML login with test account', is_completed: true }
    ]
  },
  {
    id: 'tck-1004',
    ticket_number: 'TCK-1004',
    title: 'API Rate limit increase request for Webhooks integration',
    description: 'We are launching our automated partner sync pipeline and requesting an increase in webhook endpoint throughput from 100 req/min to 500 req/min for our production tenant.',
    customer_id: 'u-corp-3',
    customer_name: 'Emma Watson',
    customer_email: 'e.watson@devops.co',
    customer_org: 'DevOps Co',
    category: 'Feature Request',
    assigned_department: 'API Platform Team',
    assigned_agent_id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    assigned_agent_name: 'Sarah Agent',
    status: 'OPEN',
    priority: 'LOW',
    customer_mood: 'HAPPY',
    mood_confidence: 0.96,
    patience_score: 'CALM',
    predicted_resolution_time: '2 business days',
    created_at: '2026-08-23T11:45:00Z',
    ai_suggested_department: 'API Platform Team',
    ai_suggested_category: 'API Platform',
    ai_routing_approved: false,
    ai_suggested_reply: 'Hello Emma, thank you for contacting SupportSense. We have reviewed your partner integration architecture and approved the webhook tier upgrade to 500 req/min. The new rate limit is now active on your API key.',
    forward_history: [],
    messages: [
      {
        id: 'm-401',
        sender_name: 'Emma Watson',
        sender_role: 'CUSTOMER',
        sender_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
        message_body: 'We are launching our automated partner sync pipeline and requesting an increase in webhook endpoint throughput from 100 req/min to 500 req/min.',
        created_at: '2026-08-23T11:45:00Z',
        is_internal_note: false
      }
    ],
    checklists: [
      { id: 'c41', item_text: 'Check tenant API quota usage history in API Gateway', is_completed: false },
      { id: 'c42', item_text: 'Apply 500 req/min rate limit bucket policy in Redis', is_completed: false }
    ]
  },
  {
    id: 'tck-1005',
    ticket_number: 'TCK-1005',
    title: 'Inter-Department Transfer: Multi-Currency VAT Invoice Request',
    description: 'Customer requested multi-currency VAT breakdown for European tax filing. Initially received by Tech triage, escalated to Finance department.',
    customer_id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    customer_name: 'Alex Rivera',
    customer_email: 'alex.rivera@customer.com',
    customer_org: 'Acme Corp',
    category: 'Billing',
    assigned_department: 'Finance & Billing',
    assigned_agent_id: 'u-elena',
    assigned_agent_name: 'Elena Rostova',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    customer_mood: 'NEUTRAL',
    mood_confidence: 0.89,
    patience_score: 'CALM',
    predicted_resolution_time: '1 business day',
    created_at: '2026-08-23T10:10:00Z',
    ai_suggested_department: 'Finance & Billing',
    ai_suggested_category: 'Billing',
    ai_routing_approved: true,
    ai_suggested_reply: 'Hello Alex, your Q3 European VAT invoice in EUR and USD currency has been compiled. You can download the certified PDF from your billing portal or the attached copy.',
    forward_history: [
      {
        forwarded_by: 'Sarah Agent',
        forwarded_to: 'Finance & Billing',
        date: '2026-08-23T10:15:00Z',
        comments: 'Forwarded to Finance team: Requires EU VAT ID tax compliance review.'
      }
    ],
    messages: [
      {
        id: 'm-501',
        sender_name: 'Alex Rivera',
        sender_role: 'CUSTOMER',
        sender_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
        message_body: 'Hi support team, we need the itemized VAT invoice in EUR for our EU accounting department.',
        created_at: '2026-08-23T10:10:00Z',
        is_internal_note: false
      },
      {
        id: 'm-502',
        sender_name: 'Sarah Agent',
        sender_role: 'AGENT',
        sender_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        message_body: '[Forwarded to Finance & Billing by Sarah Agent]: Customer needs specialized EUR VAT invoice dispatch.',
        created_at: '2026-08-23T10:15:00Z',
        is_internal_note: true
      }
    ],
    checklists: [
      { id: 'c51', item_text: 'Generate EU VAT certified invoice document', is_completed: true },
      { id: 'c52', item_text: 'Dispatch PDF to customer accounting contact', is_completed: false }
    ]
  }
];

// Rich FAQs Database for Customer Self-Serve & Knowledge Base
const MOCK_FAQS = [
  {
    id: 'faq-1',
    category: 'Billing & Payments',
    question: 'How long do credit card refunds take to process?',
    answer: 'Refunds typically take 3-5 business days to reflect in your financial institution statement after being approved and processed by our billing department.',
    tags: ['Billing', 'Refund', 'Credit Card'],
    popular: true,
  },
  {
    id: 'faq-2',
    category: 'Account & Security',
    question: 'How do I rotate our Okta / Azure SAML signing certificate?',
    answer: 'Navigate to Organization Settings > Security & SSO, click "Edit SAML Metadata", paste the new X.509 certificate XML, and click "Validate & Apply". We recommend updating 24 hours prior to expiration.',
    tags: ['SSO', 'SAML', 'Okta', 'Security'],
    popular: true,
  },
  {
    id: 'faq-3',
    category: 'API & Webhooks',
    question: 'What are the default API rate limits and how can I request an increase?',
    answer: 'Standard API limits are 100 requests/minute. Enterprise tenants can request limits up to 1,000 req/minute by submitting an API Platform query.',
    tags: ['API', 'Rate Limit', 'Webhooks'],
    popular: true,
  },
  {
    id: 'faq-4',
    category: 'Billing & Payments',
    question: 'Where can I download my itemized VAT or Tax invoices?',
    answer: 'Invoices are available under Settings > Billing & Invoices. You can download monthly and annual PDF receipts with certified VAT identification numbers.',
    tags: ['Billing', 'VAT', 'Tax', 'Invoice'],
    popular: false,
  },
  {
    id: 'faq-5',
    category: 'Technical & Uptime',
    question: 'What is the recommended connection pool setting for PostgreSQL databases?',
    answer: 'We recommend setting pool sizes between 20-50 connections per instance with pgBouncer transaction pooling enabled to prevent connection exhaustion during traffic spikes.',
    tags: ['Technical', 'Database', 'PostgreSQL'],
    popular: false,
  }
];

// Users Data for Admin Access Control
let MOCK_USERS = [
  {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    name: 'Admin User',
    email: 'admin@supportsense.ai',
    role: 'ADMIN',
    department: 'Operations & Governance',
    status: 'Active',
    last_login: '2026-08-23 13:00',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
  },
  {
    id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    name: 'Sarah Agent',
    email: 'agent.sarah@supportsense.ai',
    role: 'AGENT',
    department: 'Tier 1 Support & AI Triage',
    status: 'Active',
    last_login: '2026-08-23 12:45',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
  },
  {
    id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66',
    name: 'Elena Rostova',
    email: 'elena.r@supportsense.ai',
    role: 'AGENT',
    department: 'Finance & Billing',
    status: 'Active',
    last_login: '2026-08-23 11:20',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena'
  },
  {
    id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a77',
    name: 'Marcus Vance',
    email: 'marcus.vance@supportsense.ai',
    role: 'AGENT',
    department: 'Technical Support',
    status: 'Active',
    last_login: '2026-08-23 09:30',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus'
  },
  {
    id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a88',
    name: 'Liam Scott',
    email: 'liam.scott@supportsense.ai',
    role: 'AGENT',
    department: 'Identity & Access',
    status: 'Active',
    last_login: '2026-08-23 10:15',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Liam'
  },
  {
    id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a99',
    name: 'Priya Sharma',
    email: 'priya.sharma@supportsense.ai',
    role: 'AGENT',
    department: 'API Platform Team',
    status: 'Active',
    last_login: '2026-08-23 11:45',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya'
  },
  {
    id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    name: 'Alex Rivera',
    email: 'alex.rivera@customer.com',
    role: 'CUSTOMER',
    department: 'Acme Corp',
    status: 'Active',
    last_login: '2026-08-23 08:15',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'
  },
  {
    id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
    name: 'Samantha Reed',
    email: 'samantha.reed@globex.com',
    role: 'CUSTOMER',
    department: 'Globex Systems',
    status: 'Active',
    last_login: '2026-08-23 08:45',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Samantha'
  },
  {
    id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55',
    name: 'David Kim',
    email: 'david.kim@nexus.io',
    role: 'CUSTOMER',
    department: 'Nexus Technologies',
    status: 'Active',
    last_login: '2026-08-23 06:10',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David'
  }
];

// Helper to handle API calls with smart dev/demo mock fallback
async function safeApiCall(apiFunc, mockFallbackProducer) {
  try {
    const res = await apiFunc();
    return res;
  } catch (err) {
    // If error contains domain rejection payload (such as duplicate resolved ticket or follow-up linking), rethrow
    if (err && (err.is_duplicate || err.code === 'DUPLICATE_RESOLVED_TICKET' || err.linked_to_existing)) {
      throw err;
    }
    const statusCode = err?.response?.status || err?.status || err?.statusCode;
    const isNetworkOrServerError =
      !statusCode ||
      statusCode >= 500 ||
      statusCode === 404 ||
      err?.message === 'Network / Server Error' ||
      err?.code === 'ERR_NETWORK' ||
      err?.name === 'AxiosError';
    const isAuthError =
      statusCode === 401 ||
      statusCode === 403 ||
      (err?.message && /unauthorized|access denied|invalid or expired authentication token/i.test(err.message));
    const allowMockFallback =
      import.meta.env.VITE_ENABLE_MOCK === 'true' || isNetworkOrServerError || isAuthError;

    if (allowMockFallback && mockFallbackProducer !== undefined) {
      const payload = typeof mockFallbackProducer === 'function' ? mockFallbackProducer() : mockFallbackProducer;
      return { data: payload };
    }
    throw err;
  }
}

// Interceptor response handling
API.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response ? error.response.status : null;
    if (status === 401) {
      // Clear token only so demo/persona user is preserved
      localStorage.removeItem('supportsense_token');
    }
    const errPayload = error.response?.data || { message: 'Network / Server Error' };
    if (typeof errPayload === 'object' && !errPayload.status && status) {
      errPayload.status = status;
    }
    return Promise.reject(errPayload);
  }
);

// Auth Endpoints
export const loginApi = (email, password) =>
  safeApiCall(
    () => API.post('/auth/login', { email, password }),
    () => {
      const found = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase()) || {
        id: `u-${Date.now()}`,
        name: email.split('@')[0].replace('.', ' '),
        email: email,
        role: email.includes('admin') ? 'ADMIN' : email.includes('alex') ? 'CUSTOMER' : 'AGENT',
        department: email.includes('admin') ? 'Operations' : email.includes('alex') ? 'Acme Corp' : 'Support',
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
      };
      return {
        user: found,
        token: 'mock-jwt-token-supportsense'
      };
    }
  );

export const registerApi = (userData) => API.post('/auth/register', userData);
export const getMeApi = () => API.get('/auth/me');

// Stemming & Concept Cluster Duplicate Detector
export const isDuplicateInquiry = (textA, ticketB) => {
  if (!textA || !ticketB) return false;
  const strA = (textA || '').toLowerCase();
  const titleB = (ticketB.title || '').toLowerCase();
  const descB = (ticketB.description || '').toLowerCase();
  const strB = `${titleB} ${descB}`;

  // 1. Direct or normalized substring match
  const cleanA = strA.replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  const cleanTitleB = titleB.replace(/^\[.*?\]\s*/, '').replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  if (cleanA.length > 5 && cleanTitleB.length > 5) {
    if (cleanA.includes(cleanTitleB) || cleanTitleB.includes(cleanA)) return true;
  }

  // 2. Stemming helper
  const stem = (w) => w.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/(ing|edly|ed|ly|es|s|ment|tion|ions)$/, '');
  const stopWords = new Set(['the', 'and', 'is', 'in', 'it', 'to', 'of', 'for', 'with', 'on', 'at', 'from', 'by', 'about', 'as', 'into', 'like', 'through', 'after', 'over', 'between', 'out', 'against', 'during', 'without', 'before', 'under', 'around', 'among', 'hello', 'please', 'help', 'my', 'i', 'was', 'am', 'we', 'our', 'need', 'hey', 'hi', 'cannot', 'cant', 'want', 'report', 'issue', 'ticket', 'problem', 'ticket_number']);

  const getStems = (text) => {
    return text.replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2 && !stopWords.has(w.toLowerCase()))
      .map(stem)
      .filter(s => s.length >= 3);
  };

  const stemsA = getStems(strA);
  const stemsB = getStems(strB);
  if (stemsA.length === 0 || stemsB.length === 0) return false;

  const setB = new Set(stemsB);
  let matchCount = 0;
  for (const s of stemsA) {
    if (setB.has(s)) matchCount++;
  }
  const ratio = stemsA.length > 0 ? matchCount / stemsA.length : 0;

  // 3. Concept clusters
  const clusters = [
    ['charg', 'bill', 'pay', 'card', 'refund', 'invoic', 'subscript', 'renew', 'twice', 'doubl', 'duplic', 'money', 'credit', 'visa', 'stripe', 'debit'],
    ['login', 'log', 'sso', 'okta', 'auth', 'password', 'mfa', '2fa', 'authent', 'saml', 'token', 'access', 'challeng', 'push', 'lock'],
    ['webhook', 'api', '401', '403', '500', 'endpoint', 'rate', 'limit', 'payload', 'secret', 'hmac'],
    ['timeout', 'slow', 'latenc', 'pool', 'databas', 'postgr', 'cluster', 'fail', 'error', 'crash', 'bug', 'connect']
  ];

  for (const cluster of clusters) {
    const matchA = stemsA.some(s => cluster.includes(s));
    const matchB = stemsB.some(s => cluster.includes(s));
    if (matchA && matchB && (matchCount >= 1 || ratio >= 0.25)) {
      return true;
    }
  }

  if (ratio >= 0.35 || matchCount >= 3) return true;

  return false;
};

// Ticket Endpoints with Role-Aware Mock Filtering and Duplicate Consolidation
export const getTicketsApi = (params = {}) =>
  safeApiCall(
    () => API.get('/tickets', { params }),
    () => {
      const currentUser = JSON.parse(localStorage.getItem('supportsense_user') || 'null');
      let list = [...MOCK_TICKETS];

      // CUSTOMER Role Restriction: Can ONLY see their own tickets
      if (currentUser && currentUser.role === 'CUSTOMER') {
        list = list.filter(t => 
          t.customer_id === currentUser.id || 
          t.customer_email?.toLowerCase() === currentUser.email?.toLowerCase()
        );
      }

      // Filter by Department if provided
      if (params.department) {
        list = list.filter(t => t.assigned_department === params.department);
      }

      // Filter by Status
      if (params.status) {
        if (params.status === 'RESOLVED') {
          list = list.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED');
        } else {
          list = list.filter(t => t.status === params.status);
        }
      }

      // Filter by Priority
      if (params.priority) {
        list = list.filter(t => t.priority === params.priority);
      }

      // Filter by Search Query
      if (params.search) {
        const q = params.search.toLowerCase();
        list = list.filter(t =>
          t.title.toLowerCase().includes(q) ||
          t.ticket_number.toLowerCase().includes(q) ||
          (t.customer_name && t.customer_name.toLowerCase().includes(q)) ||
          (t.assigned_department && t.assigned_department.toLowerCase().includes(q))
        );
      }

      // Deduplicate tickets: If the same customer created multiple tickets for the same issue,
      // consolidate into 1 entry so it is NOT displayed multiple times in the ticket list
      const seen = new Map();
      const deduplicatedList = [];

      for (const t of list) {
        const normalizedTitle = (t.title || '')
          .toLowerCase()
          .replace(/^\[.*?\]\s*/, '')
          .replace(/[^a-z0-9]/g, ' ')
          .trim()
          .split(/\s+/)
          .filter(w => w.length > 2)
          .slice(0, 4)
          .join('-');

        const customerKey = t.customer_id || t.customer_email || 'unknown';
        const dedupKey = `${customerKey}_${t.category}_${normalizedTitle}`;

        if (!seen.has(dedupKey)) {
          const entry = { ...t, duplicate_count: 1, duplicate_ticket_ids: [t.id] };
          seen.set(dedupKey, entry);
          deduplicatedList.push(entry);
        } else {
          const existing = seen.get(dedupKey);
          existing.duplicate_count = (existing.duplicate_count || 1) + 1;
          existing.duplicate_ticket_ids = existing.duplicate_ticket_ids || [existing.id];
          existing.duplicate_ticket_ids.push(t.id);
        }
      }

      return deduplicatedList;
    }
  );

export const getTicketByIdApi = (id) =>
  safeApiCall(
    () => API.get(`/tickets/${id}`),
    () => {
      const currentUser = JSON.parse(localStorage.getItem('supportsense_user') || 'null');
      const ticket = MOCK_TICKETS.find((t) => t.id === id || t.ticket_number === id) || MOCK_TICKETS[0];
      
      // If Customer, strip out internal notes for security
      if (currentUser && currentUser.role === 'CUSTOMER') {
        return {
          ...ticket,
          messages: (ticket.messages || []).filter((m) => !m.is_internal_note),
        };
      }
      return ticket;
    }
  );

export const createTicketApi = (data) =>
  safeApiCall(
    () => API.post('/tickets', data),
    () => {
      const currentUser = JSON.parse(localStorage.getItem('supportsense_user') || 'null') || {
        id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
        name: 'Alex Rivera',
        email: 'alex.rivera@customer.com'
      };

      const queryText = `${data.title || ''} ${data.description || ''}`.toLowerCase();

      // Check for matching resolved ticket or active ticket
      const userTickets = MOCK_TICKETS.filter(t => 
        t.customer_id === currentUser.id || 
        t.customer_email === currentUser.email ||
        (data.customer_email && t.customer_email?.toLowerCase() === data.customer_email.toLowerCase())
      );
      
      for (const t of userTickets) {
        const isMatch = isDuplicateInquiry(data.title, t) || isDuplicateInquiry(data.description, t) || isDuplicateInquiry(queryText, t);

        // 1. If resolved ticket exists, strictly reject as duplicate and show resolved ticket
        if (isMatch && (t.status === 'RESOLVED' || t.status === 'CLOSED')) {
          const err = new Error(`Ticket already created: #${t.ticket_number || t.id} — "${t.title}". This issue was already resolved.`);
          err.is_duplicate = true;
          err.already_created = true;
          err.code = 'DUPLICATE_RESOLVED_TICKET';
          err.data = {
            resolved_ticket: t,
            resolution_summary: t.messages?.filter(m => m.sender_role === 'AGENT')?.slice(-1)[0]?.message_body
              || t.ai_suggested_reply
              || 'Issue was investigated and verified resolved by support specialists.'
          };
          throw err;
        }

        // 2. If active ticket exists, link to active ticket and return ticket already created
        if (isMatch && ['OPEN', 'IN_PROGRESS', 'PENDING', 'APPROVED'].includes(t.status)) {
          const followUpMsg = {
            id: `m-followup-${Date.now()}`,
            sender_name: currentUser.name || data.customer_name || 'Customer',
            sender_role: 'CUSTOMER',
            sender_avatar: currentUser.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.name || 'Customer'}`,
            message_body: `[Customer Follow-up Inquiry]:\n${data.description || data.title}`,
            created_at: new Date().toISOString(),
            is_internal_note: false
          };
          t.messages = [...(t.messages || []), followUpMsg];
          t.updated_at = new Date().toISOString();
          return {
            already_created: true,
            is_duplicate: true,
            linked_to_existing: true,
            ticket: t,
            id: t.id,
            ticket_number: t.ticket_number,
            title: t.title,
            status: t.status,
            category: t.category,
            assigned_department: t.assigned_department,
            resolution_summary: `You already have active ticket #${t.ticket_number || t.id} for this issue. Duplicate ticket was not created.`
          };
        }
      }

      // Collect related tickets by category
      const relatedTickets = userTickets.filter(t => t.category === data.category);

      const newId = `tck-${Date.now()}`;
      const ticketNum = `TCK-${Math.floor(1000 + Math.random() * 9000)}`;

      // Simulate AI categorization
      const deptMap = {
        'Billing': 'Finance & Billing',
        'Technical': 'Technical Support',
        'Security': 'Identity & Access',
        'Account': 'Identity & Access',
        'Feature Request': 'API Platform Team',
        'Bug': 'Technical Support'
      };
      const suggestedDept = deptMap[data.category] || 'Technical Support';

      const newTicket = {
        id: newId,
        ticket_number: ticketNum,
        title: data.title,
        description: data.description,
        category: data.category || 'Technical',
        priority: data.priority || 'MEDIUM',
        status: 'OPEN',
        linked_ticket_id: (relatedTickets && relatedTickets[0]?.id) || null,
        linked_tickets: relatedTickets || [],
        customer_id: currentUser.id,
        customer_name: currentUser.name,
        customer_email: currentUser.email,
        customer_org: currentUser.organization || 'Acme Corp',
        assigned_department: suggestedDept,
        assigned_agent_name: 'Unassigned',
        customer_mood: 'NEUTRAL',
        mood_confidence: 0.90,
        patience_score: 'CALM',
        predicted_resolution_time: '1-2 business days',
        created_at: new Date().toISOString(),
        ai_suggested_department: suggestedDept,
        ai_suggested_category: data.category || 'Technical',
        ai_routing_approved: false,
        ai_suggested_reply: `Hello ${currentUser.name}, thank you for contacting SupportSense. Our automated triage has analyzed your inquiry regarding "${data.title}" and assigned it to our ${suggestedDept} team. A specialist will update you shortly.`,
        forward_history: [],
        messages: [
          {
            id: `m-${Date.now()}`,
            sender_name: currentUser.name,
            sender_role: currentUser.role || 'CUSTOMER',
            sender_avatar: currentUser.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.name}`,
            message_body: data.description,
            created_at: new Date().toISOString(),
            is_internal_note: false
          }
        ],
        checklists: [
          { id: `c-${Date.now()}-1`, item_text: 'Verify user entitlement and account status', is_completed: false },
          { id: `c-${Date.now()}-2`, item_text: 'Review diagnostics and draft response', is_completed: false }
        ]
      };

      MOCK_TICKETS = [newTicket, ...MOCK_TICKETS];
      return newTicket;
    }
  );

export const updateTicketStatusApi = (id, data) =>
  safeApiCall(
    () => API.patch(`/tickets/${id}/status`, data),
    () => {
      const idx = MOCK_TICKETS.findIndex(t => t.id === id || t.ticket_number === id);
      if (idx !== -1) {
        MOCK_TICKETS[idx].status = data.status || MOCK_TICKETS[idx].status;
        if (data.status === 'APPROVED') {
          MOCK_TICKETS[idx].ai_routing_approved = true;
        }
        if (data.assignedAgentId) MOCK_TICKETS[idx].assigned_agent_id = data.assignedAgentId;
      }
      return { success: true, status: data.status };
    }
  );

// Forward Ticket to Department with Comments (Agent & Admin)
export const forwardTicketApi = (id, data) =>
  safeApiCall(
    () => API.post(`/tickets/${id}/forward`, data),
    () => {
      const currentUser = JSON.parse(localStorage.getItem('supportsense_user') || 'null') || { name: 'Sarah Agent', role: 'AGENT' };
      const idx = MOCK_TICKETS.findIndex(t => t.id === id || t.ticket_number === id);
      if (idx !== -1) {
        const ticket = MOCK_TICKETS[idx];
        if (data.targetDepartment) {
          ticket.assigned_department = data.targetDepartment;
        }
        const newStatus = data.status || (data.ai_routing_approved ? 'APPROVED' : 'IN_PROGRESS');
        ticket.status = newStatus;
        ticket.ai_routing_approved = data.ai_routing_approved !== undefined ? data.ai_routing_approved : (newStatus === 'APPROVED');

        const forwardEntry = {
          forwarded_by: currentUser.name,
          forwarded_to: data.targetDepartment || ticket.assigned_department,
          date: new Date().toISOString(),
          comments: data.comments || (newStatus === 'APPROVED' ? 'Approved AI department routing.' : 'Approved AI department routing.')
        };
        ticket.forward_history = [forwardEntry, ...(ticket.forward_history || [])];

        const isApproval = newStatus === 'APPROVED' || data.ai_routing_approved;
        const forwardNote = {
          id: `m-fwd-${Date.now()}`,
          sender_name: currentUser.name,
          sender_role: currentUser.role,
          sender_avatar: currentUser.avatar_url,
          message_body: isApproval
            ? `[AI Triage Verification]: Ticket routing approved to ${data.targetDepartment || ticket.assigned_department} by ${currentUser.name}.${data.comments ? ` Comments: "${data.comments}"` : ''}`
            : `[Inter-Department Forwarding]: Ticket routed to ${data.targetDepartment || ticket.assigned_department} by ${currentUser.name}.${data.comments ? ` Comments: "${data.comments}"` : ''}`,
          created_at: new Date().toISOString(),
          is_internal_note: true
        };
        ticket.messages = [...(ticket.messages || []), forwardNote];
        return ticket;
      }
      return { success: true };
    }
  );

// Explicit 1-Click Ticket Approval (Agent & Admin)
export const approveTicketApi = (id, data = {}) =>
  forwardTicketApi(id, {
    ...data,
    status: 'APPROVED',
    ai_routing_approved: true,
    comments: data.comments || 'Approved automated AI department routing.'
  });

// Full Ticket Modification (Admin Master Control)
export const modifyTicketApi = (id, data) =>
  safeApiCall(
    () => API.patch(`/tickets/${id}`, data),
    () => {
      const currentUser = JSON.parse(localStorage.getItem('supportsense_user') || 'null') || { name: 'Admin User', role: 'ADMIN' };
      const idx = MOCK_TICKETS.findIndex(t => t.id === id || t.ticket_number === id);
      if (idx !== -1) {
        MOCK_TICKETS[idx] = {
          ...MOCK_TICKETS[idx],
          ...data,
          updated_at: new Date().toISOString()
        };

        const auditMsg = {
          id: `m-mod-${Date.now()}`,
          sender_name: currentUser.name,
          sender_role: currentUser.role,
          message_body: `[Administrative Modification by ${currentUser.name}]: Updated ticket attributes.`,
          created_at: new Date().toISOString(),
          is_internal_note: true
        };
        MOCK_TICKETS[idx].messages = [...(MOCK_TICKETS[idx].messages || []), auditMsg];
        return MOCK_TICKETS[idx];
      }
      return { success: true };
    }
  );

// Delete / Archive Ticket (Admin Only)
export const deleteTicketApi = (id) =>
  safeApiCall(
    () => API.delete(`/tickets/${id}`),
    () => {
      MOCK_TICKETS = MOCK_TICKETS.filter(t => t.id !== id && t.ticket_number !== id);
      return { success: true, id };
    }
  );

export const postMessageApi = (id, data) =>
  safeApiCall(
    () => API.post(`/tickets/${id}/messages`, data),
    () => {
      const currentUser = JSON.parse(localStorage.getItem('supportsense_user') || 'null') || { name: 'Sarah Agent', role: 'AGENT' };
      const newMsg = {
        id: `m-${Date.now()}`,
        sender_name: currentUser.name,
        sender_role: currentUser.role,
        sender_avatar: currentUser.avatar_url,
        message_body: data.messageBody,
        is_internal_note: data.isInternalNote || false,
        created_at: new Date().toISOString()
      };

      const idx = MOCK_TICKETS.findIndex(t => t.id === id || t.ticket_number === id);
      if (idx !== -1) {
        MOCK_TICKETS[idx].messages = [...(MOCK_TICKETS[idx].messages || []), newMsg];
      }
      return newMsg;
    }
  );

export const toggleChecklistApi = (id, itemId, isCompleted) =>
  safeApiCall(
    () => API.patch(`/tickets/${id}/checklist/${itemId}`, { isCompleted }),
    () => {
      const idx = MOCK_TICKETS.findIndex(t => t.id === id || t.ticket_number === id);
      if (idx !== -1 && MOCK_TICKETS[idx].checklists) {
        const item = MOCK_TICKETS[idx].checklists.find(c => c.id === itemId);
        if (item) item.is_completed = isCompleted;
      }
      return { success: true };
    }
  );

// Users Management APIs (Admin Only)
export const getUsersApi = () =>
  safeApiCall(
    () => API.get('/auth/users'),
    () => MOCK_USERS
  );

export const updateUserRoleApi = (id, role) =>
  safeApiCall(
    () => API.patch(`/auth/users/${id}/role`, { role }),
    () => {
      const u = MOCK_USERS.find(user => user.id === id);
      if (u) u.role = role;
      return u;
    }
  );

// Helper: Auto-promoted FAQs synthesized from recurring resolved tickets
export const getAutoPromotedFaqs = () => {
  const resolved = MOCK_TICKETS.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED');

  const billingCount = resolved.filter(t => t.category === 'Billing' || /refund|charge|bill/i.test(t.title)).length;
  const ssoCount = resolved.filter(t => t.category === 'Security' || t.category === 'Account' || /okta|saml|sso/i.test(t.title)).length;
  const techCount = resolved.filter(t => t.category === 'Technical' || /database|timeout|pool/i.test(t.title)).length;
  const apiCount = resolved.filter(t => t.category === 'API Platform' || /webhook|api|401/i.test(t.title)).length;

  return [
    {
      id: 'faq-auto-billing-refund',
      category: 'Finance & Billing',
      question: 'What is the refund turnaround time for duplicate billing charges?',
      answer: 'When a duplicate or erroneous charge occurs, our finance team validates transaction settlement logs and initiates an immediate refund via Stripe/merchant gateway. Funds reflect on your bank statement within 3-5 business days.',
      tags: ['Billing', 'Refund', 'Credit Card', 'Duplicate', 'Charge', 'Twice', 'Payment'],
      popular: true,
      auto_promoted: true,
      resolution_count: Math.max(3, billingCount),
      source: 'AI Auto-Promoted from Recurring Resolved Tickets'
    },
    {
      id: 'faq-auto-sso-okta',
      category: 'Identity & Access',
      question: 'How do I resolve SAML assertion signature validation failures after rotating Okta X.509 certificates?',
      answer: 'Navigate to Organization Settings > Security & SSO, sync the new Okta X.509 certificate thumbprint in your tenant SSO settings, and verify SP-initiated SAML login. All active directory users will regain instant portal access.',
      tags: ['SSO', 'SAML', 'Okta', 'Security', 'Login', 'Access', 'Certificate'],
      popular: true,
      auto_promoted: true,
      resolution_count: Math.max(2, ssoCount),
      source: 'AI Auto-Promoted from Recurring Resolved Tickets'
    },
    {
      id: 'faq-auto-api-webhook',
      category: 'API Platform',
      question: 'Why am I receiving 401 Unauthorized errors on API Webhooks?',
      answer: 'HTTP 401 Unauthorized errors on webhooks occur when the signature header (X-Webhook-Signature) does not match the computed HMAC SHA-256 hash using your active webhook secret. Verify that your webhook signing secret in Developer Settings matches your consumer endpoint code.',
      tags: ['API', 'Webhook', '401', 'Unauthorized', 'Secret', 'Signature', 'HMAC'],
      popular: true,
      auto_promoted: true,
      resolution_count: Math.max(2, apiCount),
      source: 'AI Auto-Promoted from Recurring Resolved Tickets'
    },
    {
      id: 'faq-auto-db-pool',
      category: 'Technical Support',
      question: 'How can we resolve database connection pool timeouts and 504 errors during traffic spikes?',
      answer: 'Configure pgBouncer transaction pooling with max connection pools between 20-50 per instance, and provision read replicas in your primary availability zone to distribute read queries.',
      tags: ['Technical', 'Database', 'PostgreSQL', 'Pool', 'Timeout', '504', 'pgBouncer'],
      popular: true,
      auto_promoted: true,
      resolution_count: Math.max(2, techCount),
      source: 'AI Auto-Promoted from Recurring Resolved Tickets'
    }
  ];
};

export const getAllMockFaqs = () => {
  const autoFaqs = getAutoPromotedFaqs();
  const list = [...MOCK_FAQS];
  for (const af of autoFaqs) {
    if (!list.some(f => f.id === af.id)) {
      list.push(af);
    }
  }
  return list;
};

// FAQs & Knowledge Base APIs
export const getFaqsApi = (category = '') =>
  safeApiCall(
    () => API.get('/ai/faqs', { params: { category } }),
    () => {
      const all = getAllMockFaqs();
      if (category === 'Auto-Promoted FAQs') {
        return all.filter(f => f.auto_promoted);
      }
      if (category && category !== 'All') {
        return all.filter(f => 
          f.category.toLowerCase().includes(category.toLowerCase()) ||
          category.toLowerCase().includes(f.category.toLowerCase())
        );
      }
      return all;
    }
  );

export const searchFaqsApi = (query = '') =>
  safeApiCall(
    () => API.get('/ai/faqs/search', { params: { q: query } }),
    () => {
      const q = (query || '').toLowerCase().trim();
      const all = getAllMockFaqs();
      if (!q) return all.slice(0, 4);

      const stopWords = new Set(['the', 'and', 'is', 'in', 'it', 'to', 'of', 'for', 'with', 'on', 'at', 'from', 'by', 'about', 'as', 'into', 'like', 'through', 'after', 'over', 'between', 'out', 'against', 'during', 'without', 'before', 'under', 'around', 'among', 'hello', 'please', 'help', 'my', 'i', 'was', 'am', 'we', 'our', 'need']);
      const terms = q.replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 2 && !stopWords.has(w));

      const scored = all.map(f => {
        let score = 0;
        const qText = f.question.toLowerCase();
        const aText = f.answer.toLowerCase();
        const catText = f.category.toLowerCase();
        const tags = (f.tags || []).map(t => t.toLowerCase());

        if (qText.includes(q)) score += 10;
        if (aText.includes(q)) score += 5;
        for (const t of terms) {
          if (qText.includes(t)) score += 3;
          if (tags.some(tag => tag.includes(t))) score += 4;
          if (aText.includes(t)) score += 1;
          if (catText.includes(t)) score += 2;
        }
        return { ...f, relevance_score: score };
      });

      return scored.filter(f => f.relevance_score > 0).sort((a, b) => b.relevance_score - a.relevance_score).slice(0, 4);
    }
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
        categories: ["Billing", "Refund", "Invoice", "Subscription"],
        auto_reply_enabled: true,
        min_confidence: 0.85,
        target_sla_hours: 4,
        allowed_actions: ["Lookup transaction ID", "Check active subscription status", "Issue certified VAT invoice"]
      },
      "Technical Support": {
        categories: ["Technical", "Bug", "Hardware", "Performance"],
        auto_reply_enabled: true,
        min_confidence: 0.80,
        target_sla_hours: 8,
        allowed_actions: ["Check system status health", "Fetch API error logs", "Inspect pgBouncer cluster telemetry"]
      },
      "Identity & Access": {
        categories: ["Account", "Login", "SSO", "Password", "Security"],
        auto_reply_enabled: true,
        min_confidence: 0.90,
        target_sla_hours: 2,
        allowed_actions: ["Verify registered user email", "Sync Okta SAML metadata", "Initiate secure reset link"]
      },
      "API Platform Team": {
        categories: ["API Platform", "Rate Limit", "Webhook", "SDK", "Feature Request"],
        auto_reply_enabled: true,
        min_confidence: 0.85,
        target_sla_hours: 6,
        allowed_actions: ["Check API Gateway rate limits", "Inspect webhook delivery attempts", "Upgrade tenant rate bucket"]
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

// AI Concierge Chatbot & Conversational Ticket Crafter
export const chatConciergeApi = (payload) =>
  safeApiCall(
    () => API.post('/ai/concierge', payload),
    () => {
      try {
        const msg = (payload?.message || '').toLowerCase();
        const name = payload?.customerName || 'Alex Rivera';

        if (['hi', 'hello', 'hey', 'help'].includes(msg.trim())) {
          return {
            reply: `Hello ${name}! 👋 I'm your SupportSense AI Concierge. Describe your issue or question in simple, everyday words, and I'll immediately analyze it, offer quick diagnostics, and construct a formal support ticket for our engineering or finance specialists.`,
            ticket_draft: null,
            suggested_quick_actions: [
              'Duplicate charge on credit card',
              'API Webhook 401 Unauthorized error',
              'Cannot receive Okta MFA push challenge',
              'Database connection timeout under load'
            ],
            confidence_score: 0.98
          };
        }

        const currentUser = JSON.parse(localStorage.getItem('supportsense_user') || 'null') || {
          id: payload?.customerId || 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
          name: payload?.customerName || 'Alex Rivera',
          email: payload?.customerEmail || 'alex.rivera@customer.com'
        };

        const stopWords = new Set(['the', 'and', 'is', 'in', 'it', 'to', 'of', 'for', 'with', 'on', 'at', 'from', 'by', 'about', 'as', 'into', 'like', 'through', 'after', 'over', 'between', 'out', 'against', 'during', 'without', 'before', 'under', 'around', 'among', 'hello', 'please', 'help', 'my', 'i', 'was', 'am', 'we', 'our', 'need', 'hey', 'hi', 'cannot', 'cant']);
        const terms = msg.replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 2 && !stopWords.has(w));

        const userTickets = MOCK_TICKETS.filter(t => 
          (currentUser.id && t.customer_id === currentUser.id) || 
          (currentUser.email && t.customer_email?.toLowerCase() === currentUser.email?.toLowerCase()) ||
          (payload?.customerId && t.customer_id === payload.customerId) ||
          (payload?.customerEmail && t.customer_email?.toLowerCase() === payload.customerEmail?.toLowerCase())
        );

        // 1. DUPLICATE PREVENTION: Check if this user already created ANY ticket for this exact issue
        for (const t of userTickets) {
          if (isDuplicateInquiry(payload?.message, t) || isDuplicateInquiry(msg, t)) {
            // If active open or in-progress ticket exists:
            if (['OPEN', 'IN_PROGRESS', 'PENDING', 'APPROVED'].includes(t.status)) {
              return {
                reply: `⚠️ Ticket Already Created: You already have an active ticket created for this issue: #${t.ticket_number || t.id} — "${t.title}" (Status: ${t.status}). To prevent duplicate tickets in the queue, duplicate tickets cannot be created.`,
                is_ticket_already_created: true,
                is_active_linked: true,
                active_ticket: {
                  id: t.id,
                  ticket_number: t.ticket_number || t.id,
                  title: t.title,
                  status: t.status,
                  category: t.category,
                  assigned_department: t.assigned_department,
                  assigned_agent_name: t.assigned_agent_name,
                  created_at: t.created_at,
                  description: t.description
                },
                ticket_draft: null, // Strictly prevent duplicate creation
                suggested_quick_actions: [
                  `View Existing Ticket #${t.ticket_number || t.id}`,
                  'Redirect to FAQs',
                  'Ask a different question'
                ],
                confidence_score: 0.99
              };
            }

            // If resolved ticket exists:
            if (t.status === 'RESOLVED' || t.status === 'CLOSED') {
              const resolutionSummary = t.messages?.filter(m => m.sender_role === 'AGENT')?.slice(-1)[0]?.message_body
                || t.ai_suggested_reply
                || 'Issue was investigated and verified resolved by support engineering.';

              return {
                reply: `⚠️ Ticket Already Created: You previously submitted ticket #${t.ticket_number || t.id} — "${t.title}", which has been RESOLVED. Duplicate tickets are not created. Here is the verified resolution:`,
                is_ticket_already_created: true,
                is_duplicate_resolved: true,
                resolved_ticket: {
                  id: t.id,
                  ticket_number: t.ticket_number || t.id,
                  title: t.title,
                  status: t.status,
                  category: t.category,
                  assigned_department: t.assigned_department,
                  resolution_summary: resolutionSummary,
                  created_at: t.created_at,
                  description: t.description
                },
                ticket_draft: null, // Strictly prevent duplicate creation
                suggested_quick_actions: [
                  'View Resolved Ticket Details',
                  'Redirect to FAQs',
                  'Ask a different question'
                ],
                confidence_score: 0.99
              };
            }
          }
        }

        let category = 'Technical';
        let dept = 'Technical Support';
        let priority = 'MEDIUM';
        let title = `[Support] ${(payload?.message || '').slice(0, 55)}...`;
        let summary = `Inquiry submitted by ${name}.`;
        let checklist = [
          'Review customer account logs',
          'Verify reproduction steps',
          'Follow up with status update'
        ];
        let diagnostics = 'Standard intake triage. Awaiting agent assignment.';

        if (/charge|refund|card|bill|invoice|payment|stripe|subscription|\$/i.test(msg)) {
          category = 'Billing';
          dept = 'Finance & Billing';
          priority = /twice|duplicate|emergency|asap|urgent|locked/i.test(msg) ? 'URGENT' : 'HIGH';
          title = `[Billing] Duplicate Payment Discrepancy & Gateway Audit - ${name}`;
          summary = `Customer reports payment discrepancies or duplicate charges on active payment card.`;
          checklist = [
            'Inspect Stripe / Adyen transaction settlement logs',
            'Verify duplicate charge ID vs pending authorization hold',
            'Process refund or credit adjustment via merchant ledger',
            'Send customer confirmation with bank settlement window (3-5 business days)'
          ];
          diagnostics = 'High confidence payment ledger query. Pre-authorized for automated transaction lookup.';
        } else if (/login|password|mfa|2fa|sso|okta|saml|locked/i.test(msg)) {
          category = 'Account';
          dept = 'Identity & Access';
          priority = 'HIGH';
          title = `[Access] SSO Authentication & MFA Challenge Obstacle - ${name}`;
          summary = `User authentication blocked by multi-factor challenge failure or directory sync error.`;
          checklist = [
            'Verify Okta / Auth0 directory status and active session tokens',
            'Check for rate-limiting lockouts on customer IP range',
            'Trigger secure one-time verification link to verified contact email',
            'Validate successful token re-issuance'
          ];
          diagnostics = 'Identity provider session barrier. Directory sync check advised.';
        } else if (/webhook|api|401|403|404|500|502|504|endpoint|rate limit/i.test(msg)) {
          category = 'Technical';
          dept = 'API Platform Team';
          priority = /outage|down|broken|urgent|asap/i.test(msg) ? 'URGENT' : 'HIGH';
          title = `[API Platform] Webhook Dispatch Failure (HTTP 401/500) - ${name}`;
          summary = `API endpoint integration experiencing authentication rejections or ingress dropped events.`;
          checklist = [
            'Verify webhook HMAC signing secret in customer API configuration',
            'Inspect ingress reverse proxy access logs for status code clusters',
            'Validate tenant rate limit token bucket capacity',
            'Trigger synthetic test webhook payload to confirm resolution'
          ];
          diagnostics = 'Authentication handshake failure on incoming webhook event receiver.';
        } else if (/bug|crash|error|exception|slow|latency|lag/i.test(msg)) {
          category = 'Bug';
          dept = 'Technical Support';
          priority = 'HIGH';
          title = `[Bug] System Performance Degraded & Runtime Exception - ${name}`;
          summary = `Customer reports reproducible application anomaly or elevated latency.`;
          checklist = [
            'Capture client browser agent and environment details',
            'Inspect application error traces in Sentry telemetry',
            'Attempt reproduction in isolated staging sandbox',
            'Tag engineering sprint sub-task if confirmed defect'
          ];
          diagnostics = 'Application runtime exception detected in customer session.';
        }

        // 2. CATEGORIZATION & FAQ DEFLECTION: Find verified FAQs / solutions for tickets with similar problems
        let matchedFaqs = [];
        try {
          const allFaqs = getAllMockFaqs();
          matchedFaqs = allFaqs.filter(f =>
            f.category.toLowerCase().includes(category.toLowerCase()) ||
            terms.some(t => f.question.toLowerCase().includes(t) || (f.tags && f.tags.some(tag => tag.toLowerCase().includes(t))))
          ).slice(0, 2);
        } catch (faqErr) {
          console.warn('FAQ lookup fallback:', faqErr);
        }

        const replyLead = matchedFaqs.length > 0
          ? `I've categorized your inquiry under **${category}**. Tickets with similar problems have already been resolved. Here is the verified FAQ resolution below:`
          : `I understand how urgent this is, ${name}. I've synthesized your request into a formal enterprise support ticket, classified it under **${category}**, routed it to **${dept}**, and prepared a diagnostic verification checklist. Review the ticket specification below and click **Dispatch Ticket** to launch it!`;

        const formalDescription = `### 1. Executive Summary
${summary}

### 2. Customer Statement & Observed Symptoms
"${payload?.message || ''}"

### 3. Business & Operational Impact
Issue interrupts standard user workflow and requires departmental investigation.

### 4. Steps to Reproduce / User Journey
1. Customer initiated workflow in SupportSense client.
2. System exhibited failure or unexpected behavior as outlined above.
3. Customer engaged SupportSense AI Concierge for formal ticket creation.

### 5. Initial AI Diagnostic Assessment
${diagnostics}
`;

        return {
          reply: replyLead,
          matched_faqs: matchedFaqs,
          ticket_draft: {
            title,
            category,
            priority,
            target_department: dept,
            executive_summary: summary,
            formal_description: formalDescription,
            checklist,
            customer_mood: /angry|upset|frustrated|broken|fail|emergency|asap/i.test(msg) ? 'FRUSTRATED' : 'NEUTRAL',
            patience_score: priority === 'URGENT' ? 'CRITICAL' : 'CONCERNED',
            predicted_resolution_time: priority === 'URGENT' ? '2-4 hours' : '1-2 business days',
            urgency_reasoning: `Derived from reported ${category.toLowerCase()} operational friction.`,
            is_ready_for_ticket: true
          },
          suggested_quick_actions: [
            `Confirm & Dispatch to ${dept}`,
            'Add error code or screenshot details',
            'Check system status page'
          ],
          confidence_score: 0.94
        };
      } catch (fallbackError) {
        console.error('Safe fallback in chatConciergeApi:', fallbackError);
        return {
          reply: `Hello ${payload?.customerName || 'there'}! I've analyzed your inquiry and drafted a formal support ticket. Review the details below to dispatch it.`,
          ticket_draft: {
            title: `[Support] ${String(payload?.message || 'Customer Inquiry').slice(0, 50)}`,
            category: 'Technical',
            priority: 'MEDIUM',
            target_department: 'Technical Support',
            executive_summary: String(payload?.message || ''),
            formal_description: `### Reported Issue\n${payload?.message || ''}`,
            checklist: ['Review inquiry details', 'Follow up with customer'],
            customer_mood: 'NEUTRAL',
            patience_score: 'CONCERNED',
            predicted_resolution_time: '1-2 business days',
            is_ready_for_ticket: true
          },
          confidence_score: 0.90
        };
      }
    }
  );


// 1-Click AI Response Tone Polisher
export const polishToneApi = (payload) =>
  safeApiCall(
    () => API.post('/ai/polish-tone', payload),
    () => {
      const { draft = '', tone = 'empathetic', variation = 1 } = payload;
      const cleanDraft = draft.trim();
      const varIdx = Math.max(1, variation || 1);
      let polished = cleanDraft;
      let rationale = '';

      if (tone === 'empathetic') {
        const emps = [
          `Hello! Thank you for your patience while we investigate this. I completely understand how frustrating this disruption is for you and your team. ${cleanDraft} Please rest assured we are actively prioritizing your case and I will provide you with another update shortly.`,
          `Hi there, thank you for reaching out. We deeply appreciate your partnership and hear your concerns loud and clear. Regarding this matter: ${cleanDraft} Our senior engineering team is prioritized on this to ensure your service is restored smoothly.`,
          `Greetings! I want to personally apologize for any disruption this issue has caused to your day. Here is where things stand: ${cleanDraft} We are tracking this closely and I will follow up with another milestone update shortly.`
        ];
        polished = emps[(varIdx - 1) % emps.length];
        rationale = `Empathy Tone Polishing (Variation ${((varIdx - 1) % emps.length) + 1} of 3)`;
      } else if (tone === 'concise') {
        const concs = [
          `Update:\n• Status: In progress\n• Action taken: ${cleanDraft}\n• Next update: Within 2 hours.`,
          `Status: In Progress.\nDetails: ${cleanDraft}\nETA: Next update scheduled in under 2 hours.`,
          `Action Item Summary:\n1. Triage: Verified reported incident.\n2. Work in progress: ${cleanDraft}\n3. Checkpoint: Direct update will follow once patch is validated.`
        ];
        polished = concs[(varIdx - 1) % concs.length];
        rationale = `Concise TL;DR Formatting (Variation ${((varIdx - 1) % concs.length) + 1} of 3)`;
      } else if (tone === 'formal') {
        const forms = [
          `Dear Client,\n\nThank you for contacting SupportSense Enterprise Support. With regards to your recent inquiry: ${cleanDraft}\n\nOur team continues to address the issue in strict adherence to our standard Service Level Agreement. We appreciate your valued patience.\n\nSincerely,\nSupportSense Enterprise Support`,
          `Dear Valued Customer,\n\nWe acknowledge receipt of your service request. In alignment with our enterprise support commitments: ${cleanDraft}\n\nOur technical operations group has initiated formal incident diagnostics and will furnish an official progress report shortly.\n\nRespectfully,\nSupportSense Enterprise Operations`,
          `Official Support Advisory:\n\nPlease be advised that SupportSense Client Solutions has accepted and prioritized your ticket: ${cleanDraft}\n\nAll subsequent measures conform strictly to enterprise resolution protocols. We remain dedicated to your success.\n\nSincerely,\nSupportSense Global Support`
        ];
        polished = forms[(varIdx - 1) % forms.length];
        rationale = `Formal Enterprise Correspondence (Variation ${((varIdx - 1) % forms.length) + 1} of 3)`;
      } else if (tone === 'technical') {
        const techs = [
          `Diagnostic Status Report:\n${cleanDraft}\nTelemetry Check: Verifying API gateway latency metrics, TLS handshakes, and database replica synchronization logs. Sandbox reproduction underway.`,
          `Engineering Triage Status:\nObserved Behavior: ${cleanDraft}\nRoot Cause Investigation: Inspecting API gateway latency percentiles (p95/p99), database connection pool utilization, and replica lag metrics.`,
          `Technical Incident Report:\nContext: ${cleanDraft}\nDiagnostic Protocol: Correlating distributed trace spans across microservice mesh, evaluating Redis cache eviction rates, and testing hotfix in container sandbox.`
        ];
        polished = techs[(varIdx - 1) % techs.length];
        rationale = `Deep Technical Diagnostic Phrasing (Variation ${((varIdx - 1) % techs.length) + 1} of 3)`;
      }

      return {
        polished_text: polished,
        tone,
        variation: varIdx,
        rationale,
        confidence_score: 0.96
      };
    }
  );

// AI Reopened / Conversation Timeline Summarizer (TL;DR)
export const summarizeTimelineApi = (messages) =>
  safeApiCall(
    () => API.post('/ai/summarize-timeline', { messages }),
    () => {
      if (!messages || messages.length === 0) {
        return {
          timeline_summary: '• No historical messages recorded on this ticket thread yet.',
          confidence_score: 0.5
        };
      }

      const bullets = messages.map((m, idx) => {
        const role = m.sender_role || 'USER';
        const sender = m.sender_name || 'Participant';
        const snippet = (m.message_body || '').replace(/[\r\n]+/g, ' ').slice(0, 90);
        return `• [Step ${idx + 1} - ${role} (${sender})]: ${snippet}...`;
      });

      return {
        timeline_summary: bullets.slice(0, 6).join('\n'),
        confidence_score: 0.94
      };
    }
  );

export default API;



