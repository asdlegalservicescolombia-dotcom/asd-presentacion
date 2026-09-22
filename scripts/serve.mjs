import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const port = Number(process.env.PORT || 4173);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.ttf': 'font/ttf', '.woff2': 'font/woff2', '.mp4': 'video/mp4', '.json': 'application/json', '.glb': 'model/gltf-binary' };
createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const relative = pathname.replace(/^\/asd-presentacion(?=\/|$)/, '').replace(/^\/+/, '') || 'index.html';
    if (relative.split(/[\\/]/).some(part => part.startsWith('.'))) throw new Error('Not found');
    const path = resolve(root, relative);
    if (!path.startsWith(resolve(root) + sep) || !(await stat(path)).isFile()) throw new Error('Not found');
    res.writeHead(200, { 'Content-Type': types[extname(path)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(await readFile(path));
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Archivo no encontrado');
  }
}).listen(port, '127.0.0.1', () => console.log(`ASD: http://127.0.0.1:${port}/asd-presentacion/`));
