/**
 * Lightweight static-file server with health check endpoint.
 *
 * Serves the Storybook build output and exposes GET /health for
 * readiness probes (Graphras cross-repo contract).
 *
 * Environment variables:
 *   PORT        — listen port (default: 8081)
 *   STATIC_DIR  — directory name for static files relative to this script
 *                 (default: storybook-static)
 */

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const PORT = parseInt(process.env.PORT, 10) || 8081;
const __dirname = fileURLToPath(new URL('.', import.meta.url));
const STATIC_DIR = resolve(__dirname, process.env.STATIC_DIR || 'storybook-static');

const MIME_TYPES = {
  '.html':  'text/html; charset=utf-8',
  '.js':    'text/javascript; charset=utf-8',
  '.mjs':   'text/javascript; charset=utf-8',
  '.css':   'text/css; charset=utf-8',
  '.json':  'application/json; charset=utf-8',
  '.map':   'application/json; charset=utf-8',
  '.png':   'image/png',
  '.jpg':   'image/jpeg',
  '.jpeg':  'image/jpeg',
  '.gif':   'image/gif',
  '.svg':   'image/svg+xml',
  '.ico':   'image/x-icon',
  '.woff':  'font/woff',
  '.woff2': 'font/woff2',
  '.ttf':   'font/ttf',
};

const server = createServer(async (req, res) => {
  /* ---- Health check — Graphras cross-repo contract ---- */
  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  /* ---- Static file serving ---- */
  try {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    const decodedPath = decodeURIComponent(url.pathname);
    let filePath = resolve(join(STATIC_DIR, decodedPath));

    // Prevent path-traversal attacks.
    if (filePath !== STATIC_DIR && !filePath.startsWith(STATIC_DIR + '/')) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('Forbidden');
      return;
    }

    let fileStats = await stat(filePath);
    if (fileStats.isDirectory()) {
      filePath = join(filePath, 'index.html');
      fileStats = await stat(filePath);
    }

    const content = await readFile(filePath);
    const ext = extname(filePath);
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`GraphView server listening on http://0.0.0.0:${PORT}`);
});
