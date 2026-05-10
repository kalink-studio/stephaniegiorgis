import { Stack } from '@kalink-ui/seedly-react';
import { clsx } from 'clsx';

import { Center } from '@/components/center';
import type {
  PageLayoutRatio,
  PageLayoutSection,
  PageLayoutWidth,
} from '@/payload/runtime/types';

import { BlockRenderer } from './block-renderer';
import {
  layout,
  section,
  sectionContent,
  twoColumnLayout,
} from './page-layout-renderer.css';

const PAGE_SECTION_MAX_WIDTHS: Record<PageLayoutWidth, number | null> = {
  small: 720,
  medium: 960,
  large: 1280,
  full: null,
};

const PAGE_SECTION_GUTTERS_PX = 48;
const PAGE_SECTION_COLUMN_GAP_PX = 24;

const getSectionImageSizes = (width: PageLayoutWidth) => {
  const maxWidth = PAGE_SECTION_MAX_WIDTHS[width];

  if (!maxWidth) {
    return `calc(100vw - ${PAGE_SECTION_GUTTERS_PX}px)`;
  }

  return `(max-width: ${maxWidth + PAGE_SECTION_GUTTERS_PX}px) calc(100vw - ${PAGE_SECTION_GUTTERS_PX}px), ${maxWidth}px`;
};

const getColumnMaxWidth = (
  width: PageLayoutWidth,
  ratio: PageLayoutRatio,
  column: 'primary' | 'secondary',
) => {
  const maxWidth = PAGE_SECTION_MAX_WIDTHS[width];

  if (!maxWidth) {
    return column === 'primary'
      ? ratio === '2_3'
        ? '40vw'
        : ratio === '3_2'
          ? '60vw'
          : '50vw'
      : ratio === '2_3'
        ? '60vw'
        : ratio === '3_2'
          ? '40vw'
          : '50vw';
  }

  const availableWidth = maxWidth - PAGE_SECTION_COLUMN_GAP_PX;

  if (ratio === '1_1') {
    return `${Math.ceil(availableWidth / 2)}px`;
  }

  const columnShare =
    column === 'primary'
      ? ratio === '3_2'
        ? 3 / 5
        : 2 / 5
      : ratio === '3_2'
        ? 2 / 5
        : 3 / 5;

  return `${Math.ceil(availableWidth * columnShare)}px`;
};

const getColumnImageSizes = (
  width: PageLayoutWidth,
  ratio: PageLayoutRatio,
  column: 'primary' | 'secondary',
) => {
  const singleColumnSizes = getSectionImageSizes(width);
  const columnMaxWidth = getColumnMaxWidth(width, ratio, column);

  return `(max-width: 1023px) ${singleColumnSizes}, ${columnMaxWidth}`;
};

interface PageLayoutRendererProps {
  sections: PageLayoutSection[] | null | undefined;
  className?: string;
  centerSections?: boolean;
}

export function PageLayoutRenderer({
  sections,
  centerSections = true,
  className,
}: PageLayoutRendererProps) {
  if (!sections || sections.length === 0) {
    return null;
  }

  return (
    <Stack spacing={8} align="stretch" className={clsx(layout, className)}>
      {sections.map((sectionData, index) => (
        <PageLayoutSectionRenderer
          key={sectionData.id ?? index}
          sectionData={sectionData}
          centerSections={centerSections}
        />
      ))}
    </Stack>
  );
}

function PageLayoutSectionRenderer({
  centerSections,
  sectionData,
}: {
  centerSections: boolean;
  sectionData: PageLayoutSection;
}) {
  if (sectionData.columns === 'two') {
    const ratio = sectionData.ratio ?? '1_1';
    const width = sectionData.width ?? 'large';
    const content = (
      <div className={twoColumnLayout({ ratio })}>
        <div className={sectionContent}>
          <BlockRenderer
            blocks={sectionData.primaryBlocks}
            imageSizes={getColumnImageSizes(width, ratio, 'primary')}
          />
        </div>
        <div className={sectionContent}>
          <BlockRenderer
            blocks={sectionData.secondaryBlocks}
            imageSizes={getColumnImageSizes(width, ratio, 'secondary')}
          />
        </div>
      </div>
    );

    if (!centerSections) {
      return <div className={section}>{content}</div>;
    }

    return (
      <Center
        gutters={10}
        size={sectionData.width ?? 'large'}
        className={section}
      >
        {content}
      </Center>
    );
  }

  const content = (
    <div className={sectionContent}>
      <BlockRenderer
        blocks={sectionData.blocks}
        imageSizes={getSectionImageSizes(sectionData.width ?? 'large')}
      />
    </div>
  );

  if (!centerSections) {
    return <div className={section}>{content}</div>;
  }

  return (
    <Center
      gutters={10}
      size={sectionData.width ?? 'large'}
      className={section}
    >
      {content}
    </Center>
  );
}
