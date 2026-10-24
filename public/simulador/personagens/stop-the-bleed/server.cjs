const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const stopTheBleedDir = __dirname;
const publicDir = path.resolve(__dirname, '../../..');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp'
};

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0]);
  
  // API para salvar alterações de posições, tipos e tamanhos de ferimentos
  if (req.method === 'POST' && (urlPath === '/api/salvar-casos' || urlPath === '/api/save-casos')) {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const configPath = path.join(stopTheBleedDir, 'casos/casos-config.json');
        fs.writeFileSync(configPath, body, 'utf8');
        res.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        });
        res.end(JSON.stringify({ success: true, message: 'Casos atualizados e salvos com sucesso!' }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  if (urlPath === '/' || urlPath === '/index.html') {
    res.writeHead(302, { 'Location': '/simulador-geral.html' });
    res.end();
    return;
  }

  // Check in stop-the-bleed dir first, then in publicDir
  let filePath = path.join(stopTheBleedDir, urlPath);
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(publicDir, urlPath);
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache'
    });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found: ' + urlPath);
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Simulador Stop the Bleed rodando em: http://localhost:${PORT}/`);
  console.log(`- Perna: http://localhost:${PORT}/perna-realista.html`);
  console.log(`- Antebraco: http://localhost:${PORT}/antebraco-realista.html`);
  console.log(`- Galeria completa: http://localhost:${PORT}/todos.html`);
});
