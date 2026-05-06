import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_layout_width" AS ENUM('small', 'medium', 'large', 'full');
  CREATE TYPE "public"."enum_pages_layout_columns" AS ENUM('one', 'two');
  CREATE TYPE "public"."enum_pages_layout_ratio" AS ENUM('1_1', '3_2', '2_3');
  CREATE TYPE "public"."enum__pages_v_version_layout_width" AS ENUM('small', 'medium', 'large', 'full');
  CREATE TYPE "public"."enum__pages_v_version_layout_columns" AS ENUM('one', 'two');
  CREATE TYPE "public"."enum__pages_v_version_layout_ratio" AS ENUM('1_1', '3_2', '2_3');
  CREATE TABLE "pages_blocks_artwork_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"artwork_id" integer
  );
  
  CREATE TABLE "pages_layout" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"width" "enum_pages_layout_width" DEFAULT 'large',
  	"columns" "enum_pages_layout_columns" DEFAULT 'one',
  	"ratio" "enum_pages_layout_ratio" DEFAULT '1_1'
  );
  
  CREATE TABLE "_pages_v_blocks_artwork_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"artwork_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_version_layout" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"width" "enum__pages_v_version_layout_width" DEFAULT 'large',
  	"columns" "enum__pages_v_version_layout_columns" DEFAULT 'one',
  	"ratio" "enum__pages_v_version_layout_ratio" DEFAULT '1_1',
  	"_uuid" varchar
  );
  
  ALTER TABLE "psplit_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "psplit" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_psplit_v_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_psplit_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "psplit_links" CASCADE;
  DROP TABLE "psplit" CASCADE;
  DROP TABLE "pages_rels" CASCADE;
  DROP TABLE "_psplit_v_links" CASCADE;
  DROP TABLE "_psplit_v" CASCADE;
  DROP TABLE "_pages_v_rels" CASCADE;
  ALTER TABLE "_pages_v" ADD COLUMN "autosave" boolean;
  ALTER TABLE "_artworks_v" ADD COLUMN "autosave" boolean;
  ALTER TABLE "pages_blocks_artwork_grid_items" ADD CONSTRAINT "pages_blocks_artwork_grid_items_artwork_id_artworks_id_fk" FOREIGN KEY ("artwork_id") REFERENCES "public"."artworks"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_artwork_grid_items" ADD CONSTRAINT "pages_blocks_artwork_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_artwork_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_layout" ADD CONSTRAINT "pages_layout_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_artwork_grid_items" ADD CONSTRAINT "_pages_v_blocks_artwork_grid_items_artwork_id_artworks_id_fk" FOREIGN KEY ("artwork_id") REFERENCES "public"."artworks"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_artwork_grid_items" ADD CONSTRAINT "_pages_v_blocks_artwork_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_artwork_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_layout" ADD CONSTRAINT "_pages_v_version_layout_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_artwork_grid_items_order_idx" ON "pages_blocks_artwork_grid_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_artwork_grid_items_parent_id_idx" ON "pages_blocks_artwork_grid_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_artwork_grid_items_artwork_idx" ON "pages_blocks_artwork_grid_items" USING btree ("artwork_id");
  CREATE INDEX "pages_layout_order_idx" ON "pages_layout" USING btree ("_order");
  CREATE INDEX "pages_layout_parent_id_idx" ON "pages_layout" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_artwork_grid_items_order_idx" ON "_pages_v_blocks_artwork_grid_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_artwork_grid_items_parent_id_idx" ON "_pages_v_blocks_artwork_grid_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_artwork_grid_items_artwork_idx" ON "_pages_v_blocks_artwork_grid_items" USING btree ("artwork_id");
  CREATE INDEX "_pages_v_version_layout_order_idx" ON "_pages_v_version_layout" USING btree ("_order");
  CREATE INDEX "_pages_v_version_layout_parent_id_idx" ON "_pages_v_version_layout" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_autosave_idx" ON "_pages_v" USING btree ("autosave");
  CREATE INDEX "_artworks_v_autosave_idx" ON "_artworks_v" USING btree ("autosave");
  ALTER TABLE "pages_blocks_caption_image" DROP COLUMN "image_ratio";
  ALTER TABLE "_pages_v_blocks_caption_image" DROP COLUMN "image_ratio";
  DROP TYPE "public"."enum_pages_blocks_caption_image_image_ratio";
  DROP TYPE "public"."itspk_itresumeim_hv9hp";
  DROP TYPE "public"."itst_itresumeim_15hgz";
  DROP TYPE "public"."enum__pages_v_blocks_caption_image_image_ratio";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_caption_image_image_ratio" AS ENUM('original', '4_3', '2_3', '3_2');
  CREATE TYPE "public"."itspk_itresumeim_hv9hp" AS ENUM('2_3');
  CREATE TYPE "public"."itst_itresumeim_15hgz" AS ENUM('unsaved', 'missing', 'ready', 'stale', 'generating', 'failed');
  CREATE TYPE "public"."enum__pages_v_blocks_caption_image_image_ratio" AS ENUM('original', '4_3', '2_3', '3_2');
  CREATE TABLE "psplit_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "psplit" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"resume" jsonb,
  	"resume_image_source_id" integer,
  	"resume_image_selected_preset_key" "itspk_itresumeim_hv9hp",
  	"resume_image_presets_2_3_crop_x" numeric DEFAULT 50,
  	"resume_image_presets_2_3_crop_y" numeric DEFAULT 50,
  	"resume_image_presets_2_3_crop_zoom" numeric DEFAULT 1,
  	"resume_image_presets_2_3_derivative_id" integer,
  	"resume_image_presets_2_3_state" "itst_itresumeim_15hgz",
  	"resume_image_presets_2_3_fingerprint" varchar,
  	"resume_image_presets_2_3_source_version" varchar,
  	"resume_image_presets_2_3_last_generated_at" timestamp(3) with time zone,
  	"resume_image_presets_2_3_last_error" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"artworks_id" integer
  );
  
  CREATE TABLE "_psplit_v_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_psplit_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"resume" jsonb,
  	"resume_image_source_id" integer,
  	"resume_image_selected_preset_key" "itspk_itresumeim_hv9hp",
  	"resume_image_presets_2_3_crop_x" numeric DEFAULT 50,
  	"resume_image_presets_2_3_crop_y" numeric DEFAULT 50,
  	"resume_image_presets_2_3_crop_zoom" numeric DEFAULT 1,
  	"resume_image_presets_2_3_derivative_id" integer,
  	"resume_image_presets_2_3_state" "itst_itresumeim_15hgz",
  	"resume_image_presets_2_3_fingerprint" varchar,
  	"resume_image_presets_2_3_source_version" varchar,
  	"resume_image_presets_2_3_last_generated_at" timestamp(3) with time zone,
  	"resume_image_presets_2_3_last_error" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"artworks_id" integer
  );
  
  ALTER TABLE "pages_blocks_artwork_grid_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_layout" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_artwork_grid_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_version_layout" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_artwork_grid_items" CASCADE;
  DROP TABLE "pages_layout" CASCADE;
  DROP TABLE "_pages_v_blocks_artwork_grid_items" CASCADE;
  DROP TABLE "_pages_v_version_layout" CASCADE;
  DROP INDEX "_pages_v_autosave_idx";
  DROP INDEX "_artworks_v_autosave_idx";
  ALTER TABLE "pages_blocks_caption_image" ADD COLUMN "image_ratio" "enum_pages_blocks_caption_image_image_ratio" DEFAULT '4_3';
  ALTER TABLE "_pages_v_blocks_caption_image" ADD COLUMN "image_ratio" "enum__pages_v_blocks_caption_image_image_ratio" DEFAULT '4_3';
  ALTER TABLE "psplit_links" ADD CONSTRAINT "psplit_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."psplit"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "psplit" ADD CONSTRAINT "psplit_resume_image_source_id_media_id_fk" FOREIGN KEY ("resume_image_source_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "psplit" ADD CONSTRAINT "psplit_resume_image_presets_2_3_derivative_id_derivatives_id_fk" FOREIGN KEY ("resume_image_presets_2_3_derivative_id") REFERENCES "public"."derivatives"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "psplit" ADD CONSTRAINT "psplit_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_artworks_fk" FOREIGN KEY ("artworks_id") REFERENCES "public"."artworks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_psplit_v_links" ADD CONSTRAINT "_psplit_v_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_psplit_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_psplit_v" ADD CONSTRAINT "_psplit_v_resume_image_source_id_media_id_fk" FOREIGN KEY ("resume_image_source_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_psplit_v" ADD CONSTRAINT "_psplit_v_resume_image_presets_2_3_derivative_id_derivatives_id_fk" FOREIGN KEY ("resume_image_presets_2_3_derivative_id") REFERENCES "public"."derivatives"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_psplit_v" ADD CONSTRAINT "_psplit_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_artworks_fk" FOREIGN KEY ("artworks_id") REFERENCES "public"."artworks"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "psplit_links_order_idx" ON "psplit_links" USING btree ("_order");
  CREATE INDEX "psplit_links_parent_id_idx" ON "psplit_links" USING btree ("_parent_id");
  CREATE INDEX "psplit_order_idx" ON "psplit" USING btree ("_order");
  CREATE INDEX "psplit_parent_id_idx" ON "psplit" USING btree ("_parent_id");
  CREATE INDEX "psplit_path_idx" ON "psplit" USING btree ("_path");
  CREATE INDEX "psplit_resume_image_resume_image_source_idx" ON "psplit" USING btree ("resume_image_source_id");
  CREATE INDEX "psplit_resume_image_presets_2_3_resume_image_presets_2_3_idx" ON "psplit" USING btree ("resume_image_presets_2_3_derivative_id");
  CREATE INDEX "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
  CREATE INDEX "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
  CREATE INDEX "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
  CREATE INDEX "pages_rels_artworks_id_idx" ON "pages_rels" USING btree ("artworks_id");
  CREATE INDEX "_psplit_v_links_order_idx" ON "_psplit_v_links" USING btree ("_order");
  CREATE INDEX "_psplit_v_links_parent_id_idx" ON "_psplit_v_links" USING btree ("_parent_id");
  CREATE INDEX "_psplit_v_order_idx" ON "_psplit_v" USING btree ("_order");
  CREATE INDEX "_psplit_v_parent_id_idx" ON "_psplit_v" USING btree ("_parent_id");
  CREATE INDEX "_psplit_v_path_idx" ON "_psplit_v" USING btree ("_path");
  CREATE INDEX "_psplit_v_resume_image_resume_image_source_idx" ON "_psplit_v" USING btree ("resume_image_source_id");
  CREATE INDEX "_psplit_v_resume_image_presets_2_3_resume_image_presets__idx" ON "_psplit_v" USING btree ("resume_image_presets_2_3_derivative_id");
  CREATE INDEX "_pages_v_rels_order_idx" ON "_pages_v_rels" USING btree ("order");
  CREATE INDEX "_pages_v_rels_parent_idx" ON "_pages_v_rels" USING btree ("parent_id");
  CREATE INDEX "_pages_v_rels_path_idx" ON "_pages_v_rels" USING btree ("path");
  CREATE INDEX "_pages_v_rels_artworks_id_idx" ON "_pages_v_rels" USING btree ("artworks_id");
  ALTER TABLE "_pages_v" DROP COLUMN "autosave";
  ALTER TABLE "_artworks_v" DROP COLUMN "autosave";
  DROP TYPE "public"."enum_pages_layout_width";
  DROP TYPE "public"."enum_pages_layout_columns";
  DROP TYPE "public"."enum_pages_layout_ratio";
  DROP TYPE "public"."enum__pages_v_version_layout_width";
  DROP TYPE "public"."enum__pages_v_version_layout_columns";
  DROP TYPE "public"."enum__pages_v_version_layout_ratio";`)
}
