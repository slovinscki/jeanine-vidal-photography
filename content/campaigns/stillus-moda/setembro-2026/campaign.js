import { createCampaign } from '../../../campaign/campaign-factory.js';

export const campaign = createCampaign({
    storeName: 'Stillus Moda',
    clientSlug: 'stillus-moda',
    tagline: 'Seu estilo, todos os dias.',
    heroSeries: 'denim',
    looks: [
        { title: 'Dia a dia', subtitle: 'Casual / Contemporâneo', series: 'denim', textTitle: 'TODO DIA', textLine: 'Combinações que funcionam.', tone: 'blue' },
        { title: 'Leve', subtitle: 'Claro / Conforto', series: 'softBlue', textTitle: 'SOFT WEAR', textLine: 'Leve do começo ao fim.', tone: 'chalk' },
        { title: 'Preto', subtitle: 'Essencial / Urbano', series: 'noir', textTitle: 'BLACK EDIT', textLine: 'Sempre atual.', tone: 'ink' },
        { title: 'Viva', subtitle: 'Cor / Casual', series: 'rouge', textTitle: 'COR PRESENTE', textLine: 'Um look que ilumina.', tone: 'red' },
        { title: 'Natural', subtitle: 'Neutros / Fácil', series: 'volume', textTitle: 'NATURAL', textLine: 'Conforto com forma.', tone: 'sand' },
        { title: 'Movimento', subtitle: 'Feminino / Leve', series: 'contour', textTitle: 'EM MOVIMENTO', textLine: 'Para acompanhar sua rotina.', tone: 'crimson' },
        { title: 'Cidade', subtitle: 'Alfaiataria / Casual', series: 'tailored', textTitle: 'CITY LOOK', textLine: 'Do trabalho ao encontro.', tone: 'stone' },
        { title: 'Verde', subtitle: 'Casual / Cor', series: 'viridian', textTitle: 'GREEN DAY', textLine: 'Fácil de combinar.', tone: 'steel' },
        { title: 'Noite', subtitle: 'Escuro / Versátil', series: 'afterDark', textTitle: 'AFTER SIX', textLine: 'Pronto para sair.', tone: 'night' },
        { title: 'Fim de tarde', subtitle: 'Leve / Comercial', series: 'finale', textTitle: 'STILLUS MODA', textLine: 'A seleção de setembro.', tone: 'sunset' }
    ]
});
