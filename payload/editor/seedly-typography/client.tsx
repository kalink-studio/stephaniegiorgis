'use client';

import { $isHeadingNode } from '@lexical/rich-text';
import { createClientFeature } from '@payloadcms/richtext-lexical/client';
import {
  $getSelection,
  $getState,
  $isParagraphNode,
  $isRangeSelection,
  $setState,
  createState,
  type LexicalEditor,
  type LexicalNode,
  type ParagraphNode,
} from 'lexical';

import {
  defaultHeadingTypography,
  defaultParagraphTypography,
  isSeedlyTypographySize,
  isSeedlyTypographyVariant,
  seedlySizeStateKey,
  seedlyTypographySizes,
  seedlyTypographyVariants,
  seedlyVariantStateKey,
  type SeedlyTypographySize,
  type SeedlyTypographyVariant,
} from './shared';

import type { HeadingNode } from '@lexical/rich-text';
import type { ToolbarGroup } from '@payloadcms/richtext-lexical';
import type { FC, ReactNode } from 'react';

const seedlyVariantState = createState(seedlyVariantStateKey, {
  parse: (value): SeedlyTypographyVariant | undefined => {
    return isSeedlyTypographyVariant(value) ? value : undefined;
  },
});

const seedlySizeState = createState(seedlySizeStateKey, {
  parse: (value): SeedlyTypographySize | undefined => {
    return isSeedlyTypographySize(value) ? value : undefined;
  },
});

type TypographyBlockNode = HeadingNode | ParagraphNode;

function ToolbarIcon({ children }: { children: ReactNode }) {
  return (
    <>
      <style>
        {`.toolbar-popup__dropdown-item .seedly-toolbar-current { display: none; }
        .toolbar-popup__dropdown-seedlyTypographyVariant .toolbar-popup__dropdown-label,
        .toolbar-popup__dropdown-seedlyTypographySize .toolbar-popup__dropdown-label { display: none; }`}
      </style>
      <span
        aria-hidden="true"
        className="seedly-toolbar-current"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          fontSize: '0.75rem',
          lineHeight: 1,
          opacity: 0.8,
          whiteSpace: 'nowrap',
        }}
      >
        {children}
      </span>
    </>
  );
}

function createToolbarValue(text: string): FC {
  return function ToolbarValue() {
    return <ToolbarIcon>{text}</ToolbarIcon>;
  };
}

const variantAbbreviations: Record<SeedlyTypographyVariant, string> = {
  display: 'D',
  headline: 'H',
  title: 'T',
  body: 'B',
  label: 'L',
};

const sizeAbbreviations: Record<SeedlyTypographySize, string> = {
  large: 'lg',
  medium: 'md',
  small: 'sm',
};

function VariantIcon() {
  return <ToolbarIcon>Var</ToolbarIcon>;
}

function SizeIcon() {
  return <ToolbarIcon>Size</ToolbarIcon>;
}

function getTypographyBlockNode(
  node: LexicalNode | null,
): TypographyBlockNode | null {
  let current = node;

  while (current) {
    if ($isParagraphNode(current) || $isHeadingNode(current)) {
      return current;
    }

    current = current.getParent();
  }

  return null;
}

function getSelectedTypographyBlocks(): TypographyBlockNode[] {
  const selection = $getSelection();

  if (!$isRangeSelection(selection)) {
    return [];
  }

  const uniqueBlocks = new Map<string, TypographyBlockNode>();

  for (const node of selection.getNodes()) {
    const block = getTypographyBlockNode(node);

    if (!block) {
      continue;
    }

    uniqueBlocks.set(block.getKey(), block);
  }

  return [...uniqueBlocks.values()];
}

function isHeadingBlock(node: TypographyBlockNode): node is HeadingNode {
  return $isHeadingNode(node);
}

function getDefaultVariant(node: TypographyBlockNode): SeedlyTypographyVariant {
  if (isHeadingBlock(node)) {
    return defaultHeadingTypography[node.getTag()].variant;
  }

  return defaultParagraphTypography.variant;
}

function getDefaultSize(node: TypographyBlockNode): SeedlyTypographySize {
  if (isHeadingBlock(node)) {
    return defaultHeadingTypography[node.getTag()].size;
  }

  return defaultParagraphTypography.size;
}

function getEffectiveVariant(
  node: TypographyBlockNode,
): SeedlyTypographyVariant {
  return $getState(node, seedlyVariantState) ?? getDefaultVariant(node);
}

function getEffectiveSize(node: TypographyBlockNode): SeedlyTypographySize {
  return $getState(node, seedlySizeState) ?? getDefaultSize(node);
}

function applyVariant(value: SeedlyTypographyVariant) {
  for (const block of getSelectedTypographyBlocks()) {
    const defaultValue = getDefaultVariant(block);

    $setState(
      block,
      seedlyVariantState,
      value === defaultValue ? undefined : value,
    );
  }
}

function applySize(value: SeedlyTypographySize) {
  for (const block of getSelectedTypographyBlocks()) {
    const defaultValue = getDefaultSize(block);

    $setState(
      block,
      seedlySizeState,
      value === defaultValue ? undefined : value,
    );
  }
}

function hasTypographySelection(): boolean {
  return getSelectedTypographyBlocks().length > 0;
}

function onSelectVariant(
  editor: LexicalEditor,
  variant: SeedlyTypographyVariant,
) {
  editor.update(() => {
    applyVariant(variant);
  });
}

function onSelectSize(editor: LexicalEditor, size: SeedlyTypographySize) {
  editor.update(() => {
    applySize(size);
  });
}

const typographyToolbarGroups: ToolbarGroup[] = [
  {
    type: 'dropdown',
    key: 'seedlyTypographyVariant',
    order: 26,
    ChildComponent: VariantIcon,
    isEnabled: () => hasTypographySelection(),
    items: seedlyTypographyVariants.map((variant, index) => ({
      key: variant,
      order: index + 1,
      ChildComponent: createToolbarValue(variantAbbreviations[variant]),
      label: `${variant.charAt(0).toUpperCase()}${variant.slice(1)}`,
      isActive: () => {
        const blocks = getSelectedTypographyBlocks();

        return (
          blocks.length > 0 &&
          blocks.every((block) => getEffectiveVariant(block) === variant)
        );
      },
      isEnabled: () => hasTypographySelection(),
      onSelect: ({ editor }) => {
        onSelectVariant(editor, variant);
      },
    })),
  },
  {
    type: 'dropdown',
    key: 'seedlyTypographySize',
    order: 27,
    ChildComponent: SizeIcon,
    isEnabled: () => hasTypographySelection(),
    items: seedlyTypographySizes.map((size, index) => ({
      key: size,
      order: index + 1,
      ChildComponent: createToolbarValue(sizeAbbreviations[size]),
      label: `${size.charAt(0).toUpperCase()}${size.slice(1)}`,
      isActive: () => {
        const blocks = getSelectedTypographyBlocks();

        return (
          blocks.length > 0 &&
          blocks.every((block) => getEffectiveSize(block) === size)
        );
      },
      isEnabled: () => hasTypographySelection(),
      onSelect: ({ editor }) => {
        onSelectSize(editor, size);
      },
    })),
  },
];

export const SeedlyTypographyFeatureClient = createClientFeature({
  toolbarFixed: {
    groups: typographyToolbarGroups,
  },
  toolbarInline: {
    groups: typographyToolbarGroups,
  },
});
