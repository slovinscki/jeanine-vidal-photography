import { createCampaign } from '../../../campaign/campaign-factory.js';

export const campaign = createCampaign({
    storeName: 'Bruna Moda',
    clientSlug: 'bruna-moda',
    tagline: 'Leve, atual, seu.',
    heroSeries: 'softBlue',
    looks: [
        { title: 'Linho', subtitle: 'Natural / Contemporâneo', series: 'softBlue', textTitle: 'NEW LIGHT', textLine: 'Leveza para todos os dias.', tone: 'chalk' },
        { title: 'Noir', subtitle: 'Preto / Essencial', series: 'noir', textTitle: 'ESSENCIAL', textLine: 'O preto em nova forma.', tone: 'ink' },
        { title: 'Denim', subtitle: 'Jeans / Casual', series: 'denim', textTitle: 'DENIM DAYS', textLine: 'Fácil de vestir.', tone: 'blue' },
        { title: 'Flora', subtitle: 'Vestido / Movimento', series: 'rouge', textTitle: 'EM FLOR', textLine: 'Cor que acompanha.', tone: 'red' },
        { title: 'Areia', subtitle: 'Conjunto / Neutros', series: 'volume', textTitle: 'SOFT FORM', textLine: 'Texturas e proporções.', tone: 'sand' },
        { title: 'Aura', subtitle: 'Claro / Feminino', series: 'contour', textTitle: 'LUZ NATURAL', textLine: 'Uma coleção leve.', tone: 'crimson' },
        { title: 'Verde', subtitle: 'Cor / Urbano', series: 'viridian', textTitle: 'NOVO TOM', textLine: 'Presença sem esforço.', tone: 'steel' },
        { title: 'Boutique', subtitle: 'Vestido / Detalhes', series: 'boutique', textTitle: 'THE DRESS', textLine: 'Detalhes que transformam.', tone: 'stone' },
        { title: 'Forma', subtitle: 'Alfaiataria / Leve', series: 'tailored', textTitle: 'CITY EDIT', textLine: 'Linhas contemporâneas.', tone: 'night' },
        { title: 'Poente', subtitle: 'Casual / Cor', series: 'finale', textTitle: 'BRUNA MODA', textLine: 'Setembro, selecionado.', tone: 'sunset' }
    ]
});
