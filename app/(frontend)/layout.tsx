import '@/styles/seedly-globals.css';
import '@/styles/refs.css';
import '@/styles/system-theme.css';
import '@/styles/input-overrides.css';

import { Box, Text } from '@kalink-ui/seedly-react';
import { clsx } from 'clsx';
import { ReactNode } from 'react';

import { Center } from '@/components/center';
import { RefreshRouteOnSave } from '@/components/live-preview/refresh-route-on-save';
import { MainNavigationClient } from '@/components/navigation/main-navigation';
import { getMainNavigation } from '@/payload/runtime/queries';
import { fontClass } from '@/styles/font';

import { html, body, footer } from './layout.css';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.stephaniegiorgis.ch'),
  title: 'Stéphanie Giorgis',
  description: 'Artiste plasticienne romande',
};

export const dynamic = 'force-dynamic';

export default async function FrontendLayout({
  children,
}: {
  children: ReactNode;
}) {
  const nav = await getMainNavigation();

  return (
    <html lang="en" className={clsx(fontClass, html)}>
      <body className={body}>
        <RefreshRouteOnSave serverURL={process.env.PAYLOAD_PUBLIC_SERVER_URL} />
        <MainNavigationClient items={nav.items} />

        {children}

        <Box colorSource="container" colorKey="low" variant="solid" spacing={2}>
          <Center gutters={10} className={footer}>
            <Text variant="body" size="small">
              {'Stéphanie Giorgis © 2026. All Rights Reserved'}
            </Text>
          </Center>
        </Box>
      </body>
    </html>
  );
}
