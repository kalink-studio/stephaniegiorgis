export const documentationGridLayouts = [
  { label: 'Image', value: 'Image' },
  { label: 'Grid 1/1', value: 'Grid 1/1' },
  { label: 'Grid 1/2', value: 'Grid 1/2' },
  { label: 'Grid 2/1', value: 'Grid 2/1' },
  { label: 'Grid 2/2', value: 'Grid 2/2' },
  { label: 'Grid 1/1/1', value: 'Grid 1/1/1' },
  { label: 'Grid 1/1/2', value: 'Grid 1/1/2' },
] as const;

export const documentationGridImageCountByLayout = {
  Image: 1,
  'Grid 1/1': 2,
  'Grid 1/2': 3,
  'Grid 2/1': 3,
  'Grid 2/2': 4,
  'Grid 1/1/1': 3,
  'Grid 1/1/2': 4,
} as const;

export type DocumentationGridLayout =
  keyof typeof documentationGridImageCountByLayout;

export interface DocumentationImageGridBlockData {
  blockType?: string;
  layout?: DocumentationGridLayout;
  items?: unknown[] | null;
}

export function isDocumentationGridLayout(
  value: unknown,
): value is DocumentationGridLayout {
  return (
    typeof value === 'string' && value in documentationGridImageCountByLayout
  );
}

export function getDocumentationGridImageCount(
  layout: DocumentationGridLayout,
): number {
  return documentationGridImageCountByLayout[layout];
}

export function normalizeDocumentationSections(sections: unknown): unknown {
  if (!Array.isArray(sections)) {
    return sections;
  }

  return sections.map((section) => {
    if (!section || typeof section !== 'object') {
      return section;
    }

    const nextSection = { ...section } as Record<string, unknown>;

    if (
      nextSection.blockType !== 'docGrid' ||
      !isDocumentationGridLayout(nextSection.layout)
    ) {
      return nextSection;
    }

    if (!Array.isArray(nextSection.items)) {
      return nextSection;
    }

    const imageCount = getDocumentationGridImageCount(nextSection.layout);
    nextSection.items = nextSection.items.slice(0, imageCount);

    return nextSection;
  });
}
