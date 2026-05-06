import { Heading, Stack } from '@kalink-ui/seedly-react';

import { ContactForm } from '@/components/contact-form';
import { LexicalRichText } from '@/components/rich-text/lexical-rich-text';
import type { FormReferenceBlock } from '@/payload/runtime/types';

/**
 * Renders a form reference block.
 *
 * Currently renders the hardcoded ContactForm component as a bridge
 * until the Payload form-builder plugin is fully integrated.
 * Once form-builder is wired, this can dynamically render form fields
 * based on the referenced form's schema.
 */

interface Props {
  block: FormReferenceBlock;
}

export function FormReferenceBlockComponent({ block }: Props) {
  return (
    <Stack render={<section />} spacing={6} align="stretch">
      {block.heading && (
        <Heading.Root level="h2" variant="headline" size="medium">
          {block.heading}
        </Heading.Root>
      )}
      {block.intro && <LexicalRichText content={block.intro} />}
      <ContactForm />
    </Stack>
  );
}
