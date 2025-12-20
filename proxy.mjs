import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';

const hostname = '127.0.0.1';
const port = 3000;

// ES Modules で __dirname を使うための定義
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = http.createServer((req, res) => {

  /* ===============================
     ① パトライト制御用 API
     =============================== */
  if (req.url.startsWith('/patlite')) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const led = url.searchParams.get('led') ?? '11100';
    console.log(`http://192.168.12.201/api/control?led=${led}`)

    http.get(`http://192.168.12.201/api/control?led=${led}`, () => {
      // 制御できればOK。GUIやHTMLは返さない
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*'
      });
      res.end();
    }).on('error', (err) => {
      res.writeHead(500, {
        'Content-Type': 'text/plain'
      });
      res.end(err.message);
    });

    return;
  }

  /* ===============================
     ② 静的ファイル配信
     =============================== */

  // "/" に来たら index.html
  const filePath = req.url === '/'
    ? path.join(__dirname, 'index.html')
    : path.join(__dirname, req.url);

  const ext = path.extname(filePath).toLowerCase();

  const contentTypeMap = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.mp3': 'audio/mpeg'
  };

  const contentType = contentTypeMap[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, {
        'Content-Type': 'text/plain'
      });
      res.end('Not Found');
      return;
    }

    res.writeHead(200, {
      'Content-Type': contentType
    });
    res.end(data);
  });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
