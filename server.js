import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { timingSafeEqual } from 'node:crypto';
import os from 'os';
import { exec } from 'child_process';
import httpProxy from 'http-proxy';

// Operational APIs
import deviceRouter from './api/devices.js';
import gpuRouter from './api/gpu-stats.js';
import aiRouter from './api/ai-requests.js';
import recycleRouter from './api/recycle.js';
import dtnRouter from './api/interstellar-dtn.js';
import quantumRouter from './api/quantum-hub.js';
import { chat as chatWithProvider, isProviderAvailable } from './lib/aiProviders.js';

// Optional performance packages with fallbacks
let compression = null;
let helmet = null;
let cors = null;

try { compression = (await import('compression')).default; } catch {}
try { helmet = (await import('helmet')).default; } catch {}
try { cors = (await import('cors')).default; } catch {}

const proxy = httpProxy.createProxyServer({});
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '192.168.68.54';
const VITE_EXPRESS_DIST = path.join(__dirname, 'vite-express-cli', 'dist');

// Trust Azure/ingress proxy
app.set('trust proxy', 1);
app.disable('x-powered-by');

if (compression) app.use(compression());
if (helmet) app.use(helmet());

// os.html loads the Socket.IO CDN script, one known inline script, and YouTube embeds.
if (helmet) {
  app.use(helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'https://cdn.socket.io', "'sha256-UizmQVBeOxJkDpqjJdDUIOBM5bhBuv3hNMoB0oT8Rnc='"],
      connectSrc: ["'self'", 'https://cdn.socket.io', 'ws:', 'wss:'],
      frameSrc: ["'self'", 'https://www.youtube.com'],
      imgSrc: ["'self'", 'data:', 'https:'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:']
    }
  }));
}

// Proxy error handling
proxy.on('error', (err, req, res) => {
  res.status(502).json({ error: 'Proxy target unreachable', details: err.message });
});

// Basic CORS
const allowedOrigins = (process.env.CORS_ORIGINS || 'https://networkbuster.net,http://localhost:3000').split(',').map(o => o.trim());
if (cors) {
  app.use(cors({ origin: allowedOrigins, credentials: true }));
}

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// ============================================
// PRECISELIENS MISSION ROUTES
// ============================================

// Mission Proxies (Python Services)
const MISSION_PROXIES = {
  '/api/mission': 'http://localhost:5000',
  '/api/map': 'http://localhost:6000',
  '/api/launcher': 'http://localhost:7000',
  '/api/tracer': 'http://localhost:8000',
  '/api/matrix': 'http://localhost:9001',
  '/api/agi': 'http://localhost:4500',
  '/api/kernel': 'http://localhost:9002',
  '/api/telemetry': 'http://localhost:4432',
  '/api/lattice': 'http://localhost:4432',
  '/api/bom': 'http://localhost:4432',
  '/api/sync': 'http://localhost:4432'
};

Object.entries(MISSION_PROXIES).forEach(([prefix, target]) => {
  app.use(prefix, (req, res) => {
    proxy.web(req, res, { target, ignorePath: false, changeOrigin: true }, (err) => {
        // Handled by proxy.on('error')
    });
  });
});

// Direct HTML Routes
const HTML_ROUTES = {
  '/o': 'os.html',
  '/os': 'os.html',
  '/neural-coder-os': 'os.html',
  '/gemini': 'gemini-launcher.html',
  '/security': 'dashboard-security.html',
  '/music': 'music-studio.html',
  '/cinematic': 'preciseliens_cinematic.html',
  '/marketplace': 'MARKETPLACE_EXAMPLE.html',
  '/tracking': 'world_tracking.html',
  '/agi.ms': 'agi_cinematic_overlay.html',
  '/agi': 'agi_cinematic_overlay.html',
  '/agims': 'agi_cinematic_overlay.html',
  '/datacentral-cloud-llc': 'agi_cinematic_overlay.html',
  '/leads': 'leads.html',
  '/lead': 'leads.html',
  '/demo': 'leads.html',
  '/schedule-demo': 'leads.html',
  '/contact-sales': 'leads.html'
};

Object.entries(HTML_ROUTES).forEach(([route, file]) => {
  app.get(route, (req, res) => {
    res.sendFile(path.join(__dirname, file));
  });
});

// Built Overlay World View
app.get('/worldview', (req, res) => {
  res.sendFile(path.join(__dirname, 'challengerepo/real-time-overlay/dist/index.html'));
});

// Cloud-Code Console (Search-Console-style analytics: Performance, Income Tracker, Pages, Sitemaps, Links, Settings)
app.get(['/cloud-code', '/console'], (req, res) => {
  res.sendFile(path.join(__dirname, 'cloud-code/dist/index.html'));
});

// ============================================
// OPERATIONAL API ENDPOINTS
// ============================================

app.use('/api/devices', deviceRouter);
app.use('/api/gpu', gpuRouter);
app.use('/api/ai', aiRouter);
app.use('/api/recycle', recycleRouter);
app.use('/api/dtn', dtnRouter);
app.use('/api/quantum', quantumRouter);

function isAuthorizedGeminiLauncher(request) {
  const expectedToken = process.env.GEMINI_LAUNCHER_TOKEN;
  const authorization = request.get('authorization') || '';
  const providedToken = authorization.startsWith('Bearer ')
    ? authorization.slice('Bearer '.length)
    : '';

  if (!expectedToken || providedToken.length !== expectedToken.length) {
    return false;
  }

  return timingSafeEqual(Buffer.from(providedToken), Buffer.from(expectedToken));
}

app.post('/api/gemini/chat', async (request, response) => {
  if (!isAuthorizedGeminiLauncher(request)) {
    return response.status(401).json({ error: 'A valid Gemini launcher token is required.' });
  }

  const message = typeof request.body?.message === 'string'
    ? request.body.message.trim()
    : '';

  if (!message || message.length > 4000) {
    return response.status(400).json({ error: 'Message must contain 1 to 4000 characters.' });
  }

  if (!isProviderAvailable('gemini')) {
    return response.status(503).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
  }

  try {
    const result = await chatWithProvider('gemini', [{ role: 'user', content: message }], {
      useCache: false
    });
    response.json({ content: result.content, model: result.model });
  } catch (error) {
    console.error('Gemini launcher request failed:', error.message);
    response.status(502).json({ error: 'Gemini request failed.' });
  }
});

function getFoundryChatEndpoint() {
  const endpoint = process.env.AZURE_AI_FOUNDRY_ENDPOINT?.replace(/\/+$/, '');

  if (!endpoint) {
    return null;
  }

  return endpoint.endsWith('/openai/v1')
    ? `${endpoint}/chat/completions`
    : `${endpoint}/openai/v1/chat/completions`;
}

app.post('/api/copilot/chat', async (request, response) => {
  const apiKey = process.env.AZURE_AI_FOUNDRY_API_KEY;
  const deployment = process.env.AZURE_AI_FOUNDRY_DEPLOYMENT;
  const endpoint = getFoundryChatEndpoint();
  const messages = request.body?.messages;

  if (!apiKey || !deployment || !endpoint) {
    return response.status(503).json({
      error: 'Azure AI Foundry chat is not configured on this server.'
    });
  }

  if (!Array.isArray(messages) || messages.length === 0 || messages.length > 20) {
    return response.status(400).json({
      error: 'Provide between 1 and 20 chat messages.'
    });
  }

  const validMessages = messages.every(({ role, content }) =>
    ['user', 'assistant'].includes(role) &&
    typeof content === 'string' &&
    content.trim().length > 0 &&
    content.length <= 4000
  );

  if (!validMessages) {
    return response.status(400).json({
      error: 'Messages must have a user or assistant role and contain up to 4000 characters.'
    });
  }

  try {
    const foundryResponse = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify({
        model: deployment,
        messages: [
          {
            role: 'system',
            content: 'You are Mission Copilot, a concise assistant for a Vite, Express, and CLI application.'
          },
          ...messages
        ]
      })
    });
    const payload = await foundryResponse.json();

    if (!foundryResponse.ok || !payload.choices?.[0]?.message?.content) {
      console.error('Azure AI Foundry request failed:', payload);
      return response.status(502).json({
        error: 'Azure AI Foundry could not complete the chat request.'
      });
    }

    response.json({
      content: payload.choices[0].message.content,
      model: payload.model ?? deployment
    });
  } catch (error) {
    console.error('Azure AI Foundry request failed:', error.message);
    response.status(502).json({
      error: 'Azure AI Foundry could not be reached.'
    });
  }
});

app.post('/api/commands', (request, response) => {
  const message = typeof request.body?.message === 'string'
    ? request.body.message.trim()
    : '';

  if (!message) {
    return response.status(400).json({ error: 'A message is required.' });
  }

  response.json({ result: `Command received: ${message}` });
});

// Lead Submission & Proposal Request Endpoint
const leadsMemoryStore = [];

app.post('/api/leads', (req, res) => {
  const { fullName, email, company, interest, teamSize, message } = req.body || {};

  if (!fullName || !email || !company) {
    return res.status(400).json({ error: 'Full name, work email, and company/organization are required.' });
  }

  const leadId = `LEAD-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`;
  const newLead = {
    leadId,
    fullName: String(fullName).trim(),
    email: String(email).trim(),
    company: String(company).trim(),
    interest: String(interest || 'General AI Infrastructure').trim(),
    teamSize: String(teamSize || 'Unspecified').trim(),
    message: String(message || '').trim(),
    status: 'new',
    submittedAt: new Date().toISOString()
  };

  leadsMemoryStore.push(newLead);
  console.log(`📥 [DataCentral Lead Captured] ID: ${leadId} | Name: ${newLead.fullName} (${newLead.company}) | Email: ${newLead.email}`);

  res.status(201).json({
    status: 'success',
    message: 'Lead inquiry recorded successfully.',
    leadId,
    timestamp: newLead.submittedAt
  });
});

app.get('/api/leads', (req, res) => {
  res.json({
    count: leadsMemoryStore.length,
    leads: leadsMemoryStore
  });
});

// Search API Endpoint (supports SEARCH_API_KEY, BING_SEARCH_API_KEY, GOOGLE_SEARCH_API_KEY, YOUTUBE_API_KEY)
app.get('/api/search', async (req, res) => {
  const query = typeof req.query.q === 'string' ? req.query.q.trim() : '';
  const searchKey = process.env.SEARCH_API_KEY || process.env.BING_SEARCH_API_KEY || process.env.GOOGLE_SEARCH_API_KEY;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter q is required.' });
  }

  if (!searchKey) {
    return res.json({
      query,
      status: 'mock',
      results: [
        { title: `Result for ${query}`, url: `https://networkbuster.net/search?q=${encodeURIComponent(query)}`, snippet: `Sample indexing result for '${query}' on NetworkBuster Neural OS.` }
      ],
      note: 'SEARCH_API_KEY is not set in environment. Set SEARCH_API_KEY or BING_SEARCH_API_KEY in .env for live web search.'
    });
  }

  try {
    const searchUrl = `https://api.bing.microsoft.com/v7.0/search?q=${encodeURIComponent(query)}`;
    const apiRes = await fetch(searchUrl, {
      headers: { 'Ocp-Apim-Subscription-Key': searchKey }
    });
    if (!apiRes.ok) {
      return res.status(apiRes.status).json({ error: 'External Search API error' });
    }
    const data = await apiRes.json();
    res.json({ query, status: 'live', results: data.webPages?.value || [] });
  } catch (err) {
    res.status(502).json({ error: 'Search request failed', details: err.message });
  }
});

// ============================================
// STATIC ASSETS & FALLBACKS
// ============================================

// Static file serving
app.use('/overlay', express.static(path.join(__dirname, 'challengerepo/real-time-overlay/dist')));
app.use('/dashboard', express.static(path.join(__dirname, 'dashboard/dist')));
app.use('/cloud-code', express.static(path.join(__dirname, 'cloud-code/dist')));
app.use(express.static(VITE_EXPRESS_DIST));
app.use(express.static(path.join(__dirname, 'web-app')));
app.use(express.static(__dirname)); // Serve root files as static if no route matches

// API Health
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString(), suite: 'Preciseliens PLLC' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found', path: req.path, hint: 'Try the homepage or /os.' });
});

// Start server
app.listen(PORT, HOST, () => {
  console.log(`\n🚀 PRECISELIENS PRODUCTION SERVER running at http://${HOST}:${PORT}`);
  console.log(`⚡ Active Mission Routes: /os, /neural-coder-os, /gemini, /security, /cinematic, /marketplace, /tracking, /worldview\n`);
});
