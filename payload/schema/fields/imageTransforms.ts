import { createImageTransformField } from '@kalink-ui/canopy';

type ImageTransformMode = 'constrained' | 'selectable';

export const transformPresets = {
  square: { key: '1_1', aspectRatio: '1:1', label: '1:1' },
  portrait: { key: '2_3', aspectRatio: '2:3', label: '2:3' },
  landscape: { key: '3_2', aspectRatio: '3:2', label: '3:2' },
  classic: { key: '4_3', aspectRatio: '4:3', label: '4:3' },
  widescreen: { key: '16_9', aspectRatio: '16:9', label: '16:9' },
} as const;

interface SingleImageTranformOptions {
  name: string;
  label: string;
  mode?: ImageTransformMode;
  presets: (typeof transformPresets)[keyof typeof transformPresets][];
  required?: boolean;
}

export const createSingleImageTransformField = ({
  name,
  label,
  mode,
  presets,
  required,
}: SingleImageTranformOptions) => {
  return createImageTransformField({
    name,
    label,
    mode,
    relationTo: 'media',
    presets,
    required,
  });
};
