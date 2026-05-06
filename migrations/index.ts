import * as migration_20260315_131121 from './20260315_131121';
import * as migration_20260316_121844_add_page_layout_sections from './20260316_121844_add_page_layout_sections';
import * as migration_20260506_093837_add_caption_image_square_transform from './20260506_093837_add_caption_image_square_transform';

export const migrations = [
  {
    up: migration_20260315_131121.up,
    down: migration_20260315_131121.down,
    name: '20260315_131121',
  },
  {
    up: migration_20260316_121844_add_page_layout_sections.up,
    down: migration_20260316_121844_add_page_layout_sections.down,
    name: '20260316_121844_add_page_layout_sections',
  },
  {
    up: migration_20260506_093837_add_caption_image_square_transform.up,
    down: migration_20260506_093837_add_caption_image_square_transform.down,
    name: '20260506_093837_add_caption_image_square_transform'
  },
];
