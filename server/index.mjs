import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const PORT = Number(process.env.PORT || 3017);
const HOST = process.env.HOST || '0.0.0.0';
const DIST_DIR = path.resolve(process.cwd(), 'dist');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

const server = http.createServer((req, res) => {
  const urlObj = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  let reqPath = decodeURIComponent(urlObj.pathname);

  if (reqPath === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ status: 'ok', app: 'ANACI BG Hub', port: PORT }));
    return;
  }

  if (reqPath === '/') reqPath = '/index.html';

  const filePath = path.join(DIST_DIR, reqPath);
  if (filePath.startsWith(DIST_DIR) && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
    });
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  const indexHtml = path.join(DIST_DIR, 'index.html');
  if (fs.existsSync(indexHtml)) {
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache',
    });
    fs.createReadStream(indexHtml).pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Build non trovata. Esegui npm run build.');
  }
});

server.listen(PORT, HOST, () => {
  console.log(`ANACI BG Hub server attivo su http://${HOST}:${PORT}`);
});
