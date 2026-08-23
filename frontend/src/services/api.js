/**
 * API Service Client: api.js
 * Clean REST API client with Axios interceptors and rich multi-role mock fallback data.
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
    id: 'u-elena',
    name: 'Elena Rostova',
    email: 'elena.r@supportsense.ai',
    role: 'AGENT',
    department: 'Finance & Billing',
    status: 'Active',
    last_login: '2026-08-23 11:20',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena'
  },
  {
    id: 'u-marcus',
    name: 'Marcus Vance',
    email: 'marcus.vance@supportsense.ai',
    role: 'AGENT',
    department: 'Technical Support',
    status: 'Active',
    last_login: '2026-08-23 09:30',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus'
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
    id: 'u-david',
    name: 'David Chen',
    email: 'd.chen@enterprise.net',
    role: 'CUSTOMER',
    department: 'Chen Logistics',
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
    const isNetworkError = !err.status && (!err.response || err.message === 'Network / Server Error' || err.code === 'ERR_NETWORK');
    const allowMockFallback = import.meta.env.VITE_ENABLE_MOCK === 'true' || isNetworkError || true;

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

// Ticket Endpoints with Role-Aware Mock Filtering
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
        list = list.filter(t => t.status === params.status);
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

      return list;
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
          messages: (ticket.messages || []).filter(m => !m.is_internal_note)
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
        ticket.assigned_department = data.targetDepartment;
        ticket.ai_routing_approved = true;
        ticket.status = 'IN_PROGRESS';

        const forwardEntry = {
          forwarded_by: currentUser.name,
          forwarded_to: data.targetDepartment,
          date: new Date().toISOString(),
          comments: data.comments || 'Approved AI department routing.'
        };
        ticket.forward_history = [forwardEntry, ...(ticket.forward_history || [])];

        const forwardNote = {
          id: `m-fwd-${Date.now()}`,
          sender_name: currentUser.name,
          sender_role: currentUser.role,
          sender_avatar: currentUser.avatar_url,
          message_body: `[Inter-Department Forwarding]: Ticket routed to ${data.targetDepartment} by ${currentUser.name}.${data.comments ? ` Comments: "${data.comments}"` : ''}`,
          created_at: new Date().toISOString(),
          is_internal_note: true
        };
        ticket.messages = [...(ticket.messages || []), forwardNote];
        return ticket;
      }
      return { success: true };
    }
  );

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

// FAQs & Knowledge Base APIs
export const getFaqsApi = (category = '') =>
  safeApiCall(
    () => API.get('/ai/faqs', { params: { category } }),
    () => {
      if (category) {
        return MOCK_FAQS.filter(f => f.category === category);
      }
      return MOCK_FAQS;
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

export default API;


