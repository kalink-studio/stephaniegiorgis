import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  CREATE TYPE "public"."itspk_itimage1dr_se1gb" AS ENUM('1_1', '2_3', '3_2');
  CREATE TYPE "public"."itst_itimage1dr_13blr" AS ENUM('unsaved', 'missing', 'ready', 'stale', 'generating', 'failed');
  CREATE TYPE "public"."itst_itimage1dr_uvcgg" AS ENUM('unsaved', 'missing', 'ready', 'stale', 'generating', 'failed');
  CREATE TYPE "public"."itst_itimage1dr_74eqg" AS ENUM('unsaved', 'missing', 'ready', 'stale', 'generating', 'failed');
  CREATE TYPE "public"."enum_pages_blocks_caption_image_image_ratio" AS ENUM('original', '4_3', '2_3', '3_2');
  CREATE TYPE "public"."itspk_itposter12_u7jw8" AS ENUM('1_1', '4_3', '16_9');
  CREATE TYPE "public"."itst_itposter12_1u72h" AS ENUM('unsaved', 'missing', 'ready', 'stale', 'generating', 'failed');
  CREATE TYPE "public"."itst_itposter12_1ejrq" AS ENUM('unsaved', 'missing', 'ready', 'stale', 'generating', 'failed');
  CREATE TYPE "public"."itst_itposter12_1r9i9" AS ENUM('unsaved', 'missing', 'ready', 'stale', 'generating', 'failed');
  CREATE TYPE "public"."enum_pages_blocks_video_ratio" AS ENUM('16_9', '4_3', '1_1');
  CREATE TYPE "public"."itspk_itscreensh_19nhf" AS ENUM('1_1');
  CREATE TYPE "public"."itst_itscreensh_1nht9" AS ENUM('unsaved', 'missing', 'ready', 'stale', 'generating', 'failed');
  CREATE TYPE "public"."itspk_itresumeim_hv9hp" AS ENUM('2_3');
  CREATE TYPE "public"."itst_itresumeim_15hgz" AS ENUM('unsaved', 'missing', 'ready', 'stale', 'generating', 'failed');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_blocks_caption_image_image_ratio" AS ENUM('original', '4_3', '2_3', '3_2');
  CREATE TYPE "public"."enum__pages_v_blocks_video_ratio" AS ENUM('16_9', '4_3', '1_1');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."itst_itimage1dr_1gbbf" AS ENUM('unsaved', 'missing', 'ready', 'stale', 'generating', 'failed');
  CREATE TYPE "public"."enum_artworks_blocks_doc_grid_layout" AS ENUM('Grid 1/1', 'Grid 1/2', 'Grid 2/1', 'Grid 2/2', 'Grid 1/1/1', 'Grid 1/1/2');
  CREATE TYPE "public"."enum_artworks_blocks_doc_video_items_ratio" AS ENUM('16_9', '4_3', '1_1');
  CREATE TYPE "public"."itspk_itcoverima_1izsz" AS ENUM('1_1');
  CREATE TYPE "public"."itst_itcoverima_1ha4q" AS ENUM('unsaved', 'missing', 'ready', 'stale', 'generating', 'failed');
  CREATE TYPE "public"."enum_artworks_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__artworks_v_blocks_doc_grid_layout" AS ENUM('Grid 1/1', 'Grid 1/2', 'Grid 2/1', 'Grid 2/2', 'Grid 1/1/1', 'Grid 1/1/2');
  CREATE TYPE "public"."enum__artworks_v_blocks_doc_video_items_ratio" AS ENUM('16_9', '4_3', '1_1');
  CREATE TYPE "public"."enum__artworks_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_derivatives_owner_kind" AS ENUM('collection', 'global');
  CREATE TYPE "public"."enum_forms_confirmation_type" AS ENUM('message', 'redirect');
  CREATE TYPE "public"."enum_forms_redirect_type" AS ENUM('reference', 'custom');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"role" "enum_users_role" DEFAULT 'editor',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar,
  	"prefix" varchar DEFAULT 'media',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "pages_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_caption_image" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_source_id" integer,
  	"image_selected_preset_key" "itspk_itimage1dr_se1gb",
  	"image_presets_4_3_crop_x" numeric DEFAULT 50,
  	"image_presets_4_3_crop_y" numeric DEFAULT 50,
  	"image_presets_4_3_crop_zoom" numeric DEFAULT 1,
  	"image_presets_4_3_derivative_id" integer,
  	"image_presets_4_3_state" "itst_itimage1dr_13blr",
  	"image_presets_4_3_fingerprint" varchar,
  	"image_presets_4_3_source_version" varchar,
  	"image_presets_4_3_last_generated_at" timestamp(3) with time zone,
  	"image_presets_4_3_last_error" varchar,
  	"image_presets_2_3_crop_x" numeric DEFAULT 50,
  	"image_presets_2_3_crop_y" numeric DEFAULT 50,
  	"image_presets_2_3_crop_zoom" numeric DEFAULT 1,
  	"image_presets_2_3_derivative_id" integer,
  	"image_presets_2_3_state" "itst_itimage1dr_uvcgg",
  	"image_presets_2_3_fingerprint" varchar,
  	"image_presets_2_3_source_version" varchar,
  	"image_presets_2_3_last_generated_at" timestamp(3) with time zone,
  	"image_presets_2_3_last_error" varchar,
  	"image_presets_3_2_crop_x" numeric DEFAULT 50,
  	"image_presets_3_2_crop_y" numeric DEFAULT 50,
  	"image_presets_3_2_crop_zoom" numeric DEFAULT 1,
  	"image_presets_3_2_derivative_id" integer,
  	"image_presets_3_2_state" "itst_itimage1dr_74eqg",
  	"image_presets_3_2_fingerprint" varchar,
  	"image_presets_3_2_source_version" varchar,
  	"image_presets_3_2_last_generated_at" timestamp(3) with time zone,
  	"image_presets_3_2_last_error" varchar,
  	"caption" jsonb,
  	"image_ratio" "enum_pages_blocks_caption_image_image_ratio" DEFAULT '4_3',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"poster_source_id" integer,
  	"poster_selected_preset_key" "itspk_itposter12_u7jw8",
  	"poster_presets_1_1_crop_x" numeric DEFAULT 50,
  	"poster_presets_1_1_crop_y" numeric DEFAULT 50,
  	"poster_presets_1_1_crop_zoom" numeric DEFAULT 1,
  	"poster_presets_1_1_derivative_id" integer,
  	"poster_presets_1_1_state" "itst_itposter12_1u72h",
  	"poster_presets_1_1_fingerprint" varchar,
  	"poster_presets_1_1_source_version" varchar,
  	"poster_presets_1_1_last_generated_at" timestamp(3) with time zone,
  	"poster_presets_1_1_last_error" varchar,
  	"poster_presets_4_3_crop_x" numeric DEFAULT 50,
  	"poster_presets_4_3_crop_y" numeric DEFAULT 50,
  	"poster_presets_4_3_crop_zoom" numeric DEFAULT 1,
  	"poster_presets_4_3_derivative_id" integer,
  	"poster_presets_4_3_state" "itst_itposter12_1ejrq",
  	"poster_presets_4_3_fingerprint" varchar,
  	"poster_presets_4_3_source_version" varchar,
  	"poster_presets_4_3_last_generated_at" timestamp(3) with time zone,
  	"poster_presets_4_3_last_error" varchar,
  	"poster_presets_16_9_crop_x" numeric DEFAULT 50,
  	"poster_presets_16_9_crop_y" numeric DEFAULT 50,
  	"poster_presets_16_9_crop_zoom" numeric DEFAULT 1,
  	"poster_presets_16_9_derivative_id" integer,
  	"poster_presets_16_9_state" "itst_itposter12_1r9i9",
  	"poster_presets_16_9_fingerprint" varchar,
  	"poster_presets_16_9_source_version" varchar,
  	"poster_presets_16_9_last_generated_at" timestamp(3) with time zone,
  	"poster_presets_16_9_last_error" varchar,
  	"av1_file_id" integer,
  	"h264_file_id" integer,
  	"ratio" "enum_pages_blocks_video_ratio" DEFAULT '16_9',
  	"max_width" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_link_list_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link" varchar,
  	"description" jsonb,
  	"screenshot_source_id" integer,
  	"screenshot_selected_preset_key" "itspk_itscreensh_19nhf",
  	"screenshot_presets_1_1_crop_x" numeric DEFAULT 50,
  	"screenshot_presets_1_1_crop_y" numeric DEFAULT 50,
  	"screenshot_presets_1_1_crop_zoom" numeric DEFAULT 1,
  	"screenshot_presets_1_1_derivative_id" integer,
  	"screenshot_presets_1_1_state" "itst_itscreensh_1nht9",
  	"screenshot_presets_1_1_fingerprint" varchar,
  	"screenshot_presets_1_1_source_version" varchar,
  	"screenshot_presets_1_1_last_generated_at" timestamp(3) with time zone,
  	"screenshot_presets_1_1_last_error" varchar
  );
  
  CREATE TABLE "pages_blocks_link_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_artwork_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
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
  
  CREATE TABLE "pages_blocks_form_reference" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"form_id" integer,
  	"heading" varchar,
  	"intro" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"slug_manual_override" boolean DEFAULT false,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"artworks_id" integer
  );
  
  CREATE TABLE "_pages_v_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_caption_image" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_source_id" integer,
  	"image_selected_preset_key" "itspk_itimage1dr_se1gb",
  	"image_presets_4_3_crop_x" numeric DEFAULT 50,
  	"image_presets_4_3_crop_y" numeric DEFAULT 50,
  	"image_presets_4_3_crop_zoom" numeric DEFAULT 1,
  	"image_presets_4_3_derivative_id" integer,
  	"image_presets_4_3_state" "itst_itimage1dr_13blr",
  	"image_presets_4_3_fingerprint" varchar,
  	"image_presets_4_3_source_version" varchar,
  	"image_presets_4_3_last_generated_at" timestamp(3) with time zone,
  	"image_presets_4_3_last_error" varchar,
  	"image_presets_2_3_crop_x" numeric DEFAULT 50,
  	"image_presets_2_3_crop_y" numeric DEFAULT 50,
  	"image_presets_2_3_crop_zoom" numeric DEFAULT 1,
  	"image_presets_2_3_derivative_id" integer,
  	"image_presets_2_3_state" "itst_itimage1dr_uvcgg",
  	"image_presets_2_3_fingerprint" varchar,
  	"image_presets_2_3_source_version" varchar,
  	"image_presets_2_3_last_generated_at" timestamp(3) with time zone,
  	"image_presets_2_3_last_error" varchar,
  	"image_presets_3_2_crop_x" numeric DEFAULT 50,
  	"image_presets_3_2_crop_y" numeric DEFAULT 50,
  	"image_presets_3_2_crop_zoom" numeric DEFAULT 1,
  	"image_presets_3_2_derivative_id" integer,
  	"image_presets_3_2_state" "itst_itimage1dr_74eqg",
  	"image_presets_3_2_fingerprint" varchar,
  	"image_presets_3_2_source_version" varchar,
  	"image_presets_3_2_last_generated_at" timestamp(3) with time zone,
  	"image_presets_3_2_last_error" varchar,
  	"caption" jsonb,
  	"image_ratio" "enum__pages_v_blocks_caption_image_image_ratio" DEFAULT '4_3',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"poster_source_id" integer,
  	"poster_selected_preset_key" "itspk_itposter12_u7jw8",
  	"poster_presets_1_1_crop_x" numeric DEFAULT 50,
  	"poster_presets_1_1_crop_y" numeric DEFAULT 50,
  	"poster_presets_1_1_crop_zoom" numeric DEFAULT 1,
  	"poster_presets_1_1_derivative_id" integer,
  	"poster_presets_1_1_state" "itst_itposter12_1u72h",
  	"poster_presets_1_1_fingerprint" varchar,
  	"poster_presets_1_1_source_version" varchar,
  	"poster_presets_1_1_last_generated_at" timestamp(3) with time zone,
  	"poster_presets_1_1_last_error" varchar,
  	"poster_presets_4_3_crop_x" numeric DEFAULT 50,
  	"poster_presets_4_3_crop_y" numeric DEFAULT 50,
  	"poster_presets_4_3_crop_zoom" numeric DEFAULT 1,
  	"poster_presets_4_3_derivative_id" integer,
  	"poster_presets_4_3_state" "itst_itposter12_1ejrq",
  	"poster_presets_4_3_fingerprint" varchar,
  	"poster_presets_4_3_source_version" varchar,
  	"poster_presets_4_3_last_generated_at" timestamp(3) with time zone,
  	"poster_presets_4_3_last_error" varchar,
  	"poster_presets_16_9_crop_x" numeric DEFAULT 50,
  	"poster_presets_16_9_crop_y" numeric DEFAULT 50,
  	"poster_presets_16_9_crop_zoom" numeric DEFAULT 1,
  	"poster_presets_16_9_derivative_id" integer,
  	"poster_presets_16_9_state" "itst_itposter12_1r9i9",
  	"poster_presets_16_9_fingerprint" varchar,
  	"poster_presets_16_9_source_version" varchar,
  	"poster_presets_16_9_last_generated_at" timestamp(3) with time zone,
  	"poster_presets_16_9_last_error" varchar,
  	"av1_file_id" integer,
  	"h264_file_id" integer,
  	"ratio" "enum__pages_v_blocks_video_ratio" DEFAULT '16_9',
  	"max_width" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_link_list_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link" varchar,
  	"description" jsonb,
  	"screenshot_source_id" integer,
  	"screenshot_selected_preset_key" "itspk_itscreensh_19nhf",
  	"screenshot_presets_1_1_crop_x" numeric DEFAULT 50,
  	"screenshot_presets_1_1_crop_y" numeric DEFAULT 50,
  	"screenshot_presets_1_1_crop_zoom" numeric DEFAULT 1,
  	"screenshot_presets_1_1_derivative_id" integer,
  	"screenshot_presets_1_1_state" "itst_itscreensh_1nht9",
  	"screenshot_presets_1_1_fingerprint" varchar,
  	"screenshot_presets_1_1_source_version" varchar,
  	"screenshot_presets_1_1_last_generated_at" timestamp(3) with time zone,
  	"screenshot_presets_1_1_last_error" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_link_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_artwork_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
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
  
  CREATE TABLE "_pages_v_blocks_form_reference" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"form_id" integer,
  	"heading" varchar,
  	"intro" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_slug_manual_override" boolean DEFAULT false,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_pages_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"artworks_id" integer
  );
  
  CREATE TABLE "artworks_blocks_doc_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_source_id" integer,
  	"image_selected_preset_key" "itspk_itimage1dr_se1gb",
  	"image_presets_1_1_crop_x" numeric DEFAULT 50,
  	"image_presets_1_1_crop_y" numeric DEFAULT 50,
  	"image_presets_1_1_crop_zoom" numeric DEFAULT 1,
  	"image_presets_1_1_derivative_id" integer,
  	"image_presets_1_1_state" "itst_itimage1dr_1gbbf",
  	"image_presets_1_1_fingerprint" varchar,
  	"image_presets_1_1_source_version" varchar,
  	"image_presets_1_1_last_generated_at" timestamp(3) with time zone,
  	"image_presets_1_1_last_error" varchar,
  	"image_presets_2_3_crop_x" numeric DEFAULT 50,
  	"image_presets_2_3_crop_y" numeric DEFAULT 50,
  	"image_presets_2_3_crop_zoom" numeric DEFAULT 1,
  	"image_presets_2_3_derivative_id" integer,
  	"image_presets_2_3_state" "itst_itimage1dr_uvcgg",
  	"image_presets_2_3_fingerprint" varchar,
  	"image_presets_2_3_source_version" varchar,
  	"image_presets_2_3_last_generated_at" timestamp(3) with time zone,
  	"image_presets_2_3_last_error" varchar,
  	"image_presets_3_2_crop_x" numeric DEFAULT 50,
  	"image_presets_3_2_crop_y" numeric DEFAULT 50,
  	"image_presets_3_2_crop_zoom" numeric DEFAULT 1,
  	"image_presets_3_2_derivative_id" integer,
  	"image_presets_3_2_state" "itst_itimage1dr_74eqg",
  	"image_presets_3_2_fingerprint" varchar,
  	"image_presets_3_2_source_version" varchar,
  	"image_presets_3_2_last_generated_at" timestamp(3) with time zone,
  	"image_presets_3_2_last_error" varchar
  );
  
  CREATE TABLE "artworks_blocks_doc_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout" "enum_artworks_blocks_doc_grid_layout" DEFAULT 'Grid 1/1',
  	"block_name" varchar
  );
  
  CREATE TABLE "artworks_blocks_doc_audio_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "artworks_blocks_doc_audio" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "artworks_blocks_doc_video_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"ratio" "enum_artworks_blocks_doc_video_items_ratio" DEFAULT '16_9'
  );
  
  CREATE TABLE "artworks_blocks_doc_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "artworks" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"slug_manual_override" boolean DEFAULT false,
  	"medium" varchar,
  	"measure" varchar,
  	"year" varchar,
  	"description" jsonb,
  	"cover_image_source_id" integer,
  	"cover_image_selected_preset_key" "itspk_itcoverima_1izsz",
  	"cover_image_presets_1_1_crop_x" numeric DEFAULT 50,
  	"cover_image_presets_1_1_crop_y" numeric DEFAULT 50,
  	"cover_image_presets_1_1_crop_zoom" numeric DEFAULT 1,
  	"cover_image_presets_1_1_derivative_id" integer,
  	"cover_image_presets_1_1_state" "itst_itcoverima_1ha4q",
  	"cover_image_presets_1_1_fingerprint" varchar,
  	"cover_image_presets_1_1_source_version" varchar,
  	"cover_image_presets_1_1_last_generated_at" timestamp(3) with time zone,
  	"cover_image_presets_1_1_last_error" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_artworks_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_artworks_v_blocks_doc_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_source_id" integer,
  	"image_selected_preset_key" "itspk_itimage1dr_se1gb",
  	"image_presets_1_1_crop_x" numeric DEFAULT 50,
  	"image_presets_1_1_crop_y" numeric DEFAULT 50,
  	"image_presets_1_1_crop_zoom" numeric DEFAULT 1,
  	"image_presets_1_1_derivative_id" integer,
  	"image_presets_1_1_state" "itst_itimage1dr_1gbbf",
  	"image_presets_1_1_fingerprint" varchar,
  	"image_presets_1_1_source_version" varchar,
  	"image_presets_1_1_last_generated_at" timestamp(3) with time zone,
  	"image_presets_1_1_last_error" varchar,
  	"image_presets_2_3_crop_x" numeric DEFAULT 50,
  	"image_presets_2_3_crop_y" numeric DEFAULT 50,
  	"image_presets_2_3_crop_zoom" numeric DEFAULT 1,
  	"image_presets_2_3_derivative_id" integer,
  	"image_presets_2_3_state" "itst_itimage1dr_uvcgg",
  	"image_presets_2_3_fingerprint" varchar,
  	"image_presets_2_3_source_version" varchar,
  	"image_presets_2_3_last_generated_at" timestamp(3) with time zone,
  	"image_presets_2_3_last_error" varchar,
  	"image_presets_3_2_crop_x" numeric DEFAULT 50,
  	"image_presets_3_2_crop_y" numeric DEFAULT 50,
  	"image_presets_3_2_crop_zoom" numeric DEFAULT 1,
  	"image_presets_3_2_derivative_id" integer,
  	"image_presets_3_2_state" "itst_itimage1dr_74eqg",
  	"image_presets_3_2_fingerprint" varchar,
  	"image_presets_3_2_source_version" varchar,
  	"image_presets_3_2_last_generated_at" timestamp(3) with time zone,
  	"image_presets_3_2_last_error" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_artworks_v_blocks_doc_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout" "enum__artworks_v_blocks_doc_grid_layout" DEFAULT 'Grid 1/1',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_artworks_v_blocks_doc_audio_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_artworks_v_blocks_doc_audio" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_artworks_v_blocks_doc_video_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"ratio" "enum__artworks_v_blocks_doc_video_items_ratio" DEFAULT '16_9',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_artworks_v_blocks_doc_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_artworks_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_slug_manual_override" boolean DEFAULT false,
  	"version_medium" varchar,
  	"version_measure" varchar,
  	"version_year" varchar,
  	"version_description" jsonb,
  	"version_cover_image_source_id" integer,
  	"version_cover_image_selected_preset_key" "itspk_itcoverima_1izsz",
  	"version_cover_image_presets_1_1_crop_x" numeric DEFAULT 50,
  	"version_cover_image_presets_1_1_crop_y" numeric DEFAULT 50,
  	"version_cover_image_presets_1_1_crop_zoom" numeric DEFAULT 1,
  	"version_cover_image_presets_1_1_derivative_id" integer,
  	"version_cover_image_presets_1_1_state" "itst_itcoverima_1ha4q",
  	"version_cover_image_presets_1_1_fingerprint" varchar,
  	"version_cover_image_presets_1_1_source_version" varchar,
  	"version_cover_image_presets_1_1_last_generated_at" timestamp(3) with time zone,
  	"version_cover_image_presets_1_1_last_error" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__artworks_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "derivatives" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"source_id" integer NOT NULL,
  	"source_collection" varchar,
  	"source_i_d" varchar,
  	"source_version" varchar,
  	"owner_kind" "enum_derivatives_owner_kind" NOT NULL,
  	"owner_slug" varchar,
  	"owner_i_d" varchar,
  	"field_path" varchar,
  	"usage_path" varchar,
  	"preset_key" varchar,
  	"preset_aspect_ratio" varchar,
  	"fingerprint" varchar,
  	"prefix" varchar DEFAULT 'derivatives',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "forms_blocks_checkbox" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"required" boolean,
  	"default_value" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_country" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_email" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_message" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"message" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_number" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_select_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_select" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" varchar,
  	"placeholder" varchar,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_state" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" varchar,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_textarea" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" varchar,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_emails" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"email_to" varchar,
  	"cc" varchar,
  	"bcc" varchar,
  	"reply_to" varchar,
  	"email_from" varchar,
  	"subject" varchar DEFAULT 'You''ve received a new message.' NOT NULL,
  	"message" jsonb
  );
  
  CREATE TABLE "forms" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"submit_button_label" varchar,
  	"confirmation_type" "enum_forms_confirmation_type" DEFAULT 'message',
  	"confirmation_message" jsonb,
  	"redirect_type" "enum_forms_redirect_type" DEFAULT 'reference',
  	"redirect_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "forms_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer
  );
  
  CREATE TABLE "form_submissions_submission_data" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"field" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "form_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"form_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"pages_id" integer,
  	"artworks_id" integer,
  	"derivatives_id" integer,
  	"forms_id" integer,
  	"form_submissions_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "main_navigation_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "main_navigation" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "main_navigation_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"artworks_id" integer
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_rich_text" ADD CONSTRAINT "pages_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_caption_image" ADD CONSTRAINT "pages_blocks_caption_image_image_source_id_media_id_fk" FOREIGN KEY ("image_source_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_caption_image" ADD CONSTRAINT "pages_blocks_caption_image_image_presets_4_3_derivative_id_derivatives_id_fk" FOREIGN KEY ("image_presets_4_3_derivative_id") REFERENCES "public"."derivatives"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_caption_image" ADD CONSTRAINT "pages_blocks_caption_image_image_presets_2_3_derivative_id_derivatives_id_fk" FOREIGN KEY ("image_presets_2_3_derivative_id") REFERENCES "public"."derivatives"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_caption_image" ADD CONSTRAINT "pages_blocks_caption_image_image_presets_3_2_derivative_id_derivatives_id_fk" FOREIGN KEY ("image_presets_3_2_derivative_id") REFERENCES "public"."derivatives"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_caption_image" ADD CONSTRAINT "pages_blocks_caption_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_video" ADD CONSTRAINT "pages_blocks_video_poster_source_id_media_id_fk" FOREIGN KEY ("poster_source_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_video" ADD CONSTRAINT "pages_blocks_video_poster_presets_1_1_derivative_id_derivatives_id_fk" FOREIGN KEY ("poster_presets_1_1_derivative_id") REFERENCES "public"."derivatives"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_video" ADD CONSTRAINT "pages_blocks_video_poster_presets_4_3_derivative_id_derivatives_id_fk" FOREIGN KEY ("poster_presets_4_3_derivative_id") REFERENCES "public"."derivatives"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_video" ADD CONSTRAINT "pages_blocks_video_poster_presets_16_9_derivative_id_derivatives_id_fk" FOREIGN KEY ("poster_presets_16_9_derivative_id") REFERENCES "public"."derivatives"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_video" ADD CONSTRAINT "pages_blocks_video_av1_file_id_media_id_fk" FOREIGN KEY ("av1_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_video" ADD CONSTRAINT "pages_blocks_video_h264_file_id_media_id_fk" FOREIGN KEY ("h264_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_video" ADD CONSTRAINT "pages_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_link_list_items" ADD CONSTRAINT "pages_blocks_link_list_items_screenshot_source_id_media_id_fk" FOREIGN KEY ("screenshot_source_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_link_list_items" ADD CONSTRAINT "pages_blocks_link_list_items_screenshot_presets_1_1_derivative_id_derivatives_id_fk" FOREIGN KEY ("screenshot_presets_1_1_derivative_id") REFERENCES "public"."derivatives"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_link_list_items" ADD CONSTRAINT "pages_blocks_link_list_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_link_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_link_list" ADD CONSTRAINT "pages_blocks_link_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_artwork_grid" ADD CONSTRAINT "pages_blocks_artwork_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "psplit_links" ADD CONSTRAINT "psplit_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."psplit"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "psplit" ADD CONSTRAINT "psplit_resume_image_source_id_media_id_fk" FOREIGN KEY ("resume_image_source_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "psplit" ADD CONSTRAINT "psplit_resume_image_presets_2_3_derivative_id_derivatives_id_fk" FOREIGN KEY ("resume_image_presets_2_3_derivative_id") REFERENCES "public"."derivatives"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "psplit" ADD CONSTRAINT "psplit_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_form_reference" ADD CONSTRAINT "pages_blocks_form_reference_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_form_reference" ADD CONSTRAINT "pages_blocks_form_reference_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_artworks_fk" FOREIGN KEY ("artworks_id") REFERENCES "public"."artworks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_rich_text" ADD CONSTRAINT "_pages_v_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_caption_image" ADD CONSTRAINT "_pages_v_blocks_caption_image_image_source_id_media_id_fk" FOREIGN KEY ("image_source_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_caption_image" ADD CONSTRAINT "_pages_v_blocks_caption_image_image_presets_4_3_derivative_id_derivatives_id_fk" FOREIGN KEY ("image_presets_4_3_derivative_id") REFERENCES "public"."derivatives"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_caption_image" ADD CONSTRAINT "_pages_v_blocks_caption_image_image_presets_2_3_derivative_id_derivatives_id_fk" FOREIGN KEY ("image_presets_2_3_derivative_id") REFERENCES "public"."derivatives"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_caption_image" ADD CONSTRAINT "_pages_v_blocks_caption_image_image_presets_3_2_derivative_id_derivatives_id_fk" FOREIGN KEY ("image_presets_3_2_derivative_id") REFERENCES "public"."derivatives"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_caption_image" ADD CONSTRAINT "_pages_v_blocks_caption_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video" ADD CONSTRAINT "_pages_v_blocks_video_poster_source_id_media_id_fk" FOREIGN KEY ("poster_source_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video" ADD CONSTRAINT "_pages_v_blocks_video_poster_presets_1_1_derivative_id_derivatives_id_fk" FOREIGN KEY ("poster_presets_1_1_derivative_id") REFERENCES "public"."derivatives"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video" ADD CONSTRAINT "_pages_v_blocks_video_poster_presets_4_3_derivative_id_derivatives_id_fk" FOREIGN KEY ("poster_presets_4_3_derivative_id") REFERENCES "public"."derivatives"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video" ADD CONSTRAINT "_pages_v_blocks_video_poster_presets_16_9_derivative_id_derivatives_id_fk" FOREIGN KEY ("poster_presets_16_9_derivative_id") REFERENCES "public"."derivatives"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video" ADD CONSTRAINT "_pages_v_blocks_video_av1_file_id_media_id_fk" FOREIGN KEY ("av1_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video" ADD CONSTRAINT "_pages_v_blocks_video_h264_file_id_media_id_fk" FOREIGN KEY ("h264_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video" ADD CONSTRAINT "_pages_v_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_link_list_items" ADD CONSTRAINT "_pages_v_blocks_link_list_items_screenshot_source_id_media_id_fk" FOREIGN KEY ("screenshot_source_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_link_list_items" ADD CONSTRAINT "_pages_v_blocks_link_list_items_screenshot_presets_1_1_derivative_id_derivatives_id_fk" FOREIGN KEY ("screenshot_presets_1_1_derivative_id") REFERENCES "public"."derivatives"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_link_list_items" ADD CONSTRAINT "_pages_v_blocks_link_list_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_link_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_link_list" ADD CONSTRAINT "_pages_v_blocks_link_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_artwork_grid" ADD CONSTRAINT "_pages_v_blocks_artwork_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_psplit_v_links" ADD CONSTRAINT "_psplit_v_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_psplit_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_psplit_v" ADD CONSTRAINT "_psplit_v_resume_image_source_id_media_id_fk" FOREIGN KEY ("resume_image_source_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_psplit_v" ADD CONSTRAINT "_psplit_v_resume_image_presets_2_3_derivative_id_derivatives_id_fk" FOREIGN KEY ("resume_image_presets_2_3_derivative_id") REFERENCES "public"."derivatives"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_psplit_v" ADD CONSTRAINT "_psplit_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_form_reference" ADD CONSTRAINT "_pages_v_blocks_form_reference_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_form_reference" ADD CONSTRAINT "_pages_v_blocks_form_reference_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_artworks_fk" FOREIGN KEY ("artworks_id") REFERENCES "public"."artworks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "artworks_blocks_doc_grid_items" ADD CONSTRAINT "artworks_blocks_doc_grid_items_image_source_id_media_id_fk" FOREIGN KEY ("image_source_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "artworks_blocks_doc_grid_items" ADD CONSTRAINT "artworks_blocks_doc_grid_items_image_presets_1_1_derivative_id_derivatives_id_fk" FOREIGN KEY ("image_presets_1_1_derivative_id") REFERENCES "public"."derivatives"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "artworks_blocks_doc_grid_items" ADD CONSTRAINT "artworks_blocks_doc_grid_items_image_presets_2_3_derivative_id_derivatives_id_fk" FOREIGN KEY ("image_presets_2_3_derivative_id") REFERENCES "public"."derivatives"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "artworks_blocks_doc_grid_items" ADD CONSTRAINT "artworks_blocks_doc_grid_items_image_presets_3_2_derivative_id_derivatives_id_fk" FOREIGN KEY ("image_presets_3_2_derivative_id") REFERENCES "public"."derivatives"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "artworks_blocks_doc_grid_items" ADD CONSTRAINT "artworks_blocks_doc_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."artworks_blocks_doc_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "artworks_blocks_doc_grid" ADD CONSTRAINT "artworks_blocks_doc_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."artworks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "artworks_blocks_doc_audio_items" ADD CONSTRAINT "artworks_blocks_doc_audio_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "artworks_blocks_doc_audio_items" ADD CONSTRAINT "artworks_blocks_doc_audio_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."artworks_blocks_doc_audio"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "artworks_blocks_doc_audio" ADD CONSTRAINT "artworks_blocks_doc_audio_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."artworks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "artworks_blocks_doc_video_items" ADD CONSTRAINT "artworks_blocks_doc_video_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "artworks_blocks_doc_video_items" ADD CONSTRAINT "artworks_blocks_doc_video_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."artworks_blocks_doc_video"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "artworks_blocks_doc_video" ADD CONSTRAINT "artworks_blocks_doc_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."artworks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "artworks" ADD CONSTRAINT "artworks_cover_image_source_id_media_id_fk" FOREIGN KEY ("cover_image_source_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "artworks" ADD CONSTRAINT "artworks_cover_image_presets_1_1_derivative_id_derivatives_id_fk" FOREIGN KEY ("cover_image_presets_1_1_derivative_id") REFERENCES "public"."derivatives"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "artworks" ADD CONSTRAINT "artworks_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_artworks_v_blocks_doc_grid_items" ADD CONSTRAINT "_artworks_v_blocks_doc_grid_items_image_source_id_media_id_fk" FOREIGN KEY ("image_source_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_artworks_v_blocks_doc_grid_items" ADD CONSTRAINT "_artworks_v_blocks_doc_grid_items_image_presets_1_1_derivative_id_derivatives_id_fk" FOREIGN KEY ("image_presets_1_1_derivative_id") REFERENCES "public"."derivatives"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_artworks_v_blocks_doc_grid_items" ADD CONSTRAINT "_artworks_v_blocks_doc_grid_items_image_presets_2_3_derivative_id_derivatives_id_fk" FOREIGN KEY ("image_presets_2_3_derivative_id") REFERENCES "public"."derivatives"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_artworks_v_blocks_doc_grid_items" ADD CONSTRAINT "_artworks_v_blocks_doc_grid_items_image_presets_3_2_derivative_id_derivatives_id_fk" FOREIGN KEY ("image_presets_3_2_derivative_id") REFERENCES "public"."derivatives"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_artworks_v_blocks_doc_grid_items" ADD CONSTRAINT "_artworks_v_blocks_doc_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_artworks_v_blocks_doc_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_artworks_v_blocks_doc_grid" ADD CONSTRAINT "_artworks_v_blocks_doc_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_artworks_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_artworks_v_blocks_doc_audio_items" ADD CONSTRAINT "_artworks_v_blocks_doc_audio_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_artworks_v_blocks_doc_audio_items" ADD CONSTRAINT "_artworks_v_blocks_doc_audio_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_artworks_v_blocks_doc_audio"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_artworks_v_blocks_doc_audio" ADD CONSTRAINT "_artworks_v_blocks_doc_audio_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_artworks_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_artworks_v_blocks_doc_video_items" ADD CONSTRAINT "_artworks_v_blocks_doc_video_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_artworks_v_blocks_doc_video_items" ADD CONSTRAINT "_artworks_v_blocks_doc_video_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_artworks_v_blocks_doc_video"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_artworks_v_blocks_doc_video" ADD CONSTRAINT "_artworks_v_blocks_doc_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_artworks_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_artworks_v" ADD CONSTRAINT "_artworks_v_parent_id_artworks_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."artworks"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_artworks_v" ADD CONSTRAINT "_artworks_v_version_cover_image_source_id_media_id_fk" FOREIGN KEY ("version_cover_image_source_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_artworks_v" ADD CONSTRAINT "_artworks_v_version_cover_image_presets_1_1_derivative_id_derivatives_id_fk" FOREIGN KEY ("version_cover_image_presets_1_1_derivative_id") REFERENCES "public"."derivatives"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_artworks_v" ADD CONSTRAINT "_artworks_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "derivatives" ADD CONSTRAINT "derivatives_source_id_media_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "forms_blocks_checkbox" ADD CONSTRAINT "forms_blocks_checkbox_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_country" ADD CONSTRAINT "forms_blocks_country_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_email" ADD CONSTRAINT "forms_blocks_email_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_message" ADD CONSTRAINT "forms_blocks_message_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_number" ADD CONSTRAINT "forms_blocks_number_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select_options" ADD CONSTRAINT "forms_blocks_select_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_select"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select" ADD CONSTRAINT "forms_blocks_select_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_state" ADD CONSTRAINT "forms_blocks_state_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_text" ADD CONSTRAINT "forms_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_textarea" ADD CONSTRAINT "forms_blocks_textarea_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_emails" ADD CONSTRAINT "forms_emails_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_rels" ADD CONSTRAINT "forms_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_rels" ADD CONSTRAINT "forms_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_submissions_submission_data" ADD CONSTRAINT "form_submissions_submission_data_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_artworks_fk" FOREIGN KEY ("artworks_id") REFERENCES "public"."artworks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_derivatives_fk" FOREIGN KEY ("derivatives_id") REFERENCES "public"."derivatives"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_forms_fk" FOREIGN KEY ("forms_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_form_submissions_fk" FOREIGN KEY ("form_submissions_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "main_navigation_items" ADD CONSTRAINT "main_navigation_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."main_navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "main_navigation_rels" ADD CONSTRAINT "main_navigation_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."main_navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "main_navigation_rels" ADD CONSTRAINT "main_navigation_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "main_navigation_rels" ADD CONSTRAINT "main_navigation_rels_artworks_fk" FOREIGN KEY ("artworks_id") REFERENCES "public"."artworks"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "pages_blocks_rich_text_order_idx" ON "pages_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "pages_blocks_rich_text_parent_id_idx" ON "pages_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rich_text_path_idx" ON "pages_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "pages_blocks_caption_image_order_idx" ON "pages_blocks_caption_image" USING btree ("_order");
  CREATE INDEX "pages_blocks_caption_image_parent_id_idx" ON "pages_blocks_caption_image" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_caption_image_path_idx" ON "pages_blocks_caption_image" USING btree ("_path");
  CREATE INDEX "pages_blocks_caption_image_image_image_source_idx" ON "pages_blocks_caption_image" USING btree ("image_source_id");
  CREATE INDEX "pages_blocks_caption_image_image_presets_4_3_image_prese_idx" ON "pages_blocks_caption_image" USING btree ("image_presets_4_3_derivative_id");
  CREATE INDEX "pages_blocks_caption_image_image_presets_2_3_image_prese_idx" ON "pages_blocks_caption_image" USING btree ("image_presets_2_3_derivative_id");
  CREATE INDEX "pages_blocks_caption_image_image_presets_3_2_image_prese_idx" ON "pages_blocks_caption_image" USING btree ("image_presets_3_2_derivative_id");
  CREATE INDEX "pages_blocks_video_order_idx" ON "pages_blocks_video" USING btree ("_order");
  CREATE INDEX "pages_blocks_video_parent_id_idx" ON "pages_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_video_path_idx" ON "pages_blocks_video" USING btree ("_path");
  CREATE INDEX "pages_blocks_video_poster_poster_source_idx" ON "pages_blocks_video" USING btree ("poster_source_id");
  CREATE INDEX "pages_blocks_video_poster_presets_1_1_poster_presets_1_1_idx" ON "pages_blocks_video" USING btree ("poster_presets_1_1_derivative_id");
  CREATE INDEX "pages_blocks_video_poster_presets_4_3_poster_presets_4_3_idx" ON "pages_blocks_video" USING btree ("poster_presets_4_3_derivative_id");
  CREATE INDEX "pages_blocks_video_poster_presets_16_9_poster_presets_16_idx" ON "pages_blocks_video" USING btree ("poster_presets_16_9_derivative_id");
  CREATE INDEX "pages_blocks_video_av1_file_idx" ON "pages_blocks_video" USING btree ("av1_file_id");
  CREATE INDEX "pages_blocks_video_h264_file_idx" ON "pages_blocks_video" USING btree ("h264_file_id");
  CREATE INDEX "pages_blocks_link_list_items_order_idx" ON "pages_blocks_link_list_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_link_list_items_parent_id_idx" ON "pages_blocks_link_list_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_link_list_items_screenshot_screenshot_sourc_idx" ON "pages_blocks_link_list_items" USING btree ("screenshot_source_id");
  CREATE INDEX "pages_blocks_link_list_items_screenshot_presets_1_1_scre_idx" ON "pages_blocks_link_list_items" USING btree ("screenshot_presets_1_1_derivative_id");
  CREATE INDEX "pages_blocks_link_list_order_idx" ON "pages_blocks_link_list" USING btree ("_order");
  CREATE INDEX "pages_blocks_link_list_parent_id_idx" ON "pages_blocks_link_list" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_link_list_path_idx" ON "pages_blocks_link_list" USING btree ("_path");
  CREATE INDEX "pages_blocks_artwork_grid_order_idx" ON "pages_blocks_artwork_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_artwork_grid_parent_id_idx" ON "pages_blocks_artwork_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_artwork_grid_path_idx" ON "pages_blocks_artwork_grid" USING btree ("_path");
  CREATE INDEX "psplit_links_order_idx" ON "psplit_links" USING btree ("_order");
  CREATE INDEX "psplit_links_parent_id_idx" ON "psplit_links" USING btree ("_parent_id");
  CREATE INDEX "psplit_order_idx" ON "psplit" USING btree ("_order");
  CREATE INDEX "psplit_parent_id_idx" ON "psplit" USING btree ("_parent_id");
  CREATE INDEX "psplit_path_idx" ON "psplit" USING btree ("_path");
  CREATE INDEX "psplit_resume_image_resume_image_source_idx" ON "psplit" USING btree ("resume_image_source_id");
  CREATE INDEX "psplit_resume_image_presets_2_3_resume_image_presets_2_3_idx" ON "psplit" USING btree ("resume_image_presets_2_3_derivative_id");
  CREATE INDEX "pages_blocks_form_reference_order_idx" ON "pages_blocks_form_reference" USING btree ("_order");
  CREATE INDEX "pages_blocks_form_reference_parent_id_idx" ON "pages_blocks_form_reference" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_form_reference_path_idx" ON "pages_blocks_form_reference" USING btree ("_path");
  CREATE INDEX "pages_blocks_form_reference_form_idx" ON "pages_blocks_form_reference" USING btree ("form_id");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_meta_meta_image_idx" ON "pages" USING btree ("meta_image_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
  CREATE INDEX "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
  CREATE INDEX "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
  CREATE INDEX "pages_rels_artworks_id_idx" ON "pages_rels" USING btree ("artworks_id");
  CREATE INDEX "_pages_v_blocks_rich_text_order_idx" ON "_pages_v_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_rich_text_parent_id_idx" ON "_pages_v_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_rich_text_path_idx" ON "_pages_v_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_caption_image_order_idx" ON "_pages_v_blocks_caption_image" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_caption_image_parent_id_idx" ON "_pages_v_blocks_caption_image" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_caption_image_path_idx" ON "_pages_v_blocks_caption_image" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_caption_image_image_image_source_idx" ON "_pages_v_blocks_caption_image" USING btree ("image_source_id");
  CREATE INDEX "_pages_v_blocks_caption_image_image_presets_4_3_image_pr_idx" ON "_pages_v_blocks_caption_image" USING btree ("image_presets_4_3_derivative_id");
  CREATE INDEX "_pages_v_blocks_caption_image_image_presets_2_3_image_pr_idx" ON "_pages_v_blocks_caption_image" USING btree ("image_presets_2_3_derivative_id");
  CREATE INDEX "_pages_v_blocks_caption_image_image_presets_3_2_image_pr_idx" ON "_pages_v_blocks_caption_image" USING btree ("image_presets_3_2_derivative_id");
  CREATE INDEX "_pages_v_blocks_video_order_idx" ON "_pages_v_blocks_video" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_video_parent_id_idx" ON "_pages_v_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_video_path_idx" ON "_pages_v_blocks_video" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_video_poster_poster_source_idx" ON "_pages_v_blocks_video" USING btree ("poster_source_id");
  CREATE INDEX "_pages_v_blocks_video_poster_presets_1_1_poster_presets__idx" ON "_pages_v_blocks_video" USING btree ("poster_presets_1_1_derivative_id");
  CREATE INDEX "_pages_v_blocks_video_poster_presets_4_3_poster_presets__idx" ON "_pages_v_blocks_video" USING btree ("poster_presets_4_3_derivative_id");
  CREATE INDEX "_pages_v_blocks_video_poster_presets_16_9_poster_presets_idx" ON "_pages_v_blocks_video" USING btree ("poster_presets_16_9_derivative_id");
  CREATE INDEX "_pages_v_blocks_video_av1_file_idx" ON "_pages_v_blocks_video" USING btree ("av1_file_id");
  CREATE INDEX "_pages_v_blocks_video_h264_file_idx" ON "_pages_v_blocks_video" USING btree ("h264_file_id");
  CREATE INDEX "_pages_v_blocks_link_list_items_order_idx" ON "_pages_v_blocks_link_list_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_link_list_items_parent_id_idx" ON "_pages_v_blocks_link_list_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_link_list_items_screenshot_screenshot_so_idx" ON "_pages_v_blocks_link_list_items" USING btree ("screenshot_source_id");
  CREATE INDEX "_pages_v_blocks_link_list_items_screenshot_presets_1_1_s_idx" ON "_pages_v_blocks_link_list_items" USING btree ("screenshot_presets_1_1_derivative_id");
  CREATE INDEX "_pages_v_blocks_link_list_order_idx" ON "_pages_v_blocks_link_list" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_link_list_parent_id_idx" ON "_pages_v_blocks_link_list" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_link_list_path_idx" ON "_pages_v_blocks_link_list" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_artwork_grid_order_idx" ON "_pages_v_blocks_artwork_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_artwork_grid_parent_id_idx" ON "_pages_v_blocks_artwork_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_artwork_grid_path_idx" ON "_pages_v_blocks_artwork_grid" USING btree ("_path");
  CREATE INDEX "_psplit_v_links_order_idx" ON "_psplit_v_links" USING btree ("_order");
  CREATE INDEX "_psplit_v_links_parent_id_idx" ON "_psplit_v_links" USING btree ("_parent_id");
  CREATE INDEX "_psplit_v_order_idx" ON "_psplit_v" USING btree ("_order");
  CREATE INDEX "_psplit_v_parent_id_idx" ON "_psplit_v" USING btree ("_parent_id");
  CREATE INDEX "_psplit_v_path_idx" ON "_psplit_v" USING btree ("_path");
  CREATE INDEX "_psplit_v_resume_image_resume_image_source_idx" ON "_psplit_v" USING btree ("resume_image_source_id");
  CREATE INDEX "_psplit_v_resume_image_presets_2_3_resume_image_presets__idx" ON "_psplit_v" USING btree ("resume_image_presets_2_3_derivative_id");
  CREATE INDEX "_pages_v_blocks_form_reference_order_idx" ON "_pages_v_blocks_form_reference" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_form_reference_parent_id_idx" ON "_pages_v_blocks_form_reference" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_form_reference_path_idx" ON "_pages_v_blocks_form_reference" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_form_reference_form_idx" ON "_pages_v_blocks_form_reference" USING btree ("form_id");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_meta_version_meta_image_idx" ON "_pages_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_rels_order_idx" ON "_pages_v_rels" USING btree ("order");
  CREATE INDEX "_pages_v_rels_parent_idx" ON "_pages_v_rels" USING btree ("parent_id");
  CREATE INDEX "_pages_v_rels_path_idx" ON "_pages_v_rels" USING btree ("path");
  CREATE INDEX "_pages_v_rels_artworks_id_idx" ON "_pages_v_rels" USING btree ("artworks_id");
  CREATE INDEX "artworks_blocks_doc_grid_items_order_idx" ON "artworks_blocks_doc_grid_items" USING btree ("_order");
  CREATE INDEX "artworks_blocks_doc_grid_items_parent_id_idx" ON "artworks_blocks_doc_grid_items" USING btree ("_parent_id");
  CREATE INDEX "artworks_blocks_doc_grid_items_image_image_source_idx" ON "artworks_blocks_doc_grid_items" USING btree ("image_source_id");
  CREATE INDEX "artworks_blocks_doc_grid_items_image_presets_1_1_image_p_idx" ON "artworks_blocks_doc_grid_items" USING btree ("image_presets_1_1_derivative_id");
  CREATE INDEX "artworks_blocks_doc_grid_items_image_presets_2_3_image_p_idx" ON "artworks_blocks_doc_grid_items" USING btree ("image_presets_2_3_derivative_id");
  CREATE INDEX "artworks_blocks_doc_grid_items_image_presets_3_2_image_p_idx" ON "artworks_blocks_doc_grid_items" USING btree ("image_presets_3_2_derivative_id");
  CREATE INDEX "artworks_blocks_doc_grid_order_idx" ON "artworks_blocks_doc_grid" USING btree ("_order");
  CREATE INDEX "artworks_blocks_doc_grid_parent_id_idx" ON "artworks_blocks_doc_grid" USING btree ("_parent_id");
  CREATE INDEX "artworks_blocks_doc_grid_path_idx" ON "artworks_blocks_doc_grid" USING btree ("_path");
  CREATE INDEX "artworks_blocks_doc_audio_items_order_idx" ON "artworks_blocks_doc_audio_items" USING btree ("_order");
  CREATE INDEX "artworks_blocks_doc_audio_items_parent_id_idx" ON "artworks_blocks_doc_audio_items" USING btree ("_parent_id");
  CREATE INDEX "artworks_blocks_doc_audio_items_media_idx" ON "artworks_blocks_doc_audio_items" USING btree ("media_id");
  CREATE INDEX "artworks_blocks_doc_audio_order_idx" ON "artworks_blocks_doc_audio" USING btree ("_order");
  CREATE INDEX "artworks_blocks_doc_audio_parent_id_idx" ON "artworks_blocks_doc_audio" USING btree ("_parent_id");
  CREATE INDEX "artworks_blocks_doc_audio_path_idx" ON "artworks_blocks_doc_audio" USING btree ("_path");
  CREATE INDEX "artworks_blocks_doc_video_items_order_idx" ON "artworks_blocks_doc_video_items" USING btree ("_order");
  CREATE INDEX "artworks_blocks_doc_video_items_parent_id_idx" ON "artworks_blocks_doc_video_items" USING btree ("_parent_id");
  CREATE INDEX "artworks_blocks_doc_video_items_media_idx" ON "artworks_blocks_doc_video_items" USING btree ("media_id");
  CREATE INDEX "artworks_blocks_doc_video_order_idx" ON "artworks_blocks_doc_video" USING btree ("_order");
  CREATE INDEX "artworks_blocks_doc_video_parent_id_idx" ON "artworks_blocks_doc_video" USING btree ("_parent_id");
  CREATE INDEX "artworks_blocks_doc_video_path_idx" ON "artworks_blocks_doc_video" USING btree ("_path");
  CREATE UNIQUE INDEX "artworks_slug_idx" ON "artworks" USING btree ("slug");
  CREATE INDEX "artworks_cover_image_cover_image_source_idx" ON "artworks" USING btree ("cover_image_source_id");
  CREATE INDEX "artworks_cover_image_presets_1_1_cover_image_presets_1_1_idx" ON "artworks" USING btree ("cover_image_presets_1_1_derivative_id");
  CREATE INDEX "artworks_meta_meta_image_idx" ON "artworks" USING btree ("meta_image_id");
  CREATE INDEX "artworks_updated_at_idx" ON "artworks" USING btree ("updated_at");
  CREATE INDEX "artworks_created_at_idx" ON "artworks" USING btree ("created_at");
  CREATE INDEX "artworks__status_idx" ON "artworks" USING btree ("_status");
  CREATE INDEX "_artworks_v_blocks_doc_grid_items_order_idx" ON "_artworks_v_blocks_doc_grid_items" USING btree ("_order");
  CREATE INDEX "_artworks_v_blocks_doc_grid_items_parent_id_idx" ON "_artworks_v_blocks_doc_grid_items" USING btree ("_parent_id");
  CREATE INDEX "_artworks_v_blocks_doc_grid_items_image_image_source_idx" ON "_artworks_v_blocks_doc_grid_items" USING btree ("image_source_id");
  CREATE INDEX "_artworks_v_blocks_doc_grid_items_image_presets_1_1_imag_idx" ON "_artworks_v_blocks_doc_grid_items" USING btree ("image_presets_1_1_derivative_id");
  CREATE INDEX "_artworks_v_blocks_doc_grid_items_image_presets_2_3_imag_idx" ON "_artworks_v_blocks_doc_grid_items" USING btree ("image_presets_2_3_derivative_id");
  CREATE INDEX "_artworks_v_blocks_doc_grid_items_image_presets_3_2_imag_idx" ON "_artworks_v_blocks_doc_grid_items" USING btree ("image_presets_3_2_derivative_id");
  CREATE INDEX "_artworks_v_blocks_doc_grid_order_idx" ON "_artworks_v_blocks_doc_grid" USING btree ("_order");
  CREATE INDEX "_artworks_v_blocks_doc_grid_parent_id_idx" ON "_artworks_v_blocks_doc_grid" USING btree ("_parent_id");
  CREATE INDEX "_artworks_v_blocks_doc_grid_path_idx" ON "_artworks_v_blocks_doc_grid" USING btree ("_path");
  CREATE INDEX "_artworks_v_blocks_doc_audio_items_order_idx" ON "_artworks_v_blocks_doc_audio_items" USING btree ("_order");
  CREATE INDEX "_artworks_v_blocks_doc_audio_items_parent_id_idx" ON "_artworks_v_blocks_doc_audio_items" USING btree ("_parent_id");
  CREATE INDEX "_artworks_v_blocks_doc_audio_items_media_idx" ON "_artworks_v_blocks_doc_audio_items" USING btree ("media_id");
  CREATE INDEX "_artworks_v_blocks_doc_audio_order_idx" ON "_artworks_v_blocks_doc_audio" USING btree ("_order");
  CREATE INDEX "_artworks_v_blocks_doc_audio_parent_id_idx" ON "_artworks_v_blocks_doc_audio" USING btree ("_parent_id");
  CREATE INDEX "_artworks_v_blocks_doc_audio_path_idx" ON "_artworks_v_blocks_doc_audio" USING btree ("_path");
  CREATE INDEX "_artworks_v_blocks_doc_video_items_order_idx" ON "_artworks_v_blocks_doc_video_items" USING btree ("_order");
  CREATE INDEX "_artworks_v_blocks_doc_video_items_parent_id_idx" ON "_artworks_v_blocks_doc_video_items" USING btree ("_parent_id");
  CREATE INDEX "_artworks_v_blocks_doc_video_items_media_idx" ON "_artworks_v_blocks_doc_video_items" USING btree ("media_id");
  CREATE INDEX "_artworks_v_blocks_doc_video_order_idx" ON "_artworks_v_blocks_doc_video" USING btree ("_order");
  CREATE INDEX "_artworks_v_blocks_doc_video_parent_id_idx" ON "_artworks_v_blocks_doc_video" USING btree ("_parent_id");
  CREATE INDEX "_artworks_v_blocks_doc_video_path_idx" ON "_artworks_v_blocks_doc_video" USING btree ("_path");
  CREATE INDEX "_artworks_v_parent_idx" ON "_artworks_v" USING btree ("parent_id");
  CREATE INDEX "_artworks_v_version_version_slug_idx" ON "_artworks_v" USING btree ("version_slug");
  CREATE INDEX "_artworks_v_version_cover_image_version_cover_image_sour_idx" ON "_artworks_v" USING btree ("version_cover_image_source_id");
  CREATE INDEX "_artworks_v_version_cover_image_presets_1_1_version_cove_idx" ON "_artworks_v" USING btree ("version_cover_image_presets_1_1_derivative_id");
  CREATE INDEX "_artworks_v_version_meta_version_meta_image_idx" ON "_artworks_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_artworks_v_version_version_updated_at_idx" ON "_artworks_v" USING btree ("version_updated_at");
  CREATE INDEX "_artworks_v_version_version_created_at_idx" ON "_artworks_v" USING btree ("version_created_at");
  CREATE INDEX "_artworks_v_version_version__status_idx" ON "_artworks_v" USING btree ("version__status");
  CREATE INDEX "_artworks_v_created_at_idx" ON "_artworks_v" USING btree ("created_at");
  CREATE INDEX "_artworks_v_updated_at_idx" ON "_artworks_v" USING btree ("updated_at");
  CREATE INDEX "_artworks_v_latest_idx" ON "_artworks_v" USING btree ("latest");
  CREATE INDEX "derivatives_source_idx" ON "derivatives" USING btree ("source_id");
  CREATE INDEX "derivatives_updated_at_idx" ON "derivatives" USING btree ("updated_at");
  CREATE INDEX "derivatives_created_at_idx" ON "derivatives" USING btree ("created_at");
  CREATE UNIQUE INDEX "derivatives_filename_idx" ON "derivatives" USING btree ("filename");
  CREATE INDEX "forms_blocks_checkbox_order_idx" ON "forms_blocks_checkbox" USING btree ("_order");
  CREATE INDEX "forms_blocks_checkbox_parent_id_idx" ON "forms_blocks_checkbox" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_checkbox_path_idx" ON "forms_blocks_checkbox" USING btree ("_path");
  CREATE INDEX "forms_blocks_country_order_idx" ON "forms_blocks_country" USING btree ("_order");
  CREATE INDEX "forms_blocks_country_parent_id_idx" ON "forms_blocks_country" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_country_path_idx" ON "forms_blocks_country" USING btree ("_path");
  CREATE INDEX "forms_blocks_email_order_idx" ON "forms_blocks_email" USING btree ("_order");
  CREATE INDEX "forms_blocks_email_parent_id_idx" ON "forms_blocks_email" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_email_path_idx" ON "forms_blocks_email" USING btree ("_path");
  CREATE INDEX "forms_blocks_message_order_idx" ON "forms_blocks_message" USING btree ("_order");
  CREATE INDEX "forms_blocks_message_parent_id_idx" ON "forms_blocks_message" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_message_path_idx" ON "forms_blocks_message" USING btree ("_path");
  CREATE INDEX "forms_blocks_number_order_idx" ON "forms_blocks_number" USING btree ("_order");
  CREATE INDEX "forms_blocks_number_parent_id_idx" ON "forms_blocks_number" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_number_path_idx" ON "forms_blocks_number" USING btree ("_path");
  CREATE INDEX "forms_blocks_select_options_order_idx" ON "forms_blocks_select_options" USING btree ("_order");
  CREATE INDEX "forms_blocks_select_options_parent_id_idx" ON "forms_blocks_select_options" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_select_order_idx" ON "forms_blocks_select" USING btree ("_order");
  CREATE INDEX "forms_blocks_select_parent_id_idx" ON "forms_blocks_select" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_select_path_idx" ON "forms_blocks_select" USING btree ("_path");
  CREATE INDEX "forms_blocks_state_order_idx" ON "forms_blocks_state" USING btree ("_order");
  CREATE INDEX "forms_blocks_state_parent_id_idx" ON "forms_blocks_state" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_state_path_idx" ON "forms_blocks_state" USING btree ("_path");
  CREATE INDEX "forms_blocks_text_order_idx" ON "forms_blocks_text" USING btree ("_order");
  CREATE INDEX "forms_blocks_text_parent_id_idx" ON "forms_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_text_path_idx" ON "forms_blocks_text" USING btree ("_path");
  CREATE INDEX "forms_blocks_textarea_order_idx" ON "forms_blocks_textarea" USING btree ("_order");
  CREATE INDEX "forms_blocks_textarea_parent_id_idx" ON "forms_blocks_textarea" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_textarea_path_idx" ON "forms_blocks_textarea" USING btree ("_path");
  CREATE INDEX "forms_emails_order_idx" ON "forms_emails" USING btree ("_order");
  CREATE INDEX "forms_emails_parent_id_idx" ON "forms_emails" USING btree ("_parent_id");
  CREATE INDEX "forms_updated_at_idx" ON "forms" USING btree ("updated_at");
  CREATE INDEX "forms_created_at_idx" ON "forms" USING btree ("created_at");
  CREATE INDEX "forms_rels_order_idx" ON "forms_rels" USING btree ("order");
  CREATE INDEX "forms_rels_parent_idx" ON "forms_rels" USING btree ("parent_id");
  CREATE INDEX "forms_rels_path_idx" ON "forms_rels" USING btree ("path");
  CREATE INDEX "forms_rels_pages_id_idx" ON "forms_rels" USING btree ("pages_id");
  CREATE INDEX "form_submissions_submission_data_order_idx" ON "form_submissions_submission_data" USING btree ("_order");
  CREATE INDEX "form_submissions_submission_data_parent_id_idx" ON "form_submissions_submission_data" USING btree ("_parent_id");
  CREATE INDEX "form_submissions_form_idx" ON "form_submissions" USING btree ("form_id");
  CREATE INDEX "form_submissions_updated_at_idx" ON "form_submissions" USING btree ("updated_at");
  CREATE INDEX "form_submissions_created_at_idx" ON "form_submissions" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_artworks_id_idx" ON "payload_locked_documents_rels" USING btree ("artworks_id");
  CREATE INDEX "payload_locked_documents_rels_derivatives_id_idx" ON "payload_locked_documents_rels" USING btree ("derivatives_id");
  CREATE INDEX "payload_locked_documents_rels_forms_id_idx" ON "payload_locked_documents_rels" USING btree ("forms_id");
  CREATE INDEX "payload_locked_documents_rels_form_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("form_submissions_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "main_navigation_items_order_idx" ON "main_navigation_items" USING btree ("_order");
  CREATE INDEX "main_navigation_items_parent_id_idx" ON "main_navigation_items" USING btree ("_parent_id");
  CREATE INDEX "main_navigation_rels_order_idx" ON "main_navigation_rels" USING btree ("order");
  CREATE INDEX "main_navigation_rels_parent_idx" ON "main_navigation_rels" USING btree ("parent_id");
  CREATE INDEX "main_navigation_rels_path_idx" ON "main_navigation_rels" USING btree ("path");
  CREATE INDEX "main_navigation_rels_pages_id_idx" ON "main_navigation_rels" USING btree ("pages_id");
  CREATE INDEX "main_navigation_rels_artworks_id_idx" ON "main_navigation_rels" USING btree ("artworks_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "pages_blocks_rich_text" CASCADE;
  DROP TABLE "pages_blocks_caption_image" CASCADE;
  DROP TABLE "pages_blocks_video" CASCADE;
  DROP TABLE "pages_blocks_link_list_items" CASCADE;
  DROP TABLE "pages_blocks_link_list" CASCADE;
  DROP TABLE "pages_blocks_artwork_grid" CASCADE;
  DROP TABLE "psplit_links" CASCADE;
  DROP TABLE "psplit" CASCADE;
  DROP TABLE "pages_blocks_form_reference" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_rels" CASCADE;
  DROP TABLE "_pages_v_blocks_rich_text" CASCADE;
  DROP TABLE "_pages_v_blocks_caption_image" CASCADE;
  DROP TABLE "_pages_v_blocks_video" CASCADE;
  DROP TABLE "_pages_v_blocks_link_list_items" CASCADE;
  DROP TABLE "_pages_v_blocks_link_list" CASCADE;
  DROP TABLE "_pages_v_blocks_artwork_grid" CASCADE;
  DROP TABLE "_psplit_v_links" CASCADE;
  DROP TABLE "_psplit_v" CASCADE;
  DROP TABLE "_pages_v_blocks_form_reference" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "_pages_v_rels" CASCADE;
  DROP TABLE "artworks_blocks_doc_grid_items" CASCADE;
  DROP TABLE "artworks_blocks_doc_grid" CASCADE;
  DROP TABLE "artworks_blocks_doc_audio_items" CASCADE;
  DROP TABLE "artworks_blocks_doc_audio" CASCADE;
  DROP TABLE "artworks_blocks_doc_video_items" CASCADE;
  DROP TABLE "artworks_blocks_doc_video" CASCADE;
  DROP TABLE "artworks" CASCADE;
  DROP TABLE "_artworks_v_blocks_doc_grid_items" CASCADE;
  DROP TABLE "_artworks_v_blocks_doc_grid" CASCADE;
  DROP TABLE "_artworks_v_blocks_doc_audio_items" CASCADE;
  DROP TABLE "_artworks_v_blocks_doc_audio" CASCADE;
  DROP TABLE "_artworks_v_blocks_doc_video_items" CASCADE;
  DROP TABLE "_artworks_v_blocks_doc_video" CASCADE;
  DROP TABLE "_artworks_v" CASCADE;
  DROP TABLE "derivatives" CASCADE;
  DROP TABLE "forms_blocks_checkbox" CASCADE;
  DROP TABLE "forms_blocks_country" CASCADE;
  DROP TABLE "forms_blocks_email" CASCADE;
  DROP TABLE "forms_blocks_message" CASCADE;
  DROP TABLE "forms_blocks_number" CASCADE;
  DROP TABLE "forms_blocks_select_options" CASCADE;
  DROP TABLE "forms_blocks_select" CASCADE;
  DROP TABLE "forms_blocks_state" CASCADE;
  DROP TABLE "forms_blocks_text" CASCADE;
  DROP TABLE "forms_blocks_textarea" CASCADE;
  DROP TABLE "forms_emails" CASCADE;
  DROP TABLE "forms" CASCADE;
  DROP TABLE "forms_rels" CASCADE;
  DROP TABLE "form_submissions_submission_data" CASCADE;
  DROP TABLE "form_submissions" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "main_navigation_items" CASCADE;
  DROP TABLE "main_navigation" CASCADE;
  DROP TABLE "main_navigation_rels" CASCADE;
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."itspk_itimage1dr_se1gb";
  DROP TYPE "public"."itst_itimage1dr_13blr";
  DROP TYPE "public"."itst_itimage1dr_uvcgg";
  DROP TYPE "public"."itst_itimage1dr_74eqg";
  DROP TYPE "public"."enum_pages_blocks_caption_image_image_ratio";
  DROP TYPE "public"."itspk_itposter12_u7jw8";
  DROP TYPE "public"."itst_itposter12_1u72h";
  DROP TYPE "public"."itst_itposter12_1ejrq";
  DROP TYPE "public"."itst_itposter12_1r9i9";
  DROP TYPE "public"."enum_pages_blocks_video_ratio";
  DROP TYPE "public"."itspk_itscreensh_19nhf";
  DROP TYPE "public"."itst_itscreensh_1nht9";
  DROP TYPE "public"."itspk_itresumeim_hv9hp";
  DROP TYPE "public"."itst_itresumeim_15hgz";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_blocks_caption_image_image_ratio";
  DROP TYPE "public"."enum__pages_v_blocks_video_ratio";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."itst_itimage1dr_1gbbf";
  DROP TYPE "public"."enum_artworks_blocks_doc_grid_layout";
  DROP TYPE "public"."enum_artworks_blocks_doc_video_items_ratio";
  DROP TYPE "public"."itspk_itcoverima_1izsz";
  DROP TYPE "public"."itst_itcoverima_1ha4q";
  DROP TYPE "public"."enum_artworks_status";
  DROP TYPE "public"."enum__artworks_v_blocks_doc_grid_layout";
  DROP TYPE "public"."enum__artworks_v_blocks_doc_video_items_ratio";
  DROP TYPE "public"."enum__artworks_v_version_status";
  DROP TYPE "public"."enum_derivatives_owner_kind";
  DROP TYPE "public"."enum_forms_confirmation_type";
  DROP TYPE "public"."enum_forms_redirect_type";`)
}
