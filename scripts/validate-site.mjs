import { access, readFile, stat } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { campaign } from '../content/campaigns/atelier-23/setembro-2026/campaign.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const scripts = [
    'content/campaign/app.js',
    'content/campaign/components.js',
    'content/campaigns/atelier-23/setembro-2026/campaign.js',
    'scripts/build-campaigns.mjs',
    'scripts/serve.mjs',
    'scripts/validate-site.mjs'
];

for (const script of scripts) {
    const result = spawnSync(process.execPath, ['--check', path.join(root, script)], { encoding: 'utf8' });
    if (result.status !== 0) throw new Error(`${script}: ${result.stderr}`);
}

for (const required of ['index.html', 'content/index.html', 'ladob/index.html', 'content/campaign/template.html', 'content/campaign/styles.css', 'vercel.json']) {
    await access(path.join(root, required));
}

if (campaign.looks.length !== 10) throw new Error('A campanha precisa ter 10 looks.');
campaign.looks.forEach((look) => {
    if (look.images.length !== 10) throw new Error(`Look ${look.id} precisa ter 10 imagens.`);
    if (look.category !== 'fashion') throw new Error(`Look ${look.id}: somente fotografia de moda é permitida.`);
    if (look.textSlide.slide !== 2) throw new Error(`Look ${look.id}: o texto editorial deve estar apenas no slide 2.`);
    if (!look.downloadUrl?.endsWith('.zip') || !look.downloadFileName?.endsWith('.zip')) throw new Error(`Look ${look.id}: download do carrossel não configurado.`);
    look.images.forEach((image) => {
        if (!image.src || !image.srcset || !image.alt || !image.position) throw new Error(`Look ${look.id}: imagem incompleta.`);
    });
});
for (const look of campaign.looks) {
    const zipPath = path.join(root, look.downloadUrl.replace(/^\//, ''));
    const zipStats = await stat(zipPath);
    if (zipStats.size < 100_000) throw new Error(`Look ${look.id}: ZIP ausente ou incompleto.`);
}
const uniqueImageSources = new Set(campaign.looks.flatMap((look) => look.images.map((image) => image.src))).size;
if (uniqueImageSources < 90) throw new Error(`Pouca variedade fotográfica: ${uniqueImageSources} fontes únicas.`);

const css = await readFile(path.join(root, 'content/campaign/styles.css'), 'utf8');
const balance = [...css].reduce((count, character) => count + (character === '{' ? 1 : character === '}' ? -1 : 0), 0);
if (balance !== 0) throw new Error('CSS com chaves desbalanceadas.');

console.log(`Lint OK: ${scripts.length} scripts, ${campaign.looks.length} looks, ${campaign.looks.reduce((total, look) => total + look.images.length, 0)} slides e ${uniqueImageSources} fotografias distintas.`);
