// Servidor estático mínimo usado na gravação.
//   /stage/...  -> video/stage   (slides / palco do vídeo)
//   /out/...    -> video/out     (capturas geradas no build)
//   /...        -> build web do app Expo (resolve /rota -> /rota.html)
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const types = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.ttf': 'font/ttf', '.json': 'application/json',
  '.ico': 'image/x-icon', '.mp3': 'audio/mpeg', '.woff2': 'font/woff2',
};

export function startServer({ appDir, stageDir, outDir, port = 8090 }) {
  const mounts = [
    ['/stage/', path.resolve(stageDir)],
    ['/out/', path.resolve(outDir)],
    ['/', path.resolve(appDir)],
  ];
  const server = http.createServer((req, res) => {
    const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    for (const [prefix, root] of mounts) {
      if (!p.startsWith(prefix)) continue;
      const rel = p.slice(prefix.length - 1);
      for (const c of [rel, rel + '.html', path.join(rel, 'index.html')]) {
        const f = path.join(root, c);
        if (f.startsWith(root) && fs.existsSync(f) && fs.statSync(f).isFile()) {
          res.writeHead(200, { 'content-type': types[path.extname(f)] || 'application/octet-stream', 'cache-control': 'no-store' });
          return fs.createReadStream(f).pipe(res);
        }
      }
      break;
    }
    res.writeHead(404);
    res.end('not found');
  });
  return new Promise((resolve) => server.listen(port, () => resolve(server)));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [appDir = 'dist', port = '8090'] = process.argv.slice(2);
  const here = path.dirname(new URL(import.meta.url).pathname);
  startServer({ appDir, stageDir: path.join(here, 'stage'), outDir: path.join(here, 'out'), port: Number(port) })
    .then(() => console.log(`http://localhost:${port}/stage/index.html`));
}
