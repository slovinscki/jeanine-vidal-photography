import { createCampaign } from '../../../campaign/campaign-factory.js';

export const campaign = createCampaign({
    storeName: 'Gabriel Vidal',
    clientSlug: 'gabriel-vidal',
    tagline: 'Urban essentials.',
    heroSeries: 'mensStudio',
    looks: [
        { title: 'Studio', subtitle: 'Camisa / Jeans', series: 'mensStudio', textTitle: 'GV 01', textLine: 'Casual com presença.', tone: 'ink' },
        { title: 'Denim', subtitle: 'Jeans / Estrutura', series: 'denim', textTitle: 'BLUE EDIT', textLine: 'Feito para a cidade.', tone: 'blue' },
        { title: 'Graphite', subtitle: 'Neutros / Urbano', series: 'afterDark', textTitle: 'AFTER DARK', textLine: 'Tons de concreto.', tone: 'steel' },
        { title: 'Essential', subtitle: 'Camiseta / Casual', series: 'noir', textTitle: 'EVERYDAY', textLine: 'O básico, bem resolvido.', tone: 'night' },
        { title: 'Sand', subtitle: 'Camisa / Natural', series: 'volume', textTitle: 'NEW NEUTRAL', textLine: 'Textura e conforto.', tone: 'sand' },
        { title: 'Tailored', subtitle: 'Alfaiataria / Moderno', series: 'tailored', textTitle: 'SHARP LINE', textLine: 'Forma com intenção.', tone: 'stone' },
        { title: 'White', subtitle: 'Claro / Minimal', series: 'contour', textTitle: 'CLEAN CUT', textLine: 'Menos, com precisão.', tone: 'chalk' },
        { title: 'Field', subtitle: 'Verde / Utilitário', series: 'viridian', textTitle: 'UTILITY', textLine: 'Camadas para o cotidiano.', tone: 'steel' },
        { title: 'Signal', subtitle: 'Cor / Statement', series: 'rouge', textTitle: 'BOLD MOVE', textLine: 'Um ponto de cor.', tone: 'red' },
        { title: 'Last Light', subtitle: 'Urbano / Noite', series: 'finale', textTitle: 'GABRIEL VIDAL', textLine: 'A edição de setembro.', tone: 'sunset' }
    ]
});
