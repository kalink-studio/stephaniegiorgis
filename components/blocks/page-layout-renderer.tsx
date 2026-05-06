import { Stack } from '@kalink-ui/seedly-react';
import { clsx } from 'clsx';

import { Center } from '@/components/center';
import type { PageLayoutSection } from '@/payload/runtime/types';

import { BlockRenderer } from './block-renderer';
import {
  layout,
  section,
  sectionContent,
  twoColumnLayout,
} from './page-layout-renderer.css';

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
    const content = (
      <div className={twoColumnLayout({ ratio: sectionData.ratio ?? '1_1' })}>
        <div className={sectionContent}>
          <BlockRenderer blocks={sectionData.primaryBlocks} />
        </div>
        <div className={sectionContent}>
          <BlockRenderer blocks={sectionData.secondaryBlocks} />
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
      <BlockRenderer blocks={sectionData.blocks} />
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
