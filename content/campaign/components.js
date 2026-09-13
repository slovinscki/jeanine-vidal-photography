const escapeHtml = (value = '') => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

export const whatsappUrl = (number, message) =>
    `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

export const CarouselSlide = ({ image, index, textSlide, lookId }) => {
    const hasText = index + 1 === textSlide.slide;
    return `
        <li class="carousel-slide" data-slide="${index + 1}" aria-label="Foto ${index + 1} de 10">
            <div class="image-shell">
                <img
                    src="${image.src}"
                    srcset="${image.srcset}"
                    sizes="(max-width: 699px) 92vw, (max-width: 1099px) 70vw, 48vw"
                    width="1200"
                    height="1500"
                    loading="lazy"
                    decoding="async"
                    alt="${escapeHtml(image.alt)}"
                    style="object-position:${image.position}"
                    data-image
                >
                ${hasText ? `
                    <div class="slide-copy" aria-label="Texto editorial do Look ${String(lookId).padStart(2, '0')}">
                        <strong>${escapeHtml(textSlide.title)}</strong>
                        <span>${escapeHtml(textSlide.line)}</span>
                    </div>` : ''}
            </div>
        </li>`;
};

export const LookCarousel = (look) => `
    <div class="carousel" data-carousel data-look-id="${look.id}">
        <div class="carousel-viewport" data-carousel-viewport tabindex="0" aria-label="Carrossel do Look ${String(look.id).padStart(2, '0')}">
            <ol class="carousel-track">
                ${look.images.map((image, index) => CarouselSlide({ image, index, textSlide: look.textSlide, lookId: look.id })).join('')}
            </ol>
        </div>
        <div class="carousel-meta">
            <p class="carousel-counter" aria-live="polite"><span data-current>01</span> / 10</p>
            <div class="carousel-dots" aria-label="Selecionar fotografia">
                ${look.images.map((_, index) => `<button type="button" data-dot="${index}" aria-label="Ir para a foto ${index + 1}"${index === 0 ? ' aria-current="true"' : ''}></button>`).join('')}
            </div>
            <div class="carousel-arrows">
                <button type="button" data-prev aria-label="Fotografia anterior">←</button>
                <button type="button" data-next aria-label="Próxima fotografia">→</button>
            </div>
        </div>
    </div>`;

export const LookCTA = (campaign, look) => `
    <a class="look-cta" data-event="look_whatsapp_click" data-look-id="${look.id}"
       href="${whatsappUrl(campaign.whatsappNumber, look.whatsappMessage)}"
       target="_blank" rel="noopener noreferrer">
        <span>Quero este look</span><i aria-hidden="true">↗</i>
    </a>`;

export const LookDownload = (look) => `
    <a class="look-download" data-event="look_carousel_download" data-look-id="${look.id}"
       href="${look.downloadUrl}" download="${look.downloadFileName}"
       aria-label="Baixar as 10 fotografias do Look ${String(look.id).padStart(2, '0')}">
        <span>Baixar carrossel completo</span><i aria-hidden="true">↓</i>
    </a>`;

export const LookSection = (campaign, look, index) => `
    <section class="look look--${look.tone} look--rhythm-${(index % 3) + 1}" data-look-section="${look.id}" aria-labelledby="look-${look.id}-title">
        <header class="look-heading">
            <p>${String(look.id).padStart(2, '0')} / LOOK</p>
            <div>
                <h2 id="look-${look.id}-title">${escapeHtml(look.title)}</h2>
                <span>${escapeHtml(look.subtitle)}</span>
            </div>
        </header>
        ${LookCarousel(look)}
        <div class="look-actions">
            ${LookCTA(campaign, look)}
            ${LookDownload(look)}
        </div>
    </section>`;

export const CampaignHero = (campaign) => `
    <section class="campaign-hero" aria-labelledby="campaign-title">
        <img src="${campaign.heroImage}" width="1200" height="1500" alt="Campanha ${escapeHtml(campaign.campaignName)} da ${escapeHtml(campaign.clientName)}" fetchpriority="high" decoding="sync">
        <div class="campaign-hero__shade" aria-hidden="true"></div>
        <div class="campaign-hero__copy">
            <p>${escapeHtml(campaign.clientName)}</p>
            <h1 id="campaign-title">${escapeHtml(campaign.campaignName)}</h1>
            <span>${escapeHtml(campaign.tagline)}</span>
        </div>
        <a href="#look-1-title" class="campaign-hero__scroll">Ver os looks <span aria-hidden="true">↓</span></a>
    </section>`;

export const CampaignShare = () => `
    <button class="share-button" type="button" data-share>
        <span>Compartilhar campanha</span><i aria-hidden="true">↗</i>
    </button>`;

export const CampaignFooter = (campaign) => `
    <footer class="campaign-footer" data-footer>
        <div><strong>${escapeHtml(campaign.clientName)}</strong><span>${escapeHtml(campaign.campaignName)}</span></div>
        <nav aria-label="Contato da loja">
            ${campaign.instagram ? `<a href="${campaign.instagram}" target="_blank" rel="noopener noreferrer">Instagram ↗</a>` : ''}
            <a data-event="campaign_whatsapp_click" href="${whatsappUrl(campaign.whatsappNumber, campaign.whatsappMessage)}" target="_blank" rel="noopener noreferrer">WhatsApp ↗</a>
        </nav>
        <p>Content by <a href="/content/">Centrofotos</a> · ${escapeHtml(campaign.stockCredit)}</p>
    </footer>`;

export const CampaignLayout = (campaign) => `
    ${CampaignHero(campaign)}
    <div class="campaign-intro" aria-label="Apresentação da coleção">
        <p>10 looks / 100 frames</p><span>Scroll. Swipe. Select.</span>
    </div>
    ${campaign.looks.map((look, index) => LookSection(campaign, look, index)).join('')}
    <section class="campaign-end" aria-labelledby="campaign-end-title">
        <p>${escapeHtml(campaign.month)} / ${campaign.year}</p>
        <h2 id="campaign-end-title">Found your look?</h2>
        <a data-event="campaign_whatsapp_click" href="${whatsappUrl(campaign.whatsappNumber, campaign.whatsappMessage)}" target="_blank" rel="noopener noreferrer">Falar com a loja ↗</a>
        ${CampaignShare()}
    </section>
    ${CampaignFooter(campaign)}
    <a class="mobile-store-cta" data-mobile-cta data-event="campaign_whatsapp_click" href="${whatsappUrl(campaign.whatsappNumber, campaign.whatsappMessage)}" target="_blank" rel="noopener noreferrer">Falar com a loja <span aria-hidden="true">↗</span></a>`;
