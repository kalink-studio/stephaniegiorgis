import * as migration_20260315_131121 from './20260315_131121';
import * as migration_20260316_121844_add_page_layout_sections from './20260316_121844_add_page_layout_sections';

export const migrations = [
  {
    up: migration_20260315_131121.up,
    down: migration_20260315_131121.down,
    name: '20260315_131121',
  },
  {
    up: migration_20260316_121844_add_page_layout_sections.up,
    down: migration_20260316_121844_add_page_layout_sections.down,
    name: '20260316_121844_add_page_layout_sections'
  },
];
