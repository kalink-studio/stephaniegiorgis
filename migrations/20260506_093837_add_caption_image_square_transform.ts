import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."itspk_itimage1dr_se1gb" ADD VALUE '4_3' BEFORE '2_3';
  ALTER TABLE "pages_blocks_caption_image" ADD COLUMN "image_presets_1_1_crop_x" numeric DEFAULT 50;
  ALTER TABLE "pages_blocks_caption_image" ADD COLUMN "image_presets_1_1_crop_y" numeric DEFAULT 50;
  ALTER TABLE "pages_blocks_caption_image" ADD COLUMN "image_presets_1_1_crop_zoom" numeric DEFAULT 1;
  ALTER TABLE "pages_blocks_caption_image" ADD COLUMN "image_presets_1_1_derivative_id" integer;
  ALTER TABLE "pages_blocks_caption_image" ADD COLUMN "image_presets_1_1_state" "itst_itimage1dr_1gbbf";
  ALTER TABLE "pages_blocks_caption_image" ADD COLUMN "image_presets_1_1_fingerprint" varchar;
  ALTER TABLE "pages_blocks_caption_image" ADD COLUMN "image_presets_1_1_source_version" varchar;
  ALTER TABLE "pages_blocks_caption_image" ADD COLUMN "image_presets_1_1_last_generated_at" timestamp(3) with time zone;
  ALTER TABLE "pages_blocks_caption_image" ADD COLUMN "image_presets_1_1_last_error" varchar;
  ALTER TABLE "_pages_v_blocks_caption_image" ADD COLUMN "image_presets_1_1_crop_x" numeric DEFAULT 50;
  ALTER TABLE "_pages_v_blocks_caption_image" ADD COLUMN "image_presets_1_1_crop_y" numeric DEFAULT 50;
  ALTER TABLE "_pages_v_blocks_caption_image" ADD COLUMN "image_presets_1_1_crop_zoom" numeric DEFAULT 1;
  ALTER TABLE "_pages_v_blocks_caption_image" ADD COLUMN "image_presets_1_1_derivative_id" integer;
  ALTER TABLE "_pages_v_blocks_caption_image" ADD COLUMN "image_presets_1_1_state" "itst_itimage1dr_1gbbf";
  ALTER TABLE "_pages_v_blocks_caption_image" ADD COLUMN "image_presets_1_1_fingerprint" varchar;
  ALTER TABLE "_pages_v_blocks_caption_image" ADD COLUMN "image_presets_1_1_source_version" varchar;
  ALTER TABLE "_pages_v_blocks_caption_image" ADD COLUMN "image_presets_1_1_last_generated_at" timestamp(3) with time zone;
  ALTER TABLE "_pages_v_blocks_caption_image" ADD COLUMN "image_presets_1_1_last_error" varchar;
  ALTER TABLE "artworks_blocks_doc_grid_items" ADD COLUMN "image_presets_4_3_crop_x" numeric DEFAULT 50;
  ALTER TABLE "artworks_blocks_doc_grid_items" ADD COLUMN "image_presets_4_3_crop_y" numeric DEFAULT 50;
  ALTER TABLE "artworks_blocks_doc_grid_items" ADD COLUMN "image_presets_4_3_crop_zoom" numeric DEFAULT 1;
  ALTER TABLE "artworks_blocks_doc_grid_items" ADD COLUMN "image_presets_4_3_derivative_id" integer;
  ALTER TABLE "artworks_blocks_doc_grid_items" ADD COLUMN "image_presets_4_3_state" "itst_itimage1dr_13blr";
  ALTER TABLE "artworks_blocks_doc_grid_items" ADD COLUMN "image_presets_4_3_fingerprint" varchar;
  ALTER TABLE "artworks_blocks_doc_grid_items" ADD COLUMN "image_presets_4_3_source_version" varchar;
  ALTER TABLE "artworks_blocks_doc_grid_items" ADD COLUMN "image_presets_4_3_last_generated_at" timestamp(3) with time zone;
  ALTER TABLE "artworks_blocks_doc_grid_items" ADD COLUMN "image_presets_4_3_last_error" varchar;
  ALTER TABLE "_artworks_v_blocks_doc_grid_items" ADD COLUMN "image_presets_4_3_crop_x" numeric DEFAULT 50;
  ALTER TABLE "_artworks_v_blocks_doc_grid_items" ADD COLUMN "image_presets_4_3_crop_y" numeric DEFAULT 50;
  ALTER TABLE "_artworks_v_blocks_doc_grid_items" ADD COLUMN "image_presets_4_3_crop_zoom" numeric DEFAULT 1;
  ALTER TABLE "_artworks_v_blocks_doc_grid_items" ADD COLUMN "image_presets_4_3_derivative_id" integer;
  ALTER TABLE "_artworks_v_blocks_doc_grid_items" ADD COLUMN "image_presets_4_3_state" "itst_itimage1dr_13blr";
  ALTER TABLE "_artworks_v_blocks_doc_grid_items" ADD COLUMN "image_presets_4_3_fingerprint" varchar;
  ALTER TABLE "_artworks_v_blocks_doc_grid_items" ADD COLUMN "image_presets_4_3_source_version" varchar;
  ALTER TABLE "_artworks_v_blocks_doc_grid_items" ADD COLUMN "image_presets_4_3_last_generated_at" timestamp(3) with time zone;
  ALTER TABLE "_artworks_v_blocks_doc_grid_items" ADD COLUMN "image_presets_4_3_last_error" varchar;
  ALTER TABLE "pages_blocks_caption_image" ADD CONSTRAINT "pages_blocks_caption_image_image_presets_1_1_derivative_id_derivatives_id_fk" FOREIGN KEY ("image_presets_1_1_derivative_id") REFERENCES "public"."derivatives"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_caption_image" ADD CONSTRAINT "_pages_v_blocks_caption_image_image_presets_1_1_derivative_id_derivatives_id_fk" FOREIGN KEY ("image_presets_1_1_derivative_id") REFERENCES "public"."derivatives"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "artworks_blocks_doc_grid_items" ADD CONSTRAINT "artworks_blocks_doc_grid_items_image_presets_4_3_derivative_id_derivatives_id_fk" FOREIGN KEY ("image_presets_4_3_derivative_id") REFERENCES "public"."derivatives"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_artworks_v_blocks_doc_grid_items" ADD CONSTRAINT "_artworks_v_blocks_doc_grid_items_image_presets_4_3_derivative_id_derivatives_id_fk" FOREIGN KEY ("image_presets_4_3_derivative_id") REFERENCES "public"."derivatives"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_caption_image_image_presets_1_1_image_prese_idx" ON "pages_blocks_caption_image" USING btree ("image_presets_1_1_derivative_id");
  CREATE INDEX "_pages_v_blocks_caption_image_image_presets_1_1_image_pr_idx" ON "_pages_v_blocks_caption_image" USING btree ("image_presets_1_1_derivative_id");
  CREATE INDEX "artworks_blocks_doc_grid_items_image_presets_4_3_image_p_idx" ON "artworks_blocks_doc_grid_items" USING btree ("image_presets_4_3_derivative_id");
  CREATE INDEX "_artworks_v_blocks_doc_grid_items_image_presets_4_3_imag_idx" ON "_artworks_v_blocks_doc_grid_items" USING btree ("image_presets_4_3_derivative_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_caption_image" DROP CONSTRAINT "pages_blocks_caption_image_image_presets_1_1_derivative_id_derivatives_id_fk";
  
  ALTER TABLE "_pages_v_blocks_caption_image" DROP CONSTRAINT "_pages_v_blocks_caption_image_image_presets_1_1_derivative_id_derivatives_id_fk";
  
  ALTER TABLE "artworks_blocks_doc_grid_items" DROP CONSTRAINT "artworks_blocks_doc_grid_items_image_presets_4_3_derivative_id_derivatives_id_fk";
  
  ALTER TABLE "_artworks_v_blocks_doc_grid_items" DROP CONSTRAINT "_artworks_v_blocks_doc_grid_items_image_presets_4_3_derivative_id_derivatives_id_fk";
  
  ALTER TABLE "pages_blocks_caption_image" ALTER COLUMN "image_selected_preset_key" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_caption_image" ALTER COLUMN "image_selected_preset_key" SET DATA TYPE text;
  ALTER TABLE "artworks_blocks_doc_grid_items" ALTER COLUMN "image_selected_preset_key" SET DATA TYPE text;
  ALTER TABLE "_artworks_v_blocks_doc_grid_items" ALTER COLUMN "image_selected_preset_key" SET DATA TYPE text;
  DROP TYPE "public"."itspk_itimage1dr_se1gb";
  CREATE TYPE "public"."itspk_itimage1dr_se1gb" AS ENUM('1_1', '2_3', '3_2');
  ALTER TABLE "pages_blocks_caption_image" ALTER COLUMN "image_selected_preset_key" SET DATA TYPE "public"."itspk_itimage1dr_se1gb" USING "image_selected_preset_key"::"public"."itspk_itimage1dr_se1gb";
  ALTER TABLE "_pages_v_blocks_caption_image" ALTER COLUMN "image_selected_preset_key" SET DATA TYPE "public"."itspk_itimage1dr_se1gb" USING "image_selected_preset_key"::"public"."itspk_itimage1dr_se1gb";
  ALTER TABLE "artworks_blocks_doc_grid_items" ALTER COLUMN "image_selected_preset_key" SET DATA TYPE "public"."itspk_itimage1dr_se1gb" USING "image_selected_preset_key"::"public"."itspk_itimage1dr_se1gb";
  ALTER TABLE "_artworks_v_blocks_doc_grid_items" ALTER COLUMN "image_selected_preset_key" SET DATA TYPE "public"."itspk_itimage1dr_se1gb" USING "image_selected_preset_key"::"public"."itspk_itimage1dr_se1gb";
  DROP INDEX "pages_blocks_caption_image_image_presets_1_1_image_prese_idx";
  DROP INDEX "_pages_v_blocks_caption_image_image_presets_1_1_image_pr_idx";
  DROP INDEX "artworks_blocks_doc_grid_items_image_presets_4_3_image_p_idx";
  DROP INDEX "_artworks_v_blocks_doc_grid_items_image_presets_4_3_imag_idx";
  ALTER TABLE "pages_blocks_caption_image" DROP COLUMN "image_presets_1_1_crop_x";
  ALTER TABLE "pages_blocks_caption_image" DROP COLUMN "image_presets_1_1_crop_y";
  ALTER TABLE "pages_blocks_caption_image" DROP COLUMN "image_presets_1_1_crop_zoom";
  ALTER TABLE "pages_blocks_caption_image" DROP COLUMN "image_presets_1_1_derivative_id";
  ALTER TABLE "pages_blocks_caption_image" DROP COLUMN "image_presets_1_1_state";
  ALTER TABLE "pages_blocks_caption_image" DROP COLUMN "image_presets_1_1_fingerprint";
  ALTER TABLE "pages_blocks_caption_image" DROP COLUMN "image_presets_1_1_source_version";
  ALTER TABLE "pages_blocks_caption_image" DROP COLUMN "image_presets_1_1_last_generated_at";
  ALTER TABLE "pages_blocks_caption_image" DROP COLUMN "image_presets_1_1_last_error";
  ALTER TABLE "_pages_v_blocks_caption_image" DROP COLUMN "image_presets_1_1_crop_x";
  ALTER TABLE "_pages_v_blocks_caption_image" DROP COLUMN "image_presets_1_1_crop_y";
  ALTER TABLE "_pages_v_blocks_caption_image" DROP COLUMN "image_presets_1_1_crop_zoom";
  ALTER TABLE "_pages_v_blocks_caption_image" DROP COLUMN "image_presets_1_1_derivative_id";
  ALTER TABLE "_pages_v_blocks_caption_image" DROP COLUMN "image_presets_1_1_state";
  ALTER TABLE "_pages_v_blocks_caption_image" DROP COLUMN "image_presets_1_1_fingerprint";
  ALTER TABLE "_pages_v_blocks_caption_image" DROP COLUMN "image_presets_1_1_source_version";
  ALTER TABLE "_pages_v_blocks_caption_image" DROP COLUMN "image_presets_1_1_last_generated_at";
  ALTER TABLE "_pages_v_blocks_caption_image" DROP COLUMN "image_presets_1_1_last_error";
  ALTER TABLE "artworks_blocks_doc_grid_items" DROP COLUMN "image_presets_4_3_crop_x";
  ALTER TABLE "artworks_blocks_doc_grid_items" DROP COLUMN "image_presets_4_3_crop_y";
  ALTER TABLE "artworks_blocks_doc_grid_items" DROP COLUMN "image_presets_4_3_crop_zoom";
  ALTER TABLE "artworks_blocks_doc_grid_items" DROP COLUMN "image_presets_4_3_derivative_id";
  ALTER TABLE "artworks_blocks_doc_grid_items" DROP COLUMN "image_presets_4_3_state";
  ALTER TABLE "artworks_blocks_doc_grid_items" DROP COLUMN "image_presets_4_3_fingerprint";
  ALTER TABLE "artworks_blocks_doc_grid_items" DROP COLUMN "image_presets_4_3_source_version";
  ALTER TABLE "artworks_blocks_doc_grid_items" DROP COLUMN "image_presets_4_3_last_generated_at";
  ALTER TABLE "artworks_blocks_doc_grid_items" DROP COLUMN "image_presets_4_3_last_error";
  ALTER TABLE "_artworks_v_blocks_doc_grid_items" DROP COLUMN "image_presets_4_3_crop_x";
  ALTER TABLE "_artworks_v_blocks_doc_grid_items" DROP COLUMN "image_presets_4_3_crop_y";
  ALTER TABLE "_artworks_v_blocks_doc_grid_items" DROP COLUMN "image_presets_4_3_crop_zoom";
  ALTER TABLE "_artworks_v_blocks_doc_grid_items" DROP COLUMN "image_presets_4_3_derivative_id";
  ALTER TABLE "_artworks_v_blocks_doc_grid_items" DROP COLUMN "image_presets_4_3_state";
  ALTER TABLE "_artworks_v_blocks_doc_grid_items" DROP COLUMN "image_presets_4_3_fingerprint";
  ALTER TABLE "_artworks_v_blocks_doc_grid_items" DROP COLUMN "image_presets_4_3_source_version";
  ALTER TABLE "_artworks_v_blocks_doc_grid_items" DROP COLUMN "image_presets_4_3_last_generated_at";
  ALTER TABLE "_artworks_v_blocks_doc_grid_items" DROP COLUMN "image_presets_4_3_last_error";`)
}
