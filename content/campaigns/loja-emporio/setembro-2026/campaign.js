import { createCampaign } from '../../../campaign/campaign-factory.js';

export const campaign = createCampaign({
    storeName: 'Loja Empório',
    clientSlug: 'loja-emporio',
    tagline: 'Curadoria em cada detalhe.',
    heroSeries: 'boutique',
    looks: [
        { title: 'Galeria', subtitle: 'Boutique / Vestido', series: 'boutique', textTitle: 'EMPÓRIO EDIT', textLine: 'Uma curadoria de detalhes.', tone: 'stone' },
        { title: 'Jóia', subtitle: 'Acessórios / Presença', series: 'rouge', textTitle: 'DETAILS', textLine: 'O look está nos detalhes.', tone: 'crimson' },
        { title: 'Atelier', subtitle: 'Forma / Alfaiataria', series: 'tailored', textTitle: 'CURATED', textLine: 'Peças escolhidas a dedo.', tone: 'ink' },
        { title: 'Porcelana', subtitle: 'Claro / Elegante', series: 'contour', textTitle: 'WHITE ROOM', textLine: 'Leveza sofisticada.', tone: 'chalk' },
        { title: 'Cobalto', subtitle: 'Azul / Coleção', series: 'softBlue', textTitle: 'BLUE NOTE', textLine: 'Um novo clássico.', tone: 'blue' },
        { title: 'Veludo', subtitle: 'Noite / Textura', series: 'afterDark', textTitle: 'NIGHT EDIT', textLine: 'Texturas depois das seis.', tone: 'night' },
        { title: 'Oliva', subtitle: 'Verde / Boutique', series: 'viridian', textTitle: 'RARE GREEN', textLine: 'Cor em edição limitada.', tone: 'steel' },
        { title: 'Terracota', subtitle: 'Cor / Assinatura', series: 'finale', textTitle: 'THE PIECE', textLine: 'Uma peça, muitas leituras.', tone: 'sunset' },
        { title: 'Escultura', subtitle: 'Volume / Editorial', series: 'volume', textTitle: 'NEW SHAPE', textLine: 'Silhuetas em foco.', tone: 'sand' },
        { title: 'Finale', subtitle: 'Preto / Essencial', series: 'noir', textTitle: 'LOJA EMPÓRIO', textLine: 'Setembro, em curadoria.', tone: 'red' }
    ]
});
