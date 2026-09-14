const imageUrl = (id, width) =>
    `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`;

const positions = [
    '50% 50%', '50% 34%', '35% 50%', '65% 50%', '50% 70%',
    '42% 42%', '58% 42%', '50% 22%', '50% 82%', '50% 50%'
];

export const photoSeries = Object.freeze({
    volume: [19219729, 19219730, 19219731, 19219732, 19219733, 19219734, 19219735, 19219736, 19219737, 19219738],
    noir: [14622900, 14622901, 14622902, 14622903, 14622904, 14622905, 14622900, 14622902, 14622904, 14622905],
    denim: [26011843, 26011844, 26011845, 26011846, 26011847, 26011848, 26011849, 26011850, 26011851, 26011852],
    rouge: [13364867, 13364868, 13364869, 13364870, 13364871, 13364872, 13364873, 13364874, 13364875, 13364876],
    softBlue: [6770024, 6770025, 6770026, 6770027, 6770028, 6770029, 6770030, 6770031, 6770032, 6770033],
    afterDark: [31321347, 31321348, 31321349, 31321350, 31321351, 31321352, 31321353, 31321354, 14622911, 14622913],
    contour: [6962099, 6962100, 6962101, 6962102, 6962103, 6962104, 6962105, 6962106, 6962107, 6962108],
    viridian: [14622906, 14622907, 14622908, 14622909, 14622910, 14622906, 14622907, 14622908, 14622909, 14622910],
    tailored: [15761450, 15761451, 15761452, 15761453, 15761454, 15761455, 15761456, 15761457, 15761458, 15761459],
    finale: [31321357, 31321358, 31321359, 31321360, 31321361, 31321362, 31321363, 31321364, 31321365, 31321366],
    mensStudio: [4971017, 4971269, 4971136, 4971258, 4971158, 4971148, 4971149, 4971237, 4971257, 4971361],
    boutique: [8989492, 8989484, 8989482, 8989496, 8989495, 8989494, 8989489, 8989493, 8989491, 8989488]
});

const makeImages = (photoIds, lookNumber, description) => photoIds.map((photoId, index) => ({
    src: imageUrl(photoId, 1200),
    srcset: `${imageUrl(photoId, 720)} 720w, ${imageUrl(photoId, 1200)} 1200w, ${imageUrl(photoId, 1600)} 1600w`,
    alt: `${description}, fotografia ${index + 1} do Look ${String(lookNumber).padStart(2, '0')}`,
    position: positions[index],
    sourceUrl: `https://www.pexels.com/photo/${photoId}/`
}));

export const createCampaign = ({ storeName, clientSlug, tagline, heroSeries, looks }) => {
    const campaignName = 'COLEÇÃO SETEMBRO 2026';
    const collectionName = 'Coleção Setembro 2026';
    const heroId = photoSeries[heroSeries][0];

    return {
        storeName,
        clientName: storeName.toLocaleUpperCase('pt-BR'),
        clientSlug,
        campaignName,
        collectionName,
        campaignSlug: 'setembro-2026',
        assetVersion: '20260914-4',
        month: 'Setembro',
        year: 2026,
        logo: null,
        tagline,
        description: `Conheça a ${collectionName} da ${storeName}.`,
        seoTitle: `${storeName} | ${collectionName}`,
        canonicalUrl: `https://centrofotos.com.br/content/${clientSlug}/setembro-2026/`,
        heroImage: imageUrl(heroId, 1600),
        ogImage: imageUrl(heroId, 1600),
        whatsappNumber: null,
        whatsappMessage: `Olá! Vi a ${collectionName} da ${storeName} e gostaria de saber mais.`,
        instagram: null,
        stockCredit: 'Fotografias demonstrativas: Pexels',
        looks: looks.map(({ title, subtitle, series, textTitle, textLine, tone }, index) => {
            const id = index + 1;
            return {
                id,
                category: 'fashion',
                title,
                subtitle,
                tone,
                availableSizes: ['PP', 'M', 'G', 'GG'],
                images: makeImages(photoSeries[series], id, subtitle),
                textSlide: { slide: 2, title: textTitle, line: textLine }
            };
        })
    };
};
