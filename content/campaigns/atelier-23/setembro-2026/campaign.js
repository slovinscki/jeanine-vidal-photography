const imageUrl = (id, width) =>
    `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`;

const positions = [
    '50% 50%', '50% 34%', '35% 50%', '65% 50%', '50% 70%',
    '42% 42%', '58% 42%', '50% 22%', '50% 82%', '50% 50%'
];

const makeImages = (photoIds, lookNumber, description) => Array.from({ length: 10 }, (_, index) => {
    const photoId = photoIds[index % photoIds.length];
    return {
        src: imageUrl(photoId, 1200),
        srcset: `${imageUrl(photoId, 720)} 720w, ${imageUrl(photoId, 1200)} 1200w, ${imageUrl(photoId, 1600)} 1600w`,
        alt: `${description}, fotografia ${index + 1} do Look ${String(lookNumber).padStart(2, '0')}`,
        position: positions[index],
        sourceUrl: `https://www.pexels.com/photo/${photoId}/`
    };
});

const look = (id, title, subtitle, photoIds, textTitle, textLine, tone) => ({
    id,
    title,
    subtitle,
    tone,
    images: makeImages(photoIds, id, subtitle),
    textSlide: { slide: 2, title: textTitle, line: textLine },
    whatsappMessage: `Olá! Vi o Look ${String(id).padStart(2, '0')} da campanha Setembro da Atelier 23 e gostaria de saber mais.`
});

export const campaign = {
    clientName: 'ATELIER 23',
    clientSlug: 'atelier-23',
    campaignName: 'SETEMBRO 2026',
    campaignSlug: 'setembro-2026',
    month: 'Setembro',
    year: 2026,
    logo: null,
    tagline: 'New season. New pieces.',
    description: 'Conheça a campanha Setembro 2026 da Atelier 23.',
    canonicalUrl: 'https://centrofotos.com.br/content/atelier-23/setembro-2026/',
    heroImage: imageUrl(13364875, 1600),
    ogImage: imageUrl(13364875, 1600),
    whatsappNumber: '5555999948585',
    whatsappMessage: 'Vi a campanha Setembro da Atelier 23 e gostaria de saber mais.',
    instagram: 'https://www.instagram.com/centrofotosagudo/',
    stockCredit: 'Fotografias demonstrativas: Pexels',
    looks: [
        look(1, 'Volume', 'Studio / Form', [15130135,15130136,15130137,15130138,15130139,15130140,15130141,15130142,15130143,15130144], 'NEW DROP', 'Shape, colour, presence.', 'sand'),
        look(2, 'Noir', 'Black / Essential', [19809156,19809157,19809158,19809159,19809160,19809161,19809162,19809163,19809164,19809165], 'ESSENTIALS', 'Black, redefined.', 'ink'),
        look(3, 'Denim', 'Denim / Blue', [6770010,6770011,6770012,6770013,6770014,6770015,6770017,6770018,6770021,6770022], 'DENIM 02', 'Everyday structure.', 'blue'),
        look(4, 'Rouge', 'Red / Statement', [15130145,15130146,15130148,15130150,15130153,15130154,15130155,15130156,15130157,15130158], 'LOOK 04', 'A study in red.', 'red'),
        look(5, 'Soft blue', 'Denim / Silhouette', [26011840,26011841,26011842,26011843,26011844,26011845,26011846,26011847,26011848,26011849], 'SETTEMBRE', 'Soft lines, new season.', 'chalk'),
        look(6, 'After dark', 'Black / Evening', [19809166,19809167,19809168,19809169,19809170,19809171,19809172,20548707,20548708,20548710], 'AVAILABLE NOW', 'Night shapes.', 'night'),
        look(7, 'Contour', 'Black / Movement', [20548695,20548696,20548697,20548698,20548699,20548700,20548703,20548704,20548705,20548706], 'DROP 01', 'Lines in motion.', 'crimson'),
        look(8, 'Raw blue', 'Denim / Volume', [6770023,6770024,6770025,6770026,6770027,6770028,6770029,6770030,6770031,6770032], 'NEW SEASON', 'Blue on blue.', 'steel'),
        look(9, 'Tailored', 'Blue / Form', [26011850,26011851,26011852,26011853,26011854,26011855,26011856,26011857,26011858,26011859], 'ATELIER 23', 'Cut with intention.', 'stone'),
        look(10, 'Finale', 'Denim / Editorial', [6770033,6770034,6770035,6770036,6770037,6770038,6770039,6770040,6770041,6770036], 'THE EDIT', 'September, selected.', 'sunset')
    ]
};
