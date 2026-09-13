import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { campaign } from '../content/campaigns/atelier-23/setembro-2026/campaign.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const template = await readFile(path.join(root, 'content', 'campaign', 'template.html'), 'utf8');
const replacements = {
    TITLE: `${campaign.campaignName.replace('SETEMBRO', 'Setembro')} | ${campaign.clientName.replace('ATELIER', 'Atelier')}`,
    DESCRIPTION: campaign.description,
    CANONICAL: campaign.canonicalUrl,
    OG_IMAGE: campaign.ogImage,
    OG_ALT: `${campaign.clientName} — ${campaign.campaignName}`,
    HERO_IMAGE: campaign.heroImage,
    CLIENT_NAME: campaign.clientName,
    CAMPAIGN_NAME: campaign.campaignName
};

const html = Object.entries(replacements).reduce(
    (result, [key, value]) => result.replaceAll(`{{${key}}}`, value),
    template
);

const destination = path.join(root, 'content', campaign.clientSlug, campaign.campaignSlug);
await mkdir(destination, { recursive: true });
await writeFile(path.join(destination, 'index.html'), html, 'utf8');
console.log(`Built /content/${campaign.clientSlug}/${campaign.campaignSlug}/`);
