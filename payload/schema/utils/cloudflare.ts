const CLOUDFLARE_PURGE_BATCH_SIZE = 30;

interface CloudflarePurgeResult {
  attempted: number;
  errors: string[];
  purged: number;
  skipped: boolean;
}

const uniqueUrls = (urls: string[]) => {
  return Array.from(
    new Set(
      urls.filter((url): url is string => {
        if (!url || typeof url !== 'string') {
          return false;
        }

        try {
          const parsed = new URL(url);
          return parsed.protocol === 'https:' || parsed.protocol === 'http:';
        } catch {
          return false;
        }
      }),
    ),
  );
};

export const createCloudflarePurgeBatches = (
  urls: string[],
  batchSize = CLOUDFLARE_PURGE_BATCH_SIZE,
) => {
  const normalizedUrls = uniqueUrls(urls);
  const batches: string[][] = [];

  for (let index = 0; index < normalizedUrls.length; index += batchSize) {
    batches.push(normalizedUrls.slice(index, index + batchSize));
  }

  return batches;
};

const isCloudflarePurgeEnabled = () => {
  return process.env.CLOUDFLARE_PURGE_ENABLED === 'true';
};

export async function purgeCloudflareUrls(
  urls: string[],
): Promise<CloudflarePurgeResult> {
  const batches = createCloudflarePurgeBatches(urls);
  const zoneID = process.env.CLOUDFLARE_ZONE_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (
    batches.length === 0 ||
    !isCloudflarePurgeEnabled() ||
    !zoneID ||
    !apiToken
  ) {
    return {
      attempted: batches.reduce((count, batch) => count + batch.length, 0),
      errors: [],
      purged: 0,
      skipped: true,
    };
  }

  const errors: string[] = [];
  let purged = 0;

  for (const batch of batches) {
    try {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/zones/${zoneID}/purge_cache`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            files: batch,
          }),
        },
      );

      if (!response.ok) {
        errors.push(`Cloudflare purge failed with ${response.status}`);
        continue;
      }

      purged += batch.length;
    } catch (error) {
      errors.push(error instanceof Error ? error.message : 'Unknown error');
    }
  }

  return {
    attempted: batches.reduce((count, batch) => count + batch.length, 0),
    errors,
    purged,
    skipped: false,
  };
}
