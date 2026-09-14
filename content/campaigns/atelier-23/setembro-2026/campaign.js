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
    category: 'fashion',
    title,
    subtitle,
    tone,
    availableSizes: ['PP', 'M', 'G', 'GG'],
    images: makeImages(photoIds, id, subtitle),
    textSlide: { slide: 2, title: textTitle, line: textLine },
    downloadUrl: `/content/campaigns/atelier-23/setembro-2026/downloads/atelier-23-setembro-2026-look-${String(id).padStart(2, '0')}.zip`,
    downloadFileName: `atelier-23-setembro-2026-look-${String(id).padStart(2, '0')}.zip`,
    whatsappMessage: `Olá! Vi o Look ${String(id).padStart(2, '0')} da campanha Setembro da Atelier 23 e gostaria de saber mais.`
});

export const campaign = {
    storeName: 'Atelier 23',
    clientName: 'ATELIER 23',
    clientSlug: 'atelier-23',
    campaignName: 'COLEÇÃO SETEMBRO 2026',
    collectionName: 'Coleção Setembro 2026',
    campaignSlug: 'setembro-2026',
    assetVersion: '20260914-3',
    month: 'Setembro',
    year: 2026,
    logo: null,
    tagline: 'New season. New pieces.',
    description: 'Conheça a Coleção Setembro 2026 da Atelier 23.',
    canonicalUrl: 'https://centrofotos.com.br/content/atelier-23/setembro-2026/',
    heroImage: imageUrl(13364875, 1600),
    ogImage: imageUrl(13364875, 1600),
    whatsappNumber: '5555999948585',
    whatsappMessage: 'Olá! Vi a Coleção Setembro 2026 da Atelier 23 e gostaria de saber mais.',
    instagram: null,
    stockCredit: 'Fotografias demonstrativas: Pexels',
    looks: [
        look(1, 'Volume', 'Lounge / Form', [19219729,19219730,19219731,19219732,19219733,19219734,19219735,19219736,19219737,19219738], 'NEW DROP', 'Shape, colour, presence.', 'sand'),
        look(2, 'Noir', 'Black / Essential', [14622900,14622901,14622902,14622903,14622904,14622905,14622900,14622902,14622904,14622905], 'ESSENTIALS', 'Black, redefined.', 'ink'),
        look(3, 'Denim', 'Denim / Blue', [26011843,26011844,26011845,26011846,26011847,26011848,26011849,26011850,26011851,26011852], 'DENIM 02', 'Everyday structure.', 'blue'),
        look(4, 'Rouge', 'Colour / Statement', [13364867,13364868,13364869,13364870,13364871,13364872,13364873,13364874,13364875,13364876], 'LOOK 04', 'A study in colour.', 'red'),
        look(5, 'Soft blue', 'Denim / Collection', [6770024,6770025,6770026,6770027,6770028,6770029,6770030,6770031,6770032,6770033], 'SETTEMBRE', 'Soft lines, new season.', 'chalk'),
        look(6, 'After dark', 'Black / Evening', [31321347,31321348,31321349,31321350,31321351,31321352,31321353,31321354,14622911,14622913], 'AVAILABLE NOW', 'Night shapes.', 'night'),
        look(7, 'Contour', 'White / Movement', [6962099,6962100,6962101,6962102,6962103,6962104,6962105,6962106,6962107,6962108], 'DROP 01', 'Lines in motion.', 'crimson'),
        look(8, 'Viridian', 'Green / Graphic', [14622906,14622907,14622908,14622909,14622910,14622906,14622907,14622908,14622909,14622910], 'NEW SEASON', 'Green in focus.', 'steel'),
        look(9, 'Tailored', 'Boutique / Form', [15761450,15761451,15761452,15761453,15761454,15761455,15761456,15761457,15761458,15761459], 'ATELIER 23', 'Cut with intention.', 'stone'),
        look(10, 'Finale', 'Green / Editorial', [31321357,31321358,31321359,31321360,31321361,31321362,31321363,31321364,31321365,31321366], 'THE EDIT', 'September, selected.', 'sunset')
    ]
};
