const DEFAULT_PRODUCTION_SERVER_URL = 'https://www.stephaniegiorgis.ch';
const DEFAULT_STAGING_SERVER_URL = 'https://staging.stephaniegiorgis.ch';

export const normalizeOrigin = (value: string | null | undefined) => {
  if (!value) {
    return null;
  }

  try {
    return new URL(value).origin;
  } catch {
    return value.replace(/\/+$/, '');
  }
};

export const getPayloadServerURL = () => {
  const explicitURL = normalizeOrigin(process.env.PAYLOAD_PUBLIC_SERVER_URL);

  if (explicitURL) {
    return explicitURL;
  }

  const bucket = process.env.S3_BUCKET ?? '';

  if (bucket.includes('staging')) {
    return DEFAULT_STAGING_SERVER_URL;
  }

  if (bucket.includes('production')) {
    return DEFAULT_PRODUCTION_SERVER_URL;
  }

  if (process.env.NODE_ENV === 'production') {
    return DEFAULT_PRODUCTION_SERVER_URL;
  }

  return DEFAULT_PRODUCTION_SERVER_URL;
};
