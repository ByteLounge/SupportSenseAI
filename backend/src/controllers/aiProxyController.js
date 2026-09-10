/**
 * Controller: aiProxyController.js
 * Lead Engineer: Member 2 & Member 3
 * Description: Controller handling AI decision assistance routes (Quality check, Insights, Department Auto-Reply, Benchmarks).
 */

const aiService = require('../services/aiService');
const aiMetadataModel = require('../models/aiMetadataModel');
const env = require('../config/env');
const { sendSuccess, sendError } = require('../utils/responseFormatter');

/**
 * Perform pre-send response quality verification on agent draft.
 * POST /api/v1/ai/verify-response
 */
async function verifyResponse(req, res, next) {
  try {
    const { ticketContext, draftReply } = req.body;

    if (!ticketContext || !draftReply) {
      return sendError(res, 400, 'Please provide both ticketContext and draftReply.');
    }

    const verificationResult = await aiService.verifyResponseQuality(ticketContext, draftReply);
    return sendSuccess(res, 200, 'Response quality verified', verificationResult);
  } catch (error) {
    next(error);
  }
}

/**
 * Fetch latest weekly organizational learning insights.
 * GET /api/v1/ai/insights
 */
async function getWeeklyInsights(req, res, next) {
  try {
    const insights = await aiMetadataModel.getLatestWeeklyInsights();
    return sendSuccess(res, 200, 'Weekly AI Learning Insights retrieved', insights);
  } catch (error) {
    next(error);
  }
}

/**
 * Evaluate department auto-reply for a given ticket.
 * POST /api/v1/ai/department-auto-reply
 */
async function evaluateAutoReply(req, res, next) {
  try {
    const { title, description, category, departmentName } = req.body;
    if (!title || !description) {
      return sendError(res, 400, 'Title and description are required.');
    }

    const result = await aiService.evaluateDepartmentAutoReply({
      title,
      description,
      category,
      departmentName
    });

    return sendSuccess(res, 200, 'Department auto-reply evaluated successfully', result);
  } catch (error) {
    next(error);
  }
}

/**
 * Get department definitions and active auto-reply rules.
 * GET /api/v1/ai/departments
 */
async function getDepartmentRules(req, res, next) {
  try {
    const response = await fetch(`${env.AI_SERVICE_URL}/api/v1/ai/departments/definitions`, {
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(5000)
    });
    if (!response.ok) {
      throw new Error(`AI service returned ${response.status}`);
    }
    const json = await response.json();
    return sendSuccess(res, 200, 'Department auto-reply rules retrieved', json.data);
  } catch (error) {
    // Return standard fallback definitions
    return sendSuccess(res, 200, 'Department rules retrieved (fallback)', {
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
    });
  }
}

/**
 * Fetch dataset benchmarks.
 * GET /api/v1/ai/benchmarks
 */
async function getBenchmarks(req, res, next) {
  try {
    const benchmarks = await aiService.getDatasetBenchmarks();
    return sendSuccess(res, 200, 'Dataset benchmarks retrieved', benchmarks);
  } catch (error) {
    next(error);
  }
}

/**
 * Interactive AI Concierge Chatbot & Formal Ticket formulation.
 * POST /api/v1/ai/concierge
 */
async function chatConcierge(req, res, next) {
  try {
    const { message, history } = req.body;
    if (!message || !message.trim()) {
      return sendError(res, 400, 'Message body is required.');
    }

    const customerName = req.user?.name || req.body.customerName;
    const customerEmail = req.user?.email || req.body.customerEmail;

    const result = await aiService.chatConcierge({
      message,
      history,
      customerName,
      customerEmail
    });

    return sendSuccess(res, 200, 'AI Concierge response generated successfully', result);
  } catch (error) {
    next(error);
  }
}

/**
 * 1-Click AI Response Tone Polishing.
 * POST /api/v1/ai/polish-tone
 */
async function polishTone(req, res, next) {
  try {
    const { draft, tone, variation } = req.body;
    if (!draft || !draft.trim()) {
      return sendError(res, 400, 'Draft message text is required.');
    }

    const result = await aiService.polishAgentTone({
      draft,
      tone: tone || 'empathetic',
      variation: parseInt(variation, 10) || 1
    });

    return sendSuccess(res, 200, 'Agent response tone polished', result);
  } catch (error) {
    next(error);
  }
}

// Rich FAQ Knowledge Base for Customer Deflection & Instant Help
const FAQS_DATABASE = [
  {
    id: 'faq-1',
    category: 'Billing & Payments',
    question: 'How long do credit card refunds take to process?',
    answer: 'Refunds typically take 3-5 business days to reflect in your financial institution statement after being approved and processed by our billing department.',
    tags: ['billing', 'refund', 'credit card', 'charge', 'money', 'payment'],
    popular: true
  },
  {
    id: 'faq-2',
    category: 'Identity & Access',
    question: 'How do I rotate our Okta / Azure SAML signing certificate?',
    answer: 'Navigate to Organization Settings > Security & SSO, click "Edit SAML Metadata", paste the new X.509 certificate XML, and click "Validate & Apply". We recommend updating 24 hours prior to expiration.',
    tags: ['sso', 'saml', 'okta', 'azure', 'security', 'certificate', 'login', 'mfa'],
    popular: true
  },
  {
    id: 'faq-3',
    category: 'API Platform',
    question: 'What are the default API rate limits and how can I request an increase?',
    answer: 'Standard API limits are 100 requests/minute. Enterprise tenants can request limits up to 1,000 req/minute by submitting an API Platform query with expected QPS projections.',
    tags: ['api', 'rate limit', 'quota', '429', 'throttling', 'headers'],
    popular: true
  },
  {
    id: 'faq-4',
    category: 'Billing & Payments',
    question: 'Where can I download my itemized VAT or Tax invoices?',
    answer: 'Invoices are available under Settings > Billing & Invoices. You can download monthly and annual PDF receipts with certified European and US VAT identification numbers.',
    tags: ['billing', 'vat', 'tax', 'invoice', 'receipt', 'download', 'pdf'],
    popular: false
  },
  {
    id: 'faq-5',
    category: 'Technical Support',
    question: 'What is the recommended connection pool setting for PostgreSQL databases?',
    answer: 'We recommend setting pool sizes between 20-50 connections per instance with pgBouncer transaction pooling enabled to prevent connection exhaustion during traffic spikes.',
    tags: ['technical', 'database', 'postgresql', 'pool', 'timeout', 'supabase'],
    popular: false
  },
  {
    id: 'faq-6',
    category: 'API Platform',
    question: 'Why am I receiving 401 Unauthorized errors on API Webhooks?',
    answer: 'HTTP 401 Unauthorized errors on webhooks occur when the signature header (X-Webhook-Signature) does not match the computed HMAC SHA-256 hash using your active webhook secret. Verify that your webhook signing secret in Developer Settings matches your consumer endpoint code.',
    tags: ['api', 'webhook', '401', 'unauthorized', 'secret', 'signature', 'hmac'],
    popular: true
  },
  {
    id: 'faq-7',
    category: 'Identity & Access',
    question: 'How do I reset customer passwords or unlock suspended accounts?',
    answer: 'Support agents can trigger secure password reset links directly from the Identity & Access panel. Customers receive an encrypted, single-use reset URL valid for 15 minutes.',
    tags: ['account', 'password', 'reset', 'unlock', 'suspended', 'login'],
    popular: false
  }
];

/**
 * Fetch list of FAQs with optional category filter.
 * GET /api/v1/ai/faqs
 */
async function getFaqs(req, res, next) {
  try {
    const { category } = req.query;
    if (category && category !== 'All') {
      const filtered = FAQS_DATABASE.filter(f => 
        f.category.toLowerCase().includes(category.toLowerCase()) ||
        category.toLowerCase().includes(f.category.toLowerCase())
      );
      return sendSuccess(res, 200, 'FAQs retrieved', filtered);
    }
    return sendSuccess(res, 200, 'FAQs retrieved', FAQS_DATABASE);
  } catch (error) {
    next(error);
  }
}

/**
 * Search FAQs based on query text for instant customer issue deflection.
 * GET /api/v1/ai/faqs/search?q=...
 */
async function searchFaqs(req, res, next) {
  try {
    const query = (req.query.q || req.query.query || '').trim().toLowerCase();
    if (!query) {
      return sendSuccess(res, 200, 'Empty query, returning top FAQs', FAQS_DATABASE.slice(0, 3));
    }

    const stopWords = new Set(['the', 'and', 'is', 'in', 'it', 'to', 'of', 'for', 'with', 'on', 'at', 'from', 'by', 'about', 'as', 'into', 'like', 'through', 'after', 'over', 'between', 'out', 'against', 'during', 'without', 'before', 'under', 'around', 'among', 'hello', 'please', 'help', 'my', 'i', 'was', 'am', 'we', 'our', 'need']);
    const terms = query
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2 && !stopWords.has(w));

    const scored = FAQS_DATABASE.map(faq => {
      let score = 0;
      const qLower = faq.question.toLowerCase();
      const aLower = faq.answer.toLowerCase();
      const catLower = faq.category.toLowerCase();
      const tags = (faq.tags || []).map(t => t.toLowerCase());

      // Exact phrase match
      if (qLower.includes(query)) score += 10;
      if (aLower.includes(query)) score += 5;

      // Term overlaps
      for (const t of terms) {
        if (qLower.includes(t)) score += 3;
        if (tags.some(tag => tag.includes(t))) score += 4;
        if (aLower.includes(t)) score += 1;
        if (catLower.includes(t)) score += 2;
      }

      return { ...faq, relevance_score: score };
    });

    const matching = scored
      .filter(f => f.relevance_score > 0)
      .sort((a, b) => b.relevance_score - a.relevance_score)
      .slice(0, 4);

    return sendSuccess(res, 200, 'FAQ search results', matching);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  verifyResponse,
  getWeeklyInsights,
  evaluateAutoReply,
  getDepartmentRules,
  getBenchmarks,
  chatConcierge,
  polishTone,
  getFaqs,
  searchFaqs
};

