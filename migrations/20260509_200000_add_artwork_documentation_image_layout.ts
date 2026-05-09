import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TYPE "public"."enum_artworks_blocks_doc_grid_layout" ADD VALUE IF NOT EXISTS 'Image' BEFORE 'Grid 1/1';
    ALTER TYPE "public"."enum__artworks_v_blocks_doc_grid_layout" ADD VALUE IF NOT EXISTS 'Image' BEFORE 'Grid 1/1';
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql``);
}
