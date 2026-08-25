const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, 'public');
const PORT = process.env.PORT || 3000;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
};

http.createServer((req, res) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch {
    res.writeHead(400).end('Bad request');
    return;
  }

  // Resolve inside ROOT only — no path traversal.
  let file = path.join(ROOT, pathname);
  if (!file.startsWith(ROOT + path.sep) && file !== ROOT) {
    res.writeHead(403).end('Forbidden');
    return;
  }
  if (file === ROOT || pathname.endsWith('/')) file = path.join(file, 'index.html');

  fs.stat(file, (err, stat) => {
    if (err || !stat.isFile()) {
      // Anything unknown falls back to the portfolio itself.
      file = path.join(ROOT, 'index.html');
    }
    const ext = path.extname(file).toLowerCase();
    const immutable = ext === '.webp' || ext === '.jpg' || ext === '.png';
    res.writeHead(err ? 404 : 200, {
      'Content-Type': TYPES[ext] || 'application/octet-stream',
      'Cache-Control': immutable
        ? 'public, max-age=31536000, immutable'
        : 'public, max-age=300',
      'X-Content-Type-Options': 'nosniff',
    });
    fs.createReadStream(file).pipe(res);
  });
}).listen(PORT, () => console.log('Portfolio JM escuchando en :' + PORT));
