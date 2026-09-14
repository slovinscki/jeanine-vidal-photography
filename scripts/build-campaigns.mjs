import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { campaign as atelier23 } from '../content/campaigns/atelier-23/setembro-2026/campaign.js';
import { campaign as brunaModa } from '../content/campaigns/bruna-moda/setembro-2026/campaign.js';
import { campaign as gabrielVidal } from '../content/campaigns/gabriel-vidal/setembro-2026/campaign.js';
import { campaign as lojaEmporio } from '../content/campaigns/loja-emporio/setembro-2026/campaign.js';
import { campaign as stillusModa } from '../content/campaigns/stillus-moda/setembro-2026/campaign.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const template = await readFile(path.join(root, 'content', 'campaign', 'template.html'), 'utf8');
const campaigns = [atelier23, brunaModa, gabrielVidal, lojaEmporio, stillusModa];

for (const campaign of campaigns) {
    const campaignSource = `/content/campaigns/${campaign.clientSlug}/${campaign.campaignSlug}/campaign.js`;
    const replacements = {
        TITLE: campaign.seoTitle || `${campaign.collectionName} | ${campaign.storeName}`,
        DESCRIPTION: campaign.description,
        CANONICAL: campaign.canonicalUrl,
        OG_IMAGE: campaign.ogImage,
        OG_ALT: `${campaign.storeName} — ${campaign.collectionName}`,
        HERO_IMAGE: campaign.heroImage,
        CLIENT_NAME: campaign.clientName,
        CAMPAIGN_NAME: campaign.campaignName,
        CAMPAIGN_SOURCE: campaignSource,
        ASSET_VERSION: campaign.assetVersion
    };

    const html = Object.entries(replacements).reduce(
        (result, [key, value]) => result.replaceAll(`{{${key}}}`, value),
        template
    );

    const destination = path.join(root, 'content', campaign.clientSlug, campaign.campaignSlug);
    await mkdir(destination, { recursive: true });
    await writeFile(path.join(destination, 'index.html'), html, 'utf8');
    console.log(`Built /content/${campaign.clientSlug}/${campaign.campaignSlug}/`);
}
