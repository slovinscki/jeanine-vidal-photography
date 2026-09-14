const escapeHtml = (value = '') => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

export const whatsappUrl = (number, message) =>
    `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

export const selectionWhatsappMessage = (campaign, selectedLooks) => {
    const storeName = campaign.storeName || campaign.clientName;
    const collectionName = campaign.collectionName || campaign.campaignName;
    const lines = selectedLooks.map((item) => {
        const look = campaign.looks.find((candidate) => Number(candidate.id) === Number(item.lookId));
        const number = String(item.lookId).padStart(2, '0');
        return `Look ${number}${look?.title ? ` — ${look.title}` : ''} — tamanho ${item.size}`;
    });
    return [
        `Olá! Vi a ${collectionName} da ${storeName} e gostaria de consultar valores e disponibilidade destes looks:`,
        '',
        ...lines,
        '',
        'Pode me passar os preços e disponibilidade?'
    ].join('\n');
};

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
                    <div class="slide-copy" role="note" aria-label="Texto editorial do Look ${String(lookId).padStart(2, '0')}">
                        <strong>${escapeHtml(textSlide.title)}</strong>
                        <span>${escapeHtml(textSlide.line)}</span>
                    </div>` : ''}
            </div>
        </li>`;
};

export const LookCarousel = (look) => `
    <div class="carousel" data-carousel data-look-id="${look.id}">
        <div class="carousel-viewport" data-carousel-viewport tabindex="0" role="region" aria-roledescription="carrossel" aria-label="Carrossel do Look ${String(look.id).padStart(2, '0')}">
            <ol class="carousel-track">
                ${look.images.map((image, index) => CarouselSlide({ image, index, textSlide: look.textSlide, lookId: look.id })).join('')}
            </ol>
        </div>
        <div class="carousel-meta">
            <p class="carousel-counter" aria-live="polite"><span data-current>01</span> / ${String(look.images.length).padStart(2, '0')}</p>
            <div class="carousel-dots" role="group" aria-label="Selecionar fotografia">
                ${look.images.map((_, index) => `<button type="button" data-dot="${index}" aria-label="Ir para a foto ${index + 1}"${index === 0 ? ' aria-current="true"' : ''}></button>`).join('')}
            </div>
            <div class="carousel-arrows">
                <button type="button" data-prev aria-label="Fotografia anterior" disabled>←</button>
                <button type="button" data-next aria-label="Próxima fotografia">→</button>
            </div>
        </div>
    </div>`;

export const LookSelection = (look) => `
    <div class="look-selection" data-look-selection data-look-id="${look.id}">
        <button class="look-cta" type="button" data-select-look aria-pressed="false">
            <span data-select-label>Quero este look</span><i aria-hidden="true">＋</i>
        </button>
        <div class="size-picker" data-size-picker hidden>
            <p id="look-${look.id}-size-label">Escolha o tamanho</p>
            <div role="group" aria-labelledby="look-${look.id}-size-label">
                ${look.availableSizes.map((size) => `<button type="button" data-size="${escapeHtml(size)}" aria-pressed="false">${escapeHtml(size)}</button>`).join('')}
            </div>
            <p class="size-error" data-size-error role="status" aria-live="polite"></p>
        </div>
    </div>`;

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
            ${LookSelection(look)}
            ${look.downloadUrl ? LookDownload(look) : ''}
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
            ${campaign.whatsappNumber
                ? `<a data-event="campaign_whatsapp_click" href="${whatsappUrl(campaign.whatsappNumber, campaign.whatsappMessage)}" target="_blank" rel="noopener noreferrer">WhatsApp ↗</a>`
                : '<button type="button" data-selection-submit>Falar com a loja ↗</button>'}
        </nav>
        <p>Content by <a href="/content/">Centrofotos</a> · ${escapeHtml(campaign.stockCredit)}</p>
    </footer>`;

export const CampaignLayout = (campaign) => `
    ${CampaignHero(campaign)}
    ${campaign.looks.map((look, index) => LookSection(campaign, look, index)).join('')}
    <section class="campaign-end" aria-labelledby="campaign-end-title">
        <p>${escapeHtml(campaign.month)} / ${campaign.year}</p>
        <h2 id="campaign-end-title">Found your look?</h2>
        <button class="selection-submit" type="button" data-selection-submit>Falar com a loja <span aria-hidden="true">↗</span></button>
        ${CampaignShare()}
    </section>
    ${CampaignFooter(campaign)}
    <div class="mobile-selection-bar" data-mobile-selection hidden>
        <span data-mobile-selection-count></span>
        <button type="button" data-selection-submit>Solicitar preços</button>
    </div>
    <p class="campaign-contact-status" data-contact-status role="status" aria-live="polite" hidden></p>`;
