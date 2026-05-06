interface RevalidateEntry {
  path: string;
  type?: 'page' | 'layout';
}

export const triggerRevalidation = async (entries: RevalidateEntry[]) => {
  const secret = process.env.REVALIDATE_SECRET;
  const serverURL = process.env.PAYLOAD_PUBLIC_SERVER_URL;

  if (!secret || !serverURL || entries.length === 0) {
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
      }),
    });
  } catch {
    // Ignore revalidation failures to avoid blocking writes.
  }
};
