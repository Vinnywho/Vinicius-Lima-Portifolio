const globModules = import.meta.glob(
  '../assets/images/Projetos/NucleoTech/*/*.png',
  { eager: true, import: 'default' }
);

function getSlideOrder(filename) {
  // Padrão Figma: "Nome.png" (0) seguido de "Nome-1.png", "Nome-2.png"...
  const dashMatch = filename.match(/-(\d+)\.png$/i);
  if (dashMatch) {
    return [1, Number(dashMatch[1])];
  }

  // Padrão numerado direto: "Nome 01.png" ou "Nome.png" (sem número = capa -> -1)
  const spaceNumMatch = filename.match(/\s(\d+)\.png$/i);
  if (spaceNumMatch) {
    return [0, Number(spaceNumMatch[1])];
  }

  return [0, -1];
}

function getFolderSlides(folderName) {
  const prefix = `../assets/images/Projetos/NucleoTech/${folderName}/`;
  return Object.entries(globModules)
    .filter(([path]) => path.startsWith(prefix))
    .map(([path, url]) => {
      const filename = path.slice(prefix.length);
      return { filename, url, order: getSlideOrder(filename) };
    })
    .sort((a, b) => {
      if (a.order[0] !== b.order[0]) return a.order[0] - b.order[0];
      if (a.order[1] !== b.order[1]) return a.order[1] - b.order[1];
      return a.filename.localeCompare(b.filename);
    })
    .map((item) => item.url);
}

export function buildSlides(folderName, ptPrefix, enPrefix) {
  return getFolderSlides(folderName).map((image, idx) => ({
    image,
    caption: {
      pt: `${ptPrefix} - Slide ${String(idx + 1).padStart(2, '0')}`,
      en: `${enPrefix} - Slide ${String(idx + 1).padStart(2, '0')}`,
    },
  }));
}

export function getSinglePost(folderName) {
  return getFolderSlides(folderName)[0] || null;
}
