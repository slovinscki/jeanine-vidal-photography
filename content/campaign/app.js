import { campaign } from '/content/campaigns/atelier-23/setembro-2026/campaign.js';
import { CampaignLayout } from '/content/campaign/components.js';

const root = document.querySelector('[data-campaign-root]');

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
    const lookId = Number(carousel.dataset.lookId);
    let activeIndex = 0;
    let pointerStart = null;
    let scrollStart = 0;

    const setActive = (index, source = 'scroll') => {
        const bounded = Math.max(0, Math.min(slides.length - 1, index));
        if (bounded === activeIndex && source === 'scroll') return;
        activeIndex = bounded;
        current.textContent = twoDigits(bounded + 1);
        dots.forEach((dot, dotIndex) => dot.toggleAttribute('aria-current', dotIndex === bounded));
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
            track('look_carousel_interaction', { lookId, slideNumber: activeIndex + 1, interaction: 'swipe' });
        }
    };

    let scrollTimer;
    viewport.addEventListener('scroll', () => {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(syncFromScroll, 90);
    }, { passive: true });

    carousel.querySelector('[data-prev]').addEventListener('click', () => setActive(activeIndex - 1, 'previous'));
    carousel.querySelector('[data-next]').addEventListener('click', () => setActive(activeIndex + 1, 'next'));
    dots.forEach((dot, index) => dot.addEventListener('click', () => setActive(index, 'dot')));

    viewport.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight') { event.preventDefault(); setActive(activeIndex + 1, 'keyboard'); }
        if (event.key === 'ArrowLeft') { event.preventDefault(); setActive(activeIndex - 1, 'keyboard'); }
        if (event.key === 'Home') { event.preventDefault(); setActive(0, 'keyboard'); }
        if (event.key === 'End') { event.preventDefault(); setActive(slides.length - 1, 'keyboard'); }
    });

    viewport.addEventListener('pointerdown', (event) => {
        if (event.pointerType !== 'mouse') return;
        pointerStart = event.clientX;
        scrollStart = viewport.scrollLeft;
        viewport.setPointerCapture(event.pointerId);
        viewport.classList.add('is-dragging');
    });
    viewport.addEventListener('pointermove', (event) => {
        if (pointerStart === null) return;
        viewport.scrollLeft = scrollStart - (event.clientX - pointerStart);
    });
    viewport.addEventListener('pointerup', (event) => {
        if (pointerStart === null) return;
        viewport.releasePointerCapture(event.pointerId);
        pointerStart = null;
        viewport.classList.remove('is-dragging');
        syncFromScroll();
    });
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

    const footer = document.querySelector('[data-footer]');
    const mobileCta = document.querySelector('[data-mobile-cta]');
    if (footer && mobileCta) {
        new IntersectionObserver(([entry]) => mobileCta.classList.toggle('is-hidden', entry.isIntersecting), { threshold: 0.1 }).observe(footer);
    }
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
    setupObservers();
    setupActions();
    track('campaign_view');
}
