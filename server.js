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
  '/tracking': 'world_tracking.html'
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

// ============================================
// STATIC ASSETS & FALLBACKS
// ============================================

// Static file serving
app.use('/overlay', express.static(path.join(__dirname, 'challengerepo/real-time-overlay/dist')));
app.use('/dashboard', express.static(path.join(__dirname, 'dashboard/dist')));
app.use(express.static(path.join(__dirname, 'web-app')));
app.use(express.static(__dirname)); // Serve root files as static if no route matches

// API Health
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString(), suite: 'Preciseliens PLLC' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found', path: req.path, hint: 'Try /os or /cinematic' });
});

// Start server
app.listen(PORT, HOST, () => {
  console.log(`\n🚀 PRECISELIENS PRODUCTION SERVER running at http://${HOST}:${PORT}`);
  console.log(`⚡ Active Mission Routes: /os, /neural-coder-os, /gemini, /security, /cinematic, /marketplace, /tracking, /worldview\n`);
});
