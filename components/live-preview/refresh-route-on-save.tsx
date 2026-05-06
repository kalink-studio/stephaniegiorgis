'use client';

import { RefreshRouteOnSave as PayloadRefreshRouteOnSave } from '@payloadcms/live-preview-react';
import { useRouter } from 'next/navigation';

interface RefreshRouteOnSaveProps {
  serverURL?: string;
}

export const RefreshRouteOnSave = ({ serverURL }: RefreshRouteOnSaveProps) => {
  const router = useRouter();
  const resolvedServerURL =
    serverURL ||
    (typeof window !== 'undefined' ? window.location.origin : undefined);

  if (!resolvedServerURL) {
    return null;
  }

  return (
    <PayloadRefreshRouteOnSave
      refresh={() => router.refresh()}
      serverURL={resolvedServerURL}
    />
  );
};
