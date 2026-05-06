import { ReactNode } from 'react';

import { Center } from '@/components/center';

import { main } from './layout.css';

export default function ArtworksLayout({ children }: { children: ReactNode }) {
  return (
    <Center render={<main />} className={main} gutters={10}>
      {children}
    </Center>
  );
}
