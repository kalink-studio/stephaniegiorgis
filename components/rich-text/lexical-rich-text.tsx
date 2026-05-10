import { Stack, Text } from '@kalink-ui/seedly-react';
import Image from 'next/image';
import { Fragment } from 'react';

import {
  defaultHeadingTypography,
  defaultParagraphTypography,
  isSeedlyTypographySize,
  isSeedlyTypographyVariant,
  type SeedlyTypographySize,
  type SeedlyTypographyVariant,
} from '@/payload/editor/seedly-typography/shared';
import { resolveDocumentUrl } from '@/payload/runtime/helpers';
import type {
  ArtworkDocument,
  LexicalNode,
  LexicalRoot,
  PageDocument,
} from '@/payload/runtime/types';

import { blockquote, richText as richTextStyle } from './rich-text.css';

import type { ReactElement, ReactNode } from 'react';

/* ------------------------------------------------------------------ */
/*  Lexical text‑format bitmasks (inlined to avoid Payload import)     */
/* ------------------------------------------------------------------ */

const IS_BOLD = 1;
const IS_ITALIC = 1 << 1;
const IS_STRIKETHROUGH = 1 << 2;
const IS_UNDERLINE = 1 << 3;
const IS_CODE = 1 << 4;
const IS_SUBSCRIPT = 1 << 5;
const IS_SUPERSCRIPT = 1 << 6;

/* ------------------------------------------------------------------ */
/*  French punctuation thin‑space helpers                              */
/* ------------------------------------------------------------------ */

const replaceMap: Record<string, string> = {
  '« ': '«\u202F',
  ' »': '\u202F»',
  ' :': '\u202F:',
  ' ;': '\u202F;',
  ' !': '\u202F!',
  ' ?': '\u202F?',
};

function applyFrenchSpacing(text: string): string {
  let result = text;

  for (const [key, value] of Object.entries(replaceMap)) {
    result = result.replaceAll(key, value);
  }

  return result;
}

/* ------------------------------------------------------------------ */
/*  Seedly typography resolution                                       */
/* ------------------------------------------------------------------ */

function getNodeTypography(node: LexicalNode): {
  size: SeedlyTypographySize;
  variant: SeedlyTypographyVariant;
} {
  const state = node.$;
  const variant = isSeedlyTypographyVariant(state?.seedlyVariant)
    ? state.seedlyVariant
    : null;
  const size = isSeedlyTypographySize(state?.seedlySize)
    ? state.seedlySize
    : null;

  if (node.type === 'heading') {
    const tag = node.tag;
    const defaults =
      tag && tag in defaultHeadingTypography
        ? defaultHeadingTypography[tag as keyof typeof defaultHeadingTypography]
        : defaultHeadingTypography.h2;

    return {
      variant: variant ?? defaults.variant,
      size: size ?? defaults.size,
    };
  }

  return {
    variant: variant ?? defaultParagraphTypography.variant,
    size: size ?? defaultParagraphTypography.size,
  };
}

/* ------------------------------------------------------------------ */
/*  Lexical block‑level alignment                                      */
/* ------------------------------------------------------------------ */

type TextAlign = 'start' | 'center' | 'end' | 'justify';

/**
 * Map a Lexical block node `format` value to a CSS text‑align keyword
 * compatible with the Seedly `Text` `align` prop.
 *
 * Payload stores alignment as `"left"`, `"center"`, `"right"`, `"justify"`,
 * `"start"`, or `"end"` on block‑level nodes (paragraph, heading, quote).
 */
function getBlockAlignment(format: unknown): TextAlign | undefined {
  switch (format) {
    case 'left':
    case 'start':
      return 'start';
    case 'center':
      return 'center';
    case 'right':
    case 'end':
      return 'end';
    case 'justify':
      return 'justify';
    default:
      return undefined;
  }
}

/* ------------------------------------------------------------------ */
/*  Legacy Prismic‑compat helpers                                      */
/* ------------------------------------------------------------------ */

function getLegacyCustomClass(node: LexicalNode): string | null {
  return typeof node.customClass === 'string' ? node.customClass : null;
}

/* ------------------------------------------------------------------ */
/*  Internal‑doc URL resolution                                        */
/* ------------------------------------------------------------------ */

function resolveInternalDocumentHref(
  relationTo: unknown,
  value: unknown,
): string | null {
  if (
    (relationTo !== 'pages' && relationTo !== 'artworks') ||
    typeof value !== 'object' ||
    value === null ||
    !('slug' in value) ||
    typeof value.slug !== 'string'
  ) {
    return null;
  }

  return resolveDocumentUrl(
    value as PageDocument | ArtworkDocument,
    relationTo as 'pages' | 'artworks',
  );
}

function resolveRelationshipLabel(node: LexicalNode): string {
  const value = node.value;

  if (
    typeof value === 'object' &&
    value !== null &&
    'title' in value &&
    typeof value.title === 'string'
  ) {
    return value.title;
  }

  if (
    typeof value === 'object' &&
    value !== null &&
    'slug' in value &&
    typeof value.slug === 'string'
  ) {
    return value.slug;
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return String(value);
  }

  return 'Related document';
}

/* ------------------------------------------------------------------ */
/*  Heading element helper (explicit switch, never createElement(tag)) */
/* ------------------------------------------------------------------ */

function headingTagElement(tag: unknown): ReactElement {
  switch (tag) {
    case 'h1':
      return <h1 />;
    case 'h2':
      return <h2 />;
    case 'h3':
      return <h3 />;
    case 'h4':
      return <h4 />;
    case 'h5':
      return <h5 />;
    case 'h6':
      return <h6 />;
    default:
      return <h2 />;
  }
}

/* ------------------------------------------------------------------ */
/*  Recursive renderer                                                 */
/* ------------------------------------------------------------------ */

/**
 * Render children of a block‑level node, falling back to `<br />` for
 * empty blocks so they still take up visual space.
 */
function renderBlockChildren(nodes: LexicalNode[] | undefined): ReactNode {
  const children = renderNodes(nodes);

  if (Array.isArray(children) && children.length === 0) {
    return <br />;
  }

  return children;
}

/**
 * Render an array of Lexical nodes.
 */
function renderNodes(nodes: LexicalNode[] | undefined): ReactNode[] {
  if (!nodes || nodes.length === 0) {
    return [];
  }

  return nodes.map((node, index) => renderNode(node, index));
}

/**
 * Render a single Lexical JSON node. Uses an explicit switch on `node.type`
 * and never passes an untrusted `node.tag` directly to `createElement`.
 */
function renderNode(node: LexicalNode, key: number): ReactNode {
  switch (node.type) {
    /* ---- Paragraph ---- */
    case 'paragraph': {
      const children = renderBlockChildren(node.children);
      const legacyCustomClass = getLegacyCustomClass(node);

      // Legacy Prismic: quote style
      if (legacyCustomClass === 'quote') {
        return (
          <Text
            key={key}
            render={<blockquote />}
            variant="body"
            size="medium"
            className={blockquote}
          >
            {children}
          </Text>
        );
      }

      // Legacy Prismic: legend is dropped
      if (legacyCustomClass === 'legend') {
        return null;
      }

      const typography = getNodeTypography(node);
      const align =
        getBlockAlignment(node.format) ??
        (legacyCustomClass === 'align-end' ? 'end' : undefined);

      return (
        <Text
          key={key}
          render={<p />}
          variant={typography.variant}
          size={typography.size}
          align={align}
        >
          {children}
        </Text>
      );
    }

    /* ---- Heading ---- */
    case 'heading': {
      const children = renderBlockChildren(node.children);
      const typography = getNodeTypography(node);

      return (
        <Text
          key={key}
          render={headingTagElement(node.tag)}
          variant={typography.variant}
          size={typography.size}
          align={getBlockAlignment(node.format)}
        >
          {children}
        </Text>
      );
    }

    /* ---- Blockquote / quote ---- */
    case 'quote': {
      const children = renderBlockChildren(node.children);

      return (
        <Text
          key={key}
          render={<blockquote />}
          variant="body"
          size="medium"
          className={blockquote}
          align={getBlockAlignment(node.format)}
        >
          {children}
        </Text>
      );
    }

    /* ---- Lists ---- */
    case 'list': {
      const children = renderNodes(node.children);
      const listType = node.listType;
      const className =
        typeof listType === 'string' ? `list-${listType}` : undefined;

      if (node.tag === 'ol') {
        return (
          <ol key={key} className={className}>
            {children}
          </ol>
        );
      }

      return (
        <ul key={key} className={className}>
          {children}
        </ul>
      );
    }

    /* ---- List item ---- */
    case 'listitem': {
      const children = renderNodes(node.children);

      // Check‑list items: Lexical stores `checked` on the node
      if (node.checked === true || node.checked === false) {
        return (
          <li
            key={key}
            role="checkbox"
            aria-checked={node.checked}
            tabIndex={-1}
            className={
              node.checked ? 'list-item-checked' : 'list-item-unchecked'
            }
          >
            {children}
          </li>
        );
      }

      // Nested lists: Lexical wraps sub‑lists inside a listitem with a
      // single child that is itself a list node.
      return <li key={key}>{children}</li>;
    }

    /* ---- Text ---- */
    case 'text': {
      const legacyCustomClass = getLegacyCustomClass(node);
      const format = typeof node.format === 'number' ? node.format : 0;
      let content: ReactNode = applyFrenchSpacing(node.text ?? '');

      // Legacy Prismic: codespan or Lexical code format
      if (legacyCustomClass === 'codespan' || format & IS_CODE) {
        return <code key={key}>{content}</code>;
      }

      if (format & IS_BOLD) {
        content = <strong>{content}</strong>;
      }

      if (format & IS_ITALIC) {
        content = <em>{content}</em>;
      }

      if (format & IS_STRIKETHROUGH) {
        content = (
          <span style={{ textDecoration: 'line-through' }}>{content}</span>
        );
      }

      if (format & IS_UNDERLINE) {
        content = (
          <span style={{ textDecoration: 'underline' }}>{content}</span>
        );
      }

      if (format & IS_SUBSCRIPT) {
        content = <sub>{content}</sub>;
      }

      if (format & IS_SUPERSCRIPT) {
        content = <sup>{content}</sup>;
      }

      return <Fragment key={key}>{content}</Fragment>;
    }

    /* ---- Linebreak ---- */
    case 'linebreak':
      return <br key={key} />;

    /* ---- Tab ---- */
    case 'tab':
      return <span key={key}>{'\t'}</span>;

    /* ---- Horizontal rule ---- */
    case 'horizontalrule':
      return <hr key={key} />;

    /* ---- Link ---- */
    case 'link': {
      const children = renderNodes(node.children);
      const fields = node.fields;
      const rel = fields?.newTab ? 'noopener noreferrer' : undefined;
      const target = fields?.newTab ? '_blank' : undefined;
      const href =
        fields?.linkType === 'internal'
          ? (resolveInternalDocumentHref(
              fields.doc?.relationTo,
              fields.doc?.value,
            ) ?? '#')
          : (fields?.url ?? '#');

      return (
        <a key={key} href={href} rel={rel} target={target}>
          {children}
        </a>
      );
    }

    /* ---- Autolink ---- */
    case 'autolink': {
      const children = renderNodes(node.children);
      const fields = node.fields;
      const rel = fields?.newTab ? 'noopener noreferrer' : undefined;
      const target = fields?.newTab ? '_blank' : undefined;

      return (
        <a key={key} href={fields?.url ?? '#'} rel={rel} target={target}>
          {children}
        </a>
      );
    }

    /* ---- Relationship ---- */
    case 'relationship': {
      const href = resolveInternalDocumentHref(node.relationTo, node.value);
      const label = resolveRelationshipLabel(node);

      return (
        <Text key={key} render={<p />} variant="body" size="medium">
          {href ? <a href={href}>{label}</a> : label}
        </Text>
      );
    }

    /* ---- Upload (images, files) ---- */
    case 'upload': {
      const uploadValue = node.value;

      if (typeof uploadValue !== 'object' || uploadValue === null) {
        return null;
      }

      const uploadDoc = uploadValue as Record<string, unknown>;
      const alt =
        (typeof (node.fields as Record<string, unknown> | undefined)?.alt ===
        'string'
          ? (node.fields as Record<string, unknown>).alt
          : uploadDoc.alt) ?? '';
      const url = typeof uploadDoc.url === 'string' ? uploadDoc.url : null;
      const mimeType =
        typeof uploadDoc.mimeType === 'string' ? uploadDoc.mimeType : '';

      if (!url) {
        return null;
      }

      // Non‑image: render as download link
      if (!mimeType.startsWith('image')) {
        const filename =
          typeof uploadDoc.filename === 'string'
            ? uploadDoc.filename
            : 'Download';

        return (
          <a key={key} href={url} rel="noopener noreferrer">
            {filename}
          </a>
        );
      }

      // Image
      const width =
        typeof uploadDoc.width === 'number' ? uploadDoc.width : undefined;
      const height =
        typeof uploadDoc.height === 'number' ? uploadDoc.height : undefined;

      return (
        <Image
          key={key}
          src={url}
          alt={typeof alt === 'string' ? alt : ''}
          width={width ?? 800}
          height={height ?? 600}
          loading="lazy"
          sizes="100vw"
        />
      );
    }

    /* ---- Table ---- */
    case 'table': {
      const children = renderNodes(node.children);

      return (
        <div key={key} className="lexical-table-container">
          <table
            className="lexical-table"
            style={{ borderCollapse: 'collapse' }}
          >
            <tbody>{children}</tbody>
          </table>
        </div>
      );
    }

    /* ---- Table row ---- */
    case 'tablerow': {
      const children = renderNodes(node.children);

      return (
        <tr key={key} className="lexical-table-row">
          {children}
        </tr>
      );
    }

    /* ---- Table cell ---- */
    case 'tablecell': {
      const children = renderNodes(node.children);
      const headerState =
        typeof node.headerState === 'number' ? node.headerState : 0;
      const colSpan =
        typeof node.colSpan === 'number' && node.colSpan > 1
          ? node.colSpan
          : undefined;
      const rowSpan =
        typeof node.rowSpan === 'number' && node.rowSpan > 1
          ? node.rowSpan
          : undefined;

      const cellStyle = {
        border: '1px solid #ccc',
        padding: '8px',
        backgroundColor:
          typeof node.backgroundColor === 'string'
            ? node.backgroundColor
            : undefined,
      };

      if (headerState > 0) {
        return (
          <th
            key={key}
            colSpan={colSpan}
            rowSpan={rowSpan}
            style={cellStyle}
            className={`lexical-table-cell lexical-table-cell-header-${headerState}`}
          >
            {children}
          </th>
        );
      }

      return (
        <td
          key={key}
          colSpan={colSpan}
          rowSpan={rowSpan}
          style={cellStyle}
          className="lexical-table-cell"
        >
          {children}
        </td>
      );
    }

    /* ---- Root (should not appear as a child, but handle defensively) ---- */
    case 'root':
      return <Fragment key={key}>{renderNodes(node.children)}</Fragment>;

    /* ---- Unknown / unsupported: silently skip ---- */
    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Public API (unchanged)                                             */
/* ------------------------------------------------------------------ */

export interface LexicalRichTextProps {
  content: LexicalRoot | null | undefined;
  className?: string;
}

export function LexicalRichText({ content, className }: LexicalRichTextProps) {
  if (!content?.root) {
    return null;
  }

  return (
    <Stack spacing={8} align="stretch" className={className ?? richTextStyle}>
      {renderNodes(content.root.children)}
    </Stack>
  );
}
