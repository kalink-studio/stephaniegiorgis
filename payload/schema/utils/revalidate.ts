export interface RevalidateEntry {
  path: string;
  type?: 'page' | 'layout';
}

interface RevalidationRequest {
  entries?: RevalidateEntry[];
  purgeUrls?: string[];
}

export const triggerRevalidation = async (
  input: RevalidateEntry[] | RevalidationRequest,
) => {
  const entries = Array.isArray(input) ? input : (input.entries ?? []);
  const purgeUrls = Array.isArray(input) ? [] : (input.purgeUrls ?? []);
  const secret = process.env.REVALIDATE_SECRET;
  const serverURL = process.env.PAYLOAD_PUBLIC_SERVER_URL;

  if (
    !secret ||
    !serverURL ||
    (entries.length === 0 && purgeUrls.length === 0)
  ) {
    return;
  }

  try {
    await fetch(`${serverURL}/api/revalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret,
        entries,
        purgeUrls,
      }),
    });
  } catch {
    // Ignore revalidation failures to avoid blocking writes.
  }
};
