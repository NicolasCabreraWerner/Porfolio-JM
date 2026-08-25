const http = require('http');
const fs = require('fs');
const path = require('path');
 
// Dónde está realmente el sitio. Se busca index.html en los lugares
// habituales para tolerar que la carpeta quede anidada de más al subirla.
const CANDIDATES = ['public', path.join('public', 'public'), '.'];
const ROOT = (() => {
  for (const c of CANDIDATES) {
    const dir = path.resolve(__dirname, c);
    if (fs.existsSync(path.join(dir, 'index.html'))) return dir;
  }
  return path.resolve(__dirname, 'public');
})();
 
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
 
function send(res, status, file) {
  const ext = path.extname(file).toLowerCase();
  const immutable = ['.webp', '.jpg', '.jpeg', '.png'].includes(ext);
  const stream = fs.createReadStream(file);
 
  // Sin este handler, un archivo que no existe tira una excepción no
  // capturada y mata el proceso entero.
  stream.on('error', err => {
    console.error('No se pudo leer', file, '-', err.code);
    if (!res.headersSent) res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Error interno');
  });
 
  stream.once('open', () => {
    res.writeHead(status, {
      'Content-Type': TYPES[ext] || 'application/octet-stream',
      'Cache-Control': immutable ? 'public, max-age=31536000, immutable' : 'public, max-age=300',
      'X-Content-Type-Options': 'nosniff',
    });
    stream.pipe(res);
  });
}
 
http.createServer((req, res) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Pedido inválido');
    return;
  }
 
  let file = path.join(ROOT, pathname);
  if (file !== ROOT && !file.startsWith(ROOT + path.sep)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Prohibido');
    return;
  }
  if (file === ROOT || pathname.endsWith('/')) file = path.join(file, 'index.html');
 
  fs.stat(file, (err, stat) => {
    if (!err && stat.isFile()) return send(res, 200, file);
 
    // Cualquier ruta desconocida cae en el portfolio.
    const index = path.join(ROOT, 'index.html');
    if (fs.existsSync(index)) return send(res, 404, index);
 
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('No encontrado');
  });
}).listen(PORT, () => {
  console.log('Portfolio JM escuchando en :' + PORT);
  console.log('Sirviendo desde ' + ROOT);
});
 
