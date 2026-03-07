import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, join, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const STATIC_ROOT = resolve(__dirname, 'storybook-static');
const PORT = parseInt(process.env.PORT || '8081', 10);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
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
  '.map': 'application/json',
};

/**
 * Checks whether `child` is equal to or contained within `parent`.
 * Uses a trailing path-separator comparison to prevent prefix-collision
 * bypasses (e.g. /app/storybook-static-evil matching /app/storybook-static).
 */
function isPathWithin(child, parent) {
  const resolvedChild = resolve(child);
  const resolvedParent = resolve(parent);
  return resolvedChild === resolvedParent ||
    resolvedChild.startsWith(resolvedParent + sep);
}

/**
 * Sends a 405 Method Not Allowed response with the Allow header.
 */
function methodNotAllowed(res) {
  res.writeHead(405, {
    'Content-Type': 'application/json',
    'Allow': 'GET, HEAD',
  });
  res.end(JSON.stringify({ error: 'Method Not Allowed' }));
}

const server = createServer(async (req, res) => {
  // Only allow GET and HEAD on all routes
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    methodNotAllowed(res);
    return;
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;

  // Health check endpoint
  if (pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    if (req.method === 'HEAD') {
      res.end();
    } else {
      res.end(JSON.stringify({ status: 'ok' }));
    }
    return;
  }

  // Decode and resolve against STATIC_ROOT
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(pathname);
  } catch {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Bad Request' }));
    return;
  }

  let filePath = resolve(STATIC_ROOT, '.' + decodedPath);

  // Path traversal guard: resolved path must be within STATIC_ROOT
  if (!isPathWithin(filePath, STATIC_ROOT)) {
    res.writeHead(403, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Forbidden' }));
    return;
  }

  try {
    const fileStat = await stat(filePath);
    if (fileStat.isDirectory()) {
      filePath = join(filePath, 'index.html');
      // Re-validate after appending index.html
      if (!isPathWithin(filePath, STATIC_ROOT)) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Forbidden' }));
        return;
      }
    }
  } catch {
    // Path does not exist — fall through to 404 below
  }

  try {
    const data = await readFile(filePath);
    const ext = extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    if (req.method === 'HEAD') {
      res.end();
    } else {
      res.end(data);
    }
  } catch {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});

server.listen(PORT, () => {
  console.log(`GraphView server listening on port ${PORT}`);
});

export { server, STATIC_ROOT, PORT };
