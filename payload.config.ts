import path from 'path';
import { fileURLToPath } from 'url';

import {
  createImageTransformDerivativeCollection,
  imageTransformPlugin,
  slugPlugin,
} from '@kalink-ui/canopy';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { s3Storage } from '@payloadcms/storage-s3';
import { buildConfig } from 'payload';
import sharp from 'sharp';

import { SeedlyTypographyFeature } from './payload/editor/seedly-typography/server.ts';
import { getPayloadServerURL } from './payload/runtime/serverUrl.ts';
import { authenticated, anyone } from './payload/schema/access/index.ts';
import { Artworks } from './payload/schema/collections/artworks.ts';
import { Media } from './payload/schema/collections/media.ts';
import { Pages } from './payload/schema/collections/pages.ts';
import { Users } from './payload/schema/collections/users.ts';
import { MainNavigation } from './payload/schema/globals/mainNavigation.ts';
import {
  purgeUploadAfterChange,
  purgeUploadAfterDelete,
} from './payload/schema/utils/publicInvalidation.ts';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

function normalizePostgresConnectionString(connectionString: string) {
  if (!connectionString) {
    return connectionString;
  }

  try {
    const url = new URL(connectionString);
    const sslMode = url.searchParams.get('sslmode');
    const useLibpqCompat = url.searchParams.get('uselibpqcompat') === 'true';

    if (
      !useLibpqCompat &&
      (sslMode === 'prefer' || sslMode === 'require' || sslMode === 'verify-ca')
    ) {
      url.searchParams.set('sslmode', 'verify-full');
    }

    return url.toString();
  } catch {
    return connectionString;
  }
}

const rawConnectionString =
  process.env.PAYLOAD_MIGRATING === 'true'
    ? process.env.DATABASE_URL_DIRECT || process.env.DATABASE_URL || ''
    : process.env.DATABASE_URL || process.env.DATABASE_URL_DIRECT || '';

const connectionString = normalizePostgresConnectionString(rawConnectionString);
const shouldPushDevelopmentSchema =
  process.env.NODE_ENV === 'development' &&
  process.env.PAYLOAD_ENABLE_SCHEMA_PUSH === 'true';

function getPayloadSecret() {
  if (process.env.PAYLOAD_SECRET) {
    return process.env.PAYLOAD_SECRET;
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('PAYLOAD_SECRET is required in production');
  }

  return 'local-payload-secret';
}

const derivatives = createImageTransformDerivativeCollection({
  slug: 'derivatives',
  sourceRelationTo: 'media',
  admin: {
    hidden: true,
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  hooks: {
    afterChange: [purgeUploadAfterChange],
    afterDelete: [purgeUploadAfterDelete],
  },
});

export default buildConfig({
  secret: getPayloadSecret(),
  serverURL: getPayloadServerURL(),
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => {
      return [...defaultFeatures, SeedlyTypographyFeature()];
    },
  }),
  collections: [Users, Media, Pages, Artworks, derivatives],
  globals: [MainNavigation],
  db: postgresAdapter({
    pool: {
      connectionString,
    },
    migrationDir: path.resolve(dirname, 'migrations'),
    push: shouldPushDevelopmentSchema,
  }),
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  plugins: [
    slugPlugin({
      collections: ['pages', 'artworks'],
    }),
    imageTransformPlugin({
      derivativeCollectionSlug: 'derivatives',
      defaultSourceRelationTo: 'media',
    }),
    s3Storage({
      bucket: process.env.S3_BUCKET || '',
      config: {
        endpoint: process.env.S3_ENDPOINT,
        region: process.env.S3_REGION || 'us-east-1',
        forcePathStyle: true,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
      },
      collections: {
        media: {
          prefix: 'media',
        },
        derivatives: {
          prefix: 'derivatives',
        },
      },
    }),
    formBuilderPlugin({
      fields: {
        payment: false,
      },
      redirectRelationships: ['pages'],
      formOverrides: {
        access: {
          read: authenticated,
          create: authenticated,
          update: authenticated,
          delete: authenticated,
        },
      },
      formSubmissionOverrides: {
        access: {
          read: authenticated,
          create: anyone,
          update: authenticated,
          delete: authenticated,
        },
      },
    }),
  ],
});
