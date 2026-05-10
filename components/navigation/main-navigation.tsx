'use client';

import {
  Box,
  Cluster,
  Drawer,
  List,
  Stack,
  Text,
} from '@kalink-ui/seedly-react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import { ReactNode, useState } from 'react';

import { Center } from '@/components/center';
import { Hidden } from '@/components/hidden';
import { resolveNavItemUrl } from '@/payload/runtime/helpers';
import type { NavigationItem } from '@/payload/runtime/types';

import {
  logo,
  navigation,
  navigationDrawer,
  navigationLink,
  navigationPanelBodyLinks,
  navigationStart,
} from './main-navigation.css';

interface MainNavigationProps {
  items?: NavigationItem[] | null;
}

/**
 * Segment that a nav item should mark as current.
 * Derives from the resolved URL path.
 */
function getSegmentForItem(item: NavigationItem): string | null {
  const url = resolveNavItemUrl(item);
  if (url === '/') {
    return null;
  } // homepage has null segment
  // e.g. "/artworks" → "artworks", "/links" → "links"
  return url.split('/').filter(Boolean)[0] ?? null;
}

export function MainNavigationClient({ items }: MainNavigationProps) {
  const segment = useSelectedLayoutSegment();
  const [open, setOpen] = useState(false);

  const navItems: ReactNode[] = [];

  for (const item of items ?? []) {
    const href = resolveNavItemUrl(item);
    const itemSegment = getSegmentForItem(item);

    navItems.push(
      <Text
        render={<Link href={href} />}
        key={item.label}
        aria-current={segment === itemSegment ? 'page' : undefined}
        className={navigationLink}
        variant="body"
        size="small"
      >
        {item.label}
      </Text>,
    );
  }

  return (
    <Center render={<nav />} gutters={10} className={navigation}>
      <Cluster justify="spaceBetween" align="center">
        <Cluster spacing={4} align="center" className={navigationStart}>
          <Drawer.Root onOpenChange={setOpen} open={open}>
            <Hidden
              use={Drawer.Trigger}
              at="lgUp"
              useCss
              variant="ghost"
              tone="neutral"
              size="sm"
              icon={<Menu size="24" strokeWidth={1.5} />}
              aria-label="Open navigation"
            />
            <Drawer.Portal className={navigationDrawer}>
              <Drawer.Backdrop />
              <Drawer.Viewport>
                <Drawer.Popup>
                  <Drawer.Content>
                    <Box spacing={8}>
                      <Stack spacing={10} align="stretch">
                        <Cluster
                          spacing={6}
                          align="center"
                          justify="spaceBetween"
                        >
                          <Drawer.Title variant="title" size="small">
                            Stéphanie Giorgis
                          </Drawer.Title>
                          <Drawer.Close
                            variant="ghost"
                            tone="neutral"
                            size="sm"
                            icon={<X size="24" strokeWidth={1.5} />}
                            aria-label="Close navigation"
                          />
                        </Cluster>
                        <Stack
                          spacing={6}
                          align="stretch"
                          className={navigationPanelBodyLinks}
                        >
                          <List.Root
                            align="stretch"
                            itemSpacing={8}
                            itemInlineSpacing={8}
                          >
                            {navItems.map((item, index) => (
                              <List.Item
                                key={index}
                                onClick={() => setOpen(false)}
                              >
                                {item}
                              </List.Item>
                            ))}
                          </List.Root>
                        </Stack>
                      </Stack>
                    </Box>
                  </Drawer.Content>
                </Drawer.Popup>
              </Drawer.Viewport>
            </Drawer.Portal>
          </Drawer.Root>
          <Link href="/" title="Go to the homepage" className={logo}>
            <Text render={<h1 />} variant="body" size="medium">
              Stéphanie Giorgis
            </Text>
          </Link>
        </Cluster>

        <Hidden use={Cluster} at="mdDown" spacing={10} align="center">
          {navItems}
        </Hidden>
      </Cluster>
    </Center>
  );
}
