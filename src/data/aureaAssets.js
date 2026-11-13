const rootModules = import.meta.glob(
  '../assets/images/Projetos/Aurea/*.png',
  { eager: true, import: 'default' }
);

const folderModules = import.meta.glob(
  '../assets/images/Projetos/Aurea/*/*.png',
  { eager: true, import: 'default' }
);

function getVariantCaption(filename, ptLine, enLine) {
  const lower = filename.toLowerCase();
  if (lower.includes('medidas')) {
    return {
      pt: `${ptLine} — Medidas & Gabarito Técnico`,
      en: `${enLine} — Dimensions & Technical Spec`,
    };
  }
  if (lower.includes('creme') || lower.includes('off white')) {
    return {
      pt: `${ptLine} — Versão Creme / Off-White`,
      en: `${enLine} — Cream / Off-White Edition`,
    };
  }
  if (lower.includes('verde')) {
    return {
      pt: `${ptLine} — Versão Verde Botânico`,
      en: `${enLine} — Botanical Green Edition`,
    };
  }
  return {
    pt: `${ptLine} — Versão Transparente`,
    en: `${enLine} — Transparent Edition`,
  };
}

function getSortRank(filename) {
  const lower = filename.toLowerCase();
  if (lower.includes('creme') || lower.includes('off white')) return 0;
  if (lower.includes('verde')) return 1;
  if (lower.includes('medidas')) return 3;
  return 2;
}

export const aureaCaixa =
  rootModules['../assets/images/Projetos/Aurea/Caixa.png'] || null;

export function getAureaLineItems(folderName, ptLine, enLine) {
  const prefix = `../assets/images/Projetos/Aurea/${folderName}/`;
  return Object.entries(folderModules)
    .filter(([path]) => path.startsWith(prefix))
    .map(([path, image]) => {
      const filename = path.slice(prefix.length);
      return {
        image,
        rank: getSortRank(filename),
        caption: getVariantCaption(filename, ptLine, enLine),
      };
    })
    .sort((a, b) => a.rank - b.rank)
    .map(({ image, caption }) => ({ image, caption }));
}
