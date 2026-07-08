import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
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

// Trust Azure/ingress proxy
app.set('trust proxy', 1);
app.disable('x-powered-by');

if (compression) app.use(compression());
if (helmet) app.use(helmet());

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
  '/os': 'os.html',
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

app.post('/api/ingestion/mock', (req, res) => {
  res.json({
    status: 'acknowledged',
    acknowledgedAt: new Date().toISOString(),
    confidence: 0.99
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found', path: req.path, hint: 'Try /os or /cinematic' });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 PRECISELIENS PRODUCTION SERVER running at http://localhost:${PORT}`);
  console.log(`⚡ Active Mission Routes: /os, /security, /cinematic, /marketplace, /tracking, /worldview\n`);
});
