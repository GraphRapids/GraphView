import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const STATIC_DIR = join(__dirname, 'storybook-static');
const PORT = parseInt(process.env.PORT || '6006', 10);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.map': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': "default-src 'self' 'unsafe-inline' 'unsafe-eval' blob: data:",
};

function setSecurityHeaders(res) {
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    res.setHeader(key, value);
  }
}

function sendJson(res, statusCode, body) {
  setSecurityHeaders(res);
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body));
}

const server = createServer(async (req, res) => {
  // Only allow GET and HEAD methods
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    sendJson(res, 405, { error: 'Method Not Allowed' });
    return;
  }

  // Parse the URL safely
  let url;
  try {
    url = new URL(req.url, `http://localhost:${PORT}`);
  } catch {
    sendJson(res, 400, { error: 'Bad Request' });
    return;
  }

  const pathname = url.pathname;

  // Decode percent-encoded characters for validation
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(pathname);
  } catch {
    sendJson(res, 400, { error: 'Bad Request' });
    return;
  }

  // Reject null bytes (covers both literal and percent-encoded \0)
  if (decodedPath.includes('\0')) {
    sendJson(res, 400, { error: 'Bad Request' });
    return;
  }

  // Health check endpoint — strict exact match on decoded pathname
  if (decodedPath === '/health') {
    sendJson(res, 200, { status: 'ok' });
    return;
  }

  // Reject directory traversal (covers %2e%2e and other encodings)
  if (decodedPath.includes('..')) {
    sendJson(res, 403, { error: 'Forbidden' });
    return;
  }

  // Resolve the file path for static serving
  const safePath = normalize(decodedPath === '/' ? '/index.html' : decodedPath);
  const filePath = join(STATIC_DIR, safePath);

  // Belt-and-suspenders: ensure resolved path is within STATIC_DIR
  if (!filePath.startsWith(STATIC_DIR)) {
    sendJson(res, 403, { error: 'Forbidden' });
    return;
  }

  try {
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) {
      sendJson(res, 404, { error: 'Not Found' });
      return;
    }
    const content = await readFile(filePath);
    const ext = extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    setSecurityHeaders(res);
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  } catch {
    sendJson(res, 404, { error: 'Not Found' });
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`GraphView server listening on http://0.0.0.0:${PORT}`);
});
