import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const types = { '.css': 'text/css', '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg' };

createServer(async (request, response) => {
    try {
        const pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
        let filePath = path.join(root, pathname);
        if (!filePath.startsWith(root)) throw new Error('Invalid path');
        const details = await stat(filePath);
        if (details.isDirectory()) filePath = path.join(filePath, 'index.html');
        const extension = path.extname(filePath).toLowerCase();
        response.writeHead(200, { 'Content-Type': `${types[extension] || 'application/octet-stream'}; charset=utf-8` });
        createReadStream(filePath).pipe(response);
    } catch {
        response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        response.end('Not found');
    }
}).listen(4175, '127.0.0.1', () => console.log('Local site: http://127.0.0.1:4175'));
