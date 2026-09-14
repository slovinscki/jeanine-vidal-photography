import { access, readFile, stat } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { campaign as atelier23 } from '../content/campaigns/atelier-23/setembro-2026/campaign.js';
import { campaign as brunaModa } from '../content/campaigns/bruna-moda/setembro-2026/campaign.js';
import { campaign as gabrielVidal } from '../content/campaigns/gabriel-vidal/setembro-2026/campaign.js';
import { campaign as lojaEmporio } from '../content/campaigns/loja-emporio/setembro-2026/campaign.js';
import { campaign as stillusModa } from '../content/campaigns/stillus-moda/setembro-2026/campaign.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const campaigns = [atelier23, brunaModa, gabrielVidal, lojaEmporio, stillusModa];
const campaignScripts = campaigns.map((campaign) => `content/campaigns/${campaign.clientSlug}/${campaign.campaignSlug}/campaign.js`);
const scripts = [
    'content/campaign/app.js',
    'content/campaign/components.js',
    'content/campaign/campaign-factory.js',
    ...campaignScripts,
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

const clientSlugs = new Set();
for (const campaign of campaigns) {
    if (clientSlugs.has(campaign.clientSlug)) throw new Error(`Slug duplicado: ${campaign.clientSlug}.`);
    clientSlugs.add(campaign.clientSlug);
    if (campaign.looks.length !== 10) throw new Error(`${campaign.storeName}: a campanha precisa ter 10 looks.`);
    if (campaign.whatsappNumber !== null && !/^\d{10,15}$/.test(campaign.whatsappNumber)) throw new Error(`${campaign.storeName}: WhatsApp inválido.`);
    if (!campaign.whatsappMessage.includes(campaign.storeName)) throw new Error(`${campaign.storeName}: mensagem sem o nome correto da loja.`);

    campaign.looks.forEach((look) => {
        if (look.images.length !== 10) throw new Error(`${campaign.storeName}, Look ${look.id}: precisa ter 10 imagens.`);
        if (look.category !== 'fashion') throw new Error(`${campaign.storeName}, Look ${look.id}: somente fotografia de moda é permitida.`);
        if (look.availableSizes?.join(',') !== 'PP,M,G,GG') throw new Error(`${campaign.storeName}, Look ${look.id}: tamanhos inválidos.`);
        if (look.textSlide.slide !== 2) throw new Error(`${campaign.storeName}, Look ${look.id}: o texto editorial deve estar apenas no slide 2.`);
        look.images.forEach((image) => {
            if (!image.src || !image.srcset || !image.alt || !image.position) throw new Error(`${campaign.storeName}, Look ${look.id}: imagem incompleta.`);
        });
    });

    for (const look of campaign.looks.filter((item) => item.downloadUrl)) {
        if (!look.downloadFileName?.endsWith('.zip')) throw new Error(`${campaign.storeName}, Look ${look.id}: nome do download inválido.`);
        const zipPath = path.join(root, look.downloadUrl.replace(/^\//, ''));
        const zipStats = await stat(zipPath);
        if (zipStats.size < 100_000) throw new Error(`${campaign.storeName}, Look ${look.id}: ZIP ausente ou incompleto.`);
    }

    const htmlPath = path.join(root, 'content', campaign.clientSlug, campaign.campaignSlug, 'index.html');
    const html = await readFile(htmlPath, 'utf8');
    const expectedSource = `/content/campaigns/${campaign.clientSlug}/${campaign.campaignSlug}/campaign.js`;
    if (!html.includes(`data-campaign-source="${expectedSource}"`)) throw new Error(`${campaign.storeName}: fonte da campanha incorreta.`);
    if (!html.includes(campaign.canonicalUrl) || !html.includes(campaign.ogImage)) throw new Error(`${campaign.storeName}: metadata incompleta.`);
}

const css = await readFile(path.join(root, 'content/campaign/styles.css'), 'utf8');
const balance = [...css].reduce((count, character) => count + (character === '{' ? 1 : character === '}' ? -1 : 0), 0);
if (balance !== 0) throw new Error('CSS com chaves desbalanceadas.');

const totalLooks = campaigns.reduce((total, campaign) => total + campaign.looks.length, 0);
const totalSlides = campaigns.reduce((total, campaign) => total + campaign.looks.reduce((sum, look) => sum + look.images.length, 0), 0);
console.log(`Lint OK: ${campaigns.length} campanhas, ${totalLooks} looks e ${totalSlides} slides.`);
