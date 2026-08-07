import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, resolve } from 'node:path';

const rootDir = process.cwd();
const port = 3000;
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.map': 'application/json; charset=utf-8'
};

const server = createServer(async (req, res) => {
  try {
    const requestUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    let pathname = decodeURIComponent(requestUrl.pathname);

    if (pathname === '/') {
      pathname = '/index.html';
    }

    const filePath = resolve(rootDir, `.${pathname}`);

    if (!filePath.startsWith(rootDir)) {
      res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Forbidden');
      return;
    }

    const fileExt = extname(filePath).toLowerCase();
    const contentType = mimeTypes[fileExt] || 'application/octet-stream';

    const fileStats = await stat(filePath);
    if (!fileStats.isFile()) {
      throw new Error('Not a file');
    }

    const fileContents = await readFile(filePath);
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(fileContents);
  } catch (error) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  }
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
