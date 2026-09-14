const root = document.querySelector('[data-campaign-root]');
const assetVersion = new URL(import.meta.url).search;
const campaignSource = root?.dataset.campaignSource;

if (!campaignSource) throw new Error('Campaign source was not provided.');

const [{ campaign }, { CampaignLayout, selectionWhatsappMessage }] = await Promise.all([
    import(`${campaignSource}${assetVersion}`),
    import(`/content/campaign/components.js${assetVersion}`)
]);

const track = (event, payload = {}) => {
    const detail = {
        event,
        clientSlug: campaign.clientSlug,
        campaignSlug: campaign.campaignSlug,
        ...payload
    };
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(detail);
    window.dispatchEvent(new CustomEvent('centrocontent:analytics', { detail }));
    if (typeof window.gtag === 'function') window.gtag('event', event, detail);
};

const twoDigits = (number) => String(number).padStart(2, '0');

const setupImages = () => {
    document.querySelectorAll('[data-image]').forEach((image) => {
        const ready = () => image.closest('.image-shell')?.classList.add('is-loaded');
        if (image.complete) ready();
        else image.addEventListener('load', ready, { once: true });
    });
};

const setupCarousel = (carousel) => {
    const viewport = carousel.querySelector('[data-carousel-viewport]');
    const slides = [...carousel.querySelectorAll('[data-slide]')];
    const dots = [...carousel.querySelectorAll('[data-dot]')];
    const current = carousel.querySelector('[data-current]');
    const previous = carousel.querySelector('[data-prev]');
    const next = carousel.querySelector('[data-next]');
    const lookId = Number(carousel.dataset.lookId);
    let activeIndex = 0;

    const updateControls = () => {
        previous.disabled = activeIndex === 0;
        next.disabled = activeIndex === slides.length - 1;
    };

    const setActive = (index, source = 'scroll') => {
        const bounded = Math.max(0, Math.min(slides.length - 1, index));
        if (bounded === activeIndex && source === 'scroll') return;
        activeIndex = bounded;
        current.textContent = twoDigits(bounded + 1);
        dots.forEach((dot, dotIndex) => dot.toggleAttribute('aria-current', dotIndex === bounded));
        updateControls();
        if (source !== 'scroll') {
            slides[bounded].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
            track('look_carousel_interaction', { lookId, slideNumber: bounded + 1, interaction: source });
        }
    };

    const syncFromScroll = () => {
        const nearest = slides.reduce((best, slide, index) => {
            const distance = Math.abs(slide.offsetLeft - viewport.scrollLeft);
            return distance < best.distance ? { index, distance } : best;
        }, { index: 0, distance: Infinity });
        if (nearest.index !== activeIndex) {
            activeIndex = nearest.index;
            current.textContent = twoDigits(activeIndex + 1);
            dots.forEach((dot, index) => dot.toggleAttribute('aria-current', index === activeIndex));
            updateControls();
            track('look_carousel_interaction', { lookId, slideNumber: activeIndex + 1, interaction: 'swipe' });
        }
    };

    let scrollTimer;
    viewport.addEventListener('scroll', () => {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(syncFromScroll, 90);
    }, { passive: true });

    previous.addEventListener('click', () => setActive(activeIndex - 1, 'previous'));
    next.addEventListener('click', () => setActive(activeIndex + 1, 'next'));
    dots.forEach((dot, index) => dot.addEventListener('click', () => setActive(index, 'dot')));

    viewport.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight') { event.preventDefault(); setActive(activeIndex + 1, 'keyboard'); }
        if (event.key === 'ArrowLeft') { event.preventDefault(); setActive(activeIndex - 1, 'keyboard'); }
        if (event.key === 'Home') { event.preventDefault(); setActive(0, 'keyboard'); }
        if (event.key === 'End') { event.preventDefault(); setActive(slides.length - 1, 'keyboard'); }
    });

    updateControls();
};

const setupSelection = () => {
    const storageKey = `centrocontent:selection:${campaign.clientSlug}:${campaign.campaignSlug}`;
    const validSizes = new Set(campaign.looks.flatMap((look) => look.availableSizes));
    const validLookIds = new Set(campaign.looks.map((look) => Number(look.id)));
    let selectedLooks = [];

    try {
        const stored = JSON.parse(sessionStorage.getItem(storageKey) || '[]');
        if (Array.isArray(stored)) {
            selectedLooks = stored
                .filter((item) => validLookIds.has(Number(item.lookId)))
                .map((item) => ({ lookId: Number(item.lookId), size: validSizes.has(item.size) ? item.size : null }));
        }
    } catch {
        sessionStorage.removeItem(storageKey);
    }

    const selectionFor = (lookId) => selectedLooks.find((item) => item.lookId === Number(lookId));

    const selectionLabel = () => {
        const count = selectedLooks.length;
        if (!count) return 'Falar com a loja';
        return `Solicitar ${count === 1 ? 'preço de 1 look' : `preços de ${count} looks`}`;
    };

    const save = () => {
        if (selectedLooks.length) sessionStorage.setItem(storageKey, JSON.stringify(selectedLooks));
        else sessionStorage.removeItem(storageKey);
    };

    const render = () => {
        document.querySelectorAll('[data-look-selection]').forEach((selection) => {
            const selected = selectionFor(selection.dataset.lookId);
            const selectButton = selection.querySelector('[data-select-look]');
            const picker = selection.querySelector('[data-size-picker]');
            selectButton.setAttribute('aria-pressed', String(Boolean(selected)));
            selectButton.querySelector('[data-select-label]').textContent = selected ? 'Look selecionado ✓' : 'Quero este look';
            selectButton.querySelector('i').textContent = selected ? '−' : '＋';
            picker.hidden = !selected;
            selection.querySelectorAll('[data-size]').forEach((button) => {
                button.setAttribute('aria-pressed', String(button.dataset.size === selected?.size));
            });
            if (!selected) selection.querySelector('[data-size-error]').textContent = '';
        });

        document.querySelectorAll('[data-selection-submit]').forEach((button) => {
            if (button.closest('[data-mobile-selection]')) return;
            button.firstChild.textContent = `${selectionLabel()} `;
        });

        const mobileBar = document.querySelector('[data-mobile-selection]');
        mobileBar.hidden = selectedLooks.length === 0;
        if (selectedLooks.length) {
            mobileBar.querySelector('[data-mobile-selection-count]').textContent = `${selectedLooks.length} ${selectedLooks.length === 1 ? 'look selecionado' : 'looks selecionados'}`;
        }
    };

    const openWhatsapp = () => {
        if (!selectedLooks.length) {
            window.open(`https://wa.me/${campaign.whatsappNumber}?text=${encodeURIComponent(campaign.whatsappMessage)}`, '_blank', 'noopener,noreferrer');
            track('campaign_whatsapp_click', { selectedLookCount: 0 });
            return;
        }

        document.querySelectorAll('[data-size-error]').forEach((element) => { element.textContent = ''; });
        const incomplete = selectedLooks.find((item) => !item.size);
        if (incomplete) {
            const selection = document.querySelector(`[data-look-selection][data-look-id="${incomplete.lookId}"]`);
            selection.querySelector('[data-size-error]').textContent = 'Escolha um tamanho antes de continuar.';
            selection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            selection.querySelector('[data-size]')?.focus({ preventScroll: true });
            track('selection_validation_error', { lookId: incomplete.lookId });
            return;
        }

        const message = selectionWhatsappMessage(campaign, selectedLooks);
        window.open(`https://wa.me/${campaign.whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
        track('selection_whatsapp_click', { selectedLookCount: selectedLooks.length, looks: selectedLooks.map(({ lookId, size }) => ({ lookId, size })) });
    };

    document.querySelectorAll('[data-select-look]').forEach((button) => {
        button.addEventListener('click', () => {
            const lookId = Number(button.closest('[data-look-selection]').dataset.lookId);
            const selected = selectionFor(lookId);
            selectedLooks = selected
                ? selectedLooks.filter((item) => item.lookId !== lookId)
                : [...selectedLooks, { lookId, size: null }];
            save();
            render();
            track(selected ? 'look_selection_removed' : 'look_selection_added', { lookId });
        });
    });

    document.querySelectorAll('[data-size]').forEach((button) => {
        button.addEventListener('click', () => {
            const selection = button.closest('[data-look-selection]');
            const lookId = Number(selection.dataset.lookId);
            selectedLooks = selectedLooks.map((item) => item.lookId === lookId ? { ...item, size: button.dataset.size } : item);
            selection.querySelector('[data-size-error]').textContent = '';
            save();
            render();
            track('look_size_selected', { lookId, size: button.dataset.size });
        });
    });

    document.querySelectorAll('[data-selection-submit]').forEach((button) => button.addEventListener('click', openWhatsapp));
    render();
};

const setupObservers = () => {
    if (!('IntersectionObserver' in window)) return;
    const observedLooks = new Set();
    const lookObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const lookId = Number(entry.target.dataset.lookSection);
            if (!observedLooks.has(lookId)) {
                observedLooks.add(lookId);
                track('look_view', { lookId });
            }
        });
    }, { threshold: 0.38 });
    document.querySelectorAll('[data-look-section]').forEach((section) => lookObserver.observe(section));

};

const setupActions = () => {
    document.querySelectorAll('[data-event]').forEach((element) => {
        element.addEventListener('click', () => {
            const payload = element.dataset.lookId ? { lookId: Number(element.dataset.lookId) } : {};
            track(element.dataset.event, payload);
        });
    });

    document.querySelector('[data-share]')?.addEventListener('click', async () => {
        const shareData = { title: `${campaign.campaignName} | ${campaign.clientName}`, text: campaign.description, url: campaign.canonicalUrl };
        try {
            if (window.navigator.share) await window.navigator.share(shareData);
            else if (window.navigator.clipboard) await window.navigator.clipboard.writeText(campaign.canonicalUrl);
            else {
                const field = document.createElement('textarea');
                field.value = campaign.canonicalUrl;
                field.setAttribute('readonly', '');
                field.style.position = 'fixed';
                field.style.opacity = '0';
                document.body.append(field);
                field.select();
                document.execCommand('copy');
                field.remove();
            }
            document.querySelector('[data-share] span').textContent = window.navigator.share ? 'Compartilhado' : 'Link copiado';
            track('campaign_share');
        } catch (error) {
            if (error.name !== 'AbortError') document.querySelector('[data-share] span').textContent = 'Copie o link do navegador';
        }
    });
};

if (root) {
    root.innerHTML = CampaignLayout(campaign);
    setupImages();
    document.querySelectorAll('[data-carousel]').forEach(setupCarousel);
    setupSelection();
    setupObservers();
    setupActions();
    track('campaign_view');
}
